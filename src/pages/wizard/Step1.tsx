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
    <form className="wizard-form" onSubmit={handleSubmit}>
      <div>
        <h2>Step 1 - Basic Information</h2>
        <p className="wizard-form__description">
          Input sederhana khusus Admin. Masukkan data valid sebelum lanjut ke
          step berikutnya.
        </p>
      </div>

      <div className="u-grid">
        <label className="form-field">
          <span className="form-field__label">Nomor Telepon</span>
          <input
            className="form-field__input"
            type="tel"
            inputMode="numeric"
            placeholder="cth: 08123456789"
            value={value.phone}
            onChange={handleFieldChange('phone')}
          />
          {errors.phone && (
            <span className="form-field__error">{errors.phone}</span>
          )}
        </label>

        <label className="form-field">
          <span className="form-field__label">Kontak Darurat</span>
          <input
            className="form-field__input"
            placeholder="Nama & nomor kontak"
            value={value.emergencyContact}
            onChange={handleFieldChange('emergencyContact')}
          />
          {errors.emergencyContact && (
            <span className="form-field__error">
              {errors.emergencyContact}
            </span>
          )}
        </label>
      </div>

      <button type="submit" disabled={!isValid} className="btn btn--primary">
        Next
      </button>
    </form>
  )
}

export default Step1
