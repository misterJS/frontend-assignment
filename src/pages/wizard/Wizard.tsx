import { useEffect, useMemo, useState } from 'react'
import { useRole } from '../../lib/useRole'
import useDraft from '../../lib/useDraft'
import Step1, { type Step1Values } from './Step1'
import Step2, { type Step2Values } from './Step2'

type Step = 1 | 2

const createInitialStep1Values = (): Step1Values => ({
  phone: '',
  emergencyContact: '',
})

const createInitialStep2Values = (): Step2Values => ({
  department: null,
  location: null,
  employeeId: '',
  photoDataUrl: null,
  notes: '',
})

interface WizardDraft {
  step1?: Step1Values
  step2?: Step2Values
}

const Wizard = () => {
  const { role } = useRole()
  const draftKey = useMemo(() => `draft_${role}`, [role])
  const { save, load, clear } = useDraft<WizardDraft>(draftKey)
  const [step, setStep] = useState<Step>(role === 'admin' ? 1 : 2)
  const [step1Values, setStep1Values] = useState<Step1Values>(() =>
    createInitialStep1Values(),
  )
  const [step2Values, setStep2Values] = useState<Step2Values>(() =>
    createInitialStep2Values(),
  )

  useEffect(() => {
    setStep(role === 'admin' ? 1 : 2)
  }, [role])

  useEffect(() => {
    const stored = load()
    if (stored?.step1) {
      setStep1Values({ ...createInitialStep1Values(), ...stored.step1 })
    } else {
      setStep1Values(createInitialStep1Values())
    }

    if (stored?.step2) {
      setStep2Values({ ...createInitialStep2Values(), ...stored.step2 })
    } else {
      setStep2Values(createInitialStep2Values())
    }
  }, [load, role])

  const handleStep1Change = (next: Step1Values) => {
    setStep1Values(next)
    save({ step1: next })
  }

  const handleStep2Change = (next: Step2Values) => {
    setStep2Values(next)
    save({ step2: next })
  }

  const handleStep1Next = () => {
    setStep(2)
  }

  const handleStep2Submit = () => {
    console.log('Submit wizard data', {
      role,
      step1: step1Values,
      step2: step2Values,
    })
    clear()
    setStep1Values(createInitialStep1Values())
    setStep2Values(createInitialStep2Values())
    setStep(role === 'admin' ? 1 : 2)
  }

  const handleBack = () => {
    if (role !== 'admin') return
    setStep((prev) => (prev > 1 ? ((prev - 1) as Step) : prev))
  }

  const handleClearDraft = () => {
    clear()
    setStep1Values(createInitialStep1Values())
    setStep2Values(createInitialStep2Values())
    setStep(role === 'admin' ? 1 : 2)
  }

  const isBackVisible = role === 'admin' && step > 1

  return (
    <section className="wizard">
      <div className="wizard__header">
        <h1 className="wizard__title">Wizard Simulasi</h1>
        <button
          type="button"
          onClick={handleClearDraft}
          className="btn btn--ghost wizard-clear"
        >
          Clear Draft ({role})
        </button>
      </div>
      <div className="wizard__card">
        {step === 1 && role === 'admin' ? (
          <Step1
            value={step1Values}
            onChange={handleStep1Change}
            onNext={handleStep1Next}
          />
        ) : (
          <Step2
            role={role}
            value={step2Values}
            onChange={handleStep2Change}
            onSubmit={handleStep2Submit}
          />
        )}
      </div>

      {isBackVisible && (
        <button
          type="button"
          onClick={handleBack}
          className="btn btn--ghost wizard__back-button"
        >
          Back
        </button>
      )}
    </section>
  )
}

export default Wizard
