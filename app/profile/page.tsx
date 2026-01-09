// "use client";

// import React, { useEffect, useState } from 'react';
// import { authService } from '@/lib/services/authService';

// interface PlayerStats {
//   name: string;
//   score: number;
//   rank: number;
//   imageLink: string;
// }

// const ProfilePage = () => {
//   const [player, setPlayer] = useState<PlayerStats | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     authService.getUserProfile()
//       .then(data => {
//         setPlayer({
//           name: data.name, // Matches backend "name"
//           score: data.score, // Matches backend "score"
//           rank: data.rank, // Matches backend "rank"
//           imageLink: data.image || "/avatar/default.png", // Use fallback
//         });
//       })
//       .catch((err) => {
//         console.error("Profile Fetch Error:", err);
//         authService.logout();
//       })
//       .finally(() => setLoading(false));
//   }, []);

//   if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-yellow-100">Loading Quest...</div>;
//   if (!player) return null;

//   return (
//     <div className="relative min-h-screen w-full flex items-center justify-center bg-cover bg-center" 
//          style={{ backgroundImage: "url('/profile/profile.png')" }}>
      
//       <div className="relative w-[550px] h-[650px] flex flex-col items-center">
//         {/* Decorative Frame */}
//         <img src="/profile/frame.png" alt="Frame" className="absolute inset-0 w-full h-full z-0 pointer-events-none" />

//         {/* Avatar */}
//         <div className="absolute -top-6 w-28 h-28 z-20 flex items-center justify-center">
//             <img 
//               src={player.imageLink} 
//               alt="Avatar" 
//               className="w-[85%] h-[85%] rounded-full object-cover border-2 border-yellow-600"
//               onError={(e) => (e.currentTarget.src = "/avatar/default.png")}
//             />
//         </div>

//         {/* Profile Content */}
//         <div className="relative z-10 w-full h-full flex flex-col items-center pt-32 px-12 text-yellow-100 font-serif">
//           <h1 className="text-4xl mb-4 text-yellow-200 uppercase tracking-widest">Player Profile</h1>
//           <div className="w-full h-[1px] bg-yellow-700/50 mb-10" />

//           <div className="space-y-4 text-left w-full px-4 text-2xl">
//             <p>⚔️ <b>Level:</b> {player.name}</p>
//             <p>🛡️ <b>Score:</b> {player.score.toLocaleString()}</p>
//             <p>⏳ <b>Rank:</b> #{player.rank}</p>
//           </div>

//           <div className="flex gap-4 mt-12">
//             <button className="px-6 py-2 bg-red-950/80 border-2 border-yellow-700 rounded-lg text-sm font-bold hover:bg-red-900">EQUIPMENT</button>
//             <button className="px-10 py-2 bg-red-950/80 border-2 border-yellow-700 rounded-full text-sm font-bold hover:bg-red-900">SKILLS</button>
//           </div>

//           <button 
//             onClick={() => authService.logout()}
//             className="absolute bottom-12 right-12 px-6 py-1.5 bg-red-950 border-2 border-yellow-800 rounded-full text-[10px] font-bold hover:bg-red-800"
//           >
//             LOGOUT
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;