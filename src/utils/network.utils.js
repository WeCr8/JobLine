// Network utilities

export async function fetchWithTimeout(resource, options = {}) {
  const { timeout = 8000 } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  const response = await fetch(resource, { ...options, signal: controller.signal });
  clearTimeout(id);
  return response;
}

export async function fetchWithRetry(resource, options = {}, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fetch(resource, options);
    } catch (err) {
      if (i === retries - 1) throw err;
    }
  }
}

export async function fetchWithBackoff(resource, options = {}, retries = 3, delay = 500) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fetch(resource, options);
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise(res => setTimeout(res, delay * Math.pow(2, i)));
    }
  }
} 