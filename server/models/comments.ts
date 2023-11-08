import { ResultSetHeader } from "mysql2";
import { z } from "zod";
import pool from "./databasePool.js";

/**
 * id INT NOT NULL AUTO_INCREMENT,
 * product_id INT NOT NULL,
 * user_id INT NOT NULL,
 * comment TEXT NOT NULL,
 * rating INT NOT NULL,
 * created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 */

function instanceOfSetHeader(object: any): object is ResultSetHeader {
  return "insertId" in object;
}

export const commentSchema = z.array(
  z.object({
    commentId: z.number(),
    username: z.string(),
    productId: z.number(),
    userId: z.number(),
    comment: z.string(),
    rating: z.number(),
    createdAt: z.date(),
  }),
);

export async function selectComments(productId: number) {
  const results = await pool.query(
    `SELECT c.id AS commentId, u.name AS username, c.product_id AS productId, c.user_id AS userId, c.comment, c.rating, c.created_at AS createdAt
    FROM comments c
    LEFT JOIN users u ON c.user_id = u.id
    WHERE c.product_id = ?`,
    [productId],
  );
  const result = z.array(commentSchema).parse(results[0]);
  return result;
}

export async function insertComment(
  productId: number,
  userId: number,
  comment: string,
  rating: number,
) {
  const [results] = await pool.query(
    `INSERT INTO comments (product_id, user_id, comment, rating) VALUES (?, ?, ?, ?)`,
    [productId, userId, comment, rating],
  );
  if (instanceOfSetHeader(results)) {
    return results.insertId;
  }
}

export async function checkIfUserBoughtTheProduct(
  userId: number,
  productId: number,
) {
  const results = await pool.query(
    `SELECT orders.id FROM orders LEFT JOIN order_details ON orders.id = order_details.orders_id WHERE user_id = ? AND product_id = ?`,
    [userId, productId],
  );
  const result = z.array(z.object({ id: z.number() })).parse(results[0]);
  return result;
}
