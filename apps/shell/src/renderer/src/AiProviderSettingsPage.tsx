/*
 * MODIFIED FILE NOTICE: This file was added in the Opis fork of GenOffice.
 * Original project attribution: GenOffice, Copyright 2026 Mainfunc, Inc.
 * See LICENSE, NOTICE, and FORK-NOTICE.md for licensing and attribution.
 */

import { useEffect, useState, type FormEvent } from 'react'
import type { AiSettings } from '@genoffice/ai-provider'
import type { HomeApi, UiLanguage } from '../../shared/home-api'

declare global {
  interface Window {
    aiOffice: HomeApi
  }
}

const DEFAULT_BASE_URL = 'https://api.neuralwatt.com/v1'
const DEFAULT_MODEL = 'deepseek-v4-flash'

type Copy = {
  title: string
  subtitle: string
  provider: string
  customProvider: string
  baseUrl: string
  baseUrlHint: string
  model: string
  apiKey: string
  apiKeyHint: string
  show: string
  hide: string
  clear: string
  cancel: string
  save: string
  loading: string
  saving: string
  saved: string
  required: string
  invalidUrl: string
  loadFailed: string
  saveFailed: string
}

const COPY: Record<'en' | 'zh', Copy> = {
  en: {
    title: 'AI Provider Settings',
    subtitle: 'Configure a custom OpenAI-compatible endpoint for Docs, Sheets, and Slides.',
    provider: 'Provider',
    customProvider: 'Custom OpenAI-compatible',
    baseUrl: 'Base URL',
    baseUrlHint: 'Use a provider URL ending in /v1. The app adds /chat/completions.',
    model: 'Model',
    apiKey: 'API key',
    apiKeyHint: 'Stored locally in the app settings file and never written into source code.',
    show: 'Show',
    hide: 'Hide',
    clear: 'Clear',
    cancel: 'Cancel',
    save: 'Save settings',
    loading: 'Loading settings…',
    saving: 'Saving…',
    saved: 'Saved. Open AI panels will use the new settings.',
    required: 'Base URL and model are required.',
    invalidUrl: 'Base URL must start with http:// or https://.',
    loadFailed: 'Could not load the current AI settings.',
    saveFailed: 'Could not save the AI settings.',
  },
  zh: {
    title: 'AI 供应商设置',
    subtitle: '为文档、表格和幻灯片配置自定义 OpenAI 兼容接口。',
    provider: '供应商',
    customProvider: '自定义 OpenAI 兼容接口',
    baseUrl: '基础 URL',
    baseUrlHint: '请使用以 /v1 结尾的供应商 URL，应用会自动添加 /chat/completions。',
    model: '模型',
    apiKey: 'API 密钥',
    apiKeyHint: '密钥仅保存在应用设置文件中，不会写入源代码。',
    show: '显示',
    hide: '隐藏',
    clear: '清除',
    cancel: '取消',
    save: '保存设置',
    loading: '正在加载设置…',
    saving: '正在保存…',
    saved: '已保存，打开的 AI 面板会使用新设置。',
    required: '基础 URL 和模型不能为空。',
    invalidUrl: '基础 URL 必须以 http:// 或 https:// 开头。',
    loadFailed: '无法加载当前 AI 设置。',
    saveFailed: '无法保存 AI 设置。',
  },
}

function copyFor(language: UiLanguage): Copy {
  return COPY[language === 'zh' || language === 'zh-TW' ? 'zh' : 'en']
}

