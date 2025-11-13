import { useState } from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Step1, { type Step1Values } from '../Step1'

const defaultValues: Step1Values = {
  fullName: '',
  phone: '',
  emergencyContact: '',
}

const Step1Harness = ({
  initialValues = defaultValues,
  onNext,
}: {
  initialValues?: Step1Values
  onNext: () => void
}) => {
  const [values, setValues] = useState<Step1Values>(initialValues)
  return <Step1 value={values} onChange={setValues} onNext={onNext} />
}

const renderStep = (initialValues?: Step1Values) => {
  const onNext = vi.fn()
  render(<Step1Harness initialValues={initialValues} onNext={onNext} />)
  return { onNext }
}

describe('Step1 wizard form', () => {
  it('renders required inputs and keeps submit disabled when invalid', () => {
    renderStep()
    const button = screen.getByRole('button', { name: /next/i })
    expect(button).toBeDisabled()
    expect(screen.getByLabelText(/nama lengkap/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/nomor telepon/i)).toBeInTheDocument()
  })

  it('enables submit when all fields are valid', async () => {
    const user = userEvent.setup()
    const { onNext } = renderStep()

    await user.type(screen.getByLabelText(/nama lengkap/i), 'Anya Zahra')
    await user.type(screen.getByLabelText(/nomor telepon/i), '0812345678')
    await user.type(screen.getByLabelText(/kontak darurat/i), 'Budi 08123')

    const button = screen.getByRole('button', { name: /next/i })
    await waitFor(() => expect(button).toBeEnabled())

    await user.click(button)
    expect(onNext).toHaveBeenCalledTimes(1)
  })
})
