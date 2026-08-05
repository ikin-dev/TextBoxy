import { useEffect, useState } from 'react'

interface TypewriterProps {
  text: string
  speed: number
  cursor: boolean
  onComplete: () => void
}

export function Typewriter({ text, speed, cursor, onComplete }: TypewriterProps) {
  const [visibleText, setVisibleText] = useState('')
  useEffect(() => {
    setVisibleText('')
    let index = 0
    const timer = window.setInterval(() => {
      index += 1
      setVisibleText(text.slice(0, index))
      if (index >= text.length) {
        window.clearInterval(timer)
        onComplete()
      }
    }, speed)
    return () => window.clearInterval(timer)
  }, [text, speed, onComplete])
  return (
    <>
      {visibleText}
      {cursor && visibleText.length < text.length ? <span className="cursor">|</span> : null}
    </>
  )
}
