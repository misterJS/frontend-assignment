import axios from 'axios'

export interface BasicInfo {
  id: number
  employeeId?: string
  fullName: string
  departmentId?: number
  department?: string
  email: string
  role?: string
}

export interface DetailInfo {
  id: number
  employeeId?: string
  locationId?: string
  location?: string
  photo?: string
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

const STEP1_URL = 'http://localhost:4001/basicInfo'
const STEP2_URL = 'http://localhost:4002/details'

const buildQuery = (params: FetchEmployeesParams = {}) => {
  const query = new URLSearchParams()
  if (params.page) query.set('_page', params.page.toString())
  if (params.limit) query.set('_limit', params.limit.toString())
  return query.toString()
}

export const fetchEmployees = async ({
  page = 1,
  limit = 10,
}: FetchEmployeesParams = {}): Promise<{
  data: EmployeeRecord[]
  total: number
}> => {
  const query = buildQuery({ page, limit })
  const [basicResp, detailsResp] = await Promise.all([
    axios.get<BasicInfo[]>(`${STEP1_URL}?${query}`),
    axios.get<DetailInfo[]>(`${STEP2_URL}?${query}`),
  ])

  const total =
    Number(basicResp.headers['x-total-count']) ||
    basicResp.data.length ||
    0

  const detailsMap = new Map<string, DetailInfo>()
  detailsResp.data.forEach((detail) => {
    const key = (detail.employeeId ?? '').toString()
    if (key) {
      detailsMap.set(key, detail)
    }
  })

  const merged = basicResp.data.map((basic) => {
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
