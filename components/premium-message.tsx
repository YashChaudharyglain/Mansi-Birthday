"use client"

import { useEffect, useState } from "react"

export default function PremiumMessage() {
  const [revealedWords, setRevealedWords] = useState(0)
  const [showEmojis, setShowEmojis] = useState(false)

  const mainMessage =
    "MANSI, on your special day we celebrate YOU! Your incredible spirit, your beautiful heart, and the amazing light you bring to everyone around you. You deserve all the happiness in the world today and every day!".split(
      " ",
    )

  const belated =
    "Thank you for being patient with this belated celebration. You're worth every moment and more!".split(" ")

  useEffect(() => {
    const interval = setInterval(() => {
      setRevealedWords((prev) => {
        if (prev < mainMessage.length + belated.length) {
          return prev + 1
        }
        return prev
      })
    }, 120)

    return () => clearInterval(interval)
  }, [mainMessage.length, belated.length])

  useEffect(() => {
    if (revealedWords >= mainMessage.length + belated.length) {
      setShowEmojis(true)
    }
  }, [revealedWords, mainMessage.length, belated.length])

  return (
    <div className="w-full mx-auto px-4 md:px-0">
      {/* CHANGE: Premium message card with glass effect */}
      <div className="bg-gradient-to-br from-white via-yellow-50 to-orange-50 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-yellow-200 p-8 md:p-12 space-y-8">
        <h2 className="text-4xl md:text-5xl font-bold text-center bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
          A Special Message for You
        </h2>
        <div className="flex justify-center">
          <span className="inline-block text-[10px] md:text-xs tracking-widest font-bold text-amber-800 bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-200 rounded-full px-3 py-1 shadow-sm">
            SPECIAL
          </span>
        </div>
        <p className="text-center text-sm md:text-base text-amber-700 -mt-4">
          From the heart, just for <span className="font-extrabold bg-gradient-to-r from-amber-600 via-orange-500 to-red-500 bg-clip-text text-transparent">MANSI</span>
        </p>

        {/* Main Message */}
        <div className="text-xl md:text-2xl leading-relaxed text-amber-900 text-center min-h-48">
          {mainMessage.map((word, index) => (
            <span
              key={index}
              className={`inline-block mr-2 transition-all duration-300 ${
                index < revealedWords ? "opacity-100 animate-pop-in" : "opacity-0"
              }`}
            >
              {word + "\u00A0"}
            </span>
          ))}
        </div>

        {/* Belated Apology Message */}
        {revealedWords > mainMessage.length && (
          <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-6 md:p-8 border-2 border-yellow-300">
            <p className="text-lg md:text-xl leading-relaxed text-amber-800 text-center">
              {belated.map((word, index) => (
                <span
                  key={index}
                  className={`inline-block mr-2 transition-all duration-300 ${
                    index + mainMessage.length < revealedWords ? "opacity-100 animate-pop-in" : "opacity-0"
                  }`}
                >
                  {word + "\u00A0"}
                </span>
              ))}
            </p>
          </div>
        )}

        {/* Celebration Emojis */}
        {showEmojis && (
          <div className="text-center space-y-4 animate-fade-in">
            <div className="text-6xl md:text-7xl animate-bounce-hearts"></div>
            <p className="text-xl md:text-2xl font-bold text-amber-700">May all your wishes come true!</p>
          </div>
        )}
      </div>
    </div>
  )
}
