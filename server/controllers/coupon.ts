import { Request, Response } from 'express';

export async function getCoupons(req: Request, res: Response) {
  /**
  #swagger.tags = ['Admin Coupon']
  #swagger.summary = '讀取目前可用的優惠券'
  #swagger.responses[200] = {
    schema: { $ref: '#/definitions/ValidCoupons' }
  }
   */
  return res.json({
    data: [
      {
        couponId: 123,
        couponType: '折扣',
        couponTitle: '20% Off',
        couponExpiredDate: '2023-12-31',
        couponAmount: 20,
      },
      {
        couponId: 394,
        couponType: '折扣',
        couponTitle: 'Summer Sale',
        couponExpiredDate: '2023-12-31',
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
        couponType: '折扣',
        couponTitle: 'sale',
        couponExpiredDate: '2023-12-31',
        isUsed: false,
      },
      {
        couponId: 234,
        couponType: '免運',
        couponTitle: 'sale',
        couponExpiredDate: '2023-12-31',
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
        title: 'sale',
        couponType: '折扣',
        couponExpiredDate: '2023-12-31',
        isUsed: true,
      },
      {
        couponId: 123,
        title: 'summer sale',
        couponType: '免運',
        couponExpiredDate: '2023-12-31',
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
  return res.json({
    success: true,
    message: '優惠券新增成功！',
  });
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
    message: '優惠券新增成功！',
  });
}
