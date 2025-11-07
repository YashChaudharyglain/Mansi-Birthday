"use client"

import { useMemo, useState } from "react"

export interface CloudinaryItem {
  asset_id: string
  public_id: string
  secure_url: string
  displayDate: string
}

export default function SelfiesGrid({
  items,
  onDeleteMany,
  nextCursor,
}: {
  items: CloudinaryItem[]
  onDeleteMany: (payload: { publicIds: string[]; password: string }) => Promise<void>
  nextCursor?: string
}) {
  const [selectionMode, setSelectionMode] = useState(false)
  const [selected, setSelected] = useState<Record<string, boolean>>({})
  const [showConfirm, setShowConfirm] = useState(false)
  const [password, setPassword] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const anySelected = useMemo(() => Object.values(selected).some(Boolean), [selected])

  const toggle = (id: string) => {
    setSelected((s) => ({ ...s, [id]: !s[id] }))
  }

  const handleDeleteClick = async () => {
    if (!selectionMode) {
      setSelectionMode(true)
      setSelected({})
      return
    }
    const ids = Object.entries(selected)
      .filter(([, v]) => v)
      .map(([k]) => k)
    if (ids.length === 0) {
      setSelectionMode(false)
      return
    }
    setPassword("")
    setError("")
    setShowConfirm(true)
  }

  const confirmDelete = async () => {
    const ids = Object.entries(selected)
      .filter(([, v]) => v)
      .map(([k]) => k)
    if (ids.length === 0) return
    setSubmitting(true)
    setError("")
    try {
      await onDeleteMany({ publicIds: ids, password })
      setShowConfirm(false)
      setSelectionMode(false)
      setSelected({})
      setPassword("")
    } catch (e) {
      setError("Failed to delete. Check password.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="relative">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {items.map((r) => {
          const checked = !!selected[r.public_id]
          return (
            <div key={r.asset_id} className="relative rounded-2xl overflow-hidden border border-amber-200 shadow bg-white">
              <img src={r.secure_url} alt={r.public_id} className="w-full h-64 object-cover" />
              <div className="p-3 text-sm text-amber-800 flex items-center gap-3 flex-wrap">
                <span className="font-semibold">Public ID:</span> {r.public_id}
                <span className="font-semibold">Date:</span> {r.displayDate}
                <button
                  type="button"
                  onClick={() => setPreviewUrl(r.secure_url)}
                  className="ml-auto px-3 py-1.5 rounded-full bg-amber-600 text-white hover:bg-amber-700 text-xs sm:text-sm"
                >
                  Preview
                </button>
              </div>
              {selectionMode && (
                <button
                  type="button"
                  onClick={() => toggle(r.public_id)}
                  className={`absolute top-3 left-3 w-7 h-7 rounded-md border-2 ${
                    checked ? "bg-red-600 border-red-700" : "bg-white/80 border-amber-300"
                  }`}
                  title={checked ? "Unselect" : "Select"}
                />
              )}
            </div>
          )
        })}
      </div>

      <div className="fixed left-4 bottom-4 z-50 flex gap-3">
        <button
          type="button"
          onClick={handleDeleteClick}
          className={`px-4 py-2 rounded-full font-semibold shadow ${
            selectionMode ? (anySelected ? "bg-red-600 text-white" : "bg-gray-300 text-gray-600") : "bg-amber-600 text-white"
          }`}
        >
          {selectionMode ? (anySelected ? "Delete selected" : "Cancel selection") : "Delete photos"}
        </button>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/50 animate-fade-in" onClick={() => !submitting && setShowConfirm(false)} />
          <div className={`relative z-10 w-full sm:w-[480px] mx-auto rounded-2xl border border-amber-200 bg-white shadow-2xl p-5 m-3
              animate-scale-in`}
          >
            <h3 className="text-lg font-bold text-amber-800 mb-2">Are you sure?</h3>
            <p className="text-sm text-amber-700 mb-4">This will permanently delete the selected photo(s) from Cloudinary.</p>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-amber-400"
              placeholder="Admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={submitting}
            />
            {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
            <div className="mt-4 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                disabled={submitting}
                className="px-4 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={submitting || password.length === 0}
                className={`px-4 py-2 rounded-md font-semibold text-white shadow ${submitting ? "bg-red-400" : "bg-red-600 hover:bg-red-700"}`}
              >
                {submitting ? "Deleting..." : "Yes, delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {previewUrl && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/80 animate-fade-in" onClick={() => setPreviewUrl(null)} />
          <div className="relative z-10 w-[96vw] max-w-5xl">
            <div className="relative rounded-2xl overflow-hidden border border-amber-300 shadow-2xl bg-black">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previewUrl} alt="Preview" className="w-full max-h-[85vh] object-contain" />
              <button
                type="button"
                aria-label="Close preview"
                onClick={() => setPreviewUrl(null)}
                className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-white/90 text-amber-800 font-semibold hover:bg-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .animate-fade-in { animation: fade-in 180ms ease-out both; }
        .animate-scale-in { animation: scale-in 180ms cubic-bezier(0.16, 1, 0.3, 1) both; }
        @keyframes fade-in { from { opacity: 0 } to { opacity: 1 } }
        @keyframes scale-in { from { opacity: 0; transform: translateY(12px) scale(0.98) } to { opacity: 1; transform: translateY(0) scale(1) } }
      `}</style>
    </div>
  )
}
