"use client"

import { useState, useEffect, useRef } from "react"

interface CakeCuttingCeremonyProps {
  onCeremonyComplete: (stage: number) => void
  onEvents: (events: string[]) => void
}

export default function CakeCuttingCeremony({ onCeremonyComplete, onEvents }: CakeCuttingCeremonyProps) {
  const [ceremonyStage, setCeremonyStage] = useState(0)
  const [showFunnyText, setShowFunnyText] = useState(false)
  const [showPlates, setShowPlates] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [knifeActive, setKnifeActive] = useState(false)
  const [cakeSplit, setCakeSplit] = useState(false)
  const [showSparks, setShowSparks] = useState(false)
  const [cakeServed, setCakeServed] = useState([false, false, false])
  const [tableVisible, setTableVisible] = useState(false)
  const [cakeArrived, setCakeArrived] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [showSong, setShowSong] = useState(false)
  const [showFlash, setShowFlash] = useState(false)

  // Keep stable refs to callbacks so effect doesn't restart when parents re-render
  const onEventsRef = useRef(onEvents)
  const onCeremonyCompleteRef = useRef(onCeremonyComplete)
  useEffect(() => {
    onEventsRef.current = onEvents
  }, [onEvents])
  useEffect(() => {
    onCeremonyCompleteRef.current = onCeremonyComplete
  }, [onCeremonyComplete])

  // Ensure the sequence is scheduled only once per start and properly cleaned up
  const startedRef = useRef(false)
  useEffect(() => {
    if (ceremonyStage !== 1) {
      // reset guard when leaving the stage
      startedRef.current = false
      return
    }
    if (startedRef.current) return
    startedRef.current = true

    const timers: number[] = []

    // Step 1: Table appears
    setTableVisible(true)
    setCurrentStep(0)
    onEventsRef.current(["table-ready"]) 

    // Step 2: Cake arrives on table
    timers.push(window.setTimeout(() => {
      setCakeArrived(true)
      setCurrentStep(1)
      onEventsRef.current(["cake-arrived"]) 
    }, 600))

    // Step 3: Birthday song visual
    timers.push(window.setTimeout(() => {
      setShowSong(true)
      setCurrentStep(2)
      onEventsRef.current(["song-start"]) 
    }, 1000))

    // Step 4: Knife arc enters
    timers.push(window.setTimeout(() => {
      setKnifeActive(true)
      setCurrentStep(3)
      onEventsRef.current(["knife-enter"]) 
    }, 2400))

    // Step 5: Cake splits
    timers.push(window.setTimeout(() => {
      setCakeSplit(true)
      setCurrentStep(4)
      onEventsRef.current(["knife-cutting", "cake-split"]) 
    }, 3100))

    // Hide song visual after the cut starts
    timers.push(window.setTimeout(() => {
      setShowSong(false)
    }, 3200))

    // Step 6: Sparks and fun text
    timers.push(window.setTimeout(() => {
      setShowSparks(true)
      setShowFunnyText(true)
      setCurrentStep(5)
      onEventsRef.current(["funny-text"]) 
    }, 3600))

    // Step 7: Plates appear
    timers.push(window.setTimeout(() => {
      setShowPlates(true)
      setCurrentStep(6)
      onEventsRef.current(["plating-started"]) 
    }, 4300))

    // Step 8: Serve slices
    timers.push(window.setTimeout(() => {
      setCakeServed([true, false, false])
      onEventsRef.current(["cake-served-1"]) 
    }, 5100))

    timers.push(window.setTimeout(() => {
      setCakeServed([true, true, false])
      onEventsRef.current(["cake-served-2"]) 
    }, 5700))

    timers.push(window.setTimeout(() => {
      setCakeServed([true, true, true])
      setCurrentStep(7)
      onEventsRef.current(["cake-served-3", "serve-complete"]) 
    }, 6300))

    // Step 9: Final celebration + photo flash
    timers.push(window.setTimeout(() => {
      setShowCelebration(true)
      setCurrentStep(8)
      setShowFlash(true)
      onEventsRef.current(["celebration-start", "photo-flash", "ceremony-complete"]) 
      onCeremonyCompleteRef.current(2)
      timers.push(window.setTimeout(() => setShowFlash(false), 900))
    }, 7000))

    return () => {
      timers.forEach((t) => clearTimeout(t))
    }
  }, [ceremonyStage])

  const steps = [
    "Table Ready",
    "Cake Arrives",
    "Birthday Song",
    "Knife Enters",
    "Cutting",
    "Spark & Fun",
    "Plating",
    "Serving",
    "Celebrate",
  ]

  return (
    <div className="relative w-full">
      {/* Ambient spotlight */}
      <div
        className="pointer-events-none absolute inset-0 mix-blend-multiply animate-spotlight-pulse"
        style={{
          background:
            "radial-gradient(ellipse at top, rgba(255,255,255,0) 0%, rgba(0,0,0,0.15) 55%, rgba(0,0,0,0.25) 100%)",
        }}
      />

      {/* Steps tracker */}
      <div className="w-full max-w-3xl mx-auto mt-2 px-4">
        <div className="grid grid-cols-8 gap-2">
          {steps.map((label, i) => (
            <div key={label} className={`text-center text-[10px] md:text-xs font-semibold transition-colors ${i <= currentStep ? "text-amber-700" : "text-amber-400/60"}`}>
              <div className={`h-1 rounded-full mb-1 ${i <= currentStep ? "bg-gradient-to-r from-amber-400 to-orange-500" : "bg-amber-200"}`} />
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* Main Cake Display */}
      <div className="flex flex-col items-center gap-8 py-12">
        {/* Table */}
        <div className="relative w-full max-w-xl h-44">
          <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-[95%] h-6 bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 rounded-full shadow-2xl border border-amber-900/40 ${tableVisible ? "animate-table-slide-in" : "opacity-0"}`} />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-3 bg-black/20 blur-xl rounded-full" />
        </div>

        {/* Cake Cut Animation Area */}
        <div className="relative w-72 h-56 flex items-center justify-center">
          {/* Song visualizer */}
          {showSong && (
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 flex items-end gap-1 z-10">
              <div className="w-1.5 h-6 bg-amber-500 rounded-sm origin-bottom animate-music-bar-1" />
              <div className="w-1.5 h-8 bg-orange-500 rounded-sm origin-bottom animate-music-bar-2" />
              <div className="w-1.5 h-10 bg-red-500 rounded-sm origin-bottom animate-music-bar-3" />
              <div className="w-1.5 h-7 bg-amber-400 rounded-sm origin-bottom animate-music-bar-4" />
              <div className="w-1.5 h-9 bg-orange-400 rounded-sm origin-bottom animate-music-bar-5" />
            </div>
          )}
          {/* Cake container with arrival bounce */}
          <div className={`relative w-full h-full ${cakeArrived ? "animate-cake-drop-bounce" : "opacity-0"}`}>
            {/* Left half of cake */}
            <div
              className={`absolute left-0 top-6 w-1/2 h-40 bg-gradient-to-b from-amber-700 via-amber-800 to-amber-900 rounded-l-lg shadow-xl transition-all duration-500 ${
                cakeSplit ? "translate-x-[-40px] rotate-[-8deg]" : "translate-x-0"
              }`}
            >
              <div className="absolute inset-2 border-4 border-dashed border-yellow-200 opacity-40 rounded-l" />
            </div>

            {/* Right half of cake */}
            <div
              className={`absolute right-0 top-6 w-1/2 h-40 bg-gradient-to-b from-amber-700 via-amber-800 to-amber-900 rounded-r-lg shadow-xl transition-all duration-500 ${
                cakeSplit ? "translate-x-[40px] rotate-[8deg]" : "translate-x-0"
              }`}
            >
              <div className="absolute inset-2 border-4 border-dashed border-yellow-200 opacity-40 rounded-r" />
            </div>
          </div>

          {/* Knife Arc Animation */}
          {knifeActive && (
            <div className="absolute z-20 right-10 top-2 animate-knife-arc">
              <div className="w-2 h-48 bg-gradient-to-b from-gray-300 via-gray-400 to-gray-600 rounded-full shadow-xl drop-shadow-lg" />
            </div>
          )}

          {/* Sparks effect */}
          {showSparks && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-yellow-300 rounded-full animate-ping"
                  style={{
                    left: "50%",
                    top: "50%",
                    transform: `rotate(${(i * 360) / 12}deg) translateX(60px)`,
                    animationDelay: `${i * 0.05}s`,
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Funny Text - "Halke mai le rahe ho kya?" */}
        {showFunnyText && (
          <div className="animate-bounce-in text-center space-y-3">
            <p className="text-4xl md:text-5xl font-bold text-transparent bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 bg-clip-text animate-wiggle">
              Halke mein le rahe ho kya? 😆
            </p>
            <div className="flex gap-4 justify-center text-3xl animate-fade-in">
              <span className="animate-bounce" style={{ animationDelay: "0s" }}>
                😂
              </span>
              <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>
                🤣
              </span>
              <span className="animate-bounce" style={{ animationDelay: "0.4s" }}>
                😆
              </span>
            </div>
          </div>
        )}

        {/* Plates with Served Cake Slices */}
        {showPlates && (
          <div className="flex gap-8 md:gap-12 mt-8 flex-wrap justify-center">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`transform transition-all duration-500 ${
                  cakeServed[i] ? "scale-100 rotate-0" : "scale-0 rotate-180"
                }`}
              >
                {/* Plate */}
                <div className="w-32 h-24 bg-gradient-to-b from-white via-gray-50 to-gray-100 rounded-full shadow-2xl border-4 border-gray-300 flex items-center justify-center">
                  {/* Cake Slice */}
                  <div className="w-20 h-16 bg-gradient-to-b from-amber-600 via-amber-700 to-amber-800 rounded-lg shadow-lg border-2 border-yellow-200">
                    {/* Frosting */}
                    <div className="w-full h-4 bg-gradient-to-r from-yellow-200 to-yellow-100 rounded-t-lg" />
                  </div>
                </div>
                {/* Plate Label */}
                <p className="text-center mt-2 font-bold text-amber-700">Slice {i + 1}</p>
              </div>
            ))}
          </div>
        )}

        {/* Celebration Message */}
        {showCelebration && (
          <div className="text-center space-y-4 animate-fade-in mt-8">
            <p className="text-2xl md:text-3xl font-bold text-amber-700">Cheers to MANSI! 🎉</p>
            <div className="flex gap-4 justify-center text-4xl animate-bounce-hearts">
              <span>🎊</span>
              <span>✨</span>
              <span>🎉</span>
              <span>💝</span>
              <span>🎊</span>
            </div>
          </div>
        )}

        {/* Camera flash overlay */}
        {showFlash && (
          <div className="pointer-events-none fixed inset-0 bg-white/90 animate-camera-flash z-30" />
        )}

        {/* Start Button */}
        {ceremonyStage === 0 && (
          <button
            onClick={() => setCeremonyStage(1)}
            className="px-8 py-4 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 text-white font-bold rounded-full text-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300 animate-pulse-glow shadow-lg mt-8"
          >
            Let's cut it, Mansi — because it's your birthday
          </button>
        )}
      </div>
    </div>
  )
}
