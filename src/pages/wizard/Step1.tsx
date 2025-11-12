import { useMemo, type ChangeEvent, type FormEvent } from 'react'

export interface Step1Values {
  phone: string
  emergencyContact: string
}

interface Step1Props {
  value: Step1Values
  onChange: (value: Step1Values) => void
  onNext: () => void
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

const Step1 = ({ value, onChange, onNext }: Step1Props) => {
  const errors = useMemo(() => {
    const phone = value.phone.trim()
    const emergency = value.emergencyContact.trim()

    return {
      phone:
        phone.length < 9
          ? 'Nomor telepon minimal 9 karakter.'
          : /\D/.test(phone)
            ? 'Hanya angka yang diperbolehkan.'
            : '',
      emergencyContact: emergency ? '' : 'Kontak darurat wajib diisi.',
    }
  }, [value])

  const isValid = Object.values(errors).every((message) => !message)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!isValid) return
    onNext()
  }

  const handleFieldChange =
    (field: keyof Step1Values) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      onChange({
        ...value,
        [field]: event.target.value,
      })
    }

  return (
    <form onSubmit={handleSubmit}>
      <h2 style={{ marginBottom: '0.75rem' }}>Step 1 - Basic Information</h2>
      <p style={{ marginTop: 0, marginBottom: '1rem', color: '#475569' }}>
        Input sederhana khusus Admin. Masukkan data valid sebelum lanjut ke step
        berikutnya.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <label style={labelStyle}>
          <span>Nomor Telepon</span>
          <input
            type="tel"
            inputMode="numeric"
            placeholder="cth: 08123456789"
            value={value.phone}
            onChange={handleFieldChange('phone')}
            style={inputStyle}
          />
          {errors.phone && <span style={errorStyle}>{errors.phone}</span>}
        </label>

        <label style={labelStyle}>
          <span>Kontak Darurat</span>
          <input
            placeholder="Nama & nomor kontak"
            value={value.emergencyContact}
            onChange={handleFieldChange('emergencyContact')}
            style={inputStyle}
          />
          {errors.emergencyContact && (
            <span style={errorStyle}>{errors.emergencyContact}</span>
          )}
        </label>
      </div>

      <button
        type="submit"
        disabled={!isValid}
        style={{
          marginTop: '1.25rem',
          padding: '0.5rem 1.25rem',
          borderRadius: 999,
          border: 'none',
          backgroundColor: isValid ? '#2563eb' : '#94a3b8',
          color: '#fff',
          cursor: isValid ? 'pointer' : 'not-allowed',
        }}
      >
        Next
      </button>
    </form>
  )
}

export default Step1
