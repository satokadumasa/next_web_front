// import React from 'react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import Header from '@/components/Haeder'

import LinkButton from '@/components/LinkButton'
import { useAuth } from '@/lib/next-hook-auth'
import { useToasts } from 'react-toast-notifications'
import { Board, useBoard, useUpdateBoard, useDeleteBoard } from '@/lib/client'
import { useReplaceLnToBr } from '@/lib/util/StringUtil'

import React, { useState } from 'react'
import Modal from 'react-modal'

export async function getServerSideProps(context) {
  const board_id = context.query.board_id ? context.query.board_id : 1
  const url = process.env.NEXT_PUBLIC_API_SERVER + "/boards/" + board_id
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
      board: data,
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
    transform: 'translate(-50%, -50%)',
  },
}

const Show: NextPage<{ board: Board }> = ({
  board
}) => {
  const { currentUser, loading } = useAuth(true)
  const { addToast } = useToasts()
  const router = useRouter()
  const update = useUpdateBoard()
  const deleteBoard = useDeleteBoard()
  const nl2br = require('react-nl2br')
  console.log("----------------------")
  console.log("board" + JSON.stringify(board))
  console.log("currentUser" + JSON.stringify(currentUser))
  console.log("loading" + JSON.stringify(loading))
  console.log("----------------------")
  const onSubmit = async (board) => {
    try {
      update(Number(router.query.board_id), board)
      addToast('Saved Successfully', { appearance: 'success' })
      router.push('/boards')
    } catch (e) {
      addToast(e.message, { appearance: 'error' })
    }
  }

  const onError = () => {
    addToast('Please reconfirm your input', { appearance: 'error' })
  }

  const onDelete = async () => {
    console.log("onDelete()")
    await deleteBoard(Number(router.query.board_id))
    addToast('Sign out Successfully', { appearance: 'success' })
    router.push('/boards')
  }

  let subtitle: HTMLHeadingElement | null
  const [modalIsOpen, setIsOpen] = useState<boolean>(false)

  function openModal() {
    setIsOpen(true)
  }

  function afterOpenModal() {
    if (subtitle) subtitle.style.color = '#f00'
  }

  function closeModal() {
    setIsOpen(false)
  }

  return (
    <Layout signedin={!!currentUser} loading={loading}>
      <Header title={board.title} />
      <div className="container z-10">
        <div className="flex flex-col items-center">
          <div className="flex h-full w-full flex-row h-full text-left break-words new-line detail">
            { nl2br(board.detail) }
          </div>
        </div>
      </div>
      <Modal
        contentLabel="Example Modal"
        isOpen={modalIsOpen}
        style={customStyles}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
      >
        <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Hello</h2>
        <button onClick={closeModal}>close</button>
        <div>I am a modal</div>
        <form>
          <input />
          <button>tab navigation</button>
          <button>stays</button>
          <button>inside</button>
          <button>the modal</button>
        </form>
      </Modal>
      <div className="flex w-full w-1/1 pl-1 flex-row confirmBtn">
        <div className="flex w-full flex-row text-right">
            <div className="flex m-1">
              <button 
                className="text-sm px-4 py-1 h-10 m-1 rounded bg-black text-white text-right"
                onClick={openModal}
              >
                Comment
              </button>
            </div>
            {currentUser && (
              <div className="flex m-1">
                <LinkButton href={`/boards/${board.id}/edit`}>
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
              <LinkButton href="/boards">Back</LinkButton>
            </div>
          </div>
      </div>
    </Layout>
  )
}

export default Show
