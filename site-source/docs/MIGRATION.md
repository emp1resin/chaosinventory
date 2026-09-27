# Перенос проекта на другую платформу

## 1. Получение исходников

Распакуйте переданный архив в новый пустой каталог. В корне должны находиться:

```text
package.json
package-lock.json
vite.config.ts
index.html
src/
scripts/
docs/
```

Не копируйте `node_modules` и `dist`: они создаются заново.

## 2. Установка окружения

Установите Node.js 22 LTS. Проверьте:

```bash
node --version
npm --version
```

Установите зависимости строго из lock-файла:

```bash
npm ci --legacy-peer-deps
```

Флаг нужен из-за React 17 и Material UI 4. Не запускайте автоматическое массовое обновление зависимостей до отдельной миграции UI.

## 3. Локальная проверка

```bash
npm run dev -- --host 0.0.0.0 --port 43127
```

Проверьте:

1. ручной выбор предметов;
2. загрузку `DestinyS`;
3. загрузку `LICHonTHEbeach`;
4. обычные руны и рунные слова;
5. импорт FEHU/LAGUZ из API;
6. сохранение и сравнение двух билдов;
7. отсутствие бонусов у Иллирианы.

## 4. Production-сборка

```bash
npm run build
```

Результат: `dist/`.

### Настройки типичного статического хостинга

| Параметр | Значение |
|---|---|
| Build command | `npm ci --legacy-peer-deps && npm run build` |
| Output directory | `dist` |
| Node version | `22` |
| Install command | `npm ci --legacy-peer-deps` |

SPA fallback не требуется, пока приложение использует только корневой URL.

## 5. Vercel

1. Импортируйте репозиторий.
2. Framework Preset: Vite.
3. Build Command: `npm run build`.
4. Output Directory: `dist`.
5. Install Command: `npm ci --legacy-peer-deps`.
6. Node.js: 22.

## 6. Netlify

```text
Build command: npm run build
Publish directory: dist
```

Установку зависимостей Netlify выполнит по `package-lock.json`; если возникнет peer dependency error, задайте:

```text
NPM_FLAGS=--legacy-peer-deps
NODE_VERSION=22
```

## 7. Cloudflare Pages

```text
Build command: npm ci --legacy-peer-deps && npm run build
Build output directory: dist
```

## 8. Обычный VPS

```bash
npm ci --legacy-peer-deps
npm run build
```

Раздавайте `dist/` через nginx:

```nginx
server {
    listen 80;
    server_name example.com;
    root /var/www/chaos-build-forge/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## 9. Проверка внешних API после публикации

Откройте DevTools → Network и проверьте ответы:

- `getAvatarsDataByName`;
- `user_equipment_list`;
- `equipment_info`;
- `user_fraction`;
- `clan_list_by_user_name`;
- `religionAndClansData`;
- `nickParse.php`.

Если браузер блокирует запросы CORS, добавьте serverless/backend-прокси:

```text
браузер → /api/chaosage?... → сервер новой платформы → chaosage.ru
```

Прокси должен:

- разрешать только заранее заданные upstream URL и параметры;
- не принимать произвольный URL пользователя;
- кэшировать ответы;
- задавать таймаут;
- ограничивать частоту;
- возвращать понятную ошибку.

После создания прокси замените прямые URL в:

- `src/components/InputNameForFinding.jsx`;
- `src/components/CharInput.jsx`;
- `scripts/update-catalog.mjs` — только для build-time обновления.

## 10. Обновление игровых данных

Когда FAQ изменился:

```bash
npm run update:data
npm run build
```

Проверьте diff `ItemsAll.jsx`, затем закоммитьте новый снимок.

Навыки и формулы автоматически не парсятся. Их необходимо сверять вручную:

- `SkillsProps.jsx`;
- `Results.jsx`;
- `breachRunes.js`;
- `religions.js`.

## 11. Перенос сохранений пользователя

Сохранения находятся только в браузере:

```text
localStorage["chaos-build-forge:saves:v1"]
```

Они не переносятся вместе с кодом. Для переноса между доменами потребуется временная функция экспорта/импорта JSON либо ручное копирование значения через DevTools.

## 12. Финальный чек-лист

- [ ] `npm ci --legacy-peer-deps` завершился успешно.
- [ ] `npm run build` завершился успешно.
- [ ] На странице нет горизонтального сдвига.
- [ ] Импортируются обычные руны, слова и руны Разлома.
- [ ] Ручное редактирование работает при отказе API.
- [ ] Сравнение использует основной расчётный движок.
- [ ] Иллириана не даёт бонусов.
- [ ] Магазинная стоимость разделена по валютам.
- [ ] В консоли нет ошибок вашего кода.
- [ ] CORS внешних API проверен с production-домена.
