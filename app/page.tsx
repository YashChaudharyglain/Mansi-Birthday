"use client"

import { useEffect, useRef, useState } from "react"
import dynamic from "next/dynamic"
const Confetti = dynamic(() => import("@/components/confetti"), { ssr: false })
const Balloons = dynamic(() => import("@/components/balloons"), { ssr: false })
import PremiumCake from "@/components/premium-cake"
const HeartFloating = dynamic(() => import("@/components/heart-floating"), { ssr: false })
import PremiumMessage from "@/components/premium-message"
import EventSequence from "@/components/event-sequence"
import CakeCuttingCeremony from "@/components/cake-cutting-ceremony"
import SelfieCapture from "@/components/selfie-capture"

export default function Home() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const specialRef = useRef<HTMLDivElement>(null)
  const [stage, setStage] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const [showCutAnimation, setShowCutAnimation] = useState(false)
  const [events, setEvents] = useState<string[]>([])
  const [showGirlPrompt, setShowGirlPrompt] = useState(true)
  const [selfiePrompt, setSelfiePrompt] = useState(false)
  const [selfieOpen, setSelfieOpen] = useState(false)
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null)
  const [selfieDone, setSelfieDone] = useState(false)
  const [showFlirt1, setShowFlirt1] = useState(false)
  const [ceremonyIntroPrompt, setCeremonyIntroPrompt] = useState(false)
  const [preCutNote, setPreCutNote] = useState(false)
  const [showSpecialMessage, setShowSpecialMessage] = useState(false)
  const [showThanks, setShowThanks] = useState(false)
  const [experienceClosed, setExperienceClosed] = useState(false)

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.4
      audioRef.current.play().catch(() => {})
    }
  }, [])

  // Single flirty message auto-advance: 3s
  useEffect(() => {
    if (showFlirt1) {
      const t = setTimeout(() => {
        setShowFlirt1(false)
        setShowSpecialMessage(true)
      }, 3000)
      return () => clearTimeout(t)
    }
  }, [showFlirt1])

  // Cleanup overlays and scroll when special message shows, then show Thank You popup
  useEffect(() => {
    if (stage === 2 && showSpecialMessage) {
      setShowGirlPrompt(false)
      setSelfiePrompt(false)
      setSelfieOpen(false)
      setShowFlirt1(false)
      setPreCutNote(false)
      setCeremonyIntroPrompt(false)
      setTimeout(() => specialRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 200)
      // Schedule Thank You popup a bit later to let message be read (10s)
      const t = setTimeout(() => setShowThanks(true), 15000)
      return () => clearTimeout(t)
    }
  }, [stage, showSpecialMessage])

  // CHANGE: Enhanced event sequence with cake cutting ceremony
  const handleCandleBlown = () => {
    setStage(1)
    setShowConfetti(true)
    setShowGirlPrompt(false)

    setTimeout(() => {
      setEvents((prev) => [...prev, "candle-blown"])
    }, 500)
    // After blow, open ceremony start prompt directly
    setTimeout(() => {
      setCeremonyIntroPrompt(true)
    }, 800)
  }

  const handleCeremonyEvents = (ceremonyEvents: string[]) => {
    setEvents((prev) => [...prev, ...ceremonyEvents])
    // Instant transition to selfie when serving completes
    if (ceremonyEvents.includes("serve-complete") && !selfieDone) {
      setStage(2)
      setSelfiePrompt(true)
      setShowSpecialMessage(false)
    }
  }

  const handleCeremonyComplete = (newStage: number) => {
    // Stage may already be set when 'serve-complete' fires; keep as fallback
    setStage((s) => (s < newStage ? newStage : s))
  }

  const triggerSpecialEvent = () => {
    setShowConfetti(false)
    setTimeout(() => setShowConfetti(true), 100)
    setEvents((prev) => [...prev, "special-wish"])
  }

  const handleOpenCamera = () => {
    setSelfieOpen(true)
  }

  const handleSelfieCaptured = (dataUrl: string) => {
    setCapturedPhoto(dataUrl)
    setSelfieOpen(false)
    setSelfiePrompt(false)
    setSelfieDone(true)
    setEvents((prev) => [...prev, "selfie-captured"])
    // Show a single flirty message for 3s, then continue
    setShowFlirt1(true)
    setTimeout(() => {
      setShowFlirt1(false)
      setShowSpecialMessage(true)
    }, 3000)
  }

  return (
    <div className="min-h-screen w-full overflow-hidden bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 relative">
      <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />

      <Balloons />
      <Confetti trigger={showConfetti} />
      <HeartFloating />

      <audio ref={audioRef} loop preload="auto">
        <source
          src="data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA=="
          type="audio/wav"
        />
      </audio>

      <div className="relative z-20 min-h-screen flex flex-col items-center justify-center px-4 py-8">
        {/* Header Section */}
        {stage === 0 && (
          <div className="text-center mb-8 md:mb-12 animate-fade-in space-y-4">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold animate-belated-shimmer">
              <span className="bg-gradient-to-r from-amber-600 via-orange-500 to-red-500 bg-clip-text text-transparent">
                Happy Belated Birthday
              </span>
            </h1>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-extrabold">
              <span className="bg-gradient-to-r from-yellow-500 via-amber-600 to-orange-600 bg-clip-text text-transparent animate-belated-shimmer">
                MANSI
              </span>
            </h2>
            <p className="text-xl md:text-3xl text-amber-700 font-semibold animate-bounce">
              Better late than never! Let's celebrate you!
            </p>
          </div>
        )}

        {/* Selfie preview with inline flirty text (after ceremony, before special) */}
        {stage === 2 && !showSpecialMessage && capturedPhoto && (
          <div className="w-full max-w-md mb-6 animate-fade-in">
            <div className="overflow-hidden rounded-2xl shadow-2xl border border-amber-200 bg-white">
              <img src={capturedPhoto} alt="Your selfie" className="w-full h-80 object-cover" />
            </div>
            {showFlirt1 && (
              <div className="mt-4 text-center">
                <p className="inline-block px-4 py-2 rounded-full bg-white/90 border border-amber-200 shadow-sm text-amber-800 font-semibold animate-pop-in">
                  If beauty had a name, it would be you.
                </p>
              </div>
            )}
          </div>
        )}

        {/* CHANGE: Cake cutting ceremony section */}
        {stage === 1 && (
          <CakeCuttingCeremony onCeremonyComplete={handleCeremonyComplete} onEvents={handleCeremonyEvents} />
        )}

        {/* Original cake if not in ceremony mode */}
        {stage === 0 && (
          <div className="mb-8 md:mb-12">
            <PremiumCake isCutting={showCutAnimation} onBlown={handleCandleBlown} />
          </div>
        )}

        {/* Event Notifications */}
        {events.length > 0 && <EventSequence events={events} />}

        {/* Premium Birthday Message */}
        {stage === 2 && showSpecialMessage && (
          <div ref={specialRef} className="w-full max-w-4xl">
            <PremiumMessage />
          </div>
        )}

        {/* Wishes button removed per new sequence */}
      </div>

      {/* Girl prompt to blow candles (English) */}
      {stage === 0 && showGirlPrompt && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 bg-white/90 border border-amber-200 rounded-full shadow-xl px-4 py-3 flex items-center gap-3 animate-pop-in">
          <span className="text-2xl">👧🏻</span>
          <span className="text-sm md:text-base font-semibold text-amber-800">Please blow out the candles to make a wish!</span>
          <button
            onClick={() => {
              setShowGirlPrompt(false)
            }}
            className="text-xs text-amber-700 hover:underline"
          >
            okay
          </button>
        </div>
      )}

      {/* Party button removed per new sequence */}

      {/* Selfie prompt modal */}
      {selfiePrompt && !selfieOpen && !selfieDone && (
        <div className="fixed inset-0 z-40 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative z-10 w-[92vw] max-w-md rounded-2xl bg-white shadow-2xl border border-amber-200 overflow-hidden animate-pop-in">
            <div className="p-6 text-center space-y-3">
              <h3 className="text-2xl font-extrabold text-amber-800">Let's take a selfie 📸</h3>
              <p className="text-amber-700">to capture your precious moment</p>
              <div className="flex justify-center gap-3 mt-3">
                <button onClick={() => { setSelfiePrompt(false); setShowSpecialMessage(true); setSelfieDone(true) }} className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200">
                  Later
                </button>
                <button
                  onClick={handleOpenCamera}
                  className="px-6 py-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition"
                >
                  Open Camera
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Camera */}
      <SelfieCapture open={selfieOpen} onClose={() => setSelfieOpen(false)} onCapture={handleSelfieCaptured} />

      {/* Flirty popup removed; now shown inline under the selfie */}

      {/* Start Cake Ceremony prompt */}
      {ceremonyIntroPrompt && stage === 1 && (
        <div className="fixed inset-0 z-40 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative z-10 w-[92vw] max-w-md rounded-2xl bg-white shadow-2xl border border-amber-200 overflow-hidden animate-pop-in">
            <div className="p-6 text-center space-y-4">
              <h3 className="text-2xl font-extrabold text-amber-800">Let's start cake ceremony 🎂</h3>
              <button
                onClick={() => {
                  setCeremonyIntroPrompt(false)
                  setPreCutNote(true)
                }}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pre-cut messages and guidance */}
      {preCutNote && stage === 1 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-white/90 border border-amber-200 rounded-2xl shadow-xl px-5 py-4 text-center space-y-2 animate-pop-in">
          <p className="font-bold text-amber-800">Let's cut it, Mansi — because it's your birthday!</p>
          <button
            onClick={() => {
              setPreCutNote(false)
              // Ceremony component shows its own Start button; user will click it next
            }}
            className="px-5 py-2 rounded-full bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold shadow-md hover:shadow-lg"
          >
            Got it
          </button>
          <p className="text-sm text-amber-700">Ohh sorry, sorry — belated birthday! Tap the Start button to begin the cut.</p>
        </div>
      )}

      {/* Finale: premium Thank You popup, then optional close to black */}
      {stage === 2 && showSpecialMessage && showThanks && !experienceClosed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="relative z-10 w-[92vw] max-w-xl rounded-3xl border border-amber-200 shadow-2xl overflow-hidden animate-pop-in"
               style={{ background: "linear-gradient(135deg, #fff8e1, #ffe6cc)" }}>
            <div className="p-8 text-center space-y-4">
              <h3 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-amber-600 via-orange-500 to-red-500 bg-clip-text text-transparent">
                Thank you for your patience
              </h3>
              <p className="text-amber-800 font-semibold">Wishing you joy, love and endless smiles. 💖</p>
              <button
                onClick={() => setExperienceClosed(true)}
                className="mt-2 px-8 py-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold shadow-md hover:shadow-lg transform hover:scale-105 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {experienceClosed && <div className="fixed inset-0 z-[60] bg-black" />}

    </div>
  )
}
