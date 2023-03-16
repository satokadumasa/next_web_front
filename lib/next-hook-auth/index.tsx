import React, { createContext, useContext, useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from '@/lib/axios'
import useSWR, { mutate } from 'swr'
import customAxios from '@/lib/customAxios'
import { atom } from 'recoil';

export type Props = {
  currentUserPath: string
  signinPath: string
  signoutPath: string
  signupPath: string
  redirectPath: string
  resourceName: string
}

export type User = {
	id: number
	provider:string
	uid: string
	allow_password_change: boolean
	name: string
	nickname: string
	image: string
	email: string
	created_at: string
	updated_at: string
}

export type AuthContext = {
  config: Props
}

export const AuthContext = createContext<AuthContext>({
  config: {
    currentUserPath: '',
    signinPath: '',
    signoutPath: '',
    signupPath: '',
    redirectPath: '',
    resourceName: 'user',
  },
})
                                                                                                                                          
export const AuthProvider: React.FC<Props> = (props) => {
  console.log("AuthProvider()")
  const context: AuthContext = {
    config: {
      currentUserPath: props.currentUserPath,
      signinPath: props.signinPath,
      signoutPath: props.signoutPath,
      signupPath: props.signupPath,
      redirectPath: props.redirectPath,
      resourceName: props.resourceName,
    },
  }

  return (
    <AuthContext.Provider value={context}>
      {props.children}
    </AuthContext.Provider>
  )
}

export type SigninParams = {
  email: string
  password: string
}

export const useSignin = () => {
  console.log("useSignin()")
  const context = useContext(AuthContext)
  const router = useRouter()
  return async (params: SigninParams) => {
    const signinParams = {}
    signinParams[context.config.resourceName] = params
    await axios.post(context.config.signinPath, params).then((res) => {
      console.log("access-token:" + res.headers['access-token'])
      localStorage.setItem('access-token', res.headers['access-token'])
      localStorage.setItem('client', res.headers['client'])
      localStorage.setItem('uid', res.headers['uid'])
      localStorage.setItem('next-hook-auth', 'signin')
    }).catch(err => {
      console.log('err:', err)
      return;
    });
    await mutate(context.config.currentUserPath)
    router.push(context.config.redirectPath)
  }
}

export const useSignout = () => {
  console.log(">>>>useSignout()")
  const context = useContext(AuthContext)
  return async () => {
    console.log(">>>>useSignout() (2)")

    await customAxios.get(context.config.currentUserPath)
    await customAxios.delete(context.config.signoutPath)
    localStorage.setItem('next-hook-auth', 'signout')
    localStorage.removeItem('access-token')
    localStorage.removeItem('client')
    localStorage.removeItem('uid')
    await mutate(context.config.currentUserPath)
  }
}

export type SignupParams = {
  email: string
  password: string
  password_confirmation: string
  role_id: number
}

export const useSignup = () => {
  console.log("useSignup()")
  const context = useContext(AuthContext)
  const router = useRouter()
  return async (params: SignupParams) => {
    console.log("useSignup() CH-01")
    const signupParams = {}
    signupParams[context.config.resourceName] = params
    await axios.post(context.config.signupPath, params).then((res) => {
      console.log("Signup successed.")
    }).catch(err => {
      console.log('err:', err)
      return;
    });
    await mutate(context.config.currentUserPath)
    router.push(context.config.redirectPath)
  }
}

export const useAuth = (redirect = false) => {
  console.log("useAuth()")
  const context = useContext(AuthContext)
  let status = ""
  const uid = ""
  let user = {}
  const fetcher = () => {
    if (localStorage.getItem('access-token') == 'undefined') {
      console.log("useAuth() fails")
      throw Error('Unauthorized')
    }
    return customAxios.get(context.config.currentUserPath).then((res) => {
      localStorage.setItem(
        'next-hook-auth',
        res.status === 401 ? 'signout' : 'signin'
      )
      status = res.status
      user = res.data
      sessionStorage.setItem(
        'user',
        res.status === 401 ? null : JSON.stringify(user)
      )
      console.log("useAuth() CH-02 user:" + JSON.stringify(user))
      return res.data
    })
  }
  const { data, error } = useSWR(context.config.currentUserPath, fetcher)
  const router = useRouter()

  useEffect(() => {
    if (error && redirect) {
      router.push(context.config.redirectPath)
    }
  }, [data, error])

  return {
    currentUser: !error,
    loading: (!error && !data) || (redirect && !data),
  }
}
