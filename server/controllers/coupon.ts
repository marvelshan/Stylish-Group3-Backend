import { Request, Response } from "express";
import {
  checkIfUserHasCoupon,
  insertCouponIntoUserCouponWallet,
  selectAvailableCoupons,
  selectCoupon,
  selectUserCoupons,
  selectUserInvalidCoupons,
  selectUserValidCoupons,
  setDBCouponToAmountMinusOne,
  setDBCouponToZero,
} from "../models/coupon.js";
import * as couponModel from "../models/couponAdmin.js";
import { cache, del, get, set } from "../utils/cache.js";
import { ValidationError } from "../utils/errorHandler.js";

export async function getCoupons(req: Request, res: Response) {
  /**
  #swagger.tags = ['Admin Coupon']
  #swagger.parameters['Authorization'] = {
  in: 'header',
  description: 'Bearer Token',
  schema: { $ref: '#/definitions/Token' }
  }
  #swagger.summary = '讀取目前可用的優惠券'
  #swagger.responses[200] = {
    schema: { $ref: '#/definitions/ValidCoupons' }
  }
   */
  try {
    const result = await couponModel.searchCoupon();
    res.status(200).json({ data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: "讀取優惠券失敗" });
  }
}

export async function deleteCoupon(req: Request, res: Response) {
  /**
  #swagger.tags = ['Admin Coupon']
  #swagger.parameters['Authorization'] = {
  in: 'header',
  description: 'Bearer Token',
  schema: { $ref: '#/definitions/Token' }
  }
  #swagger.parameters['Request Body'] = {
  in: 'body',
  description: 'Request body',
  schema: { $ref: '#/definitions/CouponId' }
  }
  #swagger.summary = '讓目前優惠券變為零'
  #swagger.responses[200] = {
    schema: { $ref: '#/definitions/ValidCoupons' }
  }
   */
  try {
    const { id } = req.body;
    const isDeleteAdminCoupon = await couponModel.deleteAdminCoupon(id);
    if (isDeleteAdminCoupon === 1) {
      res
        .status(200)
        .json({ success: true, message: "已成功將優惠券數量更改為零" });
    } else {
      res.status(400).json({ success: false, message: "刪除優惠券失敗" });
    }
  } catch (error) {
    console.log(`deleteCoupon is error on ${error}`);
    res.status(500).json({ success: false, message: "刪除優惠券失敗" });
  }
}

export async function getUserCoupons(req: Request, res: Response) {
  /**
  #swagger.tags = ['User Coupon']
  #swagger.parameters['Authorization'] = {
  in: 'header',
  description: 'Bearer Token',
  schema: { $ref: '#/definitions/Token' }
  }
  #swagger.summary = '讀取使用者所有的優惠券'
  #swagger.responses[200] = {
    schema: { $ref: '#/definitions/UserCoupons' }
  }
   */
  try {
    const userId = res.locals.userId;
    const result = await selectUserCoupons(userId);

    return res.json({ data: result });
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({ errors: err.message });
      return;
    }
    return res.status(500).json({ errors: "Internal server error" });
  }
}

export async function getUserValidCoupons(req: Request, res: Response) {
  /**
  #swagger.tags = ['User Coupon']
  #swagger.parameters['Authorization'] = {
  in: 'header',
  description: 'Bearer Token',
  schema: { $ref: '#/definitions/Token' }
  }
  #swagger.summary = '讀取使用者尚未使用且未過期的優惠券'
  #swagger.responses[200] = {
    schema: { $ref: '#/definitions/UserCoupons' }
  }
   */
  try {
    const userId = res.locals.userId;
    const result = await selectUserValidCoupons(userId);

    return res.json({ data: result });
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({ errors: err.message });
      return;
    }
    return res.status(500).json({ errors: "Internal server error" });
  }
}

export async function getUserInvalidCoupons(req: Request, res: Response) {
  /**
  #swagger.tags = ['User Coupon']
  #swagger.parameters['Authorization'] = {
  in: 'header',
  description: 'Bearer Token',
  schema: { $ref: '#/definitions/Token' }
  }
  #swagger.summary = '讀取使用者使用過或過期的優惠券'
  #swagger.responses[200] = {
    schema: { $ref: '#/definitions/UserCoupons' }
  }
   */
  try {
    const userId = res.locals.userId;
    const result = await selectUserInvalidCoupons(userId);

    return res.json({ data: result });
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({ errors: err.message });
      return;
    }
    return res.status(500).json({ errors: "Internal server error" });
  }
}

