"use client"

import { useEffect, useRef, useState } from "react"

interface SelfieCaptureProps {
  open: boolean
  onClose: () => void
  onCapture: (dataUrl: string) => void
}

export default function SelfieCapture({ open, onClose, onCapture }: SelfieCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [ready, setReady] = useState(false)
  const [clicking, setClicking] = useState(false)

  useEffect(() => {
    let stream: MediaStream | null = null
    const start = async () => {
      if (!open) return
      setError(null)
      setReady(false)
      setClicking(false)
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "user" }, width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          const onCanPlay = () => {
            setReady(true)
          }
          videoRef.current.addEventListener("canplay", onCanPlay, { once: true })
          await videoRef.current.play().catch(() => {})
        }
      } catch (e) {
        setError("Camera access denied or unavailable.")
      }
    }
    start()
    return () => {
      if (stream) stream.getTracks().forEach((t) => t.stop())
      setReady(false)
      setClicking(false)
    }
  }, [open])

  const handleCapture = () => {
    if (clicking) return
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return
    const w = video.videoWidth || video.clientWidth
    const h = video.videoHeight || video.clientHeight
    if (!ready || !w || !h) return
    setClicking(true)
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.drawImage(video, 0, 0, w, h)
    const dataUrl = canvas.toDataURL("image/png")
    onCapture(dataUrl)
    // keep disabled to prevent multiple captures in one open
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative z-10 w-[92vw] max-w-md rounded-2xl bg-white shadow-2xl border border-amber-200 overflow-hidden">
        <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200">
          <h3 className="text-lg font-bold text-amber-800">Let's take a selfie 📸</h3>
          <p className="text-sm text-amber-700">Capture your precious moment</p>
        </div>
        <div className="p-4">
          {error ? (
            <p className="text-red-600 text-sm">{error}</p>
          ) : (
            <div className="rounded-xl overflow-hidden border border-amber-200 bg-black">
              <video
                ref={videoRef}
                className="w-full h-64 object-cover select-none"
                playsInline
                autoPlay
                muted
                controls={false}
                disablePictureInPicture
                controlsList="nofullscreen noremoteplayback noplaybackrate nodownload"
                onContextMenu={(e) => e.preventDefault()}
              />
            </div>
          )}
          <canvas ref={canvasRef} className="hidden" />
          <div className="mt-4 flex items-center justify-between">
            <button onClick={onClose} className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200">
              Cancel
            </button>
            <button
              onClick={handleCapture}
              disabled={!ready || clicking}
              className={`px-5 py-2 rounded-full text-white font-semibold shadow-md transform transition ${
                !ready || clicking
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-gradient-to-r from-amber-500 to-orange-600 hover:shadow-lg hover:scale-105"
              }`}
            >
              {!ready ? "Warming up camera..." : clicking ? "Capturing..." : "Click Photo"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
