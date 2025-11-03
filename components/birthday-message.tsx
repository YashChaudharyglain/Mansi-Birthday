"use client"

import { useEffect, useState } from "react"

export default function BirthdayMessage() {
  const [revealedWords, setRevealedWords] = useState(0)
  const message =
    "MANSI, on your special day, I want you to know how incredible you are. Your smile lights up the world, your heart is pure gold, and your presence makes life so much better. Thank you for being the amazing person you are. Wishing you infinite happiness, endless laughter, and all the dreams coming true!".split(
      " ",
    )

  useEffect(() => {
    const interval = setInterval(() => {
      setRevealedWords((prev) => {
        if (prev < message.length) {
          return prev + 1
        }
        return prev
      })
    }, 150)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="max-w-2xl mx-auto text-center px-4 py-8 bg-white bg-opacity-80 backdrop-blur-md rounded-3xl shadow-2xl border-2 border-pink-200">
      <h2 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
        ✨ Special Message ✨
      </h2>

      <p className="text-lg md:text-xl leading-relaxed text-gray-700 min-h-32">
        {message.map((word, index) => (
          <span
            key={index}
            className={`inline-block mr-2 transition-all duration-300 ${
              index < revealedWords ? "opacity-100 animate-pop-in" : "opacity-0"
            }`}
          >
            {word}
          </span>
        ))}
      </p>

      <div className="mt-8 text-6xl animate-bounce-hearts">🎂 🎈 🎉 🎁 🎊</div>
    </div>
  )
}
