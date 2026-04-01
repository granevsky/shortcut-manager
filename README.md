# Shortcut Configurator

[![Version](https://vsmarketplacebadge.apphb.com/version.svg)](#) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

*Read this in other languages: [English](#-english), [Русский](#-русский).*

---

## 🇺🇸 English

### Overview
**Shortcut Configurator** is a powerful Visual Studio Code extension that generates true OS-level native desktop shortcuts directly to your VS Code workspaces. It eliminates the need to manually search for your projects, and seamlessly integrates your configured NPM/Yarn/PNPM/Bun scripts directly into the shortcut application!

### Key Features
- **Cross-Platform**: Automatically generates native architecture shortcuts (`.lnk` for Windows, `.app` Launchpad-ready Apple Bundles for macOS, and `.desktop` files for Linux).
- **Sub-Project Script Discovery**: Automatically scans your entire workspace for nested `package.json` files (ignoring `node_modules`) and intelligently links scripts to their specific sub-directories.
- **Smart Package Manager Auto-Detection**: The extension magically "sniffs" your script folders for lock-files (`pnpm-lock.yaml`, `yarn.lock`, `bun.lockb`, `package-lock.json`). It natively generates the Quick Action with the correct manager without asking!
- **Zero-Friction Execution**: Bypasses macOS LaunchServices/Gatekeeper UI bugs by natively routing executions through OS terminal emulators (`Terminal.app` on Mac, `gnome-terminal`/`xterm` fallbacks on Linux, and `powershell.exe` on Windows).
- **Internationalization (i18n)**: Fully supports English and Russian based on your VS Code UI language, or via manual override.

### How to Use
1. Open your trusted project workspace.
2. Press `Ctrl+Shift+P` (or `Cmd+Shift+P`) and type **"Shortcut Configurator: Generate Shortcut"**.
3. Select which background scripts (e.g., `frontend : build`, `backend : start`) to include as OS-level **Quick Actions**.
4. A custom application shortcut is immediately placed into your OS's Start Menu / Applications folder!

### Custom Icons
You can easily customize the icon of your generated shortcut by placing an image file in your workspace. The extension automatically looks for files named `favicon`, `logo`, `icon`, or `app-icon`.

Supported file extensions depend on your OS: 
- **Windows**: `.ico`
- **macOS**: `.icns`
- **Linux**: `.svg` or `.png`

The extension scans the following directories relative to your workspace root:
- `/` (Workspace Root)
- `/public`
- `/static`
- `/assets`
- `/src/assets`

If no matching icon is found, a default VS Code-style icon is automatically applied.

### Requirements & Settings
- Visual Studio Code version `1.80.0` or higher.
- `shortcut-configurator.packageManager`: Override auto-detection (`auto`, `npm`, `yarn`, `pnpm`, `bun`).
- `shortcut-configurator.language`: Override extension language (`auto`, `en`, `ru`).

---

## 🇷🇺 Русский

### Обзор
**Shortcut Configurator** — это мощное расширение для Visual Studio Code, которое генерирует настоящие системные ярлыки прямо для ваших рабочих областей. Оно избавляет от необходимости постоянно искать нужный проект в файловой системе, а также позволяет встроить скрипты запуска напрямую в ярлык приложения для ОС!

### Главные Фишки
- **Кроссплатформенность**: Автоматически создает системные ярлыки (`.lnk` для Windows, полноформатные Launchpad `.app` апплеты для macOS, и `.desktop` файлы для Linux).
- **Поиск вложенных скриптов**: Глубоко сканирует вашу рабочую область на предмет множества `package.json` файлов (игнорируя `node_modules`), грамотно привязывая запуск каждого скрипта к его конкретной под-папке!
- **Умное автоопределение Менеджеров Пакетов**: Расширение магически "вынюхивает" папку каждого скрипта на наличие lock-файлов (`pnpm-lock.yaml`, `yarn.lock`, `bun.lockb`, `package-lock.json`). Ярлык для быстрого действия сгенерируется с идеальной командой без лишних вопросов!
- **Бесшовное Выполнение**: Идеально обходит агрессивные песочницы Gatekeeper/LaunchServices на Mac, поднимая стабильные терминалы ОС (`Terminal.app` на Mac, умный поиск `gnome-terminal`/`xterm` на Linux, и `powershell.exe` на Windows).
- **Локализация (i18n)**: Полная поддержка английского и русского языков с автоматической подстройкой под интерфейс вашего любимого VS Code.

### Как Использовать
1. Откройте нужную доверенную папку проекта.
2. Откройте палитру команд (`Ctrl+Shift+P` или `Cmd+Shift+P`) и введите **"Shortcut Configurator: Generate Shortcut"**.
3. Отметьте галочками скрипты (например, `frontend : build`, `backend : start`), которые хотите вынести в качестве Быстрых Действий (Quick Actions) в ярлыке ОС.
4. Кастомный ярлык мгновенно появится в вашем меню Пуск / папке Программ!

### Кастомные Иконки
Вы можете легко задать собственную иконку для сгенерированного ярлыка. Расширение автоматически сканирует проект на наличие файлов с именами `favicon`, `logo`, `icon` или `app-icon`.

Поддерживаемые форматы зависят от вашей ОС: 
- **Windows**: `.ico`
- **macOS**: `.icns`
- **Linux**: `.svg` или `.png`

Сканирование происходит в следующих популярных директориях вашей рабочей области:
- `/` (Корень проекта)
- `/public`
- `/static`
- `/assets`
- `/src/assets`

Если ни одна подходящая иконка не будет найдена, генератор использует красивую встроенную иконку по умолчанию.

### Требования и Настройки
- Visual Studio Code версии `1.80.0` или старше.
- `shortcut-configurator.packageManager`: Переопределение умного авто-определения (`auto`, `npm`, `yarn`, `pnpm`, `bun`).
- `shortcut-configurator.language`: Смена языка интерфейса расширения (`auto`, `en`, `ru`).