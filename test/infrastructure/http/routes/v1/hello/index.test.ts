import { FastifyInstance } from "fastify";
import { beforeEach, describe, expect, test } from "vitest";
import { createServer } from "../../../../../utils/buildServer.js";

describe("GET /v1/hello", () => {
  let server: FastifyInstance;

  beforeEach(async () => {
    server = await createServer();
  });

  test("should return hello world", async () => {
    const response = await server.inject({
      method: "GET",
      url: "/api/v1/hello",
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ message: "Hello world" });
  });
});