export async function addCoupon(req: Request, res: Response) {
  /**
  #swagger.tags = ['Admin Coupon']
  #swagger.parameters['Authorization'] = {
  in: 'header',
  description: 'Bearer Token',
  schema: { $ref: '#/definitions/Token' }
  }
  #swagger.parameters['body'] = {
  in: 'body',
  required: true,
  description: '優惠券',
  schema: { $ref: '#/definitions/AddCoupon' } 
  }
  #swagger.summary = '管理員新增優惠券'
  #swagger.responses[200] = {
    schema: { $ref: '#/definitions/AddCouponSuccess' }
  }
   */
  try {
    const { type, title, discount, start_date, expiry_date, amount } = req.body;
    if (
      type === undefined ||
      title === undefined ||
      discount === undefined ||
      start_date === undefined ||
      expiry_date === undefined ||
      amount === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "注意!每格必須添入資料",
      });
    }
    if (
      typeof type !== "string" ||
      typeof title !== "string" ||
      typeof discount !== "number" ||
      typeof start_date !== "string" ||
      typeof expiry_date !== "string" ||
      typeof amount !== "number"
    ) {
      return res.status(400).json({
        success: false,
        message: "注意!資料型別錯誤",
      });
    }
    if (new Date(expiry_date) < new Date(start_date)) {
      return res.status(400).json({
        success: false,
        message: "注意!結束時間不能小於開始時間",
      });
    }
    const result = await couponModel.createCoupon(
      type,
      title,
      discount,
      start_date,
      expiry_date,
      amount,
    );
    await cache.set(result.toString(), amount);

    if (result) {
      return res.json({
        success: true,
        message: "優惠券新增成功！",
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "新增優惠券失敗" });
  }
}

export async function addCouponToUserCouponWallet(req: Request, res: Response) {
  /**
  #swagger.tags = ['User Coupon']
  #swagger.summary = '將優惠券與使用者帳號綁定'
  #swagger.parameters['Authorization'] = {
  in: 'header',
  description: 'Bearer Token',
  schema: { $ref: '#/definitions/Token' }
  }
  #swagger.parameters['method'] = {
  in: 'body',
  description: 'couponId',
  required: true,
  schema: { $ref: '#/definitions/CouponId' }
  }
  #swagger.parameters['method'] = {
  in: 'body',
  description: 'couponId',
  required: true,
  schema: { $ref: '#/definitions/CouponId' }
  }
  #swagger.responses[200] = {
    schema: { $ref: '#/definitions/AddCouponSuccess' }
  }
   */
  try {
    const { userId } = res.locals;
    const couponId = req.body.id;

    const isCouponAlreadyExist = await checkIfUserHasCoupon(userId, couponId);
    if (isCouponAlreadyExist.length > 0)
      throw new ValidationError("已經領過囉！");

    const lock = cache.set(`lock:${couponId}`, "1", "PX", 5000, "NX");

    if (!lock) throw new ValidationError("活動太熱烈了!請再試一次");

    const cachedCoupon = await cache.get(couponId);

    if (cachedCoupon) {
      const coupon: number = +cachedCoupon;

      if (coupon <= 0) {
        throw new ValidationError("優惠券已經被搶完了！");
      }

      const minusOne = await cache.decr(couponId);
      await setDBCouponToAmountMinusOne(couponId);
      await insertCouponIntoUserCouponWallet(userId, couponId);
      del(`lock:${couponId}`);
      console.log(minusOne);

      return res.json({
        success: true,
        message: "優惠券綁定成功！",
        couponId,
      });
    } else {
      // If key is not in cache, fetch from DB
      const dbCoupon = await selectCoupon(couponId);

      await cache.set(couponId, dbCoupon[0].amount);

      if (dbCoupon[0].amount <= 0)
        throw new ValidationError("優惠券已經用完了！");

      await setDBCouponToAmountMinusOne(couponId);
      await insertCouponIntoUserCouponWallet(userId, couponId);

      return res.json({
        success: true,
        message: "優惠券綁定成功！",
        couponId,
      });
    }
  } catch (err) {
    if (err instanceof Error) {
      return res.status(400).json({ errors: err.message });
    }
    return res.status(500).json({ errors: "Internal server error" });
  }
}

export async function getAvailableCoupons(req: Request, res: Response) {
  /**
  #swagger.tags = ['User Coupon']
  #swagger.summary = '查詢目前可用的優惠券'
  #swagger.responses[200] = {
    schema: { $ref: '#/definitions/ValidCoupons' }
  }
  */
  const result = await selectAvailableCoupons();
  return res.json({ data: result });
}
