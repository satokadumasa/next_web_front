// import React from 'react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import Header from '@/components/Haeder'

import LinkButton from '@/components/LinkButton'
import { useAuth } from '@/lib/next-hook-auth'
import { useToasts } from 'react-toast-notifications'
import { Note, useNote, useUpdateNote, useDeleteNote, useCreatePage} from '@/lib/client'
import { useReplaceLnToBr } from '@/lib/util/StringUtil'

import React, { useState } from 'react'
import Modal from 'react-modal'
import PageForm from '@/components/forms/PageForm'


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
      // note: data,
      note: data.note,
      pages: data.pages,
    },
  }
}

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    width: '90%',
    height: '80%',
    transform: 'translate(-50%, -50%)',
  },
}

const Show: NextPage<{ note: Note, page: Page, pages: Page[] }> = ({
  note,
  page,
  pages
}) => {
  const { currentUser, loading } = useAuth(true)
  const { addToast } = useToasts()
  const router = useRouter()
  const create = useCreatePage()
  const update = useUpdateNote()
  const deleteNote = useDeleteNote()
  const nl2br = require('react-nl2br')
  const [modalIsOpen, setIsOpen] = useState<boolean>(false)
  console.log("-------------------")
  console.log(note)
  console.log("-------------------")
  let subtitle: HTMLHeadingElement | null
  const onSubmit = async (page) => {
    try {
      create(page)
      addToast('Saved Successfully', { appearance: 'success' })
      closeModal()
      router.push('/notes/' + router.query.id + '/show')
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

  function openModal() {
    setIsOpen(true)
  }

  function afterOpenModal() {
    if (subtitle) subtitle.style.color = '#f00'
  }

  function closeModal() {
    setIsOpen(false)
  }

  function convDate(datetime) {
    let arr = datetime.split('T')
    let date = arr[0]
    let arr2 = arr[1].split('.')
    let time = arr2[0]
    datetime = date + " " + time
    return datetime
  }

  return (
    <Layout signedin={!!currentUser} loading={loading}>
      <Header title={note.title} />
      <div className="container z-1">
        <div className="flex flex-col items-center">
          <div className="flex h-full w-full flex-row h-full text-left break-words new-line">
            { nl2br(note.overview) }
          </div>
          <div className="flex h-full w-full flex-row h-full text-left break-words new-line detail">
            { nl2br(note.detail) }
          </div>
        </div>
        {pages?.map((comment) => (
          <div
            key={comment.id}
            className="flex flex-wrap w-full flex-row z-1"
          >
            <div className="flex w-3/4 pl-1 flex-col title">
              「{ comment.title }」<br></br>
              Author[{ comment.user.nickname }]<br></br>
              { convDate(comment.created_at)}
            </div>
            <div className="flex h-full w-full flex-row h-full text-left break-words new-line detail">
              { nl2br(comment.detail) }
            </div>
          </div>
        ))}
        <div className="content-footer"></div>
      </div>

      <Modal
        contentLabel="コメント"
        isOpen={modalIsOpen}
        style={customStyles}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
      >
        <h2 ref={(_subtitle) => (subtitle = _subtitle)}>{note.title}</h2>
        <PageForm onSubmit={onSubmit} note={note} page={page} currentUser={currentUser} onError={onError} />
        <button onClick={closeModal}>close</button>
      </Modal>

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
              <button 
                className="text-sm px-4 py-1 h-10 m-1 rounded bg-black text-white text-right"
                onClick={openModal}
              >
                Page
              </button>
            </div>
            <div className="flex m-1">
              <LinkButton href="/notes">Back</LinkButton>
            </div>
          </div>
      </div>
    </Layout>
  )
}

export default Show
