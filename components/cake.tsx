"use client"

import { useState } from "react"

interface CakeProps {
  isBurning: boolean
  onBlown: () => void
}

export default function Cake({ isBurning, onBlown }: CakeProps) {
  const [isClickable, setIsClickable] = useState(true)

  const handleClick = () => {
    if (isClickable) {
      setIsClickable(false)
      onBlown()
    }
  }

  return (
    <div className="relative w-full max-w-md">
      {/* Cake Layers */}
      <div className="flex flex-col items-center">
        {/* Top Frosting */}
        <div className="w-48 h-4 rounded-full bg-gradient-to-b from-pink-400 to-pink-500 shadow-lg" />

        {/* Main Cake */}
        <div className="w-48 h-32 bg-gradient-to-b from-amber-600 to-amber-700 shadow-2xl flex items-center justify-center relative">
          {/* Decorative pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-2 border-4 border-dashed border-white rounded" />
          </div>
        </div>

        {/* Base */}
        <div className="w-56 h-2 bg-pink-500 shadow-lg rounded-full" />
      </div>

      {/* Candles */}
      {isBurning && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 flex gap-6 justify-center w-full">
          {[0, 1, 2].map((i) => (
            <div key={i} className="relative">
              {/* Candle */}
              <div className="w-2 h-12 bg-gradient-to-b from-yellow-100 to-yellow-300 rounded-full" />
              {/* Flame */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 animate-flicker">
                <div className="w-3 h-8 bg-gradient-to-t from-orange-500 via-yellow-400 to-orange-300 rounded-full blur-sm" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Instructions */}
      {isClickable && (
        <div className="mt-12 text-center animate-bounce">
          <p className="text-2xl font-bold text-purple-600 mb-4">Blow the candle 🎂➡️</p>
          <button
            onClick={handleClick}
            className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-lg"
          >
            Click to blow 💨
          </button>
        </div>
      )}

      {/* Knife Cutting Animation */}
      {!isBurning && (
        <div className="absolute right-0 top-1/2 transform translate-y-1/2 animate-knife-cut">
          <div className="w-2 h-24 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full transform -rotate-45" />
        </div>
      )}
    </div>
  )
}
