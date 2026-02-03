# API Apps Guide

## Philosophy

Each app is a **raw API wrapper** - a direct 1:1 representation of the company's API endpoints. No abstraction, no magic, no renaming. What you see in the API docs is what you get in the CLI.

## Principles

- **Mirror the API** - param names match exactly, no CLI-side validation, let API error
- **Modern CLI** - every command/subcommand has `--help`
- **Docs at every level** - root help links to `llms.txt`, each command links to its `.md`/`.mdx`

## Documentation Links

Each CLI includes:
- **Root level**: Link to API's `llms.txt` (machine-readable full API reference)
- **Command level**: Link to specific endpoint's `.md` or `.mdx` doc

Example:
```
elevenlabs-api --help        → links to llms.txt
elevenlabs-api voices --help → links to voices/search.mdx
```

## Apps

| App | API | Run |
|-----|-----|-----|
| elevenlabs-api | ElevenLabs TTS & sound effects | `bun run elevenlabs-api/src/index.ts` |
| suno-api | Suno music generation | `bun run suno-api/src/index.ts` |

## Adding New Apps

1. Create `<name>-api/` folder
2. Mirror API endpoints as commands
3. Use exact API param names
4. Add `llms.txt` link in root description
5. Add `.md`/`.mdx` links in each command description
