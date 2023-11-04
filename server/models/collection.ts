import { ResultSetHeader } from "mysql2";
import { z } from "zod";
import pool from "./databasePool";

/*
  id bigint unsigned NOT NULL AUTO_INCREMENT
  user_id bigint unsigned NOT NULL FOREIGN KEY
  product_id bigint unsigned NOT NULL FOREIGN KEY
  created_at
  updated_at
**/

export function instanceOfSetHeader(Object: any): Object is ResultsSetHeader {
  return "insertId" in Object;
}

const CollectionSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  product_id: z.number(),
});

export async function getCollections(userId: Number) {
  const results = await pool.query(
    `SELECT product_id FROM collections WHERE user_id = ?`,
    [userId]
  );

  const collections = z.array(CollectionSchema).parse(results[0]);
  return collections;
}
