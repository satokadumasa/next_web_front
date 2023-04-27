import React, { useCallback, useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useDropzone } from 'react-dropzone'
import { useRouter } from 'next/router'
import LinkButton from '@/components/LinkButton'
import axios from '@/lib/axios'
import { Board } from '@/lib/client'

type Props = {
  board?: Board
  onSubmit: (board: Board) => void
  onError: () => void
}

const BoardForm: React.FC<Props> = ({ user, board, onSubmit, onError }) => {
  const { register, handleSubmit, errors } = useForm()
  const router = useRouter()
  const onBack = async () => {
    console.log("onDelete()")
    router.push('/boards')
  }
  const [tag, setTag] = useState('')
  let user_id = 0;

  useEffect(() => {
    const user = JSON.parse(sessionStorage.user)
    console.log("useEffect user:" + JSON.stringify(user))
    user_id = user.id
    console.log("useEffect user_id:" + user_id)
  }, [tag])


  return (
    <form onSubmit={handleSubmit(onSubmit, onError)}>

      <label className="block mb-4">
        <span>タイトル</span>
        <input
          type="text"
          name="title"
          className="mt-2 mb-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-100 focus:ring-1"
          ref={register({ required: true })}
          defaultValue={board?.title}
        />
        <small className="mb-2 text-red-600 block">
          {errors.title && <span>This field is required</span>}
        </small>
      </label>
      <label className="block mb-4">
        <span>本文</span>
        <textarea
          name="detail"
          className="mt-2 mb-2 block w-full h-40 rounded-md border-gray-300 shadow-sm focus:border-indigo-100 focus:ring-1"
          rows={3}
          ref={register({ required: true })}
          defaultValue={board?.detail}
          onChange={(e) => {
            console.log("detail length:" + e.target.value.length)
            if (e.target.value.length > 2048) {
              alert("2048文字を超えての入力はできません。")
              e.target.value = e.target.value.substring(0, 2048)
            }
          }}
        />
        <small className="mb-2 text-red-600 block">
          {errors.description && <span>This field is required</span>}
        </small>
      </label>
      <input
        type="submit"
        value="Save"
        className="mt-4 px-6 py-2 text-white bg-accent rounded hover:bg-accent-dark"
      />
      <div className="flex flex-row justify-end mb-4">
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

export default BoardForm
