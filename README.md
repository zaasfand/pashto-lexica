# pashto-lexica

Rekhtya - Pashto Lexica is an NPM package that processes Pashto text from `.txt` files using Google's Generative Language API (Gemini). It identifies the script type (Roman Pashto or Literal Pashto), extracts word details, and provides translations or transliterations.

## Features

- Detects whether the text is **Roman Pashto** or **Literal Pashto**.
- Segments the text into lines and words.
- Extracts word details (original word, English meaning, part of speech, synonyms in Pashto).
- Translates **Roman Pashto** into **Pashto script**.
- Transliterates **Pashto script** into **Roman Pashto**.
- Returns a structured JSON response.

## Security

- **Do not** embed a Gemini `apiKey` in public browser apps. Keys in client code can be stolen and abused.
- For browsers, use `proxyUrl` and call your own backend; keep the API key on the server only.
- User text is sent to Google when using `apiKey`, or to your proxy when using `proxyUrl`. Inform end users accordingly.

---

## Installation

```sh
npm install @rekhtya/pashto-lexica
```

Requires **Node.js 18+** (for `fetch` and native ESM).

---

## Usage

### Server (direct Gemini API)

```js
import PashtoGenerative from "@rekhtya/pashto-lexica";

const lexica = new PashtoGenerative({
  apiKey: process.env.GEMINI_API_KEY,
  model: "gemini-3.8-flash", // optional; omit to use the package default
});

// Shorthand: apiKey only, or apiKey + model name
// new PashtoGenerative(process.env.GEMINI_API_KEY);
// new PashtoGenerative(process.env.GEMINI_API_KEY, "gemini-3.8-flash");

const result = await lexica.processFilePath("./sample.txt");
// or
const result2 = await lexica.processText("sta pa khalak yo wahid day");
```

### Browser (via your backend proxy)

Your proxy should accept `POST` with JSON body `{ "text": "..." }` and return the final lexica JSON object.

```js
import PashtoGenerative from "@rekhtya/pashto-lexica";

const lexica = new PashtoGenerative({
  proxyUrl: "/api/pashto-lexica",
});

const result = await lexica.processFile(fileInput.files[0]);
```

### Options

| Option | Default | Description |
|--------|---------|-------------|
| `apiKey` | — | Gemini API key (server-side only) |
| `proxyUrl` | — | Backend URL for browser-safe processing |
| `proxyHeaders` | `{}` | Extra headers for proxy requests (e.g. auth) |
| `model` | `gemini-3.8-flash` | Optional Gemini model id (`apiKey` mode only) |
| `maxFileBytes` | `524288` | Max input size |
| `timeout` | `120000` | Request timeout (ms) |
| `temperature` | `0.2` | Generation temperature |
| `debug` | `false` | Log parsed output to `console.debug` |

Constructor shorthands when using a Gemini API key:

- `new PashtoGenerative(apiKey)` — default model
- `new PashtoGenerative(apiKey, model)` — custom model name as the second string argument
- `new PashtoGenerative(apiKey, { model, timeout, ... })` — apiKey string plus an options object

The configured model id is available on the instance as `modelId` (read-only).

### Errors

Failures throw `PashtoLexicaError` with a `code` such as `CONFIG`, `FILE_TOO_LARGE`, `PROXY_ERROR`, `API_ERROR`, or `PROMPT_BLOCKED`.

```js
import PashtoGenerative, { PashtoLexicaError } from "@rekhtya/pashto-lexica";
```

---

## Privacy

Text you process is transmitted to Google (when using `apiKey`) or to your proxy service. Review [Google's terms](https://ai.google.dev/gemini-api/terms) and your own privacy policy before handling user uploads.
