// import React from 'react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import Header from '@/components/Haeder'
import {Pagination} from '@/components/Pagination'
import LinkButton from '@/components/LinkButton'
import { useAuth } from '@/lib/next-hook-auth'
import { Note } from '@/lib/client'

export async function getServerSideProps(context) {
  const page = context.query.page ? context.query.page : 1
  // const per = context.query.per ? context.query.per : 20
  const per = 20
  const url = process.env.NEXT_PUBLIC_API_SERVER + "/notes/?per=" + per + "&page=" + page
  const res = await fetch(url)
  const data = await res.json()

  if (!data) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      notes: data.notes,
      count: data.count,
      page: page
    },
  }
}

const Index: NextPage<{ notes: Note[], count: integer, page: integer, per: integer }> = ({
  notes,
  count,
  page,
  per
}) => {
  const { currentUser } = useAuth()
  const router = useRouter()
  console.log("count:" + count)

  return (
    <Layout signedin={!!currentUser} loading={!notes} >
      <Header title="Notes" />
      {currentUser && (
        <div className="flex flex-row justify-end z-100 confirmBtn">
          <LinkButton href="/notes/new">New</LinkButton>
        </div>
      )}
      <div className="container h-auto z-10">
        <div className="flex flex-wrap z-10">
          {notes?.map((note) => (
            <div
              key={note.id}
              className="flex flex-wrap w-full flex-row z-100"
            >
              <div className="flex w-3/4 pl-1 flex-col">
                <a  href={`/notes/${note.id}/show`} rel="noreferrer">
                  {note.title}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Pagination totalCount={count} page={page} per={20} url='notes' />
    </Layout>
  )
}

export default Index
