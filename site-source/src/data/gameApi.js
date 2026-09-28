const gameBridge = 'https://chaosinventory-data.emp1res1n.chatgpt.site/api/game-json';
const namedRequests = new Set(['user_equipment_list', 'user_fraction', 'clan_list_by_user_name']);
import { recordDiagnostic, describeRequest } from './diagnostics';

function bridgeUrlFor(url) {
	const source = new URL(url);
	if (source.origin !== 'https://chaosage.ru' || source.pathname !== '/sAPI2.php') return null;
	const request = source.searchParams.get('request');
	const target = new URL(gameBridge);
	if (namedRequests.has(request)) {
		target.searchParams.set('user_name', source.searchParams.get('user_name') || '');
	} else if (request === 'equipment_info') {
		target.searchParams.set('id', source.searchParams.get('id') || '');
	} else return null;
	target.searchParams.set('request', request);
	return target.toString();
}

async function requestJson(url, timeoutMs) {
	const started = Date.now();
	const source = url.startsWith(gameBridge) ? 'bridge' : 'direct';
	const path = describeRequest(url);
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), timeoutMs);
	try {
		const response = await fetch(url, {signal: controller.signal});
		if (!response.ok) {
			recordDiagnostic('game_http', { source, path, status: response.status, ms: Date.now() - started });
			throw new Error(`HTTP ${response.status}`);
		}
		const body = await response.text();
		const parsed = body ? JSON.parse(body) : null;
		recordDiagnostic('game_ok', { source, path, status: response.status, ms: Date.now() - started });
		return parsed;
	} catch (error) {
		recordDiagnostic('game_failed', { source, path, error: error.name, message: String(error.message).slice(0, 120), ms: Date.now() - started });
		throw error;
	} finally {
		clearTimeout(timeout);
	}
}

export async function fetchGameJson(url) {
	const bridge = bridgeUrlFor(url);
	try {
		return await requestJson(url, bridge ? 7000 : 15000);
	} catch (directError) {
		if (bridge) {
			try {
				return await requestJson(bridge, 15000);
			} catch (bridgeError) {
				throw new Error(`Игровые данные недоступны ни напрямую, ни через резервный сервер: ${bridgeError.message}`);
			}
		}
		await new Promise(resolve => setTimeout(resolve, 350));
		try {
			return await requestJson(url, 15000);
		} catch (retryError) {
			throw new Error(`Игровой API не ответил: ${url.split('?')[0]} (${retryError.message || directError.message})`);
		}
	}
}

export async function fetchOptionalGameJson(url) {
	try {
		return await fetchGameJson(url);
	} catch (error) {
		console.warn('Дополнительные данные временно недоступны', error);
		return null;
	}
}
