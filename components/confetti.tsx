"use client"

import { useEffect, useRef } from "react"

interface ConfettiProps {
  trigger?: boolean
}

export default function Confetti({ trigger = true }: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const confettis: Array<{
      x: number
      y: number
      vx: number
      vy: number
      size: number
      color: string
      rotation: number
      rotationSpeed: number
      shape: "square" | "circle" | "triangle"
    }> = []

    // CHANGE: Premium confetti color palette with luxury tones
    const colors = [
      "#FBB040", // Gold
      "#F59E0B", // Amber
      "#D97706", // Orange
      "#DC2626", // Red
      "#EF4444", // Light Red
      "#FBBF24", // Light Gold
      "#F97316", // Deep Orange
    ]

    // Create enhanced confetti particles
    const createConfetti = () => {
      for (let i = 0; i < 150; i++) {
        confettis.push({
          x: Math.random() * canvas.width,
          y: -50,
          vx: (Math.random() - 0.5) * 6,
          vy: Math.random() * 3 + 3,
          size: Math.random() * 12 + 6,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.3,
          shape: ["square", "circle", "triangle"][Math.floor(Math.random() * 3)] as "square" | "circle" | "triangle",
        })
      }
    }

    if (trigger) {
      createConfetti()
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      confettis.forEach((conf, index) => {
        conf.y += conf.vy
        conf.x += conf.vx + Math.sin(conf.y / 50) * 2
        conf.rotation += conf.rotationSpeed
        conf.vy += 0.12 // Enhanced gravity
        conf.vx *= 0.99 // Air resistance

        // Draw confetti based on shape
        ctx.save()
        ctx.translate(conf.x, conf.y)
        ctx.rotate(conf.rotation)
        ctx.fillStyle = conf.color

        if (conf.shape === "square") {
          ctx.fillRect(-conf.size / 2, -conf.size / 2, conf.size, conf.size)
        } else if (conf.shape === "circle") {
          ctx.beginPath()
          ctx.arc(0, 0, conf.size / 2, 0, Math.PI * 2)
          ctx.fill()
        } else {
          ctx.beginPath()
          ctx.moveTo(0, -conf.size / 2)
          ctx.lineTo(conf.size / 2, conf.size / 2)
          ctx.lineTo(-conf.size / 2, conf.size / 2)
          ctx.closePath()
          ctx.fill()
        }

        ctx.restore()

        // Reset if off screen
        if (conf.y > canvas.height) {
          confettis.splice(index, 1)
        }
      })

      if (confettis.length > 0 || trigger) {
        requestAnimationFrame(animate)
      }
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [trigger])

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-10" />
}
