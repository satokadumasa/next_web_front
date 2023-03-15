// import React from 'react'
import { NextPage } from 'next'
import Layout from '@/components/Layout'
import Header from '@/components/Haeder'
import BoardForm from '@/components/forms/BoardForm'
import LinkButton from '@/components/LinkButton'
import { useAuth } from '@/lib/next-hook-auth'
import { useToasts } from 'react-toast-notifications'
import { useRouter } from 'next/router'
import { Board, useUpdateBoard, useBoard } from '@/lib/client'

export async function getServerSideProps(context) {
  const board_id = context.query.board_id ? context.query.board_id : 1
  const url = process.env.NEXT_PUBLIC_API_SERVER + "/boards/" + board_id
  const res = await fetch(url)
  const data = await res.json()

  if (!data) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      board: data.board,
    },
  }
}

const Edit: NextPage<{board: Board,loading: boolean}> = ({
  board
}) => {
  const { currentUser, loading } = useAuth(true)
  const { addToast } = useToasts()
  const router = useRouter()
  const update = useUpdateBoard()

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

  return (
    <Layout signedin={!!currentUser} loading={loading}>
      <Header title="Edit Board" />
      <BoardForm onSubmit={onSubmit} board={board} currentUser={currentUser} onError={onError} />
    </Layout>
  )
}

export default Edit
