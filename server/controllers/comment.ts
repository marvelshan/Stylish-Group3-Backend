import { Request, Response } from "express";
import {
  checkIfUserBoughtTheProduct,
  insertComment,
  selectComments,
} from "../models/comments.js";
import { ValidationError } from "../utils/errorHandler.js";

export async function getProductComments(req: Request, res: Response) {
  /**
    #swagger.tags = ['Comments']
    #swagger.summary = '取得商品的評論'
    #swagger.description = '取得商品的評論'
    #swagger.parameters['product_id'] = {
      in: 'query',
      description: '商品id',
      required: true,
      type: 'number'
    }
    #swagger.responses[200] = {
      schema: { $ref: '#/definitions/Comments' }
    }
   */
  try {
    const productId = Number(req.query.product_id);
    if (isNaN(productId)) throw new ValidationError("id must be a number");
    const comments = await selectComments(productId);
    return res.status(200).json({ data: comments });
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({ error: error.message });
    }
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function addComments(req: Request, res: Response) {
  /**
    #swagger.tags = ['Comments']
    #swagger.summary = '新增評論'
    #swagger.description = '新增評論'
    #swagger.parameters['comment'] = {
      in: 'body',
      description: '評論內容',
      required: true,
      schema: { $ref: '#/definitions/PostCommentBody' }
    }
    #swagger.responses[200] = {
      schema: { $ref: '#/definitions/SuccessComment' }
    }
    #swagger.responses[400] = {
      schema: { $ref: '#/definitions/FailedComment' }
    }
  */
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
      return res.status(500).json({ error: error.message });
    }
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
