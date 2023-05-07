// import React from 'react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import Link from 'next/link'
import { useAuth } from '@/lib/next-hook-auth'
import axios from '@/lib/axios'
import { Board, Note } from '@/lib/client'

export async function getServerSideProps(context) {
  const url = process.env.NEXT_PUBLIC_API_SERVER + "/home/index"
  const res = await fetch(url)
  const data = await res.json()

  if (!data) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      boards: data.boards,
      notes: data.notes
    },
  }
}

const Home: NextPage<{ boards: Board[], notes: Note[] }> = ({
  boards,
  notes
}) => {
  const { currentUser } = useAuth()
  const router = useRouter()

  return (
    <Layout signedin={!!currentUser}>
      <div className="flex flex-col content">
        <div className="text-xl">
          Welcome to September-Rain.
        </div>
        <br></br>
        <div className="">
          <div className="text-lg">
            <h2>ボード更新情報</h2>
          </div>
          <br></br>
          {boards && boards?.map((board) => (
              <div
                key={board.id}
                className="flex flex-wrap w-full flex-row z-100"
              >
                <div className="flex pl-1 text-sm">
                  <a  href={`/boards/${board.id}/show`} rel="noreferrer">
                    {board.title}
                  </a>
                </div>
              </div>
            ))}
        </div>
        <br></br>
        <div className="">
          <div className="text-lg">
            Note更新情報
          </div>
          <br></br>
          <div className="">
            {notes && notes?.map((note) => (
                <div
                  key={note.id}
                  className="flex flex-wrap w-full flex-row z-100"
                >
                  <div className="flex pl-1 text-sm">
                    <a  href={`/notes/${note.id}/show`} rel="noreferrer">
                      {note.title}
                    </a>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Home
