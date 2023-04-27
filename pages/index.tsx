import React from 'react'
import Layout from '@/components/Layout'
import Link from 'next/link'
import { useAuth } from '@/lib/next-hook-auth'

const Home: React.FC = () => {
  const { currentUser } = useAuth()
  console.log("currentUser:" + currentUser)

  return (
    <Layout signedin={!!currentUser}>
      <div className="flex flex-col md:flex-row content">
        <h1>
          Welcome to September-Rain.
        </h1>
      </div>
    </Layout>
  )
}

export default Home
