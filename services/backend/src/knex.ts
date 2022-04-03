import { Knex } from "knex";
import { config } from "./config";

const { databaseUrl } = config;

//Database configuration for Knex
const DB_CONFIG: Knex.Config = {
  migrations: {
    directory: "../migrations",
  },
  seeds: {
    directory: "../seeds",
  },
  client: "pg",
  connection: databaseUrl,
};

export default DB_CONFIG;
