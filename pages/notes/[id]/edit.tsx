import { NextPage } from 'next'
import Layout from '@/components/Layout'
import Header from '@/components/Haeder'
import NoteForm from '@/components/forms/NoteForm'
import LinkButton from '@/components/LinkButton'
import { useAuth } from '@/lib/next-hook-auth'
import { useToasts } from 'react-toast-notifications'
import { useRouter } from 'next/router'
import { Note, useUpdateNote, useNote } from '@/lib/client'

export async function getServerSideProps(context) {
  const note_id = context.query.id ? context.query.id : 1
  const url = process.env.NEXT_PUBLIC_API_SERVER + "/notes/" + note_id
  const res = await fetch(url)
  const data = await res.json()
  if (!data) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      note: data.note,
    },
  }
}

const Edit: NextPage<{ note: Note }> = ({
  note,
}) => {
  const { currentUser, loading } = useAuth(true)
  const { addToast } = useToasts()
  const router = useRouter()
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
    <Layout signedin={!!currentUser} loading={loading} >
      <Header title="Edit Note" />
      <NoteForm onSubmit={onSubmit} note={note} onError={onError} />
    </Layout>
  )
}

export default Edit
