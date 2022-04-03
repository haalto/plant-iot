import { MeasurementSchema } from "./v1/schemas/measurement";
import { Static } from "@sinclair/typebox";

export type Measurement = Static<typeof MeasurementSchema>;

export type NewMeasurement = Omit<Measurement, "id">;
