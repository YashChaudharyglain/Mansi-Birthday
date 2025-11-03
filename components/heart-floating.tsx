"use client"

import type React from "react"

export default function HeartFloating() {
  // CHANGE: Premium heart and emoji floating with luxury theme
  const hearts = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    delay: Math.random() * 3,
    duration: 5 + Math.random() * 3,
    emoji: ["❤️", "💛", "💜", "💖", "✨", "🌟", "💝", "🎊"][Math.floor(Math.random() * 8)],
    size: Math.random() > 0.6 ? "text-5xl" : Math.random() > 0.3 ? "text-4xl" : "text-3xl",
  }))

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-15">
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className={`absolute animate-float-up ${heart.size} opacity-80 hover:opacity-100 transition-opacity`}
          style={
            {
              left: heart.left,
              top: heart.top,
              "--delay": `${heart.delay}s`,
              "--duration": `${heart.duration}s`,
            } as React.CSSProperties & { "--delay": string; "--duration": string }
          }
        >
          {heart.emoji}
        </div>
      ))}
    </div>
  )
}
