'use client';

import React, { useEffect, useState } from 'react';

const FireSparks = ({ className }: { className?: string }) => {
    const [particles, setParticles] = useState<any[]>([]);

    useEffect(() => {
        // Generate random values on the client to avoid hydration errors
        const newParticles = Array.from({ length: 40 }).map((_, i) => ({
            id: i,
            left: Math.random() * 100 + '%',
            delay: Math.random() * 4 + 's', // Random start time
            duration: 2 + Math.random() * 3 + 's', // Random duration between 2s and 5s
            size: 3 + Math.random() * 5 + 'px', // Random size between 3px and 8px
            moveX: (Math.random() - 0.5) * 60 + 'px', // Random horizontal drift
        }));
        setParticles(newParticles);
    }, []);

    return (
        <div className={`relative w-60 h-60 pointer-events-none overflow-hidden ${className}`}>
            {particles.map((p) => (
                <div
                    key={p.id}
                    className="absolute bottom-0 rounded-full bg-gradient-to-t from-red-600 via-orange-500 to-yellow-300 shadow-[0_0_10px_rgba(255,165,0,0.8)]"
                    style={{
                        left: p.left,
                        width: p.size,
                        height: p.size,
                        opacity: 0,
                        animation: `spark-rise ${p.duration} infinite ease-out ${p.delay}`,
                        // Custom property for the drift animation
                        '--move-x': p.moveX,
                    } as React.CSSProperties}
                />
            ))}
            <style jsx>{`
        @keyframes spark-rise {
          0% {
            transform: translateY(100%) translateX(0) scale(1);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          100% {
            transform: translateY(-150%) translateX(var(--move-x)) scale(0);
            opacity: 0;
          }
        }
      `}</style>
        </div>
    );
};

export default FireSparks;
