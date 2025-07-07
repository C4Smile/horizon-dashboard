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
