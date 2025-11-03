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

  useEffect(() => {
    let stream: MediaStream | null = null
    const start = async () => {
      if (!open) return
      setError(null)
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play()
        }
      } catch (e) {
        setError("Camera access denied or unavailable.")
      }
    }
    start()
    return () => {
      if (stream) stream.getTracks().forEach((t) => t.stop())
    }
  }, [open])

  const handleCapture = () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return
    const w = video.videoWidth
    const h = video.videoHeight
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.drawImage(video, 0, 0, w, h)
    const dataUrl = canvas.toDataURL("image/png")
    onCapture(dataUrl)
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
              <video ref={videoRef} className="w-full h-64 object-cover" playsInline muted />
            </div>
          )}
          <canvas ref={canvasRef} className="hidden" />
          <div className="mt-4 flex items-center justify-between">
            <button onClick={onClose} className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200">
              Cancel
            </button>
            <button
              onClick={handleCapture}
              className="px-5 py-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition"
            >
              Click Photo
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
