import { useCallback, useMemo, type ReactNode } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getRoleFromUrl, type Role } from './role'
import { RoleContext } from './role-context-store'

export const RoleProvider = ({ children }: { children: ReactNode }) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.toString()

  const role = useMemo(
    () => getRoleFromUrl(query ? `?${query}` : ''),
    [query],
  )

  const setRole = useCallback(
    (nextRole: Role) => {
      const nextParams = new URLSearchParams(searchParams)

      if (nextRole === 'ops') {
        nextParams.delete('role')
      } else {
        nextParams.set('role', nextRole)
      }

      setSearchParams(nextParams, { replace: true })
    },
    [searchParams, setSearchParams],
  )

  const value = useMemo(() => ({ role, setRole }), [role, setRole])

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>
}
