<?php
declare(strict_types=1);

// SpaceWeb's shared PHP hosting counterpart of backend/worker.mjs.
// Put this directory in the document root; configure the optional report database
// with environment variables, never with credentials in a public repository.
const FRONTEND_ORIGINS = ['https://emp1resin.github.io', 'https://chaosinventory.emp1res1n.chatgpt.site'];
const GAME_REQUESTS_BY_NAME = ['user_equipment_list', 'user_fraction', 'clan_list_by_user_name', 'user_religionBonuses'];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '' && in_array($origin, FRONTEND_ORIGINS, true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
}
header('Vary: Origin');
$path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);

function json_out(array $body, int $status = 200): never {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function limited(string $scope, int $window, int $maximum): bool {
    $address = (string)($_SERVER['REMOTE_ADDR'] ?? 'unknown');
    $file = sys_get_temp_dir() . '/chaosinventory-' . hash('sha256', $scope . ':' . $address);
    $handle = fopen($file, 'c+');
    if (!$handle) return true;
    try {
        if (!flock($handle, LOCK_EX)) return true;
        $bucket = json_decode(stream_get_contents($handle), true);
        $now = time();
        $started = is_array($bucket) && $now - (int)($bucket['started'] ?? 0) < $window
            ? (int)$bucket['started'] : $now;
        $count = $started === (int)($bucket['started'] ?? 0) ? (int)($bucket['count'] ?? 0) + 1 : 1;
        rewind($handle);
        ftruncate($handle, 0);
        fwrite($handle, json_encode(['started' => $started, 'count' => $count]));
        return $count > $maximum;
    } finally {
        flock($handle, LOCK_UN);
        fclose($handle);
    }
}

if ($path === '/health') {
    json_out(['ok' => true, 'version' => 'spaceweb-php-v1']);
}

if ($origin !== '' && !in_array($origin, FRONTEND_ORIGINS, true)) {
    json_out(['error' => 'Доступ запрещён'], 403);
}

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Access-Control-Max-Age: 3600');
    http_response_code(204);
    exit;
}

