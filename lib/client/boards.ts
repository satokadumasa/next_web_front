import axios from '@/lib/axios'
import useSWR, { mutate } from 'swr'
import customAxios from '@/lib/customAxios'

export type Board = {
  id: number
  user_id: number
  title: string
  detil: string
  created_at: datetime
  updated_at: datetime
}

export const useBoards = (): { boards: Board[]; error: any } => {
  const fetcher = () => axios.get('/boards').then((res) => res.data)
  const { data, error } = useSWR('/boards', fetcher)
  return { boards: data, error }
}

export const useBoard = (id: number): { board: Board; error: any } => {
  const fetcher = () =>
    id ? customAxios.get(`/boards/${id}`).then((res) => res.data) : null
  const { data, error } = useSWR(`/boards/${id}`, fetcher)
  return { board: data, error }
}

export const useCreateBoard = () => {
  return async (board: Board) => {
    await customAxios.post(`/boards/`, board)
    await mutate(`/boards/`)
  }
}

export const useDeleteBoard = () => {
  return async (id: number) => {
    await customAxios.delete(`/boards/${id}`)
    await mutate(`/boards/`)
  }
}

export const useUpdateBoard = () => {
  return async (id: number, board: Board) => {
    await customAxios.put(`/boards/${id}`, board)
    await mutate(`/boards/${id}`)
  }
}
