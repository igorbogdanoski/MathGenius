import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Star, Crown } from 'lucide-react';
import { StudentProfile } from '../types';
import { dataService } from '../services/dataService';

const Leaderboard: React.FC = () => {
  const [topStudents, setTopStudents] = useState<StudentProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBoard = async () => {
      const board = await dataService.getLeaderboard();
      setTopStudents(board);
      setLoading(false);
    };
    fetchBoard();
    
    // Refresh every 30 seconds for live feel
    const interval = setInterval(fetchBoard, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="animate-pulse h-40 bg-slate-100 rounded-3xl" />;

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
      <div className="bg-indigo-600 p-6 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
            <Trophy className="w-6 h-6 text-yellow-300" />
            <h3 className="font-bold text-lg">Class Top 10</h3>
        </div>
        <Crown className="w-6 h-6 opacity-50" />
      </div>

      <div className="p-2">
        {topStudents.length === 0 ? (
            <p className="text-center py-8 text-slate-400 text-sm italic">No data yet. Be the first!</p>
        ) : (
            topStudents.map((student, index) => (
                <div 
                    key={student.id}
                    className={`flex items-center gap-4 p-3 rounded-2xl transition-all ${
                        index === 0 ? 'bg-yellow-50/50' : 
                        index === 1 ? 'bg-slate-50/50' : 
                        index === 2 ? 'bg-orange-50/50' : ''
                    }`}
                >
                    <div className="w-8 flex justify-center font-bold text-slate-400">
                        {index === 0 ? <Medal className="w-5 h-5 text-yellow-500" /> : 
                         index === 1 ? <Medal className="w-5 h-5 text-slate-400" /> :
                         index === 2 ? <Medal className="w-5 h-5 text-orange-400" /> :
                         index + 1}
                    </div>
                    
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-xl shadow-sm border border-slate-100">
                        {student.avatar}
                    </div>
                    
                    <div className="flex-1">
                        <div className="font-bold text-sm text-slate-700 truncate">{student.name}</div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Level {Math.floor(student.overallMastery / 10)}</div>
                    </div>
                    
                    <div className="flex items-center gap-1 bg-indigo-50 px-3 py-1 rounded-full">
                        <Star className="w-3 h-3 text-indigo-500 fill-indigo-500" />
                        <span className="font-bold text-indigo-700 text-sm">{Math.round(student.overallMastery * 10)}</span>
                    </div>
                </div>
            ))
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
