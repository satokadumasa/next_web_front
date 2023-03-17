import axios from '@/lib/axios'
import useSWR, { mutate } from 'swr'
import customAxios from '@/lib/customAxios'

export type Page = {
  id: number
  user_id: number
  note_id: number
  title: string
  overview: string
  detail: string
  created_at: string
  updated_at: string
  user: {
    id: number
    nickname: string
  }
}

export const usePages = (): { pages: Page[]; error: any } => {
  const fetcher = () => axios.get('/pages').then((res) => res.data)
  const { data, error } = useSWR('/pages', fetcher)
  return { pages: data, error }
}

export const usePage = (id: number): { page: Page; error: any } => {
  const fetcher = () =>
    id ? axios.get(`/pages/${id}`).then((res) => res.data) : null
  const { data, error } = useSWR(`/pages/${id}`, fetcher)
  return { page: data, error }
}

export const useCreatePage = () => {
  return async (page: Page) => {
    await customAxios.post(`/pages/`, page)
    await mutate(`/pages/`)
  }
}

export const useDeletePage = () => {
  return async (id: number) => {
    await customAxios.delete(`/pages/${id}`)
    await mutate(`/pages/`)
  }
}

export const useUpdatePage = () => {
  return async (id: number, page: Page) => {
    await customAxios.put(`/pages/${id}`, page)
    await mutate(`/pages/${id}`)
  }
}
