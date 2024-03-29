import crypto from "crypto";
import { FastifyReply, FastifyRequest } from "fastify";
import { ResultAsync } from "neverthrow";
import { invalidAuthRequest, mapRouteError, RouteError } from "./error";
import logger from "./logger";
import { isNonceValid } from "./nonce";

/**
 * Custom subset of the JSON spec that omits the 'password' field from JSON objects.
 *
 * source:
 *  - https://www.typescriptlang.org/play?#code/FDAuE8AcFMAICkDKB5AcgNQIYBsCu0BnYWE2AXlgDtcBbAI2gCdjSAfWA0RgS0oHMWJdtWzZBsdnQD2U7NEyVx7AN6wA2gGsAXBy68+AXR1I0WPIVgBfWADJYqyJgIEA7lMYATAPw7K0AG5MVkoIKBg4+ARqBiAgvKBMAGaYAMZwAApMBFKU9uK4BEyUmDTQOpw8-OKOzm6e5XpVpLCYfGVUtAzMlrEA9L2wABI0IyOwAHST4yApOZywBUzGYWaR5HnNi4zFpToARADi3O7cfFJ7ADTifpzQHjpq4s3KT82kABbcOgDkddge3yub2BVEICXu6leINIL2hcNINB27W+fGOgKh8NINVc7gh3wATABGfEAZmJJO+GOhPUxsBi1PEBiBpFa7XJwB6wCAA
 *  - https://stackoverflow.com/q/58594051/4259341
 */
export type JSONValues = number | string | null | boolean | JSONObject | JSONValues[];

export type JSONObject = { [k: string]: JSONValues } & { password?: never };

type RouteResult<T> = ResultAsync<T, RouteError>;

type RouteHandler<T> = (req: FastifyRequest) => RouteResult<T>;
type NonceRouteHandler<T> = (req: FastifyRequest, nonce: string) => RouteResult<T>;

/*
 * Sends appropriate HTTP FastifyReplys for a RouteHandler<T>
 */
const wrapHandler = <T>(handlerResult: ReturnType<RouteHandler<T>>, res: FastifyReply): void => {
  handlerResult
    .map((data) => {
      logger.debug({ data }, "Successfully sending data");
      res.status(200).send(data);
    })
    .mapErr((error) => {
      logger.error({ error }, "Failed to work on request");
      const { statusCode, errorMsg } = mapRouteError(error);
      res.status(statusCode).send({ error: errorMsg });
    });
};

export const route = <T>(handler: RouteHandler<T>) => {
  return (req: FastifyRequest, res: FastifyReply) => {
    // const sessionMgr = new SessionManager(req);

    wrapHandler(handler(req), res);
  };
};

export const nonceRoute = <T>(handler: NonceRouteHandler<T>) => {
  return (req: FastifyRequest, res: FastifyReply) => {
    const signedNonce = req.cookies["authnonce"];

    const nonce = req.unsignCookie(signedNonce || "").value || "";

    // Crypto.randomBytes(16)  encoded as base64 string results in 24 characters
    if (!isNonceValid(nonce)) {
      wrapHandler(invalidAuthRequest, res);
      return;
    }

    wrapHandler(handler(req, nonce), res);
  };
};

export const setNonceRoute = <T>(handler: NonceRouteHandler<T>) => {
  return (req: FastifyRequest, res: FastifyReply) => {
    const nonce = crypto.randomBytes(16).toString("base64");

    res.setCookie("authnonce", nonce, {
      signed: true,
    });

    wrapHandler(handler(req, nonce), res);
  };
};
