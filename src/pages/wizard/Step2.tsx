import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react'
import { useNavigate } from 'react-router-dom'
import type { Role } from '@/lib/role'
import type { Step1Values } from './Step1'
import Autocomplete, {
  type AutocompleteOption,
} from '@/components/Autocomplete'
import PhotoPicker from '@/components/PhotoPicker'
import { makeEmpId } from '@/lib/empId'
import delay from '@/lib/delay'
import { WizardProgress, progressLabels } from '@/lib/progress'
import apiStep1 from '@/lib/apiStep1'
import apiStep2 from '@/lib/apiStep2'

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
  basicInfo: Step1Values
  value: Step2Values
  onChange: (value: Step2Values) => void
  onSubmit: () => void
}

const Step2 = ({ role, basicInfo, value, onChange, onSubmit }: Step2Props) => {
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const [isFetchingCount, setIsFetchingCount] = useState(false)
  const [progress, setProgress] = useState<WizardProgress>(WizardProgress.READY)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const progressSteps: WizardProgress[] = [
    WizardProgress.READY,
    WizardProgress.POST_BASIC,
    WizardProgress.POST_DETAILS,
    WizardProgress.VERIFY,
    WizardProgress.DONE,
  ]
  const currentProgressIndex = progressSteps.indexOf(progress)

  const errors = useMemo(
    () => ({
      department: value.department ? '' : 'Silakan pilih department.',
      location: value.location ? '' : 'Silakan pilih lokasi.',
      employeeId: value.employeeId ? '' : 'Employee ID belum terbentuk.',
      photo: value.photoDataUrl ? '' : 'Foto wajib diunggah.',
    }),
    [value.department, value.employeeId, value.location, value.photoDataUrl],
  )

  const isValid = Object.values(errors).every((message) => !message)

  const executeSubmit = async () => {
    if (isSubmitting) return
    setIsSubmitting(true)
    setErrorMessage(null)

    try {
      const basicTimestamp = Date.now()
      const detailTimestamp = basicTimestamp + 1
      const basicId = `z-${basicTimestamp}`
      const detailId = `z-${detailTimestamp}`

      setProgress(WizardProgress.POST_BASIC)
      const fullName =
        basicInfo.fullName.trim() || `Employee ${value.employeeId}`
      await apiStep1.post('/basicInfo', {
        id: basicId,
        employeeId: value.employeeId,
        departmentId: value.department?.id,
        department: value.department?.name,
        fullName,
        email: `${value.employeeId.toLowerCase()}@example.com`,
        role,
        phone: basicInfo.phone,
        emergencyContact: basicInfo.emergencyContact,
        notes: value.notes,
        createdAt: basicTimestamp,
      })
      await delay(3000)

      setProgress(WizardProgress.POST_DETAILS)
      await apiStep2.post('/details', {
        id: detailId,
        employeeId: value.employeeId,
        locationId: value.location?.id,
        location: value.location?.city,
        photo: value.photoDataUrl,
        notes: value.notes,
        createdAt: detailTimestamp,
      })
      await delay(3000)

      setProgress(WizardProgress.VERIFY)
      await delay(1000)

      setProgress(WizardProgress.DONE)
      onSubmit()
      navigate('/employees')
    } catch (error) {
      console.error('Submit failed', error)
      setErrorMessage('Submit gagal. Silakan coba lagi.')
      setProgress(WizardProgress.READY)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitAttempted(true)
    if (!isValid) return
    executeSubmit()
  }

  const handleRetry = () => {
    if (!isValid || isSubmitting) return
    executeSubmit()
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
        const response = await apiStep1.get('/basicInfo', {
          params: { departmentId: value.department.id },
        })
        const existingCount = Array.isArray(response.data)
          ? response.data.length
          : 0
        onChange({
          ...value,
          employeeId: makeEmpId(value.department?.name ?? '', existingCount),
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
    <form className="wizard-form" onSubmit={handleSubmit}>
      <div>
        <h2>Step 2 - Additional Details</h2>
        <p className="wizard-form__description">
          Tahap ini dapat diakses oleh <strong>Admin</strong> maupun{' '}
          <strong>Ops</strong>. Pilih departemen, lokasi, dan unggah foto
          sebagai bagian dari verifikasi. Role aktif saat ini:{' '}
          <strong>{role}</strong>.
        </p>
      </div>

      <div className="u-grid">
        <label className="form-field">
          <span className="form-field__label">Department</span>
          <Autocomplete<DepartmentOption>
            endpoint="http://localhost:4001/departments"
            value={value.department}
            placeholder="Cari department..."
            getOptionLabel={(option) => option.name}
            disabled={isSubmitting}
            onSelect={(option) =>
              onChange({
                ...value,
                department: option,
              })
            }
          />
          {submitAttempted && errors.department && (
            <span className="form-field__error">{errors.department}</span>
          )}
        </label>

        <label className="form-field form-field--static">
          <span className="form-field__label">ID Karyawan</span>
          <input
            className="form-field__input"
            value={isFetchingCount ? 'Menghitung...' : value.employeeId || ''}
            readOnly
          />
          {submitAttempted && errors.employeeId && (
            <span className="form-field__error">{errors.employeeId}</span>
          )}
        </label>

        <label className="form-field">
          <span className="form-field__label">Location</span>
          <Autocomplete<LocationOption>
            endpoint="http://localhost:4002/locations"
            value={value.location}
            placeholder="Cari lokasi..."
            searchField="city"
            getOptionLabel={(option) => option.city}
            disabled={isSubmitting}
            onSelect={(option) =>
              onChange({
                ...value,
                location: option,
              })
            }
          />
          {submitAttempted && errors.location && (
            <span className="form-field__error">{errors.location}</span>
          )}
        </label>

        <div
          className={`form-field${isSubmitting ? ' form-field--disabled' : ''}`}
        >
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
            <span className="form-field__error">{errors.photo}</span>
          )}
        </div>

        <label className="form-field">
          <span className="form-field__label">Catatan Tambahan</span>
          <textarea
            className="form-field__textarea form-field__textarea--lg"
            placeholder="Masukkan catatan atau checklist internal"
            value={value.notes}
            onChange={handleNotesChange}
            disabled={isSubmitting}
          />
        </label>
      </div>

      {(progress !== WizardProgress.READY || isSubmitting) && (
        <div className="wizard-progress">
          <strong className="wizard-progress__title">Progress</strong>
          <ol className="wizard-progress__list">
            {progressSteps.map((stepStatus) => {
              const isActive = progress === stepStatus
              const stepIndex = progressSteps.indexOf(stepStatus)
              const isCompleted =
                stepIndex > -1 && stepIndex < currentProgressIndex
              return (
                <li
                  key={stepStatus}
                  className={`wizard-progress__item${
                    isActive
                      ? ' wizard-progress__item--active'
                      : isCompleted
                        ? ' wizard-progress__item--done'
                        : ''
                  }`}
                >
                  {progressLabels[stepStatus]}
                </li>
              )
            })}
          </ol>
        </div>
      )}

      {errorMessage && (
        <div className="wizard-error">
          <span>{errorMessage}</span>
          <button
            type="button"
            onClick={handleRetry}
            disabled={isSubmitting}
            className="btn btn--danger btn--xs"
          >
            Retry
          </button>
        </div>
      )}

      <button
        type="submit"
        className="btn btn--primary"
        disabled={!isValid || isSubmitting}
      >
        {isSubmitting ? 'Processing...' : 'Submit'}
      </button>
    </form>
  )
}

export default Step2
