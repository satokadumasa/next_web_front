import React, { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDropzone } from 'react-dropzone'
import { useRouter } from 'next/router'
import LinkButton from '@/components/LinkButton'
import axios from '@/lib/axios'
import { Board, BoardComment } from '@/lib/client'

// type Board = {
//   id: number
//   user_id: number
//   title: string
//   detail: string
//   created_at: string
//   updated_at: string
// }

// type BoardComment = {
//   id: number
//   board_id: number
//   user_id: number
//   title: string
//   detail: string
//   created_at: string
//   updated_at: string
// }

type Props = {
  board?: Board
  board_comment?: BoardComment
  onSubmit: (board_comment: BoardComment) => void
  onError: () => void
}

const BoardCommentForm: React.FC<Props> = ({ board, board_comment, onSubmit, onError }) => {
  // const [imageKey, setImageKey] = useState(board_comment?.key)
  const { register, handleSubmit, errors } = useForm()
  const router = useRouter()
  const onBack = async () => {
    console.log("onBack()")
    router.push('/boards')
  }
  // board_comment.board_id = board.id

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)}>
      <input
        type="hidden"
        name="board_id"
        id="board_id"
        className="mt-2 mb-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-100 focus:ring-1"
        ref={register({ required: false })}
        defaultValue={board?.id}
      />

      <label className="block mb-4">
        <span>タイトル</span>
        <input
          type="text"
          name="title"
          className="mt-2 mb-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-100 focus:ring-1"
          ref={register({ required: true })}
          defaultValue={board_comment?.title}
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
          defaultValue={board_comment?.detail}
          onChange={(e) => {
            console.log("detail length:" + e.target.value.length)
            if (e.target.value.length > 1024) {
              alert("1024文字を超えての入力はできません。")
              e.target.value = e.target.value.substring(0, 1024)
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

export default BoardCommentForm
