import type { NextPage } from 'next'
import { useEffect, useRef, useState } from 'react'

const Index: NextPage<{ws_url: string}> = () => {
  const socketRef = useRef<WebSocket>()
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    socketRef.current = new WebSocket('ws://weed_api.example.com:80/speak')
    socketRef.current.onopen = function () {
      setIsConnected(true)
      console.log('Connected')
    }

    socketRef.current.onclose = function () {
      console.log('closed')
      setIsConnected(false)
    }

    return () => {
      if (socketRef.current == null) {
        return
      }
      socketRef.current.close()
    }
  }, [])

  return (
    <>
      <h1>WebSocket is connected : {`${isConnected}`}</h1>
    </>
  )
}

export default Index
