import React, { useEffect } from 'react'
import Layout from '@/components/Layout'
import Header from '@/components/Haeder'
import SignupForm from '@/components/forms/SignupForm'
import LinkButton from '@/components/LinkButton'
import { useAuth, useSignup } from '@/lib/next-hook-auth'
import { useToasts } from 'react-toast-notifications'
import { useRouter } from 'next/router'
import { useCreateUser, useRoles, Role } from '@/lib/client'

export const getStaticProps = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER}/roles`)
  const data = await res.json()

  if (!data) {
    return {
      notFound: true,
    }
  }

  return {
    props: { roles: data, generatedAt: new Date().toLocaleString('ja') },
    revalidate: 10,
  }
}

const New: NextPage<{ roles: Role[]; generatedAt: string }> = ({
  roles,
  generatedAt,
}) => {
  const router = useRouter()
  const { currentUser, loading } = useAuth()
  // const roles = useRoles()
  const signup = useSignup()
  console.log("Signup CH-01")
  useEffect(() => {
    console.log("Signup CH-02")
    !currentUser && router.push('/')
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
          <SignupForm signup={signup} roles={roles} />
        </div>
      </div>
    </Layout>
  )
}

export default New
