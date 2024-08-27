import config from "../config";

const isAnError = (status) => status < 200 || status > 299;

/**
 * @description Make a request to the API
 * @param {string} url - URL to make the request
 * @param {string} method - Request method
 * @param {object} body - Request body
 * @param {object} h - Request headers
 * @returns Request response
 */
export async function makeRequest(url, method = "GET", body = null, h = null) {
  const headers = {
    "Content-Type": "application/json",
    ...(h ?? {}),
  };
  const options = {
    method,
    headers,
  };
  if (body) options.body = JSON.stringify(body);

  const request = await fetch(`${config.apiUrl}${url}`, options);
  const data = await request.json();

  return {
    data,
    status: request.status,
    error: isAnError(request.status) ? { status: request.status, message: request.statusText } : null,
  };
}
