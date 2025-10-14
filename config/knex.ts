import knex from "knex";
import dotenv from "dotenv";

dotenv.config();

const setup = {
  client: "pg",
  connection: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  pool: {
    min: 2,
    max: 10
  }
};

export const dbConnectionSetup = setup;
export const db = knex(setup);
