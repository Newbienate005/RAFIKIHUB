import type { Theme } from '../../theme'
import { SectionCard, FileInputField } from './shared'

interface MediaState {
  photos: string[]
  showreelFile: string
  voiceoverFile: string
}

interface Props {
  t: Theme
  media: MediaState
  setMedia: (media: MediaState) => void
}

const seed = (name: string) => `https://picsum.photos/seed/${name}/300/300`

// MY MEDIA tab — Photos Gallery / Video Showreel / Voiceover Reel. All
// mocked: there's no real upload/storage in this static frontend, so
// "uploading" just records the chosen filename and (for photos) drops in a
// placeholder thumbnail.
export default function MyMediaTab({ t, media, setMedia }: Props) {
  const addPhoto = (name: string) => {
    if (!name) return
    setMedia({ ...media, photos: [...media.photos, seed(`${name}-${media.photos.length}`)] })
  }

  return (
    <div className="space-y-10">
      <SectionCard t={t} title="Photos Gallery">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {media.photos.map((src, i) => (
            <div key={i} className="relative overflow-hidden rounded-lg" style={{ paddingBottom: '100%', background: t.muted }}>
              <img src={src} alt={`Gallery ${i + 1}`} className="absolute inset-0 w-full h-full object-cover" />
            </div>
          ))}
        </div>
        <FileInputField t={t} fileName="" placeholder="Upload Photo" onChange={addPhoto} />
      </SectionCard>

      <SectionCard t={t} title="Video Showreel">
        {media.showreelFile ? (
          <div className="rounded-lg flex items-center justify-center text-sm py-16" style={{ background: t.muted, color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>
            {media.showreelFile}
          </div>
        ) : (
          <p className="text-sm" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>No showreel uploaded yet.</p>
        )}
        <FileInputField t={t} fileName={media.showreelFile} placeholder="Upload Showreel" onChange={(name) => setMedia({ ...media, showreelFile: name })} />
      </SectionCard>

      <SectionCard t={t} title="Voiceover Reel">
        {media.voiceoverFile ? (
          <div className="rounded-lg flex items-center justify-center text-sm py-8" style={{ background: t.muted, color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>
            {media.voiceoverFile}
          </div>
        ) : (
          <p className="text-sm" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>No voiceover reel uploaded yet.</p>
        )}
        <FileInputField t={t} fileName={media.voiceoverFile} placeholder="Upload Voiceover Reel" onChange={(name) => setMedia({ ...media, voiceoverFile: name })} />
      </SectionCard>
    </div>
  )
}
