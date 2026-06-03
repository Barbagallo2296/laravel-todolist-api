async function apiRequest(url, method = 'GET', data = null, headers = {}) {
  // RECUPERA IL TOKEN: Prende il token salvato nel browser durante il login
  const token = localStorage.getItem('token');

  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      // SE IL TOKEN ESISTE: Lo aggiunge in automatico all'header della richiesta HTTP
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...headers
    }
  };

  if (method !== 'GET' && data) {
    options.body = JSON.stringify(data);
  }

  if (method === 'GET' && data) {
    const params = new URLSearchParams(data).toString();
    url += '?' + params;
  }

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
}