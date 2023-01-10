import axios from '../axios'
import useSWR, { mutate } from 'swr'

export type Role = {
  id: number
  name: string
}

// const roles = {}

export const useRoles = (): { roles: Role[]; error: any } => {
  const fetcher = () => axios.get('/roles').then((res) => res.data)
  const { data, error } = useSWR('/roles', fetcher)
  console.log("data:" + JSON.stringify(data))
  return { roles: data, error }
}

export const useRole = (id: number): { slide: Slide; error: any } => {
  const fetcher = () =>
    id ? axios.get(`/slides/${id}`).then((res) => res.data) : null
  const { data, error } = useSWR(`/slides/${id}`, fetcher)
  return { role: data, error }
}

export const useCreateRole = () => {
  return async (slide: Slide) => {
    await axios.post(`/slides/`, slide)
    await mutate(`/slides/`)
  }
}

export const useUpdateRole = () => {
  return async (id: number, slide: Slide) => {
    await axios.put(`/slides/${id}`, slide)
    await mutate(`/slides/${id}`)
  }
}
