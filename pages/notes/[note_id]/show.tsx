import { NextPage } from 'next'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import Header from '@/components/Haeder'

import LinkButton from '@/components/LinkButton'
import { useAuth } from '@/lib/next-hook-auth'
import { useToasts } from 'react-toast-notifications'
import { Page, Note, useNote, useUpdateNote, useDeleteNote, useCreatePage} from '@/lib/client'
import { useReplaceLnToBr } from '@/lib/util/StringUtil'

import React, { useState, useEffect } from 'react'
import Modal from 'react-modal'
import PageForm from '@/components/forms/PageForm'


export async function getServerSideProps(context) {
  const note_id = context.query.note_id ? context.query.note_id : 1
  const url = process.env.NEXT_PUBLIC_API_SERVER + "/notes/" + note_id
  const res = await fetch(url)
  const data = await res.json()
  const nl2br = require('react-nl2br')
  if (!data) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
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
  const { currentUser, loading } = useAuth()
  const { addToast } = useToasts()
  const router = useRouter()
  const create = useCreatePage()
  const update = useUpdateNote()
  const deleteNote = useDeleteNote()
  const nl2br = require('react-nl2br')
  const [tag, setTag] = useState('')
  const [isShow, setShow] = useState(false)
  const [modalIsOpen, setIsOpen] = useState<boolean>(false)

  let subtitle: HTMLHeadingElement | null
  const onSubmit = async (page) => {
    try {
      create(page)
      addToast('Saved Successfully', { appearance: 'success' })
      closeModal()
      router.push('/notes/' + router.query.note_id + '/show')
    } catch (e) {
      addToast(e.message, { appearance: 'error' })
    }
  }

  const onError = () => {
    addToast('Please reconfirm your input', { appearance: 'error' })
  }

  const onDelete = async () => {
    console.log("onDelete()")
    await deleteNote(Number(router.query.note_id))
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

  useEffect(() => {
    console.log("useEffect user " + JSON.stringify(sessionStorage.user))
    const user = JSON.parse(sessionStorage.user)
    const show = note.user.id == user.id ? true : false
    setShow(show)
  }, [tag])

  return (
    <Layout signedin={!!currentUser} loading={loading}>
      <Header title={note.title} />
      <div className="py-1">
          Author[{ note.user.nickname}]
      </div>
      <div className="container z-1 py-1">
        <div className="flex flex-col items-center">
          <div className="flex h-full w-full text-left text-xs break-words new-line">
            { nl2br(note.overview) }
          </div>
          <div className="flex h-full w-full text-left text-xs break-words new-line detail">
            { nl2br(note.detail) }
          </div>
        </div>
        {pages?.map((page) => (
          <div
            key={page.id}
            className="flex flex-wrap w-full flex-row z-1 py-1"
          >
            <div className="pl-1 flex-col">
                <a  href={`/notes/${note.id}/pages/${page.id}/show`} rel="noreferrer">
                  「{ page.title }」<br></br>
                </a>
              { convDate(page.created_at)}
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
        <PageForm onSubmit={onSubmit} note={note} page={page} onError={onError} />
        <button onClick={closeModal}>close</button>
      </Modal>

      <div className="flex w-full w-1/1 pl-1 flex-row confirmBtn">
        <div className="flex flex-row text-right">
            {(currentUser && isShow) && (
              <div className="flex m-1">
                <LinkButton href={`/notes/${note.id}/edit`}>
                  Edit
                </LinkButton>
              </div>
            )}
            {(currentUser && isShow) && (
              <button
                className="text-sm px-4 py-1 h-10 m-1 rounded bg-black text-white text-right"
                onClick={onDelete}
              >
                Delete
              </button>
            )}
            {(currentUser && isShow) && (
              <div className="flex m-1">
                <button 
                  className="text-sm px-4 py-1 h-10 m-1 rounded bg-black text-white text-right"
                  onClick={openModal}
                >
                  Page
                </button>
              </div>
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
