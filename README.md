# API Apps

Personal CLI wrappers for various APIs. Raw 1:1 mapping to API endpoints.

## Apps

| CLI | API | Env var |
|-----|-----|---------|
| elevenlabs-api | ElevenLabs TTS & SFX | `ELEVENLABS_API_KEY` |
| suno-api | Suno music generation | `SUNO_API_KEY` |

## Install

```bash
npm i -g @todoforai/suno-api @todoforai/elevenlabs-api
suno-api --help
elevenlabs-api --help
```

## Dev

```bash
bun run elevenlabs-api/src/index.ts --help
bun run suno-api/src/index.ts --help
```

See [GUIDE.md](./GUIDE.md) for design principles.
