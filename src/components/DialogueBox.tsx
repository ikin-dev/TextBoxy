import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useState } from 'react'
import { DialogueConfig } from '../config'
import { Typewriter } from './Typewriter'
import './dialogue.css'

interface DialogueBoxProps {
  text: string
  isTyping: boolean
  config: DialogueConfig
}

export function DialogueBox({ text, isTyping, config }: DialogueBoxProps) {
  const [typingDone, setTypingDone] = useState(false)
  const handleComplete = useCallback(() => setTypingDone(true), [])
  useEffect(() => setTypingDone(false), [text])
  return (
    <AnimatePresence>
      {text && (
        <motion.div
          className="dialogue-box"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: config.fadeDuration / 1000, ease: 'easeOut' }}
          style={{
            color: config.textColor,
            backgroundColor: config.backgroundColor,
            borderColor: config.borderColor,
            borderWidth: config.borderWidth,
            borderRadius: config.borderRadius,
            padding: config.padding,
            minHeight: config.minHeight,
            maxWidth: `min(${config.maxWidth}px, calc(100vw - 24px))`,
            fontFamily: config.fontFamily,
            fontSize: config.fontSize,
          }}
          data-typing={isTyping}
          data-complete={typingDone}
        >
          <Typewriter
            key={text}
            text={text}
            speed={config.typingSpeed}
            cursor={config.cursor}
            onComplete={handleComplete}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
