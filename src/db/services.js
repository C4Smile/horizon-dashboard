import config from "../config";

/**
 * @description Make a request to the API
 * @param {string} url - URL to make the request
 * @param {string} method - Request method
 * @param {object} body - Request body
 * @param {object} headers - Request headers
 * @returns Request response
 */
export async function makeRequest(url, method = "GET", body = null, headers = null) {
  const h = {
    "Content-Type": "application/json",
    ...(headers ?? {}),
  };
  const b = body ? JSON.stringify(body) : null;
  const request = await fetch(`${config.apiUrl}${url}`, {
    method,
    headers: h,
    body: b,
  });
  const data = await request.json();
  return { data, error: { status: request.status, message: request.statusText } };
}
