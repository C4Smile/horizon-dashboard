// config
import config from "../../config";

// types
import { HTTPResponse } from "./types";

// lib
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
  h?: HeadersInit,
): Promise<HTTPResponse<TResponse>> {
  const headers = {
    "Content-Type": "application/json",
    ...h,
  };
  const options: RequestInit = {
    method,
    headers,
  };
  if (body) options.body = JSON.stringify(body);

  const request = await fetch(`${config.apiUrl}${url}`, options);
  // some endpoints answer 204 with an empty body
  const raw = await request.text();
  const data: TResponse = raw ? JSON.parse(raw) : (null as TResponse);

  return {
    data,
    status: request.status,
    error: isAnError(request.status)
      ? {
          status: request.status,
          // nest sends the reason in the body, statusText is usually empty
          message:
            (data as { message?: string })?.message ??
            request.statusText ??
            String(request.status),
        }
      : null,
  };
}

export function buildQueryUrl<TFilter>(
  endpoint: string,
  params?: TFilter,
): string {
  if (params) {
    const queryString = Object.entries(params)
      // only empties are dropped: 0 and false are meaningful here, page 0 is
      // the first page and deleted=false is the default list filter
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .filter(([_, value]) => value !== undefined && value !== null && value !== "")
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
