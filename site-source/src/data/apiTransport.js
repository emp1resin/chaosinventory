import { recordDiagnostic, describeRequest } from './diagnostics.js';

export class ApiError extends Error {
  constructor(code, message, detail = {}) {
    super(message);
    this.name = code === 'CANCELLED' ? 'AbortError' : 'ApiError';
    this.code = code;
    Object.assign(this, detail);
  }
}
export function throwIfCancelled(signal) {
  if (signal?.aborted) throw new ApiError('CANCELLED', 'Загрузка отменена.');
}

// The deadline covers headers AND the body, including a stalled response body.
export async function requestData(url, { signal, timeoutMs = 15000, format = 'json', source = 'game', maxBytes = 500000 } = {}) {
  throwIfCancelled(signal);
  const controller = new AbortController();
  const started = Date.now();
  let timeout, abort, status;
  const interruption = new Promise((_, reject) => {
    abort = () => { controller.abort(); reject(new ApiError('CANCELLED', 'Загрузка отменена.')); };
    signal?.addEventListener('abort', abort, { once: true });
    timeout = setTimeout(() => {
      controller.abort();
      reject(new ApiError('TIMEOUT', `Нет ответа за ${timeoutMs / 1000} с.`, {retryable:true}));
    }, timeoutMs);
  });
  try {
    const result = await Promise.race([interruption, (async () => {
      const response = await fetch(url, {signal:controller.signal, cache:'no-store', credentials:'omit'});
      status = response.status;
      const text = await response.text();
      if (!response.ok) {
        let detail; try { detail = JSON.parse(text); } catch {}
        throw new ApiError(detail?.code || 'HTTP', detail?.error || `HTTP ${response.status}`, {
          status, upstreamStatus:detail?.upstreamStatus, retryable:status === 429 || status >= 500,
        });
      }
      if (new TextEncoder().encode(text).length > maxBytes) throw new ApiError('RESPONSE_TOO_LARGE', 'Ответ игры превышает допустимый размер.');
      if (format === 'text') return text;
      try { return JSON.parse(text); }
      catch { throw new ApiError('INVALID_JSON', 'Игра вернула ответ, который не является JSON.'); }
    })()]);
    recordDiagnostic('request_ok', {source, path:describeRequest(url), status, ms:Date.now()-started});
    return result;
  } catch (error) {
    const classified = signal?.aborted ? new ApiError('CANCELLED', 'Загрузка отменена.') :
      error instanceof ApiError ? error : new ApiError('NETWORK', 'Браузер не получил ответ сервера (сеть или CORS).', {retryable:true});
    recordDiagnostic('request_failed', {source, path:describeRequest(url), code:classified.code,
      status:classified.status || status || 0, upstreamStatus:classified.upstreamStatus || 0,
      message:classified.message.slice(0,180), ms:Date.now()-started});
    throw classified;
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener('abort', abort);
  }
}
