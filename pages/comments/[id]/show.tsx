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
export async function getServerSideProps(context) {
  const board_id = context.query.id ? context.query.id : 1
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


const Show: NextPage<{ board: Board }> = ({
  board
}) => {
  const { currentUser, loading } = useAuth(true)
  const { addToast } = useToasts()
  const router = useRouter()
  const update = useUpdateBoard()
  const deleteBoard = useDeleteBoard()
  const nl2br = require('react-nl2br')
  console.log("-------------------")
  console.log(board)
  console.log("-------------------")
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

  const onDelete = async () => {
    console.log("onDelete()")
    await deleteBoard(Number(router.query.id))
    addToast('Sign out Successfully', { appearance: 'success' })
    router.push('/boards')
  }

  return (
    <Layout signedin={!!currentUser} loading={loading}>
      <Header title={board.title} />
      <div className="container z-10">
        <div className="flex flex-col items-center">
          <div className="flex w-full w-1/1 pl-1 flex-row">
            <div className="flex w-full flex-row text-right">
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
          <div className="flex h-full w-full flex-row h-full text-left">
            { nl2br(board.detail) }
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Show
