import * as math from 'mathjs';
import { Language } from '../types';

/**
 * Checks if two mathematical expressions are equivalent.
 * It supports basic arithmetic, variables (x, y, t, etc.), and fractions.
 * 
 * Logic:
 * Instead of string comparison ("3x+30" !== "30+3x"), 
 * we evaluate both expressions at multiple random points for the variable.
 * If the results match within a tolerance, they are mathematically equal.
 */
export const areExpressionsEquivalent = (userMap: string, correctMap: string): boolean => {
  if (!userMap || !correctMap) return false;

  // 1. Sanitize Inputs
  // Remove spaces, convert common localized chars
  const cleanUser = userMap.toLowerCase().replace(/\s/g, '').replace(',', '.');
  const cleanCorrect = correctMap.toLowerCase().replace(/\s/g, '').replace(',', '.');

  // If exact match (after trim), return true immediately
  if (cleanUser === cleanCorrect) return true;

  try {
    // 2. Parse expressions
    const userNode = math.parse(cleanUser);
    const correctNode = math.parse(cleanCorrect);

    // 3. Compile them to functions
    const userCode = userNode.compile();
    const correctCode = correctNode.compile();

    // 4. Test logic
    // We detect which variables are used (e.g., 'x', 'h', 't')
    // We merge variables from both correct and user answers to be safe
    const variables = new Set([
      ...getVariables(userNode),
      ...getVariables(correctNode)
    ]);

    // Define some test cases. 
    // If there are no variables (e.g. "1/2" vs "0.5"), we run once with empty scope.
    // If variables exist, we run multiple random values to avoid false positives.
    const testPoints = [0, 1, 10, -5, 2.5]; 
    
    // If no variables, just evaluate once
    if (variables.size === 0) {
       return Math.abs(userCode.evaluate() - correctCode.evaluate()) < 0.0001;
    }

    // If variables exist, test all points
    for (const val of testPoints) {
      const scope: Record<string, number> = {};
      variables.forEach(v => scope[v] = val);
      
      const resUser = userCode.evaluate(scope);
      const resCorrect = correctCode.evaluate(scope);

      // Check for float equality with epsilon
      if (Math.abs(resUser - resCorrect) > 0.0001) {
        return false;
      }
    }

    return true;

  } catch (e) {
    // If parsing fails (e.g. user typed gibberish), fall back to strict string equality
    // console.warn("Math parse error:", e);
    return cleanUser === cleanCorrect;
  }
};

// Helper to extract variable names from a mathjs node tree
function getVariables(node: any): string[] {
  const vars = new Set<string>();
  node.traverse(function (child: any) {
    if (child.isSymbolNode) {
      vars.add(child.name);
    }
  });
  return Array.from(vars);
}

/**
 * Formats a raw input string into LaTeX for preview if possible.
 * e.g. "1/2" -> "\frac{1}{2}"
 */
export const toLatex = (expression: string): string => {
  try {
    const node = math.parse(expression);
    return node.toTex();
  } catch (e) {
    return expression;
  }
};

/**
 * Checks if a point satisfies a linear equation string (e.g. "y = 2x + 1")
 */
export const isPointOnLine = (point: {x: number, y: number}, equation: string): boolean => {
  try {
    const parts = equation.split('=');
    if (parts.length !== 2) return false;
    
    const lhs = parts[0].toLowerCase();
    const rhs = parts[1].toLowerCase();

    const nodeL = math.parse(lhs);
    const nodeR = math.parse(rhs);
    
    const scope = { x: point.x, y: point.y };
    
    const valL = nodeL.evaluate(scope);
    const valR = nodeR.evaluate(scope);
    
    return Math.abs(valL - valR) < 0.001;
  } catch (e) {
    console.error("Equation check error", e);
    return false;
  }
};

/**
 * Validates a user's graph against the correct equation and required points.
 */
export const validateGraph = (userPoints: {x: number, y: number}[], correctEquation: string, requiredPoints?: {x: number, y: number}[]): boolean => {
  // Need at least 2 points to define the line
  if (userPoints.length < 2) return false; 

  // 1. Check if all user points satisfy the equation
  const allPointsOnLine = userPoints.every(p => isPointOnLine(p, correctEquation));
  if (!allPointsOnLine) return false;

  // 2. If required points are specified, check if they are present in userPoints
  if (requiredPoints && requiredPoints.length > 0) {
      const allRequiredFound = requiredPoints.every(req => 
          userPoints.some(u => u.x === req.x && u.y === req.y)
      );
      if (!allRequiredFound) return false;
  }

  return true;
};

