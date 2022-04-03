import Fastify, { FastifyServerOptions } from "fastify";
import { measurementRoutes } from "./v1/routes/measurementRoutes";
import fastifySensible from "fastify-sensible";

export const app = (opts?: FastifyServerOptions) => {
  const server = Fastify(opts);

  //Plugins
  server.register(fastifySensible);

  //Routes
  server.register(measurementRoutes, { prefix: "/api/v1/measurement" });
  return server;
};
