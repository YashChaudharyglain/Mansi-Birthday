import cloudinary from '@/lib/cloudinary'

export const dynamic = 'force-dynamic'

export default async function SelfiesPage() {
  const res: any = await cloudinary.search
    .expression('folder=selfies AND resource_type:image AND type:upload')
    .sort_by('created_at','desc')
    .max_results(1)
    .execute()
  const selfies = (res?.resources || []) as Array<any>
  return (
    <div className="min-h-screen px-6 py-10 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
      <h1 className="text-2xl font-bold text-amber-800 mb-6">Saved Selfies</h1>
      {selfies.length === 0 ? (
        <p className="text-amber-700">No selfies yet. Capture one in the experience and it will appear here.</p>
      ) : (
        <div className="max-w-4xl mx-auto">
          {selfies.map((s: any) => {
            const dt = new Date(s.created_at)
            const formatted = dt.toLocaleString('en-IN', {
              weekday: 'short', day: '2-digit', month: 'long', year: 'numeric',
              hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true,
            })
            return (
              <div key={s.asset_id} className="rounded-2xl overflow-hidden border border-amber-200 shadow bg-white">
                <div className="bg-black">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.secure_url} alt={s.public_id} className="w-full h-[70vh] object-contain" />
                </div>
                <div className="p-4 text-sm text-amber-800 flex items-center gap-3 flex-wrap">
                  <span className="font-semibold">Public ID:</span> {s.public_id}
                  <span className="font-semibold">Date:</span> {formatted}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
