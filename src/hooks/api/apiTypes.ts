import type { operations } from "./types";

export type ApiResponse<Op extends keyof operations> =
  operations[Op] extends {
    responses: { 200: { content: { "application/json": infer R } } };
  }
    ? R
    : never;

export type ApiRequestBody<Op extends keyof operations> =
  operations[Op] extends {
    requestBody: { content: { "application/json": infer B } };
  }
    ? B
    : never;

export type ApiPathParams<Op extends keyof operations> =
  operations[Op] extends { parameters: { path: infer P } } ? P : never;
