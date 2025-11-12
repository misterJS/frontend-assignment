import { type ChangeEvent, type FormEvent } from 'react'
import type { Role } from '../../lib/role'

export interface Step2Values {
  locationPreference: string
  notes: string
}

interface Step2Props {
  role: Role
  value: Step2Values
  onChange: (value: Step2Values) => void
  onSubmit: () => void
}

const inputStyle = {
  width: '100%',
  padding: '0.5rem 0.75rem',
  borderRadius: 6,
  border: '1px solid #cbd5f5',
  fontSize: '1rem',
}

const labelStyle = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '0.25rem',
}

const Step2 = ({ role, value, onChange, onSubmit }: Step2Props) => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmit()
  }

  const handleFieldChange =
    (field: keyof Step2Values) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      onChange({
        ...value,
        [field]: event.target.value,
      })
    }

  return (
    <form onSubmit={handleSubmit}>
      <h2 style={{ marginBottom: '0.75rem' }}>Step 2 - Additional Details</h2>
      <p style={{ marginTop: 0, marginBottom: '1rem', color: '#475569' }}>
        Tahap ini dapat diakses oleh <strong>Admin</strong> maupun{' '}
        <strong>Ops</strong>. Tambahkan data lanjutan sebelum submit akhir.
        Role aktif saat ini: <strong>{role}</strong>.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <label style={labelStyle}>
          <span>Preferensi Lokasi</span>
          <input
            placeholder="cth: Jakarta / Bandung"
            value={value.locationPreference}
            onChange={handleFieldChange('locationPreference')}
            style={inputStyle}
          />
        </label>

        <label style={labelStyle}>
          <span>Catatan Tambahan</span>
          <textarea
            placeholder="Masukkan catatan atau checklist internal"
            value={value.notes}
            onChange={handleFieldChange('notes')}
            style={{ ...inputStyle, minHeight: 120, resize: 'vertical' }}
          />
        </label>
      </div>

      <button
        type="submit"
        style={{
          marginTop: '1.25rem',
          padding: '0.5rem 1.5rem',
          borderRadius: 999,
          border: 'none',
          backgroundColor: '#16a34a',
          color: '#fff',
          cursor: 'pointer',
        }}
      >
        Submit
      </button>
    </form>
  )
}

export default Step2
