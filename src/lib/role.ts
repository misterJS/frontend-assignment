export type Role = 'admin' | 'ops'

export const getRoleFromUrl = (search?: string): Role => {
  const query =
    typeof search === 'string'
      ? search
      : typeof window !== 'undefined'
        ? window.location.search
        : ''

  const params = new URLSearchParams(query ?? '')
  const roleParam = params.get('role')?.toLowerCase()

  return roleParam === 'admin' ? 'admin' : 'ops'
}
