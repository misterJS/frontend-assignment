import { createContext } from 'react'
import type { Role } from './role'

export interface RoleContextValue {
  role: Role
  setRole: (role: Role) => void
}

export const RoleContext = createContext<RoleContextValue | undefined>(
  undefined,
)
