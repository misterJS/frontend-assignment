import axios from 'axios'
import { API_STEP2_BASE_URL } from './apiConfig'

export interface Location {
  id: string
  city: string
  country: string
}

export interface DetailPayload {
  employeeId: number
  locationId: string
  position: string
}

export const apiStep2 = axios.create({
  baseURL: API_STEP2_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const getLocations = async () => {
  const response = await apiStep2.get<Location[]>('/locations')
  return response.data
}

export const postDetails = async (payload: DetailPayload) => {
  const response = await apiStep2.post('/details', payload)
  return response.data
}

export default apiStep2
