import { useEffect, useState } from 'react'
import { DialogueConfig } from '../config'

interface DialogueMessage {
  type: 'dialogue'
  text: string
}

const wait = (duration: number) =>
  new Promise<void>((resolve) => window.setTimeout(resolve, duration))

export function useDialogue(config: DialogueConfig) {
  const [message, setMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<
    'connecting' | 'connected' | 'disconnected'
  >('connecting')

  useEffect(() => {
    let disposed = false
    let socket: WebSocket | undefined
    let reconnectTimer: number | undefined
    const queue: string[] = []
    const seen = new Set<string>()
    let draining = false

    const drain = async () => {
      if (draining) return
      draining = true
      while (!disposed && queue.length > 0) {
        const next = queue.shift()!
        setMessage(next)
        setIsTyping(true)
        await wait(Math.max(1, next.length * config.typingSpeed))
        if (disposed) break
        setIsTyping(false)
        await wait(config.holdDuration)
        if (disposed) break
        setMessage('')
      }
      draining = false
    }

    const connect = () => {
      if (disposed) return
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
      socket = new WebSocket(`${protocol}//${window.location.host}/ws`)
      socket.onopen = () => setConnectionStatus('connected')
      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as DialogueMessage
          const text = data.type === 'dialogue' ? data.text.trim() : ''
          if (!text || seen.has(text)) return
          seen.add(text)
          queue.push(text)
          void drain()
        } catch {
          /* Ignore malformed messages. */
        }
      }
      socket.onclose = () => {
        if (!disposed) {
          setConnectionStatus('disconnected')
          reconnectTimer = window.setTimeout(connect, 1000)
        }
      }
    }

    connect()
    return () => {
      disposed = true
      window.clearTimeout(reconnectTimer)
      socket?.close()
    }
  }, [config.holdDuration, config.typingSpeed])

  return { message, isTyping, connectionStatus }
}
