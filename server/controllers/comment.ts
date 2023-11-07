import { Request, Response } from "express";
import {
  checkIfUserBoughtTheProduct,
  insertComment,
  selectComments,
} from "../models/comments.js";
import { ValidationError } from "../utils/errorHandler.js";

export async function getProductComments(req: Request, res: Response) {
  const id = Number(req.query.id);
  const comments = await selectComments(id);
  return res.status(200).json({ data: comments });
}

export async function addComments(req: Request, res: Response) {
  try {
    const userId = res.locals.userId;
    const { comment, productId, rating } = req.body;
    const hasUserBoughtTheProduct = await checkIfUserBoughtTheProduct(
      userId,
      productId,
    );
    if (hasUserBoughtTheProduct.length === 0) {
      throw new ValidationError("僅限有購買商品之消費者評論");
    }
    await insertComment(productId, userId, comment, rating);
    return res.status(200).json({ success: true, message: "已新增評論" });
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({ error: error.message });
    }
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
