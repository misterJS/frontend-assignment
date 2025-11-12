import { useRef, useState, type ChangeEvent } from 'react'

interface PhotoPickerProps {
  value?: string | null
  onChange: (dataUrl: string | null) => void
  maxSizeMb?: number
  label?: string
}

const MAX_DEFAULT_MB = 2

const PhotoPicker = ({
  value = null,
  onChange,
  maxSizeMb = MAX_DEFAULT_MB,
  label = 'Upload Photo',
}: PhotoPickerProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) {
      setError(null)
      return
    }

    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      setError('Hanya file JPEG atau PNG yang diperbolehkan.')
      event.target.value = ''
      return
    }

    if (file.size > maxSizeMb * 1024 * 1024) {
      setError(`Ukuran file maksimal ${maxSizeMb}MB.`)
      event.target.value = ''
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result?.toString() ?? null
      onChange(result)
      setError(null)
    }
    reader.readAsDataURL(file)
  }

  const handleReplace = () => {
    inputRef.current?.click()
  }

  const handleRemove = () => {
    onChange(null)
    setError(null)
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  return (
    <div>
      <label style={{ display: 'block', fontWeight: 500, marginBottom: 8 }}>
        {label}
      </label>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {value ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '1rem',
          }}
        >
          <img
            src={value}
            alt="Photo preview"
            style={{
              width: 120,
              height: 120,
              objectFit: 'cover',
              borderRadius: 8,
              border: '1px solid #e2e8f0',
            }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button type="button" onClick={handleReplace}>
              Ganti Foto
            </button>
            <button type="button" onClick={handleRemove}>
              Hapus
            </button>
          </div>
        </div>
      ) : (
        <button type="button" onClick={() => inputRef.current?.click()}>
          Pilih Foto
        </button>
      )}

      {error && (
        <p style={{ color: '#dc2626', fontSize: '0.85rem', marginTop: 8 }}>
          {error}
        </p>
      )}

      <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: 4 }}>
        Format: JPG/PNG, maks {maxSizeMb} MB.
      </p>
    </div>
  )
}

export default PhotoPicker
