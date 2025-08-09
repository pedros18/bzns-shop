import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";
dotenv.config();

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;
export const db = neon(
`postgres://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?sslmode=require`,
);
