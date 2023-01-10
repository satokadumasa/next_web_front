import React, { useEffect } from 'react'
import Layout from '@/components/Layout'
import SignupForm from '@/components/forms/SignupForm'
import { useAuth, useSignup } from '@/lib/next-hook-auth'
import { useRouter } from 'next/router'

const Signup: React.FC = () => {
  const router = useRouter()
  const { currentUser, loading } = useAuth()
  const signup = useSignup()
  console.log("Signup CH-01")
  useEffect(() => {
    console.log("Signup CH-02")
    currentUser && router.push('/')
  })
  console.log("Signup CH-03")

  return (
    <Layout signedin={!!currentUser} loading={loading || !!currentUser}>
      <div className="flex justify-center px-4 sm:px-6 lg:px-8 pt-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <img
              className="mx-auto h-12 w-auto"
              src="/images/logo.jpg"
              alt="September-Rain"
            />
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Sign in to your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600"></p>
          </div>
          <SignupForm signup={signup} />
        </div>
      </div>
    </Layout>
  )
}

export default Signup
