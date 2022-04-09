import { MeasurementSchema } from "./v1/schemas/measurement";
import { Static } from "@sinclair/typebox";

export type Measurement = Static<typeof MeasurementSchema>;

export interface NewMeasurement extends Omit<Measurement, "id"> {}

export interface RawMeasurement
  extends Omit<Measurement, "id" | "measurementTime"> {
  measurementTime: number;
}
