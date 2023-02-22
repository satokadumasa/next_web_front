import React, { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDropzone } from 'react-dropzone'
import { useRouter } from 'next/router'
import LinkButton from '@/components/LinkButton'
import axios from '@/lib/axios'

type Note = {
  id: number
  user_id: number
  title: string
  overview: string
  detil: string
  created_at: datetime
  updated_at: datetime
}

type Page = {
  id: number
  user_id: number
  note_id: number
  title: string
  overview: string
  detil: string
  created_at: datetime
  updated_at: datetime
}

type Props = {
  note?: Note
  page?: Page
  onSubmit: (page: Page) => void
  onError: () => void
}

const PageForm: React.FC<Props> = ({ note, page, onSubmit, onError }) => {
  const [imageKey, setImageKey] = useState(page?.key)
  const { register, handleSubmit, errors } = useForm()
  const router = useRouter()
  const onBack = async () => {
    console.log("onBack()")
    router.push('/pages')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)}>
      <input
        type="hidden"
        name="id"
        id="id"
        className="mt-2 mb-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-100 focus:ring-1"
        ref={register({ required: false })}
        defaultValue={page?.id}
      />
      <input
        type="hidden"
        name="note_id"
        id="note_id"
        className="mt-2 mb-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-100 focus:ring-1"
        ref={register({ required: false })}
        defaultValue={note?.id}
      />

      <label className="block mb-4">
        <span>タイトル</span>
        <input
          type="text"
          name="title"
          className="mt-2 mb-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-100 focus:ring-1"
          ref={register({ required: true })}
          defaultValue={page?.title}
        />
        <small className="mb-2 text-red-600 block">
          {errors.title && <span>This field is required</span>}
        </small>
      </label>
      <label className="block mb-4">
        <span>概略</span>
        <textarea
          name="overview"
          className="mt-2 mb-2 block w-full h-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-100 focus:ring-1"
          rows={5}
          ref={register({ required: true })}
          defaultValue={page?.overview}
          onChange={(e) => {
            console.log("detail length:" + e.target.value.length)
            if (e.target.value.length > 2000) {
              alert("1000文字を超えての入力はできません。")
              e.target.value = e.target.value.substring(0, 1000)
            }
          }}
        />
        <small className="mb-2 text-red-600 block">
          {errors.description && <span>This field is required</span>}
        </small>
      </label>
      <label className="block mb-4">
        <span>本文</span>
        <textarea
          name="detail"
          className="mt-2 mb-2 block w-full h-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-100 focus:ring-1"
          rows={5}
          ref={register({ required: true })}
          defaultValue={page?.detail}
          onChange={(e) => {
            console.log("detail length:" + e.target.value.length)
            if (e.target.value.length > 2000) {
              alert("2000文字を超えての入力はできません。")
              e.target.value = e.target.value.substring(0, 2000)
            }
          }}
        />
        <small className="mb-2 text-red-600 block">
          {errors.description && <span>This field is required</span>}
        </small>
      </label>
      <div className="flex flex-row justify-end mb-4">
        <input
          type="submit"
          value="Save"
          className="mt-4 px-6 py-2 text-white bg-accent rounded hover:bg-accent-dark"
        />
        <button
          className="text-sm px-4 py-1 h-10 m-1 rounded bg-black text-white text-right"
          onClick={onBack}
        >
          Back
        </button>
      </div>
    </form>
  )
}

export default PageForm
