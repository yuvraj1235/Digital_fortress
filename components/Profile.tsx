"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/services/authService"; // Double check this path!

export default function Profile() {
    // You can also track the round number to show it in the UI
    const [roundNo, setRoundNo] = useState(1);
    const [playerImage, setPlayerImage] = useState("/avatar/default.png");

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const data = await authService.getUserProfile();
                if (data.image) {
                    setPlayerImage(data.image);
                }
                if (data.roundNo) {
                    setRoundNo(data.roundNo);
                }
            } catch (err) {
                console.log("User not logged in or error fetching profile");
            }
        };

        fetchUserData();
    }, []);
    return (
        <div>
            {/* RIGHT: PROFILE */}
            <div className="z-10 flex flex-col items-center">
                <button className="h-12 w-12 md:h-14 md:w-14 overflow-hidden rounded-full border-2 border-yellow-600 shadow-lg">
                    <img
                        src={playerImage}
                        alt="Profile"
                        className="h-full w-full object-cover"
                        onError={() => setPlayerImage("/avatar/default.png")}
                    />
                </button>
                {/* Displays the round number we extracted */}
                <p className="text-[10px] md:text-xs text-yellow-500 font-bold mt-1">
                    Round {roundNo}
                </p>
            </div>
        </div>
    )
}
