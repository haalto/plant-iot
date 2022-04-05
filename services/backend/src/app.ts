import Fastify, { FastifyServerOptions } from "fastify";
import { measurementRoutes } from "./v1/routes/measurementRoutes";
import fastifySensible from "fastify-sensible";
import fastifySocketIO from "fastify-socket.io";

export const app = (opts?: FastifyServerOptions) => {
  const server = Fastify(opts);

  //Plugins
  server.register(fastifySensible);
  server.register(fastifySocketIO);

  //Routes
  server.register(measurementRoutes, { prefix: "/api/v1/measurement" });
  return server;
};
