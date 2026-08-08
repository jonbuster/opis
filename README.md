# Opis

> **Unofficial fork notice:** Opis is an independent fork of GenOffice. It is
> not affiliated with, endorsed by, or sponsored by Mainfunc, Inc., GenOffice,
> or Genspark. See [FORK-NOTICE.md](https://github.com/jonbuster/opis/blob/main/FORK-NOTICE.md) for attribution,
> licensing, branding, and distribution requirements.

## Configure a custom AI provider

Opis includes a custom OpenAI-compatible provider so each user can supply their
own endpoint, model, and API key without changing source code or environment
variables.

1. Open Opis.
2. Select **Tools → AI Provider Settings…**.
3. In **Base URL**, enter the provider's API root. Use a URL ending in `/v1`,
   such as `https://api.neuralwatt.com/v1`. Do not add `/chat/completions`;
   Opis adds that path automatically.
4. In **Model**, enter the model identifier, such as `deepseek-v4-flash`.
5. Paste the provider's API key into **API key**. Use **Show** to verify it if
   needed, then select **Save settings**.

The endpoint must support the OpenAI-compatible
`POST /chat/completions` API with bearer-token authentication and streaming
responses. New AI requests in Docs, Sheets, and Slides use the saved settings.

The key is stored locally in the Electron user-data settings file. It is not
written to the source tree or included in release artifacts by default. Treat
it like a password, do not commit it, and review the provider's privacy terms
before sending documents, attachments, or other sensitive content.

An AI-native office suite for macOS and Windows: word processor, spreadsheet,
presentations, PDF, and Markdown — six Electron apps sharing one engine layer,
built around AI editing as a first-class workflow rather than a bolted-on chat box.

[![Meet GenOffice — the world's first full-featured open-source AI Office (video)](https://img.youtube.com/vi/B2pLdMX95v4/maxresdefault.jpg)](https://www.youtube.com/watch?v=B2pLdMX95v4)

[Watch the demo video on YouTube](https://www.youtube.com/watch?v=B2pLdMX95v4)

## Downloads

Opis does not currently publish official release artifacts from this repository.
The links below are upstream GenOffice builds for reference only; they are not
Opis releases and are not endorsed by this fork.

| Platform                        | Requirements                                | Download                                                                                                                             |
| ------------------------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| **macOS** (Apple Silicon)       | macOS 11+                                   | [GenOffice-0.5.83-arm64.dmg](https://github.com/genspark-ai/genoffice/releases/download/v0.5.83/GenOffice-0.5.83-arm64.dmg)          |
| **Windows** (x64)               | Windows 10+                                 | [GenOfficeSetup-v0.5.79.exe](https://github.com/genspark-ai/genoffice/releases/download/v0.5.83/GenOfficeSetup-v0.5.79.exe)          |
| **Linux** — Debian / Ubuntu     | x86_64, glibc 2.34+ (Ubuntu 22.04 or newer) | [genoffice_0.5.149_amd64.deb](https://github.com/genspark-ai/genoffice/releases/download/linux-v0.5.149/genoffice_0.5.149_amd64.deb) |
| **Linux** — other distributions | x86_64, glibc 2.34+, FUSE 2                 | [GenOffice-0.5.149.AppImage](https://github.com/genspark-ai/genoffice/releases/download/linux-v0.5.149/GenOffice-0.5.149.AppImage)   |

All builds come from `main`; the macOS and Windows installers are signed.
Older versions are on the [Releases](https://github.com/genspark-ai/genoffice/releases) page.

### Installing on Linux

The deb installs with apt — it pulls in the dependencies and adds GenOffice
to the applications menu:

```bash
sudo apt install ./genoffice_0.5.149_amd64.deb
```

The AppImage instead runs in place: install the FUSE 2 runtime
(`sudo apt install libfuse2`; on Ubuntu 24.04 the package is `libfuse2t64`),
make the file executable, then run it:

```bash
chmod +x GenOffice-0.5.149.AppImage
./GenOffice-0.5.149.AppImage
```

## Apps

| App           | Product              | What it is                                                                                                                                                                                                                                                                                                                                                    |
| ------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `apps/docs`   | **GenOffice Docs**   | `.docx` word processor. Byte-preserving round trip: only dirty paragraphs are regenerated (paragraph patch), everything else in the original file is kept byte-for-byte, so opening and saving never breaks layout in Word. Paginated view whose line metrics reproduce the original document's layout, tracked changes, comments, styles, equations, ink.    |
| `apps/sheets` | **GenOffice Sheets** | `.xlsx` spreadsheet. UI built on the open-source [Univer](https://github.com/dream-num/univer) core (Apache-2.0) with a large layer of in-house extensions; `.xlsx` import/export runs through an in-house Rust sidecar (calamine + IronCalc), charts are rendered in-house (Konva), plus pivot tables, slicers, conditional formatting, and formula tracing. |
| `apps/slides` | **GenOffice Slides** | `.pptx` presentations. In-house `.pptx` parse/render/edit engine with masters, charts, cropping, ink, and text shaping (HarfBuzz metrics).                                                                                                                                                                                                                    |
| `apps/pdf`    | **GenOffice PDF**    | `.pdf` viewer/editor on pdf.js + pdf-lib: annotations, forms, outlines, stamps, signatures, page operations, and printing support.                                                                                                                                                                                                                            |
| `apps/shell`  | **GenOffice**        | The suite shell: home screen, tabbed hosting of the five editors, auto-update.                                                                                                                                                                                                                                                                                |

Every app embeds the same AI panel: block-granular AI editing with version
snapshots and diffs in docs, a tool-calling agent over workbook/slide/PDF
state in the others.

**AI providers.** The upstream Genspark integration remains available. This
fork also supports user-configured custom OpenAI-compatible endpoints. A key
entered by a user is stored in the local Electron user-data settings file and
is not included in the source tree or release artifacts by default. Review the
selected provider's terms and privacy policy before sending documents or other
sensitive content.

## Engine packages

All pure TypeScript, no Electron dependency, unit-tested (except the UI kit):

- `packages/docx-engine` — docx parsing → block tree (with `docxIndex`
  anchors and passthrough), OOXML fragment generation, byte-level paragraph
  patching.
- `packages/pptx-engine` / `packages/pptx-render` — pptx model and rendering.
- `packages/file-parse` — text extraction for AI attachments (office formats,
  text formats).
- `packages/agent-core` — the AI agent loop and skill composition shared by
  every app.
- `packages/ai-provider` — provider abstraction and streaming for the model
  backends.
- `packages/ai-search` — Genspark auth + web/image search tools.
- `packages/i18n`, `packages/ui`, `packages/project-store`,
  `packages/electron-utils` — shared i18n core, React UI kit, recent-files
  store, and Electron main-process helpers.

## Development

```bash
npm install
npm run fixtures     # generate test .docx fixtures
npm test             # engine + app unit tests (docs/sheets/slides need no display)
npm run typecheck    # tsc --noEmit across every workspace
npm run dev          # all five editors + shell against Vite dev servers
npm run dev:docs     # a single app (same pattern works per workspace)
npm run dist:mac     # package macOS dmg (regenerates third-party notices)
npm run dist:win     # package Windows nsis installer
```

The sheets app additionally needs a Rust toolchain for its xlsx sidecar
(`cargo` on PATH); `npm run build -w @genoffice/sheets` compiles it
automatically.

Local UI/e2e driver scripts (Playwright + Electron, for local acceptance, not
committed by default) live in [`scripts/drivers/`](scripts/drivers/README.md).

## Architecture notes (docx round trip)

```
open docx ─► archive original by hash (never touched)
          ─► docx-engine parses word/document.xml top-level elements (w:p / w:tbl / …)
          ─► Block tree, each block anchored by docxIndex + original XML slice
          ─► Tiptap streaming editor (manual + AI editing, dirty tracking)
save      ─► dirty blocks → OOXML fragments (referencing existing styles only)
          ─► splice into original document.xml (untouched blocks keep original bytes)
          ─► repack zip; all other entries copied byte-for-byte
```

The same philosophy holds in sheets and slides: the original file is the
source of truth, edits are applied as narrow patches, and everything the
editor didn't touch survives the round trip untouched.

## Security

See [SECURITY.md](SECURITY.md) for the process security posture (renderer
sandboxing, IPC validation, external-link gating) and the threat models for
AI-generated content.

## Third-party notices

`npm run notices` regenerates the bundled third-party license summary
(`tools/gen-third-party-notices.mjs`); all runtime dependencies are
MIT/Apache-2.0/OFL, and the bundled fonts (Liberation, Carlito, Caladea, Noto
CJK subsets) are OFL/Apache.

## Fork and attribution

Opis contains modified and newly added files based on GenOffice. The original
GenOffice copyright, Apache-2.0 license, `NOTICE`, and third-party attribution
notices are retained. Modified files carry a `MODIFIED FILE NOTICE`; see
[FORK-NOTICE.md](FORK-NOTICE.md) for the scope of this fork and release notes.

## License

The Apache-2.0 portions of Opis are based on GenOffice and remain licensed
under the [Apache License 2.0](LICENSE). The `ee/` directory is a separate
enterprise-licensed area and is not covered by Apache-2.0; see [ee/LICENSE](ee/LICENSE).

The GenOffice and Genspark names and logos are trademarks of Mainfunc, Inc.
The Apache-2.0 license does not grant permission to use them (see section 6);
Opis releases should use their own branding and must not imply official
association with Mainfunc, GenOffice, or Genspark.
