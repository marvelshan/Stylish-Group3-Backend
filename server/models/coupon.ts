import pool from './databasePool.js';
import { date, z } from 'zod';
import { ResultSetHeader } from 'mysql2';

/* coupons table
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `type` VARCHAR(255) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `discount` FLOAT,
  `start_date` TIMESTAMP NOT NULL,
  `expiry_date` TIMESTAMP NOT NULL,
  `amount` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`id`));
**/

/* users_coupons table
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `coupon_id` BIGINT UNSIGNED NOT NULL,
    `isUsed` TINYINT(1) NOT NULL,
    PRIMARY KEY (`id`),
    INDEX (`user_id`),
    INDEX (`coupon_id`),
    CONSTRAINT `fk_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
    CONSTRAINT `fk_coupon_id` FOREIGN KEY (`coupon_id`) REFERENCES `coupons` (`id`)
**/

function instanceOfSetHeader(object: any): object is ResultSetHeader {
  return 'insertId' in object;
}

export const CouponSchema = z.object({
  id: z.number(),
  type: z.string(),
  title: z.string(),
  discount: z.any(),
  startDate: z.date(),
  expiredDate: z.date(),
  isUsed: z.number(),
});

export async function selectUserCoupons(userId: number) {
  const results = await pool.query(
    ` SELECT c.id,
      c.type,
      c.title,
      c.discount,
      c.start_date AS startDate,
      c.expiry_date AS expiredDate,
      uc.is_used AS isUsed
      FROM users_coupons uc
      LEFT JOIN coupons c ON uc.coupon_id = c.id
      WHERE user_id = ?`,
    [userId],
  );
  const result = z.array(CouponSchema).parse(results[0]);
  return result[0];
}

export async function selectUserInvalidCoupons(userId: number) {
  const today = new Date();
  const results = await pool.query(
    ` SELECT c.id,
    c.type,
    c.title,
    c.discount,
    c.start_date AS startDate,
    c.expiry_date AS expiredDate,
    uc.is_used AS isUsed
    FROM users_coupons uc
    LEFT JOIN coupons c ON uc.coupon_id = c.id
    WHERE user_id = ? AND (expiry_date < ? OR is_used = 1)`,
    [userId, today],
  );
  const result = z.array(CouponSchema).parse(results[0]);
  return result[0];
}

export async function insertCouponIntoUserCouponWallet(
  userId: number,
  couponId: number,
) {
  const results = await pool.query(
    `INSERT INTO users_coupons (user_id, coupon_id, is_used) VALUES (?, ?, 0)`,
    [userId, couponId],
  );
  if (Array.isArray(results) && instanceOfSetHeader(results[0])) {
    return results[0].insertId;
  }
  throw new Error('add new coupon failed');
}
