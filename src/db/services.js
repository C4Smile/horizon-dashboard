import config from "../config";

import { fromLocal } from "../utils/local";

/**
 * @description Make a request to the API
 * @param {string} url - URL to make the request
 * @param {string} method - Request method
 * @param {object} body - Request body
 * @returns Request response
 */
export async function makeRequest(url, method = "GET", body = null) {
  const request = await fetch(`${config.apiUrl}${url}`, {
    method,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    },
    body: JSON.stringify(body),
  });
  const { error, data, status } = await request.json();
  return { error, data, status };
}
