export interface DialogueConfig {
  fontFamily: string
  fontSize: number
  textColor: string
  backgroundColor: string
  borderColor: string
  borderWidth: number
  borderRadius: number
  padding: number
  maxWidth: number
  minHeight: number
  typingSpeed: number
  holdDuration: number
  fadeDuration: number
  cursor: boolean
}

export const dialogueConfig: DialogueConfig = {
  fontFamily: "'Pixelify Sans', monospace",
  fontSize: 27,
  textColor: '#fff',
  backgroundColor: '#050505',
  borderColor: '#fff',
  borderWidth: 2,
  borderRadius: 0,
  padding: 18,
  maxWidth: 700,
  minHeight: 72,
  typingSpeed: 35,
  holdDuration: 3000,
  fadeDuration: 180,
  cursor: true,
}
