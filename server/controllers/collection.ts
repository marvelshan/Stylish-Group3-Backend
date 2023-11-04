import { Request, Response, NextFunction } from "express";
import * as collectionModel from "../models/collection.js";
import * as productModel from "../models/product.js";
import * as productImageModel from "../models/productImage.js";
import * as productVariantModel from "../models/productVariant.js";

function mapId<Item extends { id: number }>(item: Item) {
  return item.id;
}

function mapImages(imagesObj: {
  [productId: string]: { main_image: string; images: string[] };
}) {
  return <Product extends { id: number }>(product: Product) => ({
    ...product,
    main_image: `${imagesObj[product.id]?.main_image}` ?? "",
    images: imagesObj[product.id]?.images?.map?.((image) => `${image}`) ?? [],
  });
}

function mapVariants(variantsObj: {
  [productId: string]: {
    variants: {
      color_code: string;
      size: string;
      stock: number;
    }[];
    sizes: Set<string>;
    colorsMap: { [colorCode: string]: string };
  };
}) {
  return <Product extends { id: number }>(product: Product) => ({
    ...product,
    ...variantsObj[product.id],
    sizes: Array.from(variantsObj[product.id].sizes),
    colors: Object.entries(variantsObj[product.id].colorsMap).map(
      ([key, value]) => ({
        code: key,
        name: value,
      })
    ),
  });
}

// To do
export async function getCollectionItems(req: Request, res: Response) {
  try {
    const userId = res.locals.userId;
    const paging = Number(req.query.paging) || 0;
    const productIds = await collectionModel.getCollectionItems(userId);
    const [productsData, productsCount] = await Promise.all([
      productModel.getProductsCollection({ paging, productIds }),
      productModel.countProducts({ productIds }),
    ]);
    const products = productsData?.map?.(mapId);
    const [images, variants] = await Promise.all([
      productImageModel.getProductImages(products),
      productVariantModel.getProductVariants(products),
    ]);
    const imagesObj = productImageModel.groupImages(images);
    const variantsObj = productVariantModel.groupVariants(variants);
    const productsDetails = productsData
      .map(mapImages(imagesObj))
      .map(mapVariants(variantsObj));
    res.json({
      data: productsDetails,
      ...(productModel.PAGE_COUNT * (paging + 1) < productsCount
        ? { next_paging: paging + 1 }
        : {}),
    });
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ errors: err.message });
      return;
    }
    res.status(500).json({ errors: "get collections failed" });
  }
}

export async function updateCollection(req: Request, res: Response) {
  /** #swagger.tags = ['Collection']
      #swagger.summary = '加入或刪除使用者收藏的商品'
      #swagger.responses[200] = {
      schema: { $ref: '#/definitions/CollectionSuccess' }
      }
   */

  try {
    const userId = res.locals.userId;
    const { method, productId } = req.body;
    const isProductValid = await productModel.isProductExist(productId);
    if (!isProductValid) {
      return res
        .status(400)
        .json({ success: false, message: "此商品不存在！" });
    }

    if (method === "create") {
      const isProductCollected = await collectionModel.checkProductCollected(
        userId,
        productId
      );
      if (isProductCollected) {
        return res
          .status(400)
          .json({ success: false, message: "已經收藏過此商品囉！" });
      }
      await collectionModel.createCollection(userId, productId);
      return res.json({
        success: true,
        message: "已加入收藏",
      });
    } else if (method === "delete") {
      await collectionModel.deleteCollection(userId, productId);
      return res.json({
        success: true,
        message: "已刪除收藏",
      });
    }
  } catch (err) {
    console.error(err);
    if (err instanceof Error) {
      res.status(500).json({ error: "update collection failed" });
    }
  }
}
