import React from 'react'
import Select from "react-select";
import { useForm } from 'react-hook-form'
import { useToasts } from 'react-toast-notifications'
import { SignupParams } from '@/lib/next-hook-auth'
import { Role, useRoles } from '@/lib/client'
import SelectBox from '@/components/SelectBox'

type Props = {
  signup: (SignupParams) => void
  roles: Role[]
}

const SignupForm: React.FC<Props> = ({ signup, roles }) => {
  const { register, handleSubmit, errors } = useForm()
  const { addToast } = useToasts()

  const onSubmit = async (params: SignupParams) => {
    try {
      console.log("SigninForm.onSubmit() params:" + JSON.stringify(params))
      await signup(params)
      addToast('Sign up Successfully', { appearance: 'success' })
    } catch (e) {
      console.log("SigninForm.onSubmit() false")
      addToast('Please reconfirm your input!', { appearance: 'error' })
    }
  }
  const onError = () => {
    addToast('Please reconfirm your input', { appearance: 'error' })
  }

  return (
    <form
      className="mt-8 space-y-6"
      action="#"
      onSubmit={handleSubmit(onSubmit, onError)}
    >
      <input type="hidden" name="remember" value="true" />
      <div className="rounded-md shadow-sm -space-y-px">
        <div>
          <label htmlFor="email-address" className="sr-only">
            Email Address
          </label>
          <input
            id="email-address"
            name="email"
            type="email"
            autoComplete="email"
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Email address"
            ref={register({ required: true })}
          />
          {errors.emailRequired && <span>This field is required</span>}
        </div>
        <div>
          <label htmlFor="password" className="sr-only">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Password"
            ref={register({ required: true })}
          />
          {errors.passwordRequired && <span>This field is required</span>}
        </div>
        <div>
          <label htmlFor="password_confirmation" className="sr-only">
            Password
          </label>
          <input
            id="password"
            name="password_confirmation"
            type="password"
            autoComplete="current-password"
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Password"
            ref={register({ required: true })}
          />
          {errors.passwordRequired && <span>This field is required</span>}
        </div>
        <div>
          <label htmlFor="nickname" className="sr-only">
            Nickname
          </label>
          <input
            id="nickname"
            name="nickname"
            type="text"
            autoComplete="nickname"
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Nickname"
            ref={register({ required: true })}
          />
        </div>
        <div>
          <label htmlFor="role_id" className="sr-only">
            User Role
          </label>
          <SelectBox data={roles} name="role_id" />
        </div>
      </div>

      <div>
        <button
          type="submit"
          className="w-full py-2 px-6 rounded-md text-white bg-gray-800 hover:bg-gray-900 focus:ring-2"
        >
          Update
        </button>
      </div>
    </form>
  )
}

export default SignupForm
