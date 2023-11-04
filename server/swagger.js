import swaggerAutogen from 'swagger-autogen';
import { config } from 'dotenv';

config();

const doc = {
  info: {
    title: 'Stylish Co-work',
    description: 'Stylish co-working project',
  },
  host: `${process.env.HOST_NAME}:3000`,
  definitions: {
    CollectionPostMethods: {
      method: 'create',
    },
    ValidCoupons: {
      data: [
        {
          couponId: 123,
          couponType: '折扣',
          couponTitle: '20% Off',
          couponDiscount: 0.8,
          couponStartDate: '2022-12-31',
          couponExpiredDate: '2023-12-31',
          couponAmount: 20,
        },
      ],
    },
    UserCoupons: {
      data: [
        {
          couponId: 123,
          couponType: '折扣',
          couponTitle: '20% Off',
          couponDiscount: 0.8,
          couponStartDate: '2022-12-31',
          couponExpiredDate: '2023-12-31',
          couponAmount: 20,
        },
      ],
    },
    AddCouponSuccess: {
      success: true,
      message: '優惠券新增成功！',
    },
    Collections: {
      data: {
        user_id: 1,
        products: [
          {
            id: 201902191210,
            category: 'women',
            title: '精緻扭結洋裝',
            description: '厚薄：薄\r\n彈性：無',
            price: 999,
            texture: '棉 100%',
            wash: '手洗',
            place: '越南',
            note: '實品顏色依單品照為主',
            story:
              'O.N.S is all about options, which is why we took our staple polo shirt and upgraded it with slubby linen jersey, making it even lighter for those who prefer their summer style extra-breezy.',
            main_image:
              'https://api.appworks-school.tw/assets/201902191210/main.jpg',
            images: [
              'https://api.appworks-school.tw/assets/201902191210/0.jpg',
              'https://api.appworks-school.tw/assets/201902191210/1.jpg',
              'https://api.appworks-school.tw/assets/201902191210/0.jpg',
              'https://api.appworks-school.tw/assets/201902191210/1.jpg',
            ],
            variants: [
              {
                color_code: 'FFFFFF',
                size: 'S',
                stock: 0,
              },
              {
                color_code: 'FFDDDD',
                size: 'M',
                stock: 1,
              },
            ],
            colors: [
              {
                code: 'FFFFFF',
                name: '白色',
              },
              {
                code: 'FFDDDD',
                name: '粉紅',
              },
            ],
            sizes: ['S', 'M'],
          },
        ],
      },
      next_paging: 1,
    },
    CollectionSuccess: {
      success: true,
      message: '已加入收藏',
      id: 1,
    },
    Errors: {
      error: 'error message',
    },
  },
};

const outputFile = './swagger-output.json';
const routes = ['./index.ts'];

swaggerAutogen()(outputFile, routes, doc);