/**
 * AI 2.0: Analyzes WHY the linear equation is wrong.
 * Checks slope (m) and intercept (c) independently.
 */
export const analyzeLinearError = (userAns: string, correctAns: string, lang: Language): string | null => {
  try {
    // 1. Extract expression parts (assuming y=... format for simplicity in this unit)
    // We normalize to "expression" form. e.g. "y=2x+1" -> "2x+1" (if user typed y=)
    // Or if user just typed "2x+1", we use it.
    
    const extractRHS = (eq: string) => {
      const clean = eq.toLowerCase().replace(/\s/g, '');
      if (clean.includes('=')) return clean.split('=')[1];
      return clean;
    };

    const userRHS = extractRHS(userAns);
    const correctRHS = extractRHS(correctAns);

    const uNode = math.parse(userRHS).compile();
    const cNode = math.parse(correctRHS).compile();

    // Evaluate at x=0 to get INTERCEPT (c)
    const uC = uNode.evaluate({x: 0, t: 0, n: 0}); // Support common vars
    const cC = cNode.evaluate({x: 0, t: 0, n: 0});

    // Evaluate at x=1 to derive SLOPE (m) -> f(1) = m + c => m = f(1) - c
    const uAt1 = uNode.evaluate({x: 1, t: 1, n: 1});
    const cAt1 = cNode.evaluate({x: 1, t: 1, n: 1});
    
    const uM = uAt1 - uC;
    const cM = cAt1 - cC;

    // Analysis Logic
    const isSlopeCorrect = Math.abs(uM - cM) < 0.001;
    const isInterceptCorrect = Math.abs(uC - cC) < 0.001;

    // Messages
    const messages = {
      MK: {
        slopeWrong: `Градиентот (m) ти е ${uM}, но треба да е ${cM}.`,
        intWrong: `Слободниот член (c) ти е ${uC}, но треба да е ${cC}.`,
        signError: "Провери ги предзнаците (+/-).",
        slopeCorrect: "Наклонот е супер! ✅",
        intCorrect: "Отсечокот е точен! ✅"
      },
      EN: {
        slopeWrong: `Your gradient (m) is ${uM}, but should be ${cM}.`,
        intWrong: `Your intercept (c) is ${uC}, but should be ${cC}.`,
        signError: "Check your signs (+/-).",
        slopeCorrect: "Slope is correct! ✅",
        intCorrect: "Intercept is correct! ✅"
      },
      SQ: {
        slopeWrong: `Gradienti juaj (m) është ${uM}, por duhet të jetë ${cM}.`,
        intWrong: `Ndërprerja juaj (c) është ${uC}, por duhet të jetë ${cC}.`,
        signError: "Kontrolloni shenjat (+/-).",
        slopeCorrect: "Pjerrësia është e saktë! ✅",
        intCorrect: "Ndërprerja është e saktë! ✅"
      },
      TR: {
        slopeWrong: `Eğiminiz (m) ${uM}, ancak ${cM} olmalı.`,
        intWrong: `Kesişiminiz (c) ${uC}, ancak ${cC} olmalı.`,
        signError: "İşaretleri kontrol edin (+/-).",
        slopeCorrect: "Eğim doğru! ✅",
        intCorrect: "Kesişim doğru! ✅"
      }
    };

    const t = messages[lang] || messages['EN'];

    // Construct Feedback
    if (isSlopeCorrect && !isInterceptCorrect) {
      return `${t.slopeCorrect} ${t.intWrong}`;
    }
    if (!isSlopeCorrect && isInterceptCorrect) {
      return `${t.intCorrect} ${t.slopeWrong}`;
    }
    if (!isSlopeCorrect && !isInterceptCorrect) {
       // Check if maybe just signs are flipped? e.g. y = -2x - 5 vs y = 2x + 5
       if (Math.abs(uM) === Math.abs(cM) && Math.abs(uC) === Math.abs(cC)) {
          return t.signError;
       }
       return null; // Too many errors, let generic AI handle or generic message
    }

    return null;

  } catch (e) {
    return null; // Parsing failed, can't analyze
  }
};