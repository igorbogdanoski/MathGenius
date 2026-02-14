
import { Lesson, Language } from './types';

export const WELCOME_CONTENT = {
  MK: {
    title: "Добредојдовте во MathGenius",
    subtitle: "Вашиот личен AI тутор за математика",
    whatIsThis: "Ова е авантура! Мапата е скриена - мора да ги решавате задачите за да го откриете патот напред.",
    howItWorks: "Како се игра?",
    step1: "Отклучи ја Мапата",
    step1Desc: "Решавај лекции за да го тргнеш облакот и да видиш што следи.",
    step2: "Собери Поени",
    step2Desc: "Точните одговори ти носат златници за продавницата.",
    step3: "Победи го Шефот",
    step3Desc: "Реши ја финалната 'Master' задача за да отвориш нова област!",
    startButton: "Започни со Авантурата"
  },
  SQ: {
    title: "Mirësevini në MathGenius",
    subtitle: "Tutori juaj personal i matematikës me AI",
    whatIsThis: "Kjo është një aventurë! Harta është e fshehur - duhet të zgjidhni detyrat për të zbuluar rrugën përpara.",
    howItWorks: "Si luhet?",
    step1: "Zhblloko Hartën",
    step1Desc: "Përfundo mësimet për të hequr renë dhe për të parë çfarë vjen më pas.",
    step2: "Fito Pikë",
    step2Desc: "Përgjigjet e sakta ju sjellin monedha për dyqanin.",
    step3: "Mund Shefin",
    step3Desc: "Zgjidh detyrën përfundimtare 'Master' për të hapur një zonë të re!",
    startButton: "Fillo Aventurën"
  },
  TR: {
    title: "MathGenius'a Hoş Geldiniz",
    subtitle: "Kişisel YZ Matematik Eğitmeniniz",
    whatIsThis: "Bu bir macera! Harita gizli - yolu keşfetmek için görevleri çözmelisiniz.",
    howItWorks: "Nasıl oynanır?",
    step1: "Haritayı Aç",
    step1Desc: "Bulutu kaldırmak ve sıradakini görmek için dersleri tamamla.",
    step2: "Puan Topla",
    step2Desc: "Doğru cevaplar sana mağaza için altın kazandırır.",
    step3: "Patronu Yen",
    step3Desc: "Yeni bir bölge açmak için final 'Master' görevini çöz!",
    startButton: "Maceraya Başla"
  },
  EN: {
    title: "Welcome to MathGenius",
    subtitle: "Your Personal AI Math Tutor",
    whatIsThis: "It's an adventure! The map is hidden - you must solve problems to reveal the path ahead.",
    howItWorks: "How to play?",
    step1: "Unlock the Map",
    step1Desc: "Complete lessons to clear the fog and reveal what's next.",
    step2: "Earn Points",
    step2Desc: "Correct answers get you coins for the Avatar Shop.",
    step3: "Beat the Boss",
    step3Desc: "Solve the final 'Master' task to open a new area!",
    startButton: "Start Adventure"
  }
};

