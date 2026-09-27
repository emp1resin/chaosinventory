# Состав переданного проекта

Опись составлена по архиву `chaos-build-forge-transfer.tar.gz`, переданному 26 сентября 2026 года. Архив успешно распакован; 48 файлов. `node_modules/`, `dist/` и сохранения браузера в него не включены.

## Запуск и сборка

- `package.json`, `package-lock.json` — зависимости и команды; исходная установка: `npm ci --legacy-peer-deps`.
- `vite.config.ts`, `index.html`, `tsconfig*.json`, `.oxlintrc.json` — конфигурация и точка HTML.
- `src/index.jsx`, `src/App.jsx`, `src/App.css`, `src/index.css` — вход, компоновка и стили.
- `public/favicon.svg`, `public/icons.svg`, `src/assets/` — локальные визуальные файлы.

## Логика приложения

- `src/reducers/postReducer.jsx` — состояние Redux.
- `src/components/Results.jsx` — итоговый расчёт, используемый также сравнением.
- `src/components/ItemsAll.jsx` — снимок каталога: 1 054 предмета из FAQ и игрового API, создан 30 августа 2026 года; присутствуют также записи «Нет» для пустых слотов.
- `src/components/ItemsFit.jsx`, `ItemsList.jsx`, `ItemInfoSystem.jsx` — экипировка, выбор, модификации и руны.
- `src/components/InputNameForFinding.jsx` — импорт персонажа по нику и сведений об экземплярах вещей.
- `src/components/CharInput.jsx`, `CharSingle.jsx`, `FreePointsChar.jsx`, `ClansArt.jsx` — характеристики и дополнительные настройки.
- `src/components/SkillsProps.jsx`, `SkillsInput.jsx`, `SkillsSingle.jsx`, `FreePointsSkills.jsx` — навыки и мастерство.
- `src/components/SaveState.jsx`, `SaveGrid.jsx`, `DiffBuilds.jsx`, `LocalBuildForDiff.jsx` — локальные сохранения и сравнение.
- `src/components/BuildCost.jsx` — подтверждённые магазинные валюты.
- `src/components/TooltipsCharErr.jsx`, `TooltipsSkillsInfo.jsx` — подсказки.
- `src/data/breachRunes.js`, `religions.js` — описания рун Разлома и правило исключения бонусов Иллирианы.
- `scripts/update-catalog.mjs` — обновление снимка каталога.

## Документация

`README.md`, `docs/ARCHITECTURE.md`, `docs/DATA_SOURCES.md`, `docs/MIGRATION.md`, `docs/TRANSFER_PROMPT.md`. Этот файл отсутствовал в исходном архиве и восстановлен по его составу.

## Внешние зависимости во время работы

`chaosage.ru` (API и изображения), `chaosage.space` (профиль, кланы, религии), `chaosage.app` (необязательные подсказки ников). Сохранения находятся в `localStorage` под ключом `chaos-build-forge:saves:v1` и не входят в архив.
