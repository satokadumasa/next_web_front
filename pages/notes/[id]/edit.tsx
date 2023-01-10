import React from 'react'
import Layout from '@/components/Layout'
import Header from '@/components/Haeder'
import NoteForm from '@/components/forms/NoteForm'
import LinkButton from '@/components/LinkButton'
import { useAuth } from '@/lib/next-hook-auth'
import { useToasts } from 'react-toast-notifications'
import { useRouter } from 'next/router'
import { useUpdateNote, useNote } from '@/lib/client'

const Edit: React.FC = () => {
  const { currentUser, loading } = useAuth(true)
  const { addToast } = useToasts()
  const router = useRouter()
  const { note, error } = useNote(Number(router.query.id))
  const update = useUpdateNote()

  const onSubmit = async (note) => {
    try {
      update(Number(router.query.id), note)
      addToast('Saved Successfully', { appearance: 'success' })
      router.push('/notes')
    } catch (e) {
      addToast(e.message, { appearance: 'error' })
    }
  }

  const onError = () => {
    addToast('Please reconfirm your input', { appearance: 'error' })
  }

  return (
    <Layout signedin={!!currentUser} loading={loading} error={error}>
      <Header title="Edit Note" />
      <NoteForm onSubmit={onSubmit} note={note} currentUser={currentUser} onError={onError} />
    </Layout>
  )
}

export default Edit
