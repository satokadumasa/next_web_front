import React from 'react'
import Layout from '@/components/Layout'
import Header from '@/components/Haeder'
import BoardForm from '@/components/forms/BoardForm'
import LinkButton from '@/components/LinkButton'
import { useAuth } from '@/lib/next-hook-auth'
import { useToasts } from 'react-toast-notifications'
import { useRouter } from 'next/router'
import { useUpdateBoard, useBoard } from '@/lib/client'

const Edit: React.FC = () => {
  const { currentUser, loading } = useAuth(true)
  const { addToast } = useToasts()
  const router = useRouter()
  const { board, error } = useBoard(Number(router.query.id))
  const update = useUpdateBoard()

  const onSubmit = async (board) => {
    try {
      update(Number(router.query.id), board)
      addToast('Saved Successfully', { appearance: 'success' })
      router.push('/boards')
    } catch (e) {
      addToast(e.message, { appearance: 'error' })
    }
  }

  const onError = () => {
    addToast('Please reconfirm your input', { appearance: 'error' })
  }

  return (
    <Layout signedin={!!currentUser} loading={loading} error={error}>
      <Header title="Edit Board" />
      <div className="flex flex-row justify-end mb-4">
        <LinkButton href="/boards">Back</LinkButton>
      </div>
      <BoardForm onSubmit={onSubmit} board={board} currentUser={currentUser} onError={onError} />
    </Layout>
  )
}

export default Edit