if ($path === '/api/bug-report') {
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') json_out(['error' => 'Разрешён только POST'], 405);
    $mime = strtolower(trim(explode(';', $_SERVER['CONTENT_TYPE'] ?? '')[0]));
    if (!in_array($mime, ['application/json', 'text/plain'], true)) json_out(['error' => 'Ожидается JSON'], 415);
    if ((int)($_SERVER['CONTENT_LENGTH'] ?? 0) > 24000) json_out(['error' => 'Отчёт слишком большой'], 413);
    $raw = file_get_contents('php://input', false, null, 0, 24001);
    if ($raw === false || strlen($raw) > 24000) json_out(['error' => 'Отчёт слишком большой'], 413);
    $report = json_decode($raw, true);
    if (!is_array($report) || ($report['schema'] ?? null) !== 1 ||
        !is_string($report['clientId'] ?? null) || !preg_match('/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i', $report['clientId']) ||
        !in_array($report['category'] ?? null, ['import', 'equipment', 'calculation', 'other'], true) ||
        !is_string($report['nick'] ?? null) || strlen($report['nick']) > 240 ||
        !is_string($report['note'] ?? null) || strlen($report['note']) > 4000 ||
        !is_array($report['events'] ?? null) || count($report['events']) > 35 ||
        !is_array($report['browser'] ?? null)) {
        json_out(['error' => 'Неверный формат отчёта'], 400);
    }
    foreach ($report['events'] as $event) {
        if (!is_array($event) || strlen(json_encode($event)) > 600) json_out(['error' => 'Неверный формат отчёта'], 400);
    }
    if (strlen(json_encode($report['browser'])) > 800 ||
        (isset($report['build']) && strlen(json_encode($report['build'])) > 12000)) {
        json_out(['error' => 'Неверный формат отчёта'], 400);
    }
    if (limited('report', 3600, 40)) json_out(['error' => 'Лимит отчётов: попробуйте через час'], 429);
    $dsn = getenv('CHAOS_REPORT_DSN');
    $user = getenv('CHAOS_REPORT_USER');
    $password = getenv('CHAOS_REPORT_PASSWORD');
    if (!$dsn) json_out(['error' => 'Хранилище отчётов временно недоступно'], 503);
    try {
        $db = new PDO($dsn, $user ?: '', $password ?: '', [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
        $created = gmdate('Y-m-d\TH:i:s\Z');
        $statement = $db->prepare('INSERT IGNORE INTO bug_reports (id, created_at, category, nick, report_json) VALUES (?, ?, ?, ?, ?)');
        $statement->execute([$report['clientId'], $created, $report['category'], $report['nick'], $raw]);
        json_out(['id' => $report['clientId'], 'createdAt' => $created], 201);
    } catch (Throwable $error) {
        error_log('bug_report_storage_failed: ' . $error->getMessage());
        json_out(['error' => 'Не удалось сохранить отчёт'], 503);
    }
}

if (!in_array($path, ['/api/profile-html', '/api/avatar-rating-html', '/api/clan-rating-html', '/api/game-json'], true)) {
    json_out(['error' => 'Неизвестный путь'], 404);
}
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'GET') json_out(['error' => 'Разрешён только GET'], 405);
if (limited('game', 60, 90)) json_out(['error' => 'Слишком много запросов. Повторите через минуту.'], 429);

$name = trim((string)($_GET['name'] ?? ''));
if ($path === '/api/profile-html' && !preg_match('/^[\p{L}\p{N}_-]{1,60}$/u', $name)) {
    json_out(['error' => 'Некорректный ник персонажа'], 400);
}
$format = 'text';
if ($path === '/api/game-json') {
    $request = (string)($_GET['request'] ?? '');
    $userName = trim((string)($_GET['user_name'] ?? ''));
    $id = (string)($_GET['id'] ?? '');
    if ($request === 'clans') {
        $query = ['request' => 'clans'];
    } elseif (in_array($request, GAME_REQUESTS_BY_NAME, true) && preg_match('/^[\p{L}\p{N}_-]{1,60}$/u', $userName)) {
        $query = ['request' => $request, 'user_name' => $userName];
    } elseif ($request === 'equipment_info' && preg_match('/^\d{1,12}$/', $id)) {
        $query = ['request' => $request, 'id' => $id];
    } else {
        json_out(['error' => 'Некорректный запрос к игровым данным'], 400);
    }
    $source = 'https://chaosage.ru/sAPI2.php?' . http_build_query($query);
    $format = 'json';
} elseif ($path === '/api/clan-rating-html') {
    $source = 'https://chaosage.ru/rating.php?type=2';
} elseif ($path === '/api/avatar-rating-html') {
    $source = 'https://chaosage.ru/rating.php';
} else {
    $source = 'https://chaosage.ru/showInfo.php?' . http_build_query(['avatar' => $name]);
}

// Bound each response in memory and keep HTTPS verification enabled.
$body = '';
$tooLarge = false;
$curl = curl_init($source);
curl_setopt_array($curl, [
    CURLOPT_RETURNTRANSFER => false,
    CURLOPT_FOLLOWLOCATION => false,
    CURLOPT_CONNECTTIMEOUT => 5,
    CURLOPT_TIMEOUT => 12,
    CURLOPT_SSL_VERIFYPEER => true,
    CURLOPT_SSL_VERIFYHOST => 2,
    CURLOPT_HTTPHEADER => ['Accept: ' . ($format === 'json' ? 'application/json' : 'text/html')],
    CURLOPT_WRITEFUNCTION => static function ($handle, string $chunk) use (&$body, &$tooLarge): int {
        if (strlen($body) + strlen($chunk) > 500000) { $tooLarge = true; return 0; }
        $body .= $chunk;
        return strlen($chunk);
    },
]);
$success = curl_exec($curl);
$status = curl_getinfo($curl, CURLINFO_RESPONSE_CODE);
$curlError = curl_error($curl);
$curlCode = curl_errno($curl);
curl_close($curl);
if ($tooLarge) json_out(['error' => 'Ответ превышает допустимый размер', 'code' => 'UPSTREAM_SIZE'], 502);
if ($success === false) {
    $timeout = $curlCode === CURLE_OPERATION_TIMEDOUT;
    error_log('game_fetch_failed: ' . $curlCode . ' ' . $curlError);
    json_out(['error' => $timeout ? 'Игра не ответила нашему серверу за 12 с.' : 'Не удалось получить ответ игры',
        'code' => $timeout ? 'UPSTREAM_TIMEOUT' : 'UPSTREAM_NETWORK'], $timeout ? 504 : 502);
}
if ($status < 200 || $status >= 300) {
    json_out(['error' => 'Игра вернула HTTP ' . $status, 'code' => 'UPSTREAM_HTTP', 'upstreamStatus' => $status], 502);
}
if ($format === 'json' && json_decode($body) === null && json_last_error() !== JSON_ERROR_NONE) {
    json_out(['error' => 'Игра вернула повреждённый JSON', 'code' => 'UPSTREAM_JSON'], 502);
}
header('Content-Type: ' . ($format === 'json' ? 'application/json' : 'text/plain') . '; charset=utf-8');
header('Cache-Control: no-store');
header('X-Data-Fetched-At: ' . gmdate('Y-m-d\TH:i:s\Z'));
header('Access-Control-Expose-Headers: X-Data-Fetched-At');
echo $body;
