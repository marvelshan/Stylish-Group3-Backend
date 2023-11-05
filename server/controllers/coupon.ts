import { Request, Response } from 'express';
import {
  insertCouponIntoUserCouponWallet,
  selectUserCoupons,
  selectUserInvalidCoupons,
} from '../models/coupon.js';
import * as couponModel from "../models/couponAdmin.js";

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
    res.send(result);
  } catch (error) {
    res.status(404).json({ success: false, message: "讀取優惠券失敗" });
  }
  return res.json({
    data: [
      {
        couponId: 123,
        couponType: "折扣",
        couponTitle: "20% Off",
        couponExpiredDate: "2023-12-31",
        couponAmount: 20,
      },
      {
        couponId: 394,
        couponType: "折扣",
        couponTitle: "Summer Sale",
        couponExpiredDate: "2023-12-31",
        couponAmount: 20,
      },
    ],
  });
}

export async function getUserCoupons(req: Request, res: Response) {
  /**
  #swagger.tags = ['User Coupon']
  #swagger.parameters['Authorization'] = {
  in: 'header',
  description: 'Bearer Token',
  schema: { $ref: '#/definitions/Token' }
  }
  #swagger.summary = '讀取使用者所有可用的優惠券'
  #swagger.responses[200] = {
    schema: { $ref: '#/definitions/UserCoupons' }
  }
   */
  try {
    const userId = res.locals.userId;
    const result = await selectUserCoupons(userId);

    return res.json(result);
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({ errors: err.message });
      return;
    }
    return res.status(500).json({ errors: 'Internal server error' });
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

    return res.json(result);
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({ errors: err.message });
      return;
    }
    return res.status(500).json({ errors: 'Internal server error' });
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
  #swagger.summary = '管理員新增優惠券'
  #swagger.responses[200] = {
    schema: { $ref: '#/definitions/AddCouponSuccess' }
  }
   */
  try {
    const { type, title, discount, startDate, expiredDate, amount } = req.body;
    if (
      type === undefined ||
      title === undefined ||
      discount === undefined ||
      startDate === undefined ||
      expiredDate === undefined ||
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
      typeof startDate !== "string" ||
      typeof expiredDate !== "string" ||
      typeof amount !== "number"
    ) {
      return res.status(400).json({
        success: false,
        message: "注意!資料型別錯誤",
      });
    }
    const result = await couponModel.createCoupon(
      type,
      title,
      discount,
      startDate,
      expiredDate,
      amount
    );
    if (result) {
      return res.json({
        success: true,
        message: "優惠券新增成功！",
      });
    }
  } catch (error) {
    res.status(404).json({ success: false, message: "新增優惠券失敗" });
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
    const { couponId } = req.body;
    const result = await insertCouponIntoUserCouponWallet(userId, couponId);

    return res.json({
      success: true,
      message: '優惠券綁定成功！',
      coupon_id: result,
    });
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({ errors: err.message });
      return;
    }
    return res.status(500).json({ errors: 'Internal server error' });
  }
}
