import { Knex } from "knex";
import { config } from "./config";

const { dbName, dbPassowrd, dbUser, dbHost } = config;

//Database configuration for Knex
const DB_CONFIG: Knex.Config = {
  migrations: {
    directory: "../migrations",
  },
  seeds: {
    directory: "../seeds",
  },
  client: "pg",
  connection: {
    host: dbHost,
    user: dbUser,
    password: dbPassowrd,
    database: dbName,
  },
};

export default DB_CONFIG;
