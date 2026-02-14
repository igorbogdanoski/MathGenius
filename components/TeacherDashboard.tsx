import React, { useState, useEffect, useRef } from 'react';
import { Users, AlertTriangle, TrendingUp, Clock, Search, ChevronDown, CheckCircle, XCircle, BarChart3, Download, Upload, Plus, Save, BookOpen, Trash2 } from 'lucide-react';
import { StudentProfile, Problem, Language } from '../types';
import { dataService } from '../services/dataService';
import MathRenderer from './MathRenderer';

interface Props {
  onBack: () => void;
  onExport: () => void;
  onImport: (file: File) => void;
}

const TeacherDashboard: React.FC<Props> = ({ onBack, onExport, onImport }) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'cms'>('analytics');
  
  // Analytics State
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // CMS State
  const [customProblems, setCustomProblems] = useState<Problem[]>([]);
  const [newProblem, setNewProblem] = useState<Partial<Problem>>({
    type: 'input',
    difficulty: 'Practice',
    lessonId: '11.1',
    question: { MK: '', EN: '', SQ: '', TR: '' },
    ai_tutor_logic: { hint: { MK: '', EN: '', SQ: '', TR: '' }, explanation: { MK: '', EN: '', SQ: '', TR: '' } },
    correctAnswer: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load Initial Data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const roster = await dataService.getClassRoster();
      setStudents(roster);
      
      const content = dataService.getCustomProblems();
      setCustomProblems(content);
      
      setLoading(false);
    };
    loadData();
  }, []);

  // --- ANALYTICS LOGIC ---
  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const atRiskCount = students.filter(s => s.status === 'At Risk').length;
  const avgMastery = students.length > 0 ? Math.round(students.reduce((acc, s) => acc + s.overallMastery, 0) / students.length) : 0;

  // --- CMS LOGIC ---
  const handleSaveProblem = () => {
    if (!newProblem.question?.EN || !newProblem.correctAnswer) {
      alert("Please fill in at least the English question and Correct Answer.");
      return;
    }

    const problemToSave: Problem = {
      id: `custom_${Date.now()}`,
      lessonId: newProblem.lessonId || '11.1',
      type: newProblem.type || 'input',
      difficulty: newProblem.difficulty || 'Practice',
      question: newProblem.question as any,
      ai_tutor_logic: newProblem.ai_tutor_logic as any,
      correctAnswer: newProblem.correctAnswer
    };

    dataService.saveCustomProblem(problemToSave);
    setCustomProblems([...customProblems, problemToSave]);
    alert("Problem Saved! It will now appear in the student app.");
    
    // Reset form
    setNewProblem({
      type: 'input',
      difficulty: 'Practice',
      lessonId: '11.1',
      question: { MK: '', EN: '', SQ: '', TR: '' },
      ai_tutor_logic: { hint: { MK: '', EN: '', SQ: '', TR: '' }, explanation: { MK: '', EN: '', SQ: '', TR: '' } },
      correctAnswer: ''
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImport(e.target.files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Top Navigation */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg text-white">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-xl">Teacher Dashboard</h1>
            <p className="text-xs text-slate-500">Unit 11: Graphs • Class 8-A</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
           <button 
             onClick={() => setActiveTab('analytics')}
             className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-all ${activeTab === 'analytics' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
           >
             Analytics
           </button>
           <button 
             onClick={() => setActiveTab('cms')}
             className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-all ${activeTab === 'cms' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
           >
             Course Editor (CMS)
           </button>
        </div>
        
        <div className="flex items-center gap-3">
           <button onClick={onBack} className="text-sm font-semibold text-slate-500 hover:text-indigo-600">Exit</button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        
        {/* =======================
            ANALYTICS VIEW 
           ======================= */}
        {activeTab === 'analytics' && (
           <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-fade-in-up">
              {/* Stats Sidebar */}
              <div className="lg:col-span-1 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                        <div className="text-xs text-slate-400 uppercase font-bold mb-1">Students</div>
                        <div className="text-2xl font-bold">{students.length}</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                        <div className="text-xs text-red-400 uppercase font-bold mb-1">At Risk</div>
                        <div className="text-2xl font-bold text-red-600">{atRiskCount}</div>
                    </div>
                  </div>

                  {/* Student List */}
                  <div className="bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col h-[600px]">
                     <div className="p-3 border-b border-slate-100">
                        <input 
                           type="text" 
                           placeholder="Search..." 
                           className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                           value={searchTerm}
                           onChange={(e) => setSearchTerm(e.target.value)}
                        />
                     </div>
                     <div className="overflow-y-auto flex-1 p-2 space-y-1">
                        {loading ? (
                           <div className="text-center py-10 text-slate-400 text-sm">Loading data...</div>
                        ) : filteredStudents.map(student => (
                           <button
                              key={student.id}
                              onClick={() => setSelectedStudent(student)}
                              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left ${
                              selectedStudent?.id === student.id ? 'bg-indigo-50 border border-indigo-200' : 'hover:bg-slate-50 border border-transparent'
                              }`}
                           >
                              <div className="w-8 h-8 bg-white border border-slate-200 rounded-full flex items-center justify-center">
                                 {student.avatar}
                              </div>
                              <div className="flex-1 min-w-0">
                                 <div className="font-bold text-sm truncate">{student.name}</div>
                                 <div className={`text-[10px] uppercase font-bold tracking-wide ${
                                    student.status === 'At Risk' ? 'text-red-500' : 'text-green-500'
                                 }`}>{student.status}</div>
                              </div>
                           </button>
                        ))}
                     </div>
                  </div>
              </div>

              {/* Student Details */}
              <div className="lg:col-span-3">
                 {selectedStudent ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 h-full">
                       <div className="flex items-center gap-6 mb-8">
                          <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center text-4xl border-4 border-white shadow-lg">
                             {selectedStudent.avatar}
                          </div>
                          <div>
                             <h2 className="text-3xl font-bold text-slate-800">{selectedStudent.name}</h2>
                             <div className="flex gap-4 mt-2 text-sm text-slate-500">
                                <span className="bg-slate-100 px-3 py-1 rounded-full flex items-center gap-2"><Clock className="w-3 h-3"/> Active: {selectedStudent.lastActive}</span>
                             </div>
                          </div>
                       </div>
                       
                       <h3 className="font-bold text-lg mb-4">Performance History</h3>
                       <div className="space-y-3">
                          {selectedStudent.history.length === 0 ? (
                             <div className="text-slate-400 italic">No activity recorded yet.</div>
                          ) : selectedStudent.history.map((h, i) => (
                             <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <div className="flex items-center gap-3">
                                   {h.correct ? <CheckCircle className="text-green-500 w-5 h-5"/> : <XCircle className="text-red-500 w-5 h-5"/>}
                                   <span className="font-medium text-slate-700">{h.topic}</span>
                                   <span className="text-xs text-slate-400">({h.problemId})</span>
                                </div>
                                <span className="font-mono text-sm text-slate-500">{h.timeSpent}s</span>
                             </div>
                          ))}
                       </div>
                    </div>
                 ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">
                       <BarChart3 className="w-16 h-16 opacity-20 mb-4" />
                       <p>Select a student to view details</p>
                    </div>
                 )}
              </div>
           </div>
        )}

        {/* =======================
            CMS VIEW (COURSE EDITOR)
           ======================= */}
        {activeTab === 'cms' && (
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in-up">
              {/* Form Side */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                 <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-indigo-600" /> Add New Problem
                 </h2>

                 <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                       <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Lesson ID</label>
                          <select 
                             className="w-full p-2 border rounded-lg bg-slate-50"
                             value={newProblem.lessonId}
                             onChange={e => setNewProblem({...newProblem, lessonId: e.target.value})}
                          >
                             <option value="11.1">11.1 Functions</option>
                             <option value="11.2">11.2 Plotting</option>
                             <option value="11.3">11.3 Gradient</option>
                             <option value="11.4">11.4 Interpreting</option>
                          </select>
                       </div>
                       <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Difficulty</label>
                          <select 
                             className="w-full p-2 border rounded-lg bg-slate-50"
                             value={newProblem.difficulty}
                             onChange={e => setNewProblem({...newProblem, difficulty: e.target.value as any})}
                          >
                             <option value="Focus">Focus</option>
                             <option value="Practice">Practice</option>
                             <option value="Challenge">Challenge</option>
                          </select>
                       </div>
                    </div>

                    <div>
                       <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Question (English)</label>
                       <textarea 
                          className="w-full p-3 border rounded-lg bg-slate-50 min-h-[80px]"
                          placeholder="Type question here... Use $x$ for math vars."
                          value={newProblem.question?.EN}
                          onChange={e => setNewProblem({
                             ...newProblem, 
                             question: { ...newProblem.question as any, EN: e.target.value, MK: e.target.value, SQ: e.target.value, TR: e.target.value } // Auto-fill others for demo
                          })}
                       />
                       <p className="text-[10px] text-slate-400 mt-1">* Auto-fills other languages for demo. Use JSON import for full translation support.</p>
                    </div>

                    <div>
                       <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Correct Answer</label>
                       <input 
                          type="text" 
                          className="w-full p-3 border rounded-lg bg-slate-50"
                          placeholder="e.g. 5, y=2x+1, or MCQ index"
                          value={newProblem.correctAnswer}
                          onChange={e => setNewProblem({...newProblem, correctAnswer: e.target.value})}
                       />
                    </div>
                    
                    <button 
                       onClick={handleSaveProblem}
                       className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 mt-4"
                    >
                       <Save className="w-5 h-5" /> Save Problem
                    </button>
                 </div>
              </div>

              {/* Preview List Side */}
              <div className="bg-slate-100 p-8 rounded-2xl border border-slate-200">
                 <h2 className="text-xl font-bold mb-6 text-slate-600">Custom Content Library</h2>
                 {customProblems.length === 0 ? (
                    <div className="text-center text-slate-400 py-10 border-2 border-dashed border-slate-300 rounded-xl">
                       <BookOpen className="w-10 h-10 mx-auto mb-2 opacity-30" />
                       No custom problems yet.
                    </div>
                 ) : (
                    <div className="space-y-3 max-h-[500px] overflow-y-auto">
                       {customProblems.map((p, i) => (
                          <div key={i} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex justify-between items-center group">
                             <div>
                                <div className="flex items-center gap-2 mb-1">
                                   <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-[10px] font-bold">{p.lessonId}</span>
                                   <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-[10px] font-bold">{p.difficulty}</span>
                                </div>
                                <div className="text-sm font-medium text-slate-800 line-clamp-1">
                                   <MathRenderer text={p.question.EN} />
                                </div>
                             </div>
                             <div className="text-xs font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded">
                                Ans: {p.correctAnswer}
                             </div>
                          </div>
                       ))}
                    </div>
                 )}
              </div>
           </div>
        )}

      </div>
    </div>
  );
};

export default TeacherDashboard;