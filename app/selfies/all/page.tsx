import cloudinary from '@/lib/cloudinary'
import Link from 'next/link'
import { revalidatePath } from 'next/cache'
import SelfiesGrid, { type CloudinaryItem } from '@/components/selfies-grid'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

async function fetchPage({ cursor }: { cursor?: string }) {
  const search = cloudinary.search
    .expression('folder=selfies AND resource_type:image AND type:upload')
    .sort_by('created_at','desc')
    .max_results(50)

  if (cursor) (search as any).next_cursor(cursor)
  const res = await search.execute()
  return res as any
}

export async function deleteManyAction(payload: { publicIds: string[]; password: string }) {
  'use server'
  const expected = process.env.ADMIN_DELETE_PASSWORD || 'Yash@_@98700'
  const { publicIds, password } = payload || { publicIds: [], password: '' }
  if (!Array.isArray(publicIds) || publicIds.length === 0 || password !== expected) return
  try {
    await Promise.all(
      publicIds.map((id) => cloudinary.uploader.destroy(id, { invalidate: true, resource_type: 'image' }))
    )
  } catch {}
  revalidatePath('/selfies/all')
}

export default async function AllSelfiesPage({ searchParams }: { searchParams: Promise<{ cursor?: string }> }) {
  const { cursor } = await searchParams
  const res = await fetchPage({ cursor })
  const resources = (res?.resources || []) as Array<any>
  const nextCursor: string | undefined = res?.next_cursor

  // Deduplicate strictly by public_id using a Map
  const uniqueMap = new Map<string, any>()
  for (const r of resources) {
    const key = String(r.public_id)
    if (!uniqueMap.has(key)) uniqueMap.set(key, r)
  }
  const unique = Array.from(uniqueMap.values())

  return (
    <div className="min-h-screen px-6 py-10 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-amber-800">All Selfies (Cloudinary)</h1>
          <Link href="/selfies" className="text-amber-700 hover:underline">Latest (DB)</Link>
        </div>
        {unique.length === 0 ? (
          <p className="text-amber-700">No selfies found in Cloudinary folder <code className="px-1 rounded bg-amber-100">selfies</code>.</p>
        ) : (
          <SelfiesGrid
            items={unique.map((r) => {
              const dt = new Date(r.created_at)
              const displayDate = dt.toLocaleString('en-IN', {
                weekday: 'short', day: '2-digit', month: 'long', year: 'numeric',
                hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true,
              })
              return {
                asset_id: r.asset_id,
                public_id: r.public_id,
                secure_url: r.secure_url,
                displayDate,
              } as CloudinaryItem
            })}
            onDeleteMany={deleteManyAction}
            nextCursor={nextCursor}
          />
        )}
        <div className="mt-8 flex justify-between items-center">
          <Link href="/selfies" className="text-amber-700 hover:underline">Back</Link>
          {nextCursor ? (
            <Link href={`/selfies/all?cursor=${encodeURIComponent(nextCursor)}`} className="px-4 py-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold shadow">
              Load more
            </Link>
          ) : (
            <span className="text-amber-700">No more items</span>
          )}
        </div>
      </div>
    </div>
  )
}
