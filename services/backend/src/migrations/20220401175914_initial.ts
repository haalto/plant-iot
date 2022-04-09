import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

  await knex.schema.createTable("device", (table) => {
    table.text("id").primary();
  });

  await knex.schema.createTable("measurement", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
    table.uuid("device_id").notNullable().references("id").inTable("device");
    table.timestamp("measurement_time").notNullable();
    table.double("temperature").notNullable();
    table.double("humidity").notNullable();
    table.double("soil_moisture").notNullable();
    table.timestamp("created_at").defaultTo(knex.raw("NOW()"));
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("device");
  await knex.schema.dropTable("measurement");
}
