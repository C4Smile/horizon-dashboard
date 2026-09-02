export type HTTPResponse<TResponse> = {
  data: TResponse;
  status: number;
  error: {
    status: number;
    message: string;
  } | null;
};

export type HTTPError = {
  status: number;
};

/**
 * @class HttpRequestError
 * @description Error thrown by the api layer, keeps the http status of the failed request
 */
export class HttpRequestError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "HttpRequestError";
    this.status = status;
  }
}
