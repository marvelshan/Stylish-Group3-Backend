import { ResultSetHeader } from "mysql2";
import { z } from "zod";
import pool from "./databasePool.js";

/*
  id bigint unsigned NOT NULL AUTO_INCREMENT
  user_id bigint unsigned NOT NULL FOREIGN KEY
  product_id bigint unsigned NOT NULL FOREIGN KEY
  created_at
  updated_at
**/

// function instanceOfSetHeader(object: any): object is ResultSetHeader {
//   return "insertId" in object;
// }

const ProductIdSchema = z.object({
  product_id: z.number(),
});

export async function getCollectionItems(userId: Number) {
  const [
    rows,
  ] = await pool.query(
    `SELECT product_id FROM user_collections WHERE user_id = ?`,
    [userId]
  );

  const collectionItems = z.array(ProductIdSchema).parse(rows);
  const productIds = collectionItems.map((item: any) => item.product_id);
  return productIds;
}

export async function checkProductCollected(userId: number, productId: number) {
  try {
    const productIds = await getCollectionItems(userId);
    return productIds.some((item: number) => item === productId);
  } catch (err) {
    console.error(err);
    return false;
  }
}

export async function createCollection(userId: number, productId: number) {
  try {
    const [results] = await pool.query<ResultSetHeader>(
      `INSERT INTO user_collections (user_id, product_id) VALUES (?, ?)`,
      [userId, productId]
    );
    return results.insertId;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function deleteCollection(userId: number, productId: number) {
  try {
    const [results] = await pool.query<ResultSetHeader>(
      `DELETE FROM user_collections WHERE user_id = ? AND product_id = ?`,
      [userId, productId]
    );
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}
