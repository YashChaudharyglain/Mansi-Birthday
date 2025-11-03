"use client"

import { useState } from "react"

interface PremiumCakeProps {
  isCutting: boolean
  onBlown: () => void
}

export default function PremiumCake({ isCutting, onBlown }: PremiumCakeProps) {
  const [isClickable, setIsClickable] = useState(true)
  const [showBlow, setShowBlow] = useState(false)

  const handleClick = () => {
    if (isClickable) {
      setIsClickable(false)
      setShowBlow(true)
      setTimeout(() => onBlown(), 800)
    }
  }

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="flex flex-col items-center gap-4">
        {/* Top Tier */}
        <div className="w-40 h-6 rounded-full bg-gradient-to-b from-yellow-300 via-yellow-400 to-yellow-500 shadow-xl" />

        {/* Main Cake Body */}
        <div className="w-56 h-40 bg-gradient-to-b from-amber-700 via-amber-800 to-amber-900 shadow-2xl rounded-lg relative overflow-hidden border-4 border-amber-900">
          <div className="absolute inset-0 opacity-30 bg-pattern"></div>
          <div className="absolute inset-2 border-4 border-dashed border-yellow-200 opacity-40 rounded" />
        </div>

        {/* Base Layer */}
        <div className="w-64 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 shadow-lg rounded-full" />
      </div>

      {/* Enhanced candles with blow animation */}
      {!isCutting && (
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 flex gap-8 justify-center w-full">
          {[0, 1, 2].map((i) => (
            <div key={i} className="relative">
              <div className="w-3 h-16 bg-gradient-to-b from-yellow-50 to-yellow-200 rounded-full shadow-md" />
              <div
                className={`absolute top-0 left-1/2 transform -translate-x-1/2 transition-all duration-700 ${
                  showBlow ? "scale-0 opacity-0" : "scale-100 opacity-100"
                }`}
              >
                <div className="w-4 h-10 bg-gradient-to-t from-orange-500 via-yellow-300 to-orange-300 rounded-full blur-sm drop-shadow-lg animate-flicker" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Knife cutting animation */}
      {isCutting && (
        <>
          <div className="absolute right-8 top-1/3 animate-knife-slice">
            <div className="w-3 h-32 bg-gradient-to-b from-gray-300 to-gray-600 rounded-full transform -rotate-45 shadow-lg" />
          </div>
          <div className="absolute inset-0 animate-cake-split pointer-events-none" />
        </>
      )}

      {/* Enhanced interactive instructions */}
      {isClickable && (
        <div className="mt-16 text-center space-y-4 animate-fade-in">
          <p className="text-2xl md:text-3xl font-bold text-amber-700 animate-pulse">
            🎂 Blow out the candles and make a wish! 🎂
          </p>
          <button
            onClick={handleClick}
            className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-full hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-xl shadow-lg animate-scale-bounce"
          >
            💨 Click to Blow Candles
          </button>
        </div>
      )}
    </div>
  )
}
