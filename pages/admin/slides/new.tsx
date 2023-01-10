import React from 'react'
import Layout from '@/components/Layout'
import Header from '@/components/Haeder'
import SlidesForm from '@/components/forms/SlideForm'
import LinkButton from '@components/LinkButton'
import { useAuth } from '@/lib/next-hook-auth'
import { useToasts } from 'react-toast-notifications'
import { useRouter } from 'next/router'
import { useCreateSlide } from '@/lib/client'

const New: React.FC = () => {
  const { currentUser, loading } = useAuth(true)
  const { addToast } = useToasts()
  const router = useRouter()
  const create = useCreateSlide()

  const onSubmit = async (slide) => {
    console.log("Signup CH-01")
    try {
      console.log("Signup CH-03")
      create(slide)
      addToast('Saved Successfully', { appearance: 'success' })
      router.push('/slides')
    } catch (e) {
      console.log("Signup CH-03")
      addToast(e.message, { appearance: 'error' })
    }
  }

  const onError = () => {
    addToast('Please reconfirm your input', { appearance: 'error' })
  }

  return (
    <Layout signedin={!!currentUser} loading={loading}>
      <Header title="New Slide" />
      <div className="flex flex-row justify-end mb-4">
        <LinkButton href="/slides">Back</LinkButton>
      </div>
      <SlidesForm onSubmit={onSubmit} onError={onError} />
    </Layout>
  )
}

export default New
