const configuredApiBase = import.meta.env?.VITE_CHAOS_API_BASE;
export const apiBase = configuredApiBase === 'same-origin' ? '' :
  (configuredApiBase || 'https://chaosinventory-data.emp1res1n.chatgpt.site').replace(/\/$/, '');
export const buildVersion = import.meta.env?.VITE_BUILD_SHA || 'development';
