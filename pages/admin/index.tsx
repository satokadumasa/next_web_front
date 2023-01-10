import React from 'react'
import Layout from '@/components/Layout'
import Link from 'next/link'
import { useAuth } from '@/lib/next-hook-auth'

const Home: React.FC = () => {
  const { currentUser } = useAuth()
  console.log("currentUser:" + currentUser)

  return (
    <Layout signedin={!!currentUser}>
      <div className="flex flex-col md:flex-row justify-center items-center">
        <div>
          <h1 className="text-6xl leading-tight text-gray-900 py-4 my-4 border-b-2">
            Welcome to September-Rain.
          </h1>
          <span className="text-2xl block justify-center mb-8">
            Check out my profile!
          </span>
          <div className="flex justify-center">
            <Link href="/admin/users/new">
              <button className="bg-accent hover:bg-accent-dark text-white text-2xl py-2 px-4 w-1/2 tracking-widest rounded block">
                Signup
              </button>
            </Link>
          </div>
        </div>
        <div>
          <img src="/images/logo.jpg" />
        </div>
      </div>
    </Layout>
  )
}

export default Home
