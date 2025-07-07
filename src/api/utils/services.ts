import config from "src/config";

// types
import { HTTPResponse } from "./types";
import { BaseCommonEntityDto } from "lib";

const isAnError = (status: number) => status < 200 || status > 299;

/**
 * @description Make a request to the API
 * @param url - URL to make the request
 * @param method - Request method
 * @param body - Request body
 * @param h - Request headers
 * @returns Request response
 */
export async function makeRequest<TBody, TResponse>(
  url: string,
  method = "GET",
  body?: TBody,
  h?: HeadersInit
): Promise<HTTPResponse<TResponse>> {
  const headers = {
    "Content-Type": "application/json",
    ...(h ?? {}),
  };
  const options: RequestInit = {
    method,
    headers,
  };
  if (body) options.body = JSON.stringify(body);

  const request = await fetch(`${config.apiUrl}${url}`, options);
  const data: TResponse = await request.json();

  return {
    data,
    status: request.status,
    error: isAnError(request.status)
      ? { status: request.status, message: request.statusText }
      : null,
  };
}

export function buildQueryUrl<TFilter>(
  endpoint: string,
  params?: TFilter
): string {
  if (params) {
    const queryString = Object.entries(params)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .filter(([_, value]) => !!value)
      .flatMap(([key, value]) => {
        if (Array.isArray(value))
          return value.map((v) => `${key}[]=${encodeURIComponent(v.id ?? v)}`);
        else if (typeof value === "object" && value !== null)
          return `${key}=${encodeURIComponent((value as BaseCommonEntityDto).id ?? "")}`;
        else return `${key}=${encodeURIComponent(String(value))}`;
      })
      .join("&");

    return queryString ? `${endpoint}?${queryString}` : endpoint;
  }
  return endpoint;
}
