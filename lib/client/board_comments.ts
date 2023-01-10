import axios from '@/lib/axios'
import useSWR, { mutate } from 'swr'
import customAxios from '@/lib/customAxios'

export type BoardComment = {
  id: number
  user_id: number
  board_id: number
  title: string
  detil: string
  created_at: datetime
  updated_at: datetime
}

export const useBoardComments = (): { board_comments: BoardComment[]; error: any } => {
  const fetcher = () => axios.get('/board_comments').then((res) => res.data)
  const { data, error } = useSWR('/board_comments', fetcher)
  return { board_comments: data, error }
}

export const useBoardComment = (id: number): { board: BoardComment; error: any } => {
  const fetcher = () =>
    id ? customAxios.get(`/board_comments/${id}`).then((res) => res.data) : null
  const { data, error } = useSWR(`/board_comments/${id}`, fetcher)
  return { board: data, error }
}

export const useCreateBoardComment = () => {
  return async (board: BoardComment) => {
    await customAxios.post(`/board_comments/`, board)
    await mutate(`/board_comments/`)
  }
}

export const useDeleteBoardComment = () => {
  return async (id: number) => {
    await customAxios.delete(`/board_comments/${id}`)
    await mutate(`/board_comments/`)
  }
}

export const useUpdateBoardComment = () => {
  return async (id: number, board: BoardComment) => {
    await customAxios.put(`/board_comments/${id}`, board)
    await mutate(`/board_comments/${id}`)
  }
}
