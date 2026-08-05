# TextBoxy

A textbox overlay for your TTS output.

## Run

```bash
npm install
npm start
```

After starting TextBoxy, you will see a message in the console showing TextBoxy is live alongside a localhost URL, `http://localhost:3000` by default.

You can open the URL in a browser or add it to an OBS Browser Source. The background of the page is transparent and should work out of the box without any further changes for overlaying in OBS.

### What it does

- TextBoxy watches a text file as it gets updated and previews the new text.
- TextBoxy has a queue system so messages don't overlap each other.
- The appearance of TextBoxy can be customized.

## Customization

### Custom dialogue file

The default watched file is `dialogue.txt`. Point to another file with either command-line syntax:

```powershell
npm start -- --file "C:\path\to\my-dialogue.txt"
```

or an environment variable:

```powershell
$env:DIALOGUE_FILE = "C:\path\to\my-dialogue.txt"
npm start
```

### Custom appearance

Edit the defaults in `src/config.ts` to change font, size, colors, dimensions, typewriter speed, hold time, and animation timing.

## Architecture

`server/server.ts` runs Express, Vite middleware, a WebSocket server, and a Chokidar watcher. `src/hooks/useDialogue.ts` receives `{ type: "dialogue", text: "..." }`, stores messages FIFO, and advances only after typing and the hold period. `DialogueBox` uses Framer Motion for fade/scale transitions while `Typewriter` reveals one character at a time.
