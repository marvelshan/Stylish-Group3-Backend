import { Request, Response } from "express";
import * as couponModel from "../models/couponAdmin.js";
import { z } from "zod";

export async function getCoupons(req: Request, res: Response) {
  /**
  #swagger.tags = ['Admin Coupon']
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
  #swagger.summary = '讀取使用者所有可用的優惠券'
  #swagger.responses[200] = {
    schema: { $ref: '#/definitions/UserCoupons' }
  }
   */
  return res.json({
    data: [
      {
        couponId: 123,
        couponType: "折扣",
        couponTitle: "sale",
        couponExpiredDate: "2023-12-31",
        isUsed: false,
      },
      {
        couponId: 234,
        couponType: "免運",
        couponTitle: "sale",
        couponExpiredDate: "2023-12-31",
        isUsed: false,
      },
    ],
  });
}

export async function getUserInvalidCoupons(req: Request, res: Response) {
  /**
  #swagger.tags = ['User Coupon']
  #swagger.summary = '讀取使用者使用過或過期的優惠券'
  #swagger.responses[200] = {
    schema: { $ref: '#/definitions/UserCoupons' }
  }
   */
  return res.json({
    data: [
      {
        couponId: 123,
        title: "sale",
        couponType: "折扣",
        couponExpiredDate: "2023-12-31",
        isUsed: true,
      },
      {
        couponId: 123,
        title: "summer sale",
        couponType: "免運",
        couponExpiredDate: "2023-12-31",
        isUsed: false,
      },
    ],
  });
}

export async function addCoupon(req: Request, res: Response) {
  /**
  #swagger.tags = ['Admin Coupon']
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
  #swagger.responses[200] = {
    schema: { $ref: '#/definitions/AddCouponSuccess' }
  }
   */
  return res.json({
    success: true,
    message: "優惠券新增成功！",
  });
}
