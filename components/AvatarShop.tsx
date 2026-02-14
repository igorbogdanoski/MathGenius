
import React, { useState } from 'react';
import { ShoppingBag, Check, Lock, X } from 'lucide-react';
import { UserState, ShopItem } from '../types';

// Define Shop Items
export const SHOP_ITEMS: ShopItem[] = [
  // Avatars
  { id: 'av_student', type: 'avatar', name: 'Scholar', cost: 0, value: '🧑‍🎓', description: 'Default scholar' },
  { id: 'av_robot', type: 'avatar', name: 'RoboMath', cost: 50, value: '🤖', description: 'Calculates fast' },
  { id: 'av_cat', type: 'avatar', name: 'Professor Meow', cost: 100, value: '🐱', description: 'Purrfect logic' },
  { id: 'av_alien', type: 'avatar', name: 'Galactic Mind', cost: 150, value: '👽', description: 'Universal math' },
  { id: 'av_fox', type: 'avatar', name: 'Sly Solver', cost: 200, value: '🦊', description: 'Tricky problems' },
  
  // Accessories
  { id: 'acc_glasses', type: 'accessory', name: 'Smart Glasses', cost: 80, value: '👓', description: 'See the answer' },
  { id: 'acc_crown', type: 'accessory', name: 'Math King', cost: 300, value: '👑', description: 'Rule the numbers' },
  { id: 'acc_grad', type: 'accessory', name: 'Cap', cost: 120, value: '🎓', description: 'Graduated' },
  
  // Themes (CSS Classes for background)
  { id: 'th_default', type: 'theme', name: 'Clean White', cost: 0, value: 'bg-slate-50', description: 'Classic look' },
  { id: 'th_dark', type: 'theme', name: 'Night Mode', cost: 100, value: 'bg-slate-900 text-white', description: 'Easy on eyes' },
  { id: 'th_purple', type: 'theme', name: 'Royal', cost: 150, value: 'bg-purple-50', description: 'Regal learning' },
];

interface Props {
  userState: UserState;
  onUpdateState: (newState: Partial<UserState>) => void;
  onClose: () => void;
}

const AvatarShop: React.FC<Props> = ({ userState, onUpdateState, onClose }) => {
  const [activeTab, setActiveTab] = useState<'avatar' | 'accessory' | 'theme'>('avatar');

  const handleBuyOrEquip = (item: ShopItem) => {
    const isOwned = userState.inventory.includes(item.id);

    if (isOwned) {
      // Equip
      const newEquipped = { ...userState.equipped };
      if (item.type === 'avatar') newEquipped.avatar = item.value;
      if (item.type === 'accessory') newEquipped.accessory = (newEquipped.accessory === item.value ? null : item.value); // Toggle
      if (item.type === 'theme') newEquipped.theme = item.value;

      onUpdateState({ equipped: newEquipped });
    } else {
      // Buy
      if (userState.masteryPoints >= item.cost) {
        onUpdateState({
          masteryPoints: userState.masteryPoints - item.cost,
          inventory: [...userState.inventory, item.id]
        });
      } else {
        // Shake animation logic could go here
        alert("Not enough points!");
      }
    }
  };

  const filteredItems = SHOP_ITEMS.filter(i => i.type === activeTab);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in-up">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-indigo-600 p-6 flex justify-between items-center text-white">
          <div className="flex items-center gap-3">
             <div className="bg-white/20 p-2 rounded-xl">
               <ShoppingBag className="w-6 h-6" />
             </div>
             <div>
               <h2 className="text-xl font-bold">Avatar Shop</h2>
               <p className="text-indigo-200 text-sm">Customize your look!</p>
             </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full font-bold text-sm shadow-sm flex items-center gap-1">
               🏆 {userState.masteryPoints}
            </div>
            <button onClick={onClose} className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Preview Area */}
        <div className={`p-8 flex justify-center items-center bg-gray-100 transition-colors duration-500 border-b border-gray-200 relative`}>
            {/* We apply the chosen theme to this preview box essentially */}
            <div className={`w-32 h-32 rounded-full border-4 border-white shadow-xl flex items-center justify-center text-6xl relative bg-white`}>
               <span>{userState.equipped.avatar}</span>
               {userState.equipped.accessory && (
                 <span className="absolute -top-4 -right-4 text-4xl animate-bounce">
                   {userState.equipped.accessory}
                 </span>
               )}
            </div>
        </div>

        {/* Tabs */}
        <div className="flex p-2 gap-2 bg-gray-50 border-b border-gray-200">
           {['avatar', 'accessory', 'theme'].map((tab) => (
             <button
               key={tab}
               onClick={() => setActiveTab(tab as any)}
               className={`flex-1 py-2 rounded-lg font-bold text-sm capitalize transition-all ${
                 activeTab === tab 
                   ? 'bg-indigo-100 text-indigo-700 shadow-sm' 
                   : 'text-gray-500 hover:bg-gray-200'
               }`}
             >
               {tab}s
             </button>
           ))}
        </div>

        {/* Items Grid */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
           <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {filteredItems.map(item => {
                const isOwned = userState.inventory.includes(item.id);
                const isEquipped = 
                   item.type === 'avatar' ? userState.equipped.avatar === item.value :
                   item.type === 'accessory' ? userState.equipped.accessory === item.value :
                   item.type === 'theme' ? userState.equipped.theme === item.value : false;
                
                const canAfford = userState.masteryPoints >= item.cost;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleBuyOrEquip(item)}
                    disabled={!isOwned && !canAfford}
                    className={`relative p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-all ${
                      isEquipped 
                        ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200' 
                        : isOwned 
                          ? 'border-gray-200 hover:border-indigo-300 bg-white'
                          : canAfford
                            ? 'border-yellow-200 bg-yellow-50 hover:scale-105'
                            : 'border-gray-100 bg-gray-50 opacity-60'
                    }`}
                  >
                     <div className="text-4xl">{item.type === 'theme' ? '🎨' : item.value}</div>
                     <div className="text-center">
                       <div className="font-bold text-sm text-gray-800">{item.name}</div>
                       <div className="text-xs text-gray-500">{item.description}</div>
                     </div>
                     
                     <div className="mt-2 w-full">
                       {isOwned ? (
                         <div className={`w-full py-1 rounded text-xs font-bold flex items-center justify-center gap-1 ${
                           isEquipped ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'
                         }`}>
                           {isEquipped ? <Check className="w-3 h-3" /> : null}
                           {isEquipped ? 'Equipped' : 'Equip'}
                         </div>
                       ) : (
                         <div className="w-full bg-yellow-400 text-yellow-900 py-1 rounded text-xs font-bold flex items-center justify-center gap-1">
                            {canAfford ? 'Buy' : <Lock className="w-3 h-3" />}
                            {item.cost} pts
                         </div>
                       )}
                     </div>
                  </button>
                );
              })}
           </div>
        </div>

      </div>
    </div>
  );
};

export default AvatarShop;
