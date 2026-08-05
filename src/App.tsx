import { DialogueBox } from './components/DialogueBox'
import { useDialogue } from './hooks/useDialogue'
import { dialogueConfig } from './config'
import './index.css'

export default function App() {
  const { message, isTyping, connectionStatus } = useDialogue(dialogueConfig)
  const debug = new URLSearchParams(window.location.search).has('debug')
  return (
    <main className="overlay" aria-live="polite" aria-label="TTS dialogue overlay">
      <DialogueBox text={message} isTyping={isTyping} config={dialogueConfig} />
      {debug && (
        <div className="debug-panel">
          WebSocket: {connectionStatus}
          <br />
          Message: {message || '(waiting for dialogue.txt)'}
        </div>
      )}
    </main>
  )
}
