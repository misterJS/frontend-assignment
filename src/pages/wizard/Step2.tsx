import { useMemo, useState, type ChangeEvent, type FormEvent } from 'react'
import type { Role } from '../../lib/role'
import Autocomplete, {
  type AutocompleteOption,
} from '../../components/Autocomplete'

export interface Step2Values {
  department: AutocompleteOption | null
  location: AutocompleteOption | null
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

const errorStyle = {
  color: '#dc2626',
  fontSize: '0.85rem',
}

const Step2 = ({ role, value, onChange, onSubmit }: Step2Props) => {
  const [submitAttempted, setSubmitAttempted] = useState(false)

  const errors = useMemo(
    () => ({
      department: value.department ? '' : 'Silakan pilih department.',
      location: value.location ? '' : 'Silakan pilih lokasi.',
    }),
    [value.department, value.location],
  )

  const isValid = Object.values(errors).every((message) => !message)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitAttempted(true)
    if (!isValid) return
    onSubmit()
  }

  const handleNotesChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onChange({
      ...value,
      notes: event.target.value,
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2 style={{ marginBottom: '0.75rem' }}>Step 2 - Additional Details</h2>
      <p style={{ marginTop: 0, marginBottom: '1rem', color: '#475569' }}>
        Tahap ini dapat diakses oleh <strong>Admin</strong> maupun{' '}
        <strong>Ops</strong>. Pilih departemen dan lokasi, lalu lengkapi catatan
        tambahan. Role aktif saat ini: <strong>{role}</strong>.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <label style={labelStyle}>
          <span>Department</span>
          <Autocomplete
            endpoint="http://localhost:4001/departments"
            value={value.department}
            placeholder="Cari department..."
            onSelect={(option) =>
              onChange({
                ...value,
                department: option,
              })
            }
          />
          {submitAttempted && errors.department && (
            <span style={errorStyle}>{errors.department}</span>
          )}
        </label>

        <label style={labelStyle}>
          <span>Location</span>
          <Autocomplete
            endpoint="http://localhost:4002/locations"
            value={value.location}
            placeholder="Cari lokasi..."
            onSelect={(option) =>
              onChange({
                ...value,
                location: option,
              })
            }
          />
          {submitAttempted && errors.location && (
            <span style={errorStyle}>{errors.location}</span>
          )}
        </label>

        <label style={labelStyle}>
          <span>Catatan Tambahan</span>
          <textarea
            placeholder="Masukkan catatan atau checklist internal"
            value={value.notes}
            onChange={handleNotesChange}
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
          backgroundColor: isValid ? '#16a34a' : '#94a3b8',
          color: '#fff',
          cursor: isValid ? 'pointer' : 'not-allowed',
        }}
      >
        Submit
      </button>
    </form>
  )
}

export default Step2
