// import React from 'react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import Header from '@/components/Haeder'

import LinkButton from '@/components/LinkButton'
import { useAuth } from '@/lib/next-hook-auth'
import { useToasts } from 'react-toast-notifications'
import { Note, useNote, useUpdateNote, useDeleteNote } from '@/lib/client'
import { useReplaceLnToBr } from '@/lib/util/StringUtil'
export async function getServerSideProps(context) {
  const note_id = context.query.id ? context.query.id : 1
  const url = process.env.NEXT_PUBLIC_API_SERVER + "/notes/" + note_id
  const res = await fetch(url)
  const data = await res.json()
  const nl2br = require('react-nl2br')
  if (!data) {
    return {
      notFound: true,
    }
  }
  console.log("----------------------")
  console.log(data)
  console.log("----------------------")
  return {
    props: {
      note: data,
    },
  }
}


const Show: NextPage<{ note: Note }> = ({
  note
}) => {
  const { currentUser, loading } = useAuth(true)
  const { addToast } = useToasts()
  const router = useRouter()
  const update = useUpdateNote()
  const deleteNote = useDeleteNote()
  const nl2br = require('react-nl2br')
  console.log("-------------------")
  console.log(note)
  console.log("-------------------")
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

  const onDelete = async () => {
    console.log("onDelete()")
    await deleteNote(Number(router.query.id))
    addToast('Sign out Successfully', { appearance: 'success' })
    router.push('/notes')
  }

  return (
    <Layout signedin={!!currentUser} loading={loading}>
      <Header title={note.title} />
      <div className="container z-10">
        <div className="flex flex-col items-center">
          <div className="flex h-full w-full flex-row h-full text-left break-words new-line">
            { nl2br(note.overview) }
          </div>
          <div className="flex h-full w-full flex-row h-full text-left break-words new-line detail">
            { nl2br(note.detail) }
          </div>
        </div>
      </div>
      <div className="flex w-full w-1/1 pl-1 flex-row confirmBtn">
        <div className="flex w-full flex-row text-right">
            {currentUser && (
              <div className="flex m-1">
                <LinkButton href={`/notes/${note.id}/edit`}>
                  Edit
                </LinkButton>
              </div>
            )}
            {currentUser && (
              <button
                className="text-sm px-4 py-1 h-10 m-1 rounded bg-black text-white text-right"
                onClick={onDelete}
              >
                Delete
              </button>
            )}
            <div className="flex m-1">
              <LinkButton href="/notes">Back</LinkButton>
            </div>
          </div>
      </div>
    </Layout>
  )
}

export default Show
