# API Apps

Personal CLI wrappers for various APIs. Raw 1:1 mapping to API endpoints.

## Apps

| CLI | API | Env var |
|-----|-----|---------|
| elevenlabs-api | ElevenLabs TTS & SFX | `ELEVENLABS_API_KEY` |
| suno-api | Suno music generation | `SUNO_API_KEY` |

## Usage

```bash
bun run elevenlabs-api/src/index.ts --help
bun run suno-api/src/index.ts --help
```

## npm publishing

To publish as scoped packages (`@todoforai/suno-api`), you need:
1. Create `todoforai` org on npmjs.com
2. Update package.json names to `@todoforai/suno-api` etc.
3. `npm publish --access public`

See [GUIDE.md](./GUIDE.md) for design principles.
