import { Type } from "@sinclair/typebox";

export const MeasurementSchema = Type.Object({
  id: Type.String({ format: "uuid" }),
  deviceId: Type.String({ format: "uuid" }),
  measurementTime: Type.String({ format: "date-time" }),
  temperature: Type.Number(),
  humidity: Type.Number(),
  soilMoisture: Type.Number(),
});

export const GetMeasurementsResponseSchema = {
  200: Type.Array(MeasurementSchema, { minItems: 0 }),
};
