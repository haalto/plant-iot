import { FastifyInstance, RouteHandlerMethod } from "fastify";
import { getMeasurements } from "../controllers/measurementControllers";
import { GetMeasurementsResponseSchema } from "../schemas/measurement";

export const measurementRoutes = (server: FastifyInstance) => {
  server.get(
    "/",
    {
      schema: {
        response: GetMeasurementsResponseSchema,
      },
    },
    getMeasurements
  );
  return server;
};
