/*
 * MODIFIED FILE NOTICE: This file was modified in the Opis fork of GenOffice.
 * Original work: GenOffice, Copyright 2026 Mainfunc, Inc.
 * See LICENSE, NOTICE, and FORK-NOTICE.md for licensing and attribution.
 */

export type {
  AiChatRequest,
  AiChatResponse,
  AiProviderConfig,
  AiProviderId,
  AiProviderMeta,
  AiSettings,
  AiStreamChunk,
  AiStreamRequest,
  GenSparkAccountStatus,
  LegacyAiSettings,
} from './types'
export {
  AI_PROVIDERS,
  GENSPARK_LLM_BASE_URLS,
  NEURALWATT_CUSTOM_PROVIDER,
  defaultAiSettings,
  resolveAiSettings,
} from './providers'
export { chatForProvider } from './chat'
export { AiCreditsError, sseLines, streamForProvider } from './stream'
export type { StreamCallbacks } from './stream'
export {
  AI_CHAT_RESPONSE_TIMEOUT_MS,
  AI_CONNECT_TIMEOUT_MS,
  AI_IDLE_TIMEOUT_MS,
  AiTimeoutError,
  createStreamWatchdog,
} from './watchdog'
export type { StreamWatchdog } from './watchdog'
