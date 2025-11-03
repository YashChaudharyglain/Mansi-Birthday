"use client"

import { useEffect, useState } from "react"

interface EventSequenceProps {
  events: string[]
}

export default function EventSequence({ events }: EventSequenceProps) {
  const [displayedEvents, setDisplayedEvents] = useState<string[]>([])

  useEffect(() => {
    const timeout = setTimeout(() => {
      // Show only the most recent event to avoid stacking
      setDisplayedEvents(events.slice(-1))
    }, 300)
    return () => clearTimeout(timeout)
  }, [events])

  const eventMessages = {
    "candle-blown": { text: "Wish made! 🎂✨", emoji: "🎊" },
    "cake-cutting": { text: "Cake time! 🔪✨", emoji: "🎉" },
    "message-reveal": { text: "Special message unlocked! 💌", emoji: "✨" },
    "celebration-complete": { text: "Celebration begins! 🎈", emoji: "🎊" },
    "special-wish": { text: "More wishes sent! 💝", emoji: "🌟" },
    // CHANGE: Added new ceremony events
    "knife-cutting": { text: "Knife cutting starts! 🔪", emoji: "✨" },
    "cake-split": { text: "Cake split! 🎉", emoji: "✨" },
    "funny-text": { text: "Halke mein le rahe ho! 😆", emoji: "🤣" },
    "plating-started": { text: "Plating begins! 🍽️", emoji: "✨" },
    "cake-served-1": { text: "First slice served! 🎂", emoji: "😋" },
    "cake-served-2": { text: "Second slice served! 🎂", emoji: "😋" },
    "cake-served-3": { text: "Third slice served! 🎂", emoji: "😋" },
    "ceremony-complete": { text: "Ceremony complete! 🎊", emoji: "🎉" },
    // New pre/post steps
    "table-ready": { text: "Table is ready! 🍽️", emoji: "✨" },
    "cake-arrived": { text: "Cake arrived on table! 🎂", emoji: "🍰" },
    "knife-enter": { text: "Knife enters with style! 🔪", emoji: "⚡" },
    "serve-complete": { text: "All slices served! 🥳", emoji: "🎉" },
    "celebration-start": { text: "Party time! 🎶", emoji: "🎊" },
    "song-start": { text: "Birthday song! 🎵", emoji: "🎶" },
    "photo-flash": { text: "Click! Photo captured 📸", emoji: "✨" },
    // Main flow extras
    "party-button-show": { text: "Ready to start the party! 🎉", emoji: "🎶" },
    "party-start": { text: "Party started! 🔊", emoji: "🎵" },
    "selfie-prompt": { text: "Let's take a selfie! 📸", emoji: "✨" },
    "selfie-captured": { text: "Selfie saved! 😍", emoji: "📷" },
    "ceremony-intro-prompt": { text: "Let's start cake ceremony 🎂", emoji: "🎊" },
  }

  return (
    <div className="fixed bottom-8 right-8 space-y-4 z-30 max-w-xs">
      {displayedEvents.map((event, index) => {
        const eventData = eventMessages[event as keyof typeof eventMessages]
        return (
          <div
            key={index}
            className="bg-gradient-to-r from-amber-400 to-orange-400 text-white px-6 py-4 rounded-full shadow-xl animate-slide-in-right border-2 border-yellow-300"
          >
            <p className="font-bold text-sm md:text-base">{eventData.text}</p>
          </div>
        )
      })}
    </div>
  )
}
