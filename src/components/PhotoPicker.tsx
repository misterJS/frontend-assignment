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
    <div className="photo-picker">
      <span className="form-field__label">{label}</span>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {value ? (
        <div className="photo-picker__preview">
          <img
            className="photo-picker__image"
            src={value}
            alt="Photo preview"
          />
          <div className="photo-picker__actions">
            <button type="button" onClick={handleReplace} className="btn btn--secondary btn--xs">
              Ganti Foto
            </button>
            <button type="button" onClick={handleRemove} className="btn btn--ghost btn--xs">
              Hapus
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="btn btn--secondary btn--xs"
        >
          Pilih Foto
        </button>
      )}

      {error && (
        <p className="photo-picker__error">{error}</p>
      )}

      <p className="photo-picker__hint">Format: JPG/PNG, maks {maxSizeMb} MB.</p>
    </div>
  )
}

export default PhotoPicker
