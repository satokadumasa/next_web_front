// import React from 'react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import Header from '@/components/Haeder'

import LinkButton from '@/components/LinkButton'
import { useAuth } from '@/lib/next-hook-auth'
import { useToasts } from 'react-toast-notifications'
import { User, Board, BoardComment, useBoard, useDeleteBoard, useCreateBoardComment, useMe } from '@/lib/client'
import { useReplaceLnToBr } from '@/lib/util/StringUtil'

import React, { useState, useEffect } from 'react'
import Modal from 'react-modal'
import BoardCommentForm from '@/components/forms/BoardCommentForm'
import customAxios from '@/lib/customAxios'

// import { parseISO, format } from 'date-fns'
import ja from 'date-fns/locale/ja'

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

  return {
    props: {
      board: data.board,
      board_comments: data.board_comments,
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

const Show: NextPage<{board: Board,board_comment: BoardCommen, board_comments: BoardCommen[],loading: boolean}> = ({
  board,
  board_comment,
  board_comments
}) => {
  const { currentUser, loading} = useAuth(true)
  const { addToast } = useToasts()
  const router = useRouter()
  const create = useCreateBoardComment()
  const deleteBoard = useDeleteBoard()
  const nl2br = require('react-nl2br')
  const [tag, setTag] = useState('');
  const [initialLoad, setInitialLoad] = useState(true);

  const onSubmit = async (board_comment) => {
    try {
      create(board_comment)
      addToast('Saved Successfully', { appearance: 'success' })
      closeModal()
      console.log("boards::show::onSubmit() :" + router.query.board_id)
      router.push('/boards/' + router.query.board_id + '/show')
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

  function convDate(datetime) {
    let arr = datetime.split('T')
    let date = arr[0]
    let arr2 = arr[1].split('.')
    let time = arr2[0]
    datetime = date + " " + time
    return datetime
  }

  useEffect(() => {
    const user = sessionStorage.getItem('user')
    console.log("User:" + user)
  }, [tag])
  return (
    <Layout signedin={!!currentUser} loading={loading}>
      <div className="z-1">
        <Header title={board.title} />
        <div>
        Author[{ board.user.nickname}]
        </div>
        <div className="z-10">
          <div className="flex flex-col items-center">
            <div className="flex h-full w-full flex-row h-full text-left break-words new-line detail">
              { nl2br(board.detail) }
            </div>
          </div>
        </div>
        {board_comments?.map((comment) => (
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
        <h2 ref={(_subtitle) => (subtitle = _subtitle)}>{board.title}</h2>
        <button onClick={closeModal}>close</button>
        <BoardCommentForm onSubmit={onSubmit} board={board} board_comment={board_comment} currentUser={currentUser} onError={onError} />
      </Modal>

      <div className="flex w-full w-1/1 pl-1 flex-row confirmBtn">
        <div className="flex w-full flex-row text-right">
          {currentUser && (
            <button
              className="text-sm px-4 py-1 h-10 m-1 rounded bg-black text-white text-right"
              onClick={onDelete}
            >
              Delete
            </button>
          )}
          {currentUser && (
            <div className="flex w-full flex-row text-right">
              <LinkButton href={`/boards/${board.id}/edit`}>
                Edit
              </LinkButton>
            </div>
          )}
          <div className="flex w-full flex-row text-right">
            <button 
              className="text-sm px-4 py-1 h-10 m-1 rounded bg-black text-white text-right"
              onClick={openModal}
            >
              Comment
            </button>
          </div>
          <div className="flex w-full flex-row text-right">
            <LinkButton href="/boards">Back</LinkButton>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Show
