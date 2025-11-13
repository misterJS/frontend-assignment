const getEnv = (key: string, fallback: string) => {
  if (typeof import.meta !== 'undefined' && import.meta.env?.[key]) {
    return import.meta.env[key] as string
  }
  return fallback
}

export const API_STEP1_BASE_URL = getEnv(
  'VITE_API_STEP1',
  'http://localhost:4001',
)
export const API_STEP2_BASE_URL = getEnv(
  'VITE_API_STEP2',
  'http://localhost:4002',
)
