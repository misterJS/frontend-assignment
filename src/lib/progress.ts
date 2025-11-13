export const WizardProgress = {
  READY: 'READY',
  POST_BASIC: 'POST_BASIC',
  POST_DETAILS: 'POST_DETAILS',
  VERIFY: 'VERIFY',
  DONE: 'DONE',
} as const

export type WizardProgressValue =
  (typeof WizardProgress)[keyof typeof WizardProgress]

export const progressLabels: Record<WizardProgressValue, string> = {
  [WizardProgress.READY]: 'Menunggu submit',
  [WizardProgress.POST_BASIC]: 'Menyimpan Basic Info',
  [WizardProgress.POST_DETAILS]: 'Menyimpan Detail',
  [WizardProgress.VERIFY]: 'Verifikasi akhir',
  [WizardProgress.DONE]: 'Selesai',
}
