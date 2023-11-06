import swaggerAutogen from "swagger-autogen";
import { config } from "dotenv";

config();

const doc = {
  info: {
    title: "Stylish Co-work",
    description: "Stylish co-working project",
  },
  host: `${process.env.HOST_NAME}:3000`,
  definitions: {
    CheckoutSuccess: {
      data: {
        number: "4465123465",
      },
    },
    CheckoutList: {
      prime: "ccc1491581661f700bcc1cafec673c741f0665ca77550fe828ef38ee1437a2b8",
      couponId: 123,
      order: {
        shipping: "delivery",
        payment: "credit_card",
        subtotal: 1234,
        freight: 14,
        total: 1300,
        recipient: {
          name: "Luke",
          phone: "0987654321",
          email: "luke@gmail.com",
          address: "市政府站",
          time: "morning",
        },
        list: [
          {
            id: "201807202157",
            name: "活力花紋長筒牛仔褲",
            price: 1299,
            color: {
              code: "DDF0FF",
              name: "淺藍",
            },
            size: "M",
            qty: 1,
          },
        ],
      },
    },
    Token: {
      Authorization: "Bearer",
    },
    CollectionPostMethods: {
      productId: 123,
      method: "create",
    },
    CouponId: {
      couponId: 123,
    },
    ValidCoupons: {
      data: [
        {
          id: 123,
          type: "折扣",
          title: "Summer Sale",
          discount: 20,
          startDate: "2023-12-17T03:24:00",
          expiredDate: "2023-12-17T03:24:00",
          amount: 20,
        },
      ],
    },
    UserCoupons: {
      data: [
        {
          id: 123,
          type: "折扣",
          title: "Summer Sale",
          discount: 20,
          startDate: "2023-12-17T03:24:00",
          expiredDate: "2023-12-17T03:24:00",
          isUsed: 0,
        },
      ],
    },
    AddCoupon: {
      type: "折扣",
      title: "20",
      discount: 70,
      start_date: "2023-12-17T03:24:00",
      expiry_date: "2023-12-17T12:24:00",
      amount: 2000,
    },
    AddCouponSuccess: {
      success: true,
      message: "優惠券新增成功！",
      couponId: 123,
    },
    Collections: {
      data: {
        user_id: 1,
        products: [
          {
            id: 201902191210,
            category: "women",
            title: "精緻扭結洋裝",
            description: "厚薄：薄\r\n彈性：無",
            price: 999,
            texture: "棉 100%",
            wash: "手洗",
            place: "越南",
            note: "實品顏色依單品照為主",
            story:
              "O.N.S is all about options, which is why we took our staple polo shirt and upgraded it with slubby linen jersey, making it even lighter for those who prefer their summer style extra-breezy.",
            main_image:
              "https://api.appworks-school.tw/assets/201902191210/main.jpg",
            images: [
              "https://api.appworks-school.tw/assets/201902191210/0.jpg",
              "https://api.appworks-school.tw/assets/201902191210/1.jpg",
              "https://api.appworks-school.tw/assets/201902191210/0.jpg",
              "https://api.appworks-school.tw/assets/201902191210/1.jpg",
            ],
            variants: [
              {
                color_code: "FFFFFF",
                size: "S",
                stock: 0,
              },
              {
                color_code: "FFDDDD",
                size: "M",
                stock: 1,
              },
            ],
            colors: [
              {
                code: "FFFFFF",
                name: "白色",
              },
              {
                code: "FFDDDD",
                name: "粉紅",
              },
            ],
            sizes: ["S", "M"],
          },
        ],
      },
      next_paging: 1,
    },
    CollectionSuccess: {
      success: true,
      message: "已加入收藏",
      id: 1,
    },
    Errors: {
      error: "error message",
    },
  },
};

const outputFile = "./swagger-output.json";
const routes = ["./index.ts"];

swaggerAutogen()(outputFile, routes, doc);
