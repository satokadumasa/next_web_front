import axios from '@/lib/axios'
import useSWR, { mutate } from 'swr'
import customAxios from '@/lib/customAxios'

export type User = {
  id: number
  email: string
  password: string
  password_confirmation: string
}

const readUser = (): User | undefined => {
  const fetcher = () =>
    customAxios.get(`/users/me`).then((res) => res.data)
  const { data, error } = useSWR(`/users/me`, fetcher)
  return  { user: data, error }
}


export const useUsers = (): { users: User[]; error: any } => {
  const fetcher = () => axios.get('/users').then((res) => res.data)
  const { data, error } = useSWR('/users', fetcher)
  return { users: data, error }
}

export const useUser = (id: number): { user: User; error: any } => {
  const fetcher = () =>
    id ? axios.get(`/users/${id}`).then((res) => res.data) : null
  const { data, error } = useSWR(`/users/${id}`, fetcher)
  return { user: data, error }
}

export const useCreateUser = () => {
  return async (user: User) => {
    await axios.post(`/account/sign_up`, user)
    await mutate(`/users/`)
  }
}

export const useUpdateUser = () => {
  return async (id: number, skill: User) => {
    await axios.put(`/users/${id}`, user)
    await mutate(`/users/${id}`)
  }
}

export const useMe = () => {
  const getMe = async () => {
    const fetcher = () => customAxios.get('/users/me').then((res) => res.data)
    const { data, error } = useSWR('/users', fetcher)
    console.log("useMe() data:" + JSON.stringify(data))
    return { user: data, error }
  }
}
