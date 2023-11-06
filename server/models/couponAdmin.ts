import { ResultSetHeader } from "mysql2";
import pool from "./databasePool.js";

export async function createCoupon(
  type: string,
  title: string,
  discount: number,
  start_date: string,
  expiry_date: string,
  amount: number
) {
  try {
    const results = await pool.query(
      `INSERT INTO coupons (type, title, discount, start_date, expiry_date, amount)
      VALUES(?, ?, ?, ?, ?, ?);`,
      [type, title, discount, start_date, expiry_date, amount]
    );
    return results;
  } catch (error) {
    console.log(`createcoupon model is error by ${error}`);
  }
}

export async function searchCoupon() {
  try {
    const results = await pool.query(`SELECT * FROM coupons`);
    return results[0];
  } catch (error) {
    console.log(`searchCoupon model is error by ${error}`);
  }
}

export async function deleteAdminCoupon(id: number) {
  const results = await pool.query<ResultSetHeader>(
    `UPDATE coupons SET amount = 0 WHERE id = ? `,
    [id]
  );
  return results[0].affectedRows;
}
