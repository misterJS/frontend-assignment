import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react'
import axios from 'axios'
import type { Role } from '../../lib/role'
import Autocomplete, {
  type AutocompleteOption,
} from '../../components/Autocomplete'
import PhotoPicker from '../../components/PhotoPicker'
import { makeEmpId } from '../../lib/empId'

type DepartmentOption = AutocompleteOption & { name: string }
type LocationOption = AutocompleteOption & { city: string; country: string }

export interface Step2Values {
  department: DepartmentOption | null
  location: LocationOption | null
  employeeId: string
  photoDataUrl: string | null
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
  const [isFetchingCount, setIsFetchingCount] = useState(false)

  const errors = useMemo(
    () => ({
      department: value.department ? '' : 'Silakan pilih department.',
      location: value.location ? '' : 'Silakan pilih lokasi.',
      employeeId: value.employeeId ? '' : 'Employee ID belum terbentuk.',
      photo: value.photoDataUrl ? '' : 'Foto wajib diunggah.',
    }),
    [
      value.department,
      value.employeeId,
      value.location,
      value.photoDataUrl,
    ],
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

  useEffect(() => {
    const fetchCount = async () => {
      if (!value.department) {
        onChange({ ...value, employeeId: '' })
        return
      }

      setIsFetchingCount(true)

      try {
        const response = await axios.get(
          'http://localhost:4001/basicInfo',
          {
            params: { departmentId: value.department.id },
          },
        )
        const existingCount = Array.isArray(response.data)
          ? response.data.length
          : 0
        onChange({
          ...value,
          employeeId: makeEmpId(
            value.department?.name ?? '',
            existingCount,
          ),
        })
      } catch (error) {
        console.error('Failed to fetch existing count', error)
        onChange({ ...value, employeeId: '' })
      } finally {
        setIsFetchingCount(false)
      }
    }

    fetchCount()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value.department])

  return (
    <form onSubmit={handleSubmit}>
      <h2 style={{ marginBottom: '0.75rem' }}>Step 2 - Additional Details</h2>
      <p style={{ marginTop: 0, marginBottom: '1rem', color: '#475569' }}>
        Tahap ini dapat diakses oleh <strong>Admin</strong> maupun{' '}
        <strong>Ops</strong>. Pilih departemen, lokasi, dan unggah foto sebagai
        bagian dari verifikasi. Role aktif saat ini:{' '}
        <strong>{role}</strong>.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <label style={labelStyle}>
          <span>Department</span>
          <Autocomplete<DepartmentOption>
            endpoint="http://localhost:4001/departments"
            value={value.department}
            placeholder="Cari department..."
            getOptionLabel={(option) => option.name}
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

        <div style={labelStyle}>
          <span>ID Karyawan</span>
          <input
            value={
              isFetchingCount
                ? 'Menghitung...'
                : value.employeeId || ''
            }
            readOnly
            style={{
              ...inputStyle,
              backgroundColor: '#f8fafc',
              color: '#0f172a',
            }}
          />
          {submitAttempted && errors.employeeId && (
            <span style={errorStyle}>{errors.employeeId}</span>
          )}
        </div>

        <label style={labelStyle}>
          <span>Location</span>
          <Autocomplete<LocationOption>
            endpoint="http://localhost:4002/locations"
            value={value.location}
            placeholder="Cari lokasi..."
            searchField="city"
            getOptionLabel={(option) => option.city}
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

        <div style={labelStyle}>
          <PhotoPicker
            label="Foto Karyawan"
            value={value.photoDataUrl}
            onChange={(photo) =>
              onChange({
                ...value,
                photoDataUrl: photo,
              })
            }
          />
          {submitAttempted && errors.photo && (
            <span style={errorStyle}>{errors.photo}</span>
          )}
        </div>

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
