import axios from 'axios'
import { API_STEP1_BASE_URL, API_STEP2_BASE_URL } from './apiConfig'

export interface BasicInfo {
  id: number | string
  employeeId?: string
  fullName: string
  departmentId?: number
  department?: string
  email: string
  role?: string
  createdAt?: number
}

export interface DetailInfo {
  id: number | string
  employeeId?: string
  locationId?: string
  location?: string
  photo?: string
  createdAt?: number
}

export interface EmployeeRecord {
  employeeId: string
  fullName: string
  department?: string
  role?: string
  location?: string
  photo?: string | null
}

export interface FetchEmployeesParams {
  page?: number
  limit?: number
}

const STEP1_URL = `${API_STEP1_BASE_URL}/basicInfo`
const STEP2_URL = `${API_STEP2_BASE_URL}/details`

export const fetchEmployees = async ({
  page = 1,
  limit = 10,
}: FetchEmployeesParams = {}): Promise<{
  data: EmployeeRecord[]
  total: number
}> => {
  const [basicResp, detailsResp] = await Promise.all([
    axios.get<BasicInfo[]>(STEP1_URL),
    axios.get<DetailInfo[]>(STEP2_URL),
  ])

  const total = basicResp.data.length

  const detailsMap = new Map<string, DetailInfo>()
  detailsResp.data.forEach((detail) => {
    const key = (detail.employeeId ?? '').toString()
    if (key) {
      detailsMap.set(key, detail)
    }
  })

  const sortedBasics = [...basicResp.data].sort((a, b) => {
    const toNumber = (entry: BasicInfo) => {
      if (entry.createdAt) return entry.createdAt
      const numericId = Number(entry.id)
      if (!Number.isNaN(numericId)) return numericId
      return 0
    }
    return toNumber(b) - toNumber(a)
  })

  const start = (page - 1) * limit
  const pagedBasics = sortedBasics.slice(start, start + limit)

  const merged = pagedBasics.map((basic) => {
    const employeeId =
      (basic.employeeId ?? basic.id?.toString()) ?? ''
    const detail = detailsMap.get(employeeId)
    return {
      employeeId,
      fullName: basic.fullName ?? 'Unknown',
      department: basic.department || '-',
      role: basic.role || '-',
      location: detail?.location ?? detail?.locationId ?? 'N/A',
      photo: detail?.photo ?? null,
    }
  })

  return { data: merged, total }
}
