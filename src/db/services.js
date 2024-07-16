import config from "../config";

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
  return { data, error: { status: request.status, message: request.statusText } };
}
