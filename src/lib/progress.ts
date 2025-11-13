export enum WizardProgress {
  READY = 'READY',
  POST_BASIC = 'POST_BASIC',
  POST_DETAILS = 'POST_DETAILS',
  VERIFY = 'VERIFY',
  DONE = 'DONE',
}

export const progressLabels: Record<WizardProgress, string> = {
  [WizardProgress.READY]: 'Menunggu submit',
  [WizardProgress.POST_BASIC]: 'Menyimpan Basic Info',
  [WizardProgress.POST_DETAILS]: 'Menyimpan Detail',
  [WizardProgress.VERIFY]: 'Verifikasi akhir',
  [WizardProgress.DONE]: 'Selesai',
}
