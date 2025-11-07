import { NextResponse } from 'next/server'
import cloudinary from '@/lib/cloudinary'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    if (!file) {
      return NextResponse.json({ error: 'file is required' }, { status: 400 })
    }
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const url: string = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'selfies', resource_type: 'image' },
        (error, result) => {
          if (error || !result) return reject(error || new Error('Upload failed'))
          resolve(result.secure_url)
        }
      )
      stream.end(buffer)
    })

    const [, selfie] = await prisma.$transaction([
      prisma.selfie.deleteMany({}),
      prisma.selfie.create({ data: { url } }),
    ])

    return NextResponse.json({ id: selfie.id, url: selfie.url })
  } catch (e) {
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}
