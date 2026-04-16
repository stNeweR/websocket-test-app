# AGENTS.md - Personal App

## Проект
- Название: `personal-app`
- Стадия: `prototype`
- Ветка: `main`
- Описание: Помодоро-таймер, задачи, уведомления

## Структура
- `/src` - Laravel 13 backend (PHP 8.3)
- `/front` - Vue 3 + TypeScript + Vite frontend

## Команды

### Backend (src)
```bash
cd src
composer test          # PHPUnit тесты
php artisan test     # альтернатива
php artisan <cmd>   # любые artisan команды
```

### Frontend (front)
```bash
cd front
npm run dev         # dev сервер (порт 5173)
npm run build      # TS проверка + vite build
```

### Docker
```bash
docker-compose up -d    # запуск
docker-compose down   # остановка
```

## База данных
- По умолчанию: SQLite (`DB_CONNECTION=sqlite` в .env)
- Docker PostgreSQL: порт 5434, DB: `bot`, user: `postgres`, pass: `secret`

## API Routes
- `src/routes/api.php` - REST эндпоинты
- Auth: `/api/auth/register`, `/api/auth/login`, `/api/auth/logout`, `/api/auth/me`
- Messages: `/api/messages/users/{userId}`
- Auth: Laravel Sanctum токены

## CORS
- `SANCTUM_STATEFUL_DOMAINS=localhost,localhost:5173`
- `CORS_ALLOWED_ORIGINS=http://localhost:5173`

## Тестирование
```bash
php artisan test --filter=TestClassName   # конкретный тест
```

## Важное
- Controllers: `src/app/Http/Controllers/Api/`
- Models: `src/app/Models/`
- Routes: `src/routes/api.php`, `src/routes/web.php`
- Frontend API: `front/src/composables/api.ts`
- Frontend Store: `front/src/stores/auth.ts`