export const UI_LABELS = {
  MK: {
    start: "Започни",
    submit: "Провери",
    next: "Следно",
    hint: "Помош од AI",
    practice: "Вежбање",
    challenge: "Предизвик",
    focus: "Основни",
    points: "Поени",
    streak: "Серија",
    welcome: "Unit 11: Графици",
    diagnostic: "Дијагностички Тест",
    tutorName: "AI Тутор",
    correct: "Точно!",
    incorrect: "Обиди се повторно.",
    completed: "Честитки! Ја заврши целината.",
    typeAnswer: "Внесете го вашиот одговор...",
    // New Map Labels
    myLearningPath: "Мојата Патека",
    shop: "Продавница",
    unitTitle: "Тема 11: Графици",
    unitDesc: "Линеарни функции и координати",
    diagnosticDesc: "Калибрирај го AI нивото на тежина",
    lockedLesson: "Заклучена Лекција",
    lockedDesc: "Заврши ја претходната за отклучување...",
    hiddenFog: "Повеќе лекции скриени во магла...",
    nextSection: "Следната Секција е Отклучена",
    unit12Title: "Тема 12: Геометрија",
    unit12Desc: "Наскоро во целосната верзија...",
    masterTask: "Мастер Задача",
    lesson: "Лекција"
  },
  SQ: {
    start: "Fillimi",
    submit: "Kontrollo",
    next: "Tjetra",
    hint: "Ndihmë nga AI",
    practice: "Praktikë",
    challenge: "Sfidë",
    focus: "Fokus",
    points: "Pikë",
    streak: "Seri",
    welcome: "Unit 11: Grafikët",
    diagnostic: "Test Diagnostikues",
    tutorName: "AI Tutor",
    correct: "Saktë!",
    incorrect: "Provo përsëri.",
    completed: "Urime! E përfunduat njësinë.",
    typeAnswer: "Shkruani përgjigjen tuaj...",
    // New Map Labels
    myLearningPath: "Rruga Ime",
    shop: "Dyqan",
    unitTitle: "Njësia 11: Grafikët",
    unitDesc: "Funksionet lineare dhe koordinatat",
    diagnosticDesc: "Kalibroni nivelin e vështirësisë së AI",
    lockedLesson: "Mësim i Kyçur",
    lockedDesc: "Përfundoni detyrën e mëparshme...",
    hiddenFog: "Mësime të fshehura në mjegull...",
    nextSection: "Seksioni Tjetër i Zhbllokuar",
    unit12Title: "Njësia 12: Gjeometria",
    unit12Desc: "Së shpejti në versionin e plotë...",
    masterTask: "Detyrë Master",
    lesson: "Mësim"
  },
  TR: {
    start: "Başla",
    submit: "Kontrol Et",
    next: "Sonraki",
    hint: "YZ İpucu",
    practice: "Alıştırma",
    challenge: "Meydan Okuma",
    focus: "Odak",
    points: "Puanlar",
    streak: "Seri",
    welcome: "Unit 11: Grafikler",
    diagnostic: "Tanı Testi",
    tutorName: "YZ Eğitmen",
    correct: "Doğru!",
    incorrect: "Tekrar dene.",
    completed: "Tebrikler! Üniteyi tamamladınız.",
    typeAnswer: "Cevabınızı yazın...",
    // New Map Labels
    myLearningPath: "Öğrenme Yolum",
    shop: "Mağaza",
    unitTitle: "Ünite 11: Grafikler",
    unitDesc: "Doğrusal fonksiyonlar ve koordinatlar",
    diagnosticDesc: "YZ zorluk seviyenizi ayarlayın",
    lockedLesson: "Kilitli Ders",
    lockedDesc: "Açmak için öncekini tamamlayın...",
    hiddenFog: "Sis içinde gizlenmiş dersler...",
    nextSection: "Sonraki Bölüm Açıldı",
    unit12Title: "Ünite 12: Geometri",
    unit12Desc: "Tam sürümde yakında...",
    masterTask: "Usta Görevi",
    lesson: "Ders"
  },
  EN: {
    start: "Start",
    submit: "Check",
    next: "Next",
    hint: "AI Hint",
    practice: "Practice",
    challenge: "Challenge",
    focus: "Focus",
    points: "Points",
    streak: "Streak",
    welcome: "Unit 11: Graphs",
    diagnostic: "Diagnostic Test",
    tutorName: "AI Tutor",
    correct: "Correct!",
    incorrect: "Try again.",
    completed: "Congratulations! Unit completed.",
    typeAnswer: "Type your answer...",
    // New Map Labels
    myLearningPath: "My Learning Path",
    shop: "Shop",
    unitTitle: "Unit 11: Graphs",
    unitDesc: "Master linear functions and coordinates",
    diagnosticDesc: "Calibrate your AI difficulty level",
    lockedLesson: "Locked Lesson",
    lockedDesc: "Complete previous task to reveal...",
    hiddenFog: "More lessons hidden in fog...",
    nextSection: "Next Section Unlocked",
    unit12Title: "Unit 12: Geometry",
    unit12Desc: "Coming soon in the full version...",
    masterTask: "Master Task",
    lesson: "Lesson"
  }
};

