import { FastifyReply, FastifyRequest } from "fastify";
import { getAllMeasurements } from "../../services/measurementServices";

export const getMeasurements = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const measurements = await getAllMeasurements();
  reply.send(measurements);
};
