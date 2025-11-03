"use client"

import type React from "react"
import { useEffect, useMemo, useState } from "react"

export default function Balloons() {
  // CHANGE: Enhanced premium balloon design with luxury colors
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const balloons = useMemo(() => {
    if (!mounted) return [] as Array<{
      id: number
      left: string
      delay: number
      duration: number
      color: string
    }>
    return Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      left: `${(i * 100) / 12}%`,
      delay: i * 0.15,
      duration: 12 + Math.random() * 6,
      color: [
        "#FBB040", // Gold
        "#F59E0B", // Amber
        "#D97706", // Orange
        "#DC2626", // Red
        "#EF4444", // Light Red
        "#FBBF24", // Light Gold
        "#F97316", // Deep Orange
        "#92400E", // Deep Brown
        "#B45309", // Warm Brown
        "#EA580C", // Vibrant Orange
        "#D1410C", // Deep Red Orange
        "#FB8500", // Rich Orange
      ][i],
    }))
  }, [mounted])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-5">
      {balloons.map((balloon) => (
        <div key={balloon.id} className="absolute bottom-0" style={{ left: balloon.left }}>
          <div
            className="animate-float"
            style={
              {
                "--balloon-color": balloon.color,
                "--delay": `${balloon.delay}s`,
                "--duration": `${balloon.duration}s`,
              } as React.CSSProperties & { "--balloon-color": string; "--delay": string; "--duration": string }
            }
          >
            {/* Premium Balloon with shadow */}
            <div
              className="w-14 h-20 md:w-20 md:h-28 rounded-full shadow-lg"
              style={{
                backgroundColor: balloon.color,
                boxShadow: `0 8px 20px ${balloon.color}40, inset -2px -2px 5px rgba(0,0,0,0.2)`,
              }}
            />
            {/* String */}
            <div className="w-1 h-32 md:h-40 bg-gradient-to-b from-gray-300 to-gray-400" style={{ margin: "0 auto" }} />
          </div>
        </div>
      ))}
    </div>
  )
}
