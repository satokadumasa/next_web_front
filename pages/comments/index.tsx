// import React from 'react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import Header from '@/components/Haeder'
import {Pagination} from '@/components/Pagination'
import LinkButton from '@/components/LinkButton'
import { useAuth } from '@/lib/next-hook-auth'
import { Board } from '@/lib/client'

export async function getServerSideProps(context) {
  const page = context.query.page ? context.query.page : 1
  const per = context.query.per ? context.query.per : 10
  const url = process.env.NEXT_PUBLIC_API_SERVER + "/boards/?per=20&page=" + context.query.page
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
      count: data.count,
      page: page,
      per: per
    },
  }
}

const Index: NextPage<{ boards: Board[], count: integer, page: integer, per: integer }> = ({
  boards,
  count,
  page,
  per
}) => {
  const { currentUser } = useAuth()
  const router = useRouter()
  console.log("count:" + count)

  return (
    <Layout signedin={!!currentUser} loading={!boards} >
      <Header title="Boards" />
      {currentUser && (
        <div className="flex flex-row justify-end z-100">
          <LinkButton href="/boards/new">New</LinkButton>
        </div>
      )}
      <div className="container h-auto z-10">
        <div className="flex flex-wrap z-10">
          {boards?.map((board) => (
            <div
              key={board.id}
              className="flex flex-wrap w-full flex-row z-100"
            >
              <div className="flex w-3/4 pl-1 flex-col">
                <a  href={`/boards/${board.id}/show`} rel="noreferrer">
                  {board.title}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Pagination totalCount={count} page={page} per={per} url='boards' />
    </Layout>
  )
}

export default Index