export function AiProviderSettingsPage({ language }: { language: UiLanguage }) {
  const copy = copyFor(language)
  const [settings, setSettings] = useState<AiSettings | null>(null)
  const [baseUrl, setBaseUrl] = useState(DEFAULT_BASE_URL)
  const [model, setModel] = useState(DEFAULT_MODEL)
  const [apiKey, setApiKey] = useState('')
  const [showKey, setShowKey] = useState(false)
  const [busy, setBusy] = useState(true)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    void window.aiOffice
      .getAiSettings()
      .then((current) => {
        if (!active) return
        const custom = current.providers.custom
        setSettings(current)
        setBaseUrl(custom.baseUrl?.trim() || DEFAULT_BASE_URL)
        setModel(custom.model?.trim() || DEFAULT_MODEL)
        setApiKey(custom.apiKey ?? '')
      })
      .catch(() => {
        if (active) setError(copy.loadFailed)
      })
      .finally(() => {
        if (active) setBusy(false)
      })
    return () => {
      active = false
    }
  }, [copy.loadFailed])

  const close = () => window.close()

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!settings) return
    const nextBaseUrl = baseUrl.trim().replace(/\/+$/, '')
    const nextModel = model.trim()
    if (!nextBaseUrl || !nextModel) {
      setError(copy.required)
      setNotice('')
      return
    }
    if (!/^https?:\/\//i.test(nextBaseUrl)) {
      setError(copy.invalidUrl)
      setNotice('')
      return
    }

    setBusy(true)
    setError('')
    setNotice('')
    const nextSettings: AiSettings = {
      ...settings,
      provider: 'custom',
      providers: {
        ...settings.providers,
        custom: {
          ...settings.providers.custom,
          apiKey: apiKey.trim(),
          model: nextModel,
          baseUrl: nextBaseUrl,
        },
      },
    }
    void window.aiOffice
      .setAiSettings(nextSettings)
      .then(() => {
        setSettings(nextSettings)
        setBaseUrl(nextBaseUrl)
        setModel(nextModel)
        setApiKey(apiKey.trim())
        setNotice(copy.saved)
        window.setTimeout(close, 350)
      })
      .catch(() => setError(copy.saveFailed))
      .finally(() => setBusy(false))
  }

  return (
    <main className="ai-settings-page">
      <div className="ai-settings-card">
        <header className="ai-settings-header">
          <div>
            <p className="ai-settings-eyebrow">GenOffice</p>
            <h1>{copy.title}</h1>
            <p className="ai-settings-subtitle">{copy.subtitle}</p>
          </div>
          <button className="ai-settings-close" type="button" onClick={close} aria-label={copy.cancel}>
            ×
          </button>
        </header>

        {busy && !settings ? (
          <p className="ai-settings-status">{copy.loading}</p>
        ) : (
          <form className="ai-settings-form" onSubmit={submit}>
            <label className="ai-settings-field">
              <span>{copy.provider}</span>
              <input value={copy.customProvider} readOnly />
            </label>

            <label className="ai-settings-field">
              <span>{copy.baseUrl}</span>
              <input
                value={baseUrl}
                onChange={(event) => setBaseUrl(event.target.value)}
                placeholder={DEFAULT_BASE_URL}
                autoComplete="url"
                spellCheck={false}
                disabled={busy}
              />
              <small>{copy.baseUrlHint}</small>
            </label>

            <label className="ai-settings-field">
              <span>{copy.model}</span>
              <input
                value={model}
                onChange={(event) => setModel(event.target.value)}
                placeholder={DEFAULT_MODEL}
                autoComplete="off"
                spellCheck={false}
                disabled={busy}
              />
            </label>

            <label className="ai-settings-field">
              <span>{copy.apiKey}</span>
              <div className="ai-settings-secret">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(event) => setApiKey(event.target.value)}
                  placeholder="sk-…"
                  autoComplete="off"
                  spellCheck={false}
                  disabled={busy}
                />
                <button type="button" onClick={() => setShowKey((visible) => !visible)} disabled={busy}>
                  {showKey ? copy.hide : copy.show}
                </button>
                <button type="button" onClick={() => setApiKey('')} disabled={busy || !apiKey}>
                  {copy.clear}
                </button>
              </div>
              <small>{copy.apiKeyHint}</small>
            </label>

            {error && <p className="ai-settings-message is-error">{error}</p>}
            {notice && <p className="ai-settings-message is-success">{notice}</p>}

            <div className="ai-settings-actions">
              <button className="ai-settings-secondary" type="button" onClick={close} disabled={busy}>
                {copy.cancel}
              </button>
              <button className="ai-settings-primary" type="submit" disabled={busy}>
                {busy ? copy.saving : copy.save}
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  )
}
