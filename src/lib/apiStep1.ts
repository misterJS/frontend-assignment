import axios from 'axios'
import { API_STEP1_BASE_URL } from './apiConfig'

export interface Department {
  id: number
  name: string
  head: string
}

export interface BasicInfoPayload {
  fullName: string
  departmentId: number
  email: string
}

export const apiStep1 = axios.create({
  baseURL: API_STEP1_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const getDepartments = async () => {
  const response = await apiStep1.get<Department[]>('/departments')
  return response.data
}

export const postBasicInfo = async (payload: BasicInfoPayload) => {
  const response = await apiStep1.post('/basicInfo', payload)
  return response.data
}

export default apiStep1