export const SAMPLE_LESSON: Lesson = {
  id: "COURSE_BOOK_1",
  title: {
    MK: "Учебник: Unit 11 (Графици)",
    EN: "Textbook: Unit 11 (Graphs)",
    SQ: "Libri shkollor: Unit 11 (Grafikët)",
    TR: "Ders Kitabı: Unit 11 (Grafikler)"
  },
  introText: {
    MK: "Добредојдовте во Unit 11. Ќе учиме за линеарни функции, графици и примена во реалниот живот.",
    EN: "Welcome to Unit 11. We will learn about linear functions, graphs, and real-life applications.",
    SQ: "Mirësevini në Unit 11. Do të mësojmë për funksionet lineare, grafikët dhe zbatimin në jetën reale.",
    TR: "Ünite 11'e hoş geldiniz. Doğrusal fonksiyonlar, grafikler ve gerçek hayat uygulamaları hakkında bilgi edineceğiz."
  },
  problems: [
    // ==========================================
    // GETTING STARTED (DIAGNOSTIC)
    // ==========================================
    {
      id: "GS_Q1a",
      lessonId: "Start",
      type: "input",
      difficulty: "Focus",
      question: {
        MK: "Еден пар чевли чини $25 помалку од еден капут. Ако капутот чини $110, најди ја цената на чевлите.",
        EN: "A pair of shoes costs $25 less than a coat. If the coat costs $110, find the price of the shoes.",
        SQ: "Një palë këpucë kushtojnë $25 më pak se një pallto. Nëse palltoja kushton $110, gjeni çmimin e këpucëve.",
        TR: "Bir çift ayakkabı bir paltodan $25 daha ucuzdur. Palto $110 ise, ayakkabının fiyatını bulun."
      },
      ai_tutor_logic: {
        hint: {
          MK: "Цената на чевлите е $110 минус $25.",
          EN: "The price of shoes is $110 minus $25.",
          SQ: "Çmimi i këpucëve është $110 minus $25.",
          TR: "Ayakkabının fiyatı $110 eksi $25'tir."
        },
        explanation: {
          MK: "$110 - 25 = 85$.",
          EN: "$110 - 25 = 85$.",
          SQ: "$110 - 25 = 85$.",
          TR: "$110 - 25 = 85$."
        }
      },
      correctAnswer: "85"
    },
    {
      id: "GS_Q2",
      lessonId: "Start",
      type: "multiple_choice",
      difficulty: "Focus",
      question: {
        MK: "Еден сингапурски долар може да се замени за 80 јапонски јени. Ако $d$ сингапурски долари можат да се заменат за $y$ јапонски јени, која од овие равенки е точна?",
        EN: "One Singapore Dollar can be exchanged for 80 Japanese Yen. If $d$ Singapore Dollars can be exchanged for $y$ Japanese Yen, which equation is correct?",
        SQ: "Një dollar Singapori mund të këmbehet me 80 jen japonez. Nëse $d$ dollarë këmbehen me $y$ jen, cili ekuacion është i saktë?",
        TR: "Bir Singapur Doları 80 Japon Yeni ile değiştirilebilir. $d$ Singapur Doları $y$ Japon Yeni ile değiştirilebiliyorsa, hangi denklem doğrudur?"
      },
      options: [
        { MK: "$y=d+80$", EN: "$y=d+80$", SQ: "$y=d+80$", TR: "$y=d+80$" },
        { MK: "$y=d-80$", EN: "$y=d-80$", SQ: "$y=d-80$", TR: "$y=d-80$" },
        { MK: "$y=80d$", EN: "$y=80d$", SQ: "$y=80d$", TR: "$y=80d$" },
        { MK: "$y=\\frac{d}{80}$", EN: "$y=\\frac{d}{80}$", SQ: "$y=\\frac{d}{80}$", TR: "$y=\\frac{d}{80}$" }
      ],
      ai_tutor_logic: {
        hint: {
          MK: "За секој 1 долар добивате 80 јени. Треба да множите.",
          EN: "For every 1 dollar you get 80 yen. You need to multiply.",
          SQ: "Për çdo 1 dollar merrni 80 jen. Duhet të shumëzoni.",
          TR: "Her 1 dolar için 80 yen alırsınız. Çarpmanız gerekir."
        },
        explanation: {
          MK: "Бидејќи 1 долар = 80 јени, $d$ долари = $80 \\times d$. Значи $y = 80d$.",
          EN: "Since 1 dollar = 80 yen, $d$ dollars = $80 \\times d$. So $y = 80d$.",
          SQ: "Meqenëse 1 dollar = 80 jen, $d$ dollarë = $80 \\times d$. Pra $y = 80d$.",
          TR: "1 dolar = 80 yen olduğundan, $d$ dolar = $80 \\times d$. Yani $y = 80d$."
        }
      },
      correctAnswer: 2
    },
    {
      id: "GS_Q4b",
      lessonId: "Start",
      type: "input",
      difficulty: "Practice",
      question: {
        MK: "Графикот ја покажува температурата на вода со равенка $y=-2x+30$. Колку време ($x$ во мин) е потребно за да се олади за $10^\\circ\\text{C}$?",
        EN: "The graph shows water temperature with equation $y=-2x+30$. How much time ($x$ in min) does it take to cool by $10^\\circ\\text{C}$?",
        SQ: "Grafiku tregon temperaturën e ujit me ekuacionin $y=-2x+30$. Sa kohë ($x$ në min) duhet për t'u ftohur me $10^\\circ\\text{C}$?",
        TR: "Grafik, $y=-2x+30$ denklemiyle su sıcaklığını gösterir. $10^\\circ\\text{C}$ soğuması ne kadar sürer ($x$ dakika)?"
      },
      illustration_description: "Линиски график на координатен систем. Вертикалната оска (y) претставува температура, а хоризонталната оска (x) претставува време. Правата линија започнува од точката (0, 30) на y-оската и опаѓа надолу надесно (негативен наклон).",
      ai_tutor_logic: {
        hint: {
          MK: "Наклонот е -2, што значи температурата паѓа за 2 степени секоја минута.",
          EN: "The slope is -2, meaning temperature drops 2 degrees every minute.",
          SQ: "Pjerrësia është -2, që do të thotë se temperatura bie 2 gradë çdo minutë.",
          TR: "Eğim -2'dir, yani sıcaklık her dakika 2 derece düşer."
        },
        explanation: {
          MK: "Вкупен пад од 10 поделено со брзината од 2 степени/мин = 5 минути.",
          EN: "Total drop of 10 divided by rate of 2 deg/min = 5 minutes.",
          SQ: "Rënia totale prej 10 pjesëtuar me normën prej 2 gradë/min = 5 minuta.",
          TR: "Toplam 10 düşüş, 2 derece/dakika hızına bölünür = 5 dakika."
        }
      },
      correctAnswer: "5"
    },

    // ==========================================
    // WORKBOOK 11.1: FUNCTIONS
    // ==========================================
    {
      id: "11.1_WB_Q1b",
      lessonId: "11.1_WB",
      type: "input",
      difficulty: "Focus",
      question: {
        MK: "Цената за изнајмување на скала за $n$ дена е $h$. Има такса за испорака од $10, плус дневна такса од $5. Напиши функција за $h$.",
        EN: "The cost of renting a ladder for $n$ days is $h$. There is a delivery fee of $10, plus a daily fee of $5. Write a function for $h$.",
        SQ: "Kostoja e marrjes me qira të një shkalle për $n$ ditë është $h$. Ka një tarifë dërgese prej $10, plus një tarifë ditore prej $5. Shkruani një funksion për $h$.",
        TR: "Bir merdiven kiralamanın maliyeti $n$ gün için $h$'dir. $10 teslimat ücreti artı günlük $5 ücret vardır. $h$ için bir fonksiyon yazın."
      },
      ai_tutor_logic: {
        hint: {
          MK: "Идентификувај ја фиксната вредност ($10) и променливата ($5 по ден).",
          EN: "Identify the fixed value ($10) and variable ($5 per day).",
          SQ: "Identifikoni vlerën fikse ($10) dhe variabël ($5 në ditë).",
          TR: "Sabit değeri ($10) ve değişkeni (günlük $5) belirleyin."
        },
        explanation: {
          MK: "Вкупно = Фиксна + (Дневна * денови). Значи $h = 5n + 10$.",
          EN: "Total = Fixed + (Daily * days). So $h = 5n + 10$.",
          SQ: "Gjithsej = Fikse + (Ditore * ditë). Pra $h = 5n + 10$.",
          TR: "Toplam = Sabit + (Günlük * gün). Yani $h = 5n + 10$."
        }
      },
      correctAnswer: "h=5n+10"
    },
    {
      id: "11.1_WB_Q4b",
      lessonId: "11.1_WB",
      type: "input",
      difficulty: "Focus",
      question: {
        MK: "Автомобил има 37 литри бензин. Троши 6 литри на час. Напиши формула за $L$ литри по $t$ часа.",
        EN: "A car has 37 liters of petrol. It uses 6 liters per hour. Write a formula for $L$ liters after $t$ hours.",
        SQ: "Një makinë ka 37 litra benzinë. Përdor 6 litra në orë. Shkruani një formulë për $L$ litra pas $t$ orësh.",
        TR: "Bir arabanın 37 litre benzini var. Saatte 6 litre harcıyor. $t$ saat sonra $L$ litre için bir formül yazın."
      },
      illustration_description: "Илустрација на мерач за гориво во автомобил кој покажува намалување на нивото на бензин.",
      ai_tutor_logic: {
        hint: {
          MK: "Почнуваш со 37 и одземаш 6 секој час.",
          EN: "You start with 37 and subtract 6 every hour.",
          SQ: "Filloni me 37 dhe zbritni 6 çdo orë.",
          TR: "37 ile başlayıp her saat 6 çıkarıyorsunuz."
        },
        explanation: {
          MK: "Количината се намалува. $L = 37 - 6t$.",
          EN: "The amount decreases. $L = 37 - 6t$.",
          SQ: "Sasia ulet. $L = 37 - 6t$.",
          TR: "Miktar azalır. $L = 37 - 6t$."
        }
      },
      correctAnswer: "L=37-6t"
    },

    // ==========================================
    // WORKBOOK 11.2: PLOTTING GRAPHS
    // ==========================================
    {
      id: "11.2_WB_Q1",
      lessonId: "11.2_WB",
      type: "table_completion",
      difficulty: "Focus",
      question: {
        MK: "Дадена е функцијата $y=2x-2$. Пополни ја табелата со вредности.",
        EN: "Given the function $y=2x-2$. Complete the table of values.",
        SQ: "Jepet funksioni $y=2x-2$. Plotësoni tabelën e vlerave.",
        TR: "$y=2x-2$ fonksiyonu veriliyor. Değerler tablosunu tamamlayın."
      },
      correctAnswer: { "-2": -6, "-1": -4, "0": -2, "1": 0, "2": 2, "3": 4 },
      ai_tutor_logic: {
        hint: {
          MK: "Замени го $x$ во равенката. Пр. за $x=-2$, $y=2(-2)-2 = -6$.",
          EN: "Substitute $x$ into the equation. E.g. for $x=-2$, $y=2(-2)-2 = -6$.",
          SQ: "Zëvendësoni $x$ në ekuacion. P.sh. për $x=-2$, $y=2(-2)-2 = -6$.",
          TR: "Denklemde $x$ yerine koyun. Örneğin $x=-2$ için $y=2(-2)-2 = -6$."
        },
        explanation: {
          MK: "Пресметај ја вредноста за секое x со множење со 2 и одземање 2.",
          EN: "Calculate the value for each x by multiplying by 2 and subtracting 2.",
          SQ: "Llogaritni vlerën për çdo x duke shumëzuar me 2 dhe duke zbritur 2.",
          TR: "Her x için değeri 2 ile çarpıp 2 çıkararak hesaplayın."
        }
      }
    },
    {
      id: "11.2_WB_Q3b",
      lessonId: "11.2_WB",
      type: "graphing",
      difficulty: "Practice",
      question: {
        MK: "Нацртај го графикот на функцијата $y=5-x$.",
        EN: "Plot the graph of the function $y=5-x$.",
        SQ: "Vizatoni grafikun e funksionit $y=5-x$.",
        TR: "$y=5-x$ fonksiyonunun grafiğini çizin."
      },
      graphConfig: {
        equation: "y=5-x"
      },
      ai_tutor_logic: {
        hint: {
          MK: "Кога $x=0, y=5$. Кога $x=5, y=0$.",
          EN: "When $x=0, y=5$. When $x=5, y=0$.",
          SQ: "Kur $x=0, y=5$. Kur $x=5, y=0$.",
          TR: "$x=0$ olduğunda $y=5$. $x=5$ olduğunda $y=0$."
        },
        explanation: {
          MK: "Линијата започнува од 5 на y-оската и оди надолу за 1 за секој чекор десно.",
          EN: "The line starts at 5 on the y-axis and goes down by 1 for each step right.",
          SQ: "Vija fillon në 5 në boshtin y dhe shkon poshtë me 1 për çdo hap djathtas.",
          TR: "Çizgi y ekseninde 5'ten başlar ve sağa her adımda 1 aşağı iner."
        }
      },
      correctAnswer: "line_match"
    },
    {
      id: "11.2_WB_Q11d",
      lessonId: "11.2_WB",
      type: "input",
      difficulty: "Challenge",
      question: {
        MK: "Цената за електричар е $y=30t+50$. Тој наплатил $185. Колку часа работел?",
        EN: "Electrician cost is $y=30t+50$. He charged $185. How many hours did he work?",
        SQ: "Kostoja e elektricistit është $y=30t+50$. Ai tarifoi $185. Sa orë punoi ai?",
        TR: "Elektrikçi maliyeti $y=30t+50$. $185 tahsil etti. Kaç saat çalıştı?"
      },
      illustration_description: "Илустрација на електричар со алат.",
      ai_tutor_logic: {
        hint: {
          MK: "Постави ја равенката $185 = 30t + 50$ и реши по $t$.",
          EN: "Set up equation $185 = 30t + 50$ and solve for $t$.",
          SQ: "Vendosni ekuacionin $185 = 30t + 50$ dhe zgjidheni për $t$.",
          TR: "$185 = 30t + 50$ denklemini kurun ve $t$ için çözün."
        },
        explanation: {
          MK: "$185 - 50 = 135$. $135 / 30 = 4.5$ часа.",
          EN: "$185 - 50 = 135$. $135 / 30 = 4.5$ hours.",
          SQ: "$185 - 50 = 135$. $135 / 30 = 4.5$ orë.",
          TR: "$185 - 50 = 135$. $135 / 30 = 4.5$ saat."
        }
      },
      correctAnswer: "4.5"
    },

    // ==========================================
    // WORKBOOK 11.3: GRADIENT & INTERCEPT
    // ==========================================
    {
      id: "11.3_WB_Q1d",
      lessonId: "11.3_WB",
      type: "input",
      difficulty: "Focus",
      question: {
        MK: "Спореди ги $y=x+2$ и $y=x$. Колкав е градиентот (m)?",
        EN: "Compare $y=x+2$ and $y=x$. What is the gradient (m)?",
        SQ: "Krahasoni $y=x+2$ dhe $y=x$. Sa është gradienti (m)?",
        TR: "$y=x+2$ ve $y=x$'i karşılaştırın. Eğim (m) nedir?"
      },
      ai_tutor_logic: {
        hint: {
          MK: "Градиентот е бројот пред $x$. Ако нема број, тоа е 1.",
          EN: "The gradient is the number before $x$. If no number, it is 1.",
          SQ: "Gradienti është numri para $x$. Nëse nuk ka numër, është 1.",
          TR: "Eğim $x$'ten önceki sayıdır. Sayı yoksa 1'dir."
        },
        explanation: {
          MK: "Двете линии имаат градиент 1. Тие се паралелни.",
          EN: "Both lines have gradient 1. They are parallel.",
          SQ: "Të dyja vijat kanë gradient 1. Ato janë paralele.",
          TR: "Her iki doğrunun da eğimi 1'dir. Paraleldirler."
        }
      },
      correctAnswer: "1"
    },
    {
      id: "11.3_WB_Q7a",
      lessonId: "11.3_WB",
      type: "input",
      difficulty: "Practice",
      question: {
        MK: "Колкав е градиентот на линијата $y=10-5x$?",
        EN: "What is the gradient of the line $y=10-5x$?",
        SQ: "Sa është gradienti i vijës $y=10-5x$?",
        TR: "$y=10-5x$ doğrusunun eğimi nedir?"
      },
      ai_tutor_logic: {
        hint: {
          MK: "Градиентот е коефициентот што го множи $x$. Внимавај на знакот.",
          EN: "The gradient is the coefficient multiplying $x$. Watch the sign.",
          SQ: "Gradienti është koeficienti që shumëzon $x$. Kujdes me shenjën.",
          TR: "Eğim, $x$ ile çarpılan katsayıdır. İşarete dikkat edin."
        },
        explanation: {
          MK: "Равенката е $y=-5x+10$, значи градиентот е -5.",
          EN: "The equation is $y=-5x+10$, so gradient is -5.",
          SQ: "Ekuacioni është $y=-5x+10$, pra gradienti është -5.",
          TR: "Denklem $y=-5x+10$'dur, yani eğim -5'tir."
        }
      },
      correctAnswer: "-5"
    },
    {
      id: "11.3_WB_Q12",
      lessonId: "11.3_WB",
      type: "input",
      difficulty: "Challenge",
      question: {
        MK: "Цената за $n$ ноќевања е $c=100n+50$. Што претставува градиентот во овој контекст?",
        EN: "Cost for $n$ nights is $c=100n+50$. What does the gradient represent here?",
        SQ: "Kostoja për $n$ netë është $c=100n+50$. Çfarë përfaqëson gradienti këtu?",
        TR: "$n$ gece için maliyet $c=100n+50$'dir. Eğim burada neyi temsil eder?"
      },
      // Note: Since this is text explanation, we check for keyword "100" or "price per night"
      ai_tutor_logic: {
        hint: {
          MK: "Градиентот е 100. Тоа е промената на цената за секоја дополнителна ноќ.",
          EN: "The gradient is 100. It is the change in cost for each extra night.",
          SQ: "Gradienti është 100. Është ndryshimi në kosto për çdo natë shtesë.",
          TR: "Eğim 100'dür. Her ek gece için maliyetteki değişimdir."
        },
        explanation: {
          MK: "Тоа е цената по ноќ ($100).",
          EN: "It is the price per night ($100).",
          SQ: "Është çmimi për natë ($100).",
          TR: "Gecelik fiyattır ($100)."
        }
      },
      correctAnswer: "100" 
    },

    // ==========================================
    // WORKBOOK 11.4: INTERPRETING GRAPHS
    // ==========================================
    {
      id: "11.4_WB_Q1",
      lessonId: "11.4_WB",
      type: "multiple_choice",
      difficulty: "Focus",
      question: {
        MK: "Софија и Зара пешачат. Линијата на Софија е пострмна од онаа на Зара. Кој пешачи побрзо?",
        EN: "Sofia and Zara are walking. Sofia's line is steeper than Zara's. Who is walking faster?",
        SQ: "Sofia dhe Zara po ecin. Vija e Sofisë është më e pjerrët se e Zarës. Kush ecën më shpejt?",
        TR: "Sofia ve Zara yürüyor. Sofia'nın çizgisi Zara'nınkinden daha dik. Kim daha hızlı yürüyor?"
      },
      options: [
        { MK: "Софија", EN: "Sofia", SQ: "Sofia", TR: "Sofia" },
        { MK: "Зара", EN: "Zara", SQ: "Zara", TR: "Zara" },
        { MK: "Исто", EN: "Same", SQ: "Njësoj", TR: "Aynı" }
      ],
      illustration_description: "График на растојание и време. Една линија е стрмна (Софија), другата е поблага (Зара).",
      ai_tutor_logic: {
        hint: {
          MK: "Пострмна линија значи дека поминува повеќе растојание за исто време.",
          EN: "A steeper line means covering more distance in the same time.",
          SQ: "Një vijë më e pjerrët do të thotë të mbulosh më shumë distancë në të njëjtën kohë.",
          TR: "Daha dik bir çizgi, aynı sürede daha fazla mesafe kat etmek anlamına gelir."
        },
        explanation: {
          MK: "Стрмнината е брзина. Софија има пострмна линија, значи е побрза.",
          EN: "Steepness is speed. Sofia has a steeper line, so she is faster.",
          SQ: "Pjerrësia është shpejtësi. Sofia ka një vijë më të pjerrët, kështu që është më e shpejtë.",
          TR: "Diklik hızdır. Sofia'nın çizgisi daha dik, yani o daha hızlı."
        }
      },
      correctAnswer: 0
    },
    {
      id: "11.4_WB_Q5a",
      lessonId: "11.4_WB",
      type: "multiple_choice",
      difficulty: "Practice",
      question: {
        MK: "Водоводџија А: y=20x+40. Водоводџија Б: y=40x. Кој е поевтин за 1.5 часа?",
        EN: "Plumber A: y=20x+40. Plumber B: y=40x. Who is cheaper for 1.5 hours?",
        SQ: "Hidrauliku A: y=20x+40. Hidrauliku B: y=40x. Kush është më i lirë për 1.5 orë?",
        TR: "Tesisatçı A: y=20x+40. Tesisatçı B: y=40x. 1.5 saat için kim daha ucuz?"
      },
      options: [
        { MK: "Водоводџија А ($70)", EN: "Plumber A ($70)", SQ: "Hidrauliku A ($70)", TR: "Tesisatçı A ($70)" },
        { MK: "Водоводџија Б ($60)", EN: "Plumber B ($60)", SQ: "Hidrauliku B ($60)", TR: "Tesisatçı B ($60)" }
      ],
      ai_tutor_logic: {
        hint: {
          MK: "Замени x=1.5 во двете равенки. А: 20(1.5)+40. Б: 40(1.5).",
          EN: "Substitute x=1.5 into both equations. A: 20(1.5)+40. B: 40(1.5).",
          SQ: "Zëvendësoni x=1.5 në të dy ekuacionet. A: 20(1.5)+40. B: 40(1.5).",
          TR: "Her iki denklemde x=1.5 koyun. A: 20(1.5)+40. B: 40(1.5)."
        },
        explanation: {
          MK: "А = 30+40 = 70. Б = 60. Б е поевтин.",
          EN: "A = 30+40 = 70. B = 60. B is cheaper.",
          SQ: "A = 30+40 = 70. B = 60. B është më i lirë.",
          TR: "A = 30+40 = 70. B = 60. B daha ucuzdur."
        }
      },
      correctAnswer: 1
    },
    {
      id: "11.4_WB_Q8d",
      lessonId: "11.4_WB",
      type: "input",
      difficulty: "Challenge",
      question: {
        MK: "Растение X расте според $y=5x+10$. Растение Y започнува од 20cm и расте 3cm неделно. Напиши ја равенката за Y.",
        EN: "Plant X grows by $y=5x+10$. Plant Y starts at 20cm and grows 3cm/week. Write the equation for Y.",
        SQ: "Bima X rritet sipas $y=5x+10$. Bima Y fillon në 20cm dhe rritet 3cm/javë. Shkruani ekuacionin për Y.",
        TR: "Bitki X, $y=5x+10$'a göre büyür. Bitki Y 20cm'de başlar ve haftada 3cm büyür. Y için denklemi yazın."
      },
      illustration_description: "График на раст на растенија.",
      ai_tutor_logic: {
        hint: {
          MK: "Почетна висина е c=20. Раст е m=3.",
          EN: "Starting height is c=20. Growth is m=3.",
          SQ: "Lartësia fillestare është c=20. Rritja është m=3.",
          TR: "Başlangıç yüksekliği c=20. Büyüme m=3'tür."
        },
        explanation: {
          MK: "Користи $y=mx+c$. Значи $y=3x+20$.",
          EN: "Use $y=mx+c$. So $y=3x+20$.",
          SQ: "Përdorni $y=mx+c$. Pra $y=3x+20$.",
          TR: "$y=mx+c$ kullanın. Yani $y=3x+20$."
        }
      },
      correctAnswer: "y=3x+20"
    }
  ]
};
