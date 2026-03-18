export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

const checkResponse = (response: Response) => {
  if (!response.ok) {
    throw new ApiError(
      response.status,
      `API request failed: ${response.status} ${response.statusText}`,
    );
  }
};

export const get = async <T>(
  getToken: () => Promise<string | undefined>,
  endpoint: string,
) => {
  const url = createFullUrl(endpoint);

  const token = await getToken();
  const requestOptions = {
    headers: { Authorization: "Bearer " + token },
  };

  const response = await fetch(url, requestOptions);
  checkResponse(response);
  const data: T = await response.json();

  return data;
};

export const patch =
  (getToken: () => Promise<string | undefined>, endpoint: string) =>
  async <TRequestBody, TRequestResult>(body: TRequestBody) => {
    const url = createFullUrl(endpoint);

    const token = await getToken();
    const requestOptions = {
      method: "PATCH",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    };

    const response = await fetch(url, requestOptions);
    checkResponse(response);
    const data: TRequestResult = await response.json();

    return data;
  };

export const post =
  (getToken: () => Promise<string | undefined>, endpoint: string) =>
  async <TRequestBody, TRequestResult>(body: TRequestBody) => {
    const url = createFullUrl(endpoint);

    const token = await getToken();
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    };

    const response = await fetch(url, requestOptions);
    checkResponse(response);
    const data: TRequestResult = await response.json();

    return data;
  };

export const httpDelete = async (
  getToken: () => Promise<string | undefined>,
  endpoint: string,
) => {
  const url = createFullUrl(endpoint);

  const token = await getToken();
  const requestOptions = {
    method: "DELETE",
    headers: { Authorization: "Bearer " + token },
  };

  const response = await fetch(url, requestOptions);
  checkResponse(response);

  return undefined as never;
};

const createFullUrl = (endpoint: string) => {
  return `${import.meta.env.VITE_API_BASE_URL}/${endpoint}`;
};
