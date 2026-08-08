/*
 * MODIFIED FILE NOTICE: This file was modified in the Opis fork of GenOffice.
 * Original work: GenOffice, Copyright 2026 Mainfunc, Inc.
 * See LICENSE, NOTICE, and FORK-NOTICE.md for licensing and attribution.
 */

import React from 'react'
import { createRoot } from 'react-dom/client'
import { htmlLang } from '@genoffice/i18n'
import { AppFrame } from './AppFrame'
import { AiProviderSettingsPage } from './AiProviderSettingsPage'
import { LocaleProvider } from './locale'
import './home.css'
import './ai-settings.css'
import './tabbar.css'

// macOS shell window is created with vibrancy; a transparent body lets the
// editor views' translucent regions (e.g. slides thumbnail pane) show it
if (navigator.platform.toLowerCase().includes('mac')) document.body.classList.add('vib')

const isAiProviderSettingsWindow =
  new URLSearchParams(window.location.search).get('window') === 'ai-provider-settings'

// resolve the persisted language, first-run flag, and theme before first paint
// so the UI never flashes (home showing briefly before the onboarding overlay)
void Promise.all([
  window.aiOffice.getLanguage(),
  // if the flag is unreadable, skip onboarding rather than block the home screen
  isAiProviderSettingsWindow
    ? Promise.resolve(true)
    : window.aiOffice.onboardingSeen().catch(() => true),
  window.aiOffice.getTheme().catch(() => 'system' as const),
]).then(([lang, onboardingSeen, theme]) => {
  document.documentElement.lang = htmlLang(lang)
  // apply theme attribute before first paint to avoid flash
  if (theme !== 'system') {
    document.documentElement.setAttribute('data-theme', theme)
  }
  createRoot(document.getElementById('root')!).render(
    isAiProviderSettingsWindow ? (
      <AiProviderSettingsPage language={lang} />
    ) : (
      <React.StrictMode>
        <LocaleProvider initial={lang}>
          <AppFrame initialOnboardingSeen={onboardingSeen} />
        </LocaleProvider>
      </React.StrictMode>
    ),
  )
})
