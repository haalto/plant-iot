import db from "../data-layer/postgres";
import { DBTables } from "../enums";
import { Measurement, NewMeasurement } from "../types";
import camelcaseKeys = require("camelcase-keys");
const snakecaseKeys = require("snakecase-keys");

const { MEASUREMENT } = DBTables;

export const getAllMeasurements = async () => {
  const measurements = (await db<Measurement[]>(MEASUREMENT)).map((m) =>
    camelcaseKeys(m)
  );
  return measurements;
};

export const createMeasurement = async (measurement: NewMeasurement) => {
  const result = await db<Measurement>(MEASUREMENT)
    .insert(snakecaseKeys(measurement))
    .returning("id");
  return result[0];
};
