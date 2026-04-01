# Changelog

All notable changes to the **Shortcut Configurator** extension will be documented in this file.

*Read this in other languages: [English](#-english), [Русский](#-русский).*

---

## 🇺🇸 English

### [1.0.3] - 2026-04-01
#### Added
- **Enhanced Custom Icon Resolution**: Massively upgraded the icon scanning logic. The extension now intelligently checks modern framework directories like `/static` and `/src/assets` in addition to `/public`. It also safely defaults unknown OS platforms to `.png` and natively embraces `.svg` vectors for Linux `.desktop` shortcuts.

### [1.0.2] - 2026-03-29
#### Fixed
- **macOS LaunchServices Compatibility**: Redesigned the Apple Bundle (`.app`) generator to route executions through `Terminal.app` using `osacompile`. This resolves critical `SIGHUP` process-group kills, Gatekeeper sandboxing blocks, and AppleEvent timeouts on newer macOS versions. Desktop Shortcuts now launch VS Code and Quick Actions flawlessly via Launchpad.

### [1.0.1] - 2026-03-29
#### Added
- **Smart Package Manager Auto-Detection**: Quick actions now automatically detect `yarn`, `pnpm`, `bun`, or `npm` by scanning for target lock-files in the script's directory.
- **Nested Sub-Project Discovery**: The extension now recursively searches the workspace for multiple `package.json` files (excluding `node_modules`), properly identifying and routing scripts based on their relative CWD.
- **macOS Quick Action Apps**: `MacGenerator` now generates canonical `.app` Apple Bundles for each Quick Action, utilizing `osascript` to hook gracefully into macOS `Terminal.app`.
- **Advanced Linux Terminal Wrapper**: `.desktop` execution now natively scans and utilizes the user's favored terminal emulator (e.g. `gnome-terminal`, `xterm`, `konsole`, `terminator`) without silently executing background commands.
- Configuration option `shortcut-configurator.packageManager` added to allow users to force a specific package manager to be injected.

### [1.0.0] - 2026-03-23
#### Added
- Core command `Shortcut Configurator: Generate Shortcut` implemented.
- Automatic creation of `.lnk`, `.app`, and `.desktop` native files.
- Basic Quick Actions binding mapped via Workspace prompt.
- Full localization (English/Russian).
- Security patches to prevent command injection exploits.

---

## 🇷🇺 Русский

### [1.0.3] - 2026-04-01
#### Добавлено
- **Продвинутый поиск кастомных иконок**: Мощный апгрейд алгоритма сканирования иконок. Теперь расширение заглядывает в популярные папки современных фреймворков (`/static`, `/src/assets`), безопасно фоллбэчится к `.png` на неизвестных операционных системах, и по-настоящему нативно поддерживает векторные `.svg` логотипы для Linux-ярлыков `.desktop`.

### [1.0.2] - 2026-03-29
#### Исправлено
- **Нативная поддержка Launchpad (macOS)**: Полностью переписан движок генерации `.app` пакетов под Mac. Теперь расширение собирает "белые" скрипт-апплеты через `osacompile` и маршрутизирует запуск через `Terminal.app`. Это решает проблемы с невидимыми блокировками LaunchServices (падения скриптов), TCC песочницей и зависаниями AppleEvent (таймаут -1712). Ярлыки теперь 100% надежно запускаются на всех версиях macOS двойным кликом!

### [1.0.1] - 2026-03-29
#### Добавлено
- **Умное Авто-определение Менеджера Пакетов (Smart PM Auto-Detection)**: Быстрые действия (Quick Actions) теперь автоматически анализируют наличие файлов блокировки (`yarn.lock`, `pnpm-lock.yaml`, `bun.lockb`) и встраивают правильную команду запуска проекта без лишних вопросов!
- **Поддержка Мульти-проектов**: Расширение рекурсивно находит вложенные файлы `package.json` (исключая `node_modules`) и грамотно привязывает пути (CWD) к каждому скрипту, помечая их понятными префиксами в меню при генерации.
- **Сборка Быстрых Команд на macOS**: Генератор для Mac (Apple) теперь создает отдельные независимые `.app` сборки для каждой быстрой команды, которые запускают скрипты через классический системный `Terminal.app` с помощью механизмов `osascript`.
- **Продвинутый оборачиватель Терминалов для Linux**: На Linux расширение теперь нативно ищет установленный в системе терминал (такие как `gnome-terminal`, `xterm`, `konsole`, `terminator`) и выводит выполнение скриптов в визуальное окно, вместо мертвого "фонового" исполнения.
- Новая настройка `shortcut-configurator.packageManager` для ручного переопределения используемого пакетного менеджера.

### [1.0.0] - 2026-03-23
#### Добавлено
- Реализована базовая команда создания нативного ярлыка: `Shortcut Configurator: Generate Shortcut`.
- Полноценная генерация удобных форматов `.lnk`, `.app` и `.desktop`.
- Поддержка чтения скриптов из базового `package.json`.
- Двуязычная локализация и архитектурная защита от Command Injection уязвимостей.
