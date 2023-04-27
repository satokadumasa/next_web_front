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
  const page_id = context.query.page_id ? context.query.page_id : 1
  const note_id = context.query.note_id ? context.query.note_id : 1
  const url = process.env.NEXT_PUBLIC_API_SERVER + "/pages/" + page_id
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
      page: data,
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

const Show: NextPage<{ page: Page}> = ({
  page
}) => {
  const { currentUser, loading } = useAuth(true)
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
    console.log("useEffect user " + sessionStorage.user)
    console.log("useEffect page " + JSON.stringify(page))
    const user = JSON.parse(sessionStorage.user)
    const show = page.user.id == user.id ? true : false
    setShow(show)
  }, [tag])

  return (
    <Layout signedin={!!currentUser} loading={loading}>
      <Header title={page.title} />
      <div className="container z-1">
        <div className="flex flex-col items-center">
          <div className="flex h-full w-full flex-row text-left text-xs break-words new-line detail">
            { nl2br(page.detail) }
          </div>
        </div>
        {/* {pages?.map((page) => (
          <div
            key={page.id}
            className="flex flex-wrap w-full flex-row z-1"
          >
            <div className="flex w-3/4 pl-1 flex-col title">
                <a  href={`/page/${page.id}/show`} rel="noreferrer">
                  「{ page.title }」<br></br>
                </a>
              { convDate(page.created_at)}
            </div>
          </div>
        ))} */}
        <div className="content-footer"></div>
      </div>

      <div className="flex w-full w-1/1 pl-1 flex-row confirmBtn">
        <div className="flex flex-row text-right">
            {(currentUser && isShow) && (
              <div className="flex m-1">
                <LinkButton href={`/notes/${router.query.note_id}/pages/${page.id}/edit`}>
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
              <LinkButton href={`/notes/${router.query.note_id}/show`}>Back</LinkButton>
            </div>
          </div>
      </div>
    </Layout>
  )
}

export default Show
