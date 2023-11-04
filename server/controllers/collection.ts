import { Request, Response, NextFunction } from 'express';

// To do
export async function getCollection(req: Request, res: Response) {
  /*  #swagger.tags = ['Collection']
      #swagger.parameters['Authorization'] = {
      in: 'header',
      description: 'Bearer Token',
      schema: { $ref: '#/definitions/Token' }
      }
      #swagger.summary = '取得使用者的收藏商品'
      #swagger.responses[200] = {
        schema: { $ref: '#/definitions/Collections' }
      } 
      #swagger.responses[500] = {
        schema: { $ref: '#/definitions/Errors' }
      }
  */
  return res.json({
    data: {
      id: 1,
      user_id: 1,
      products: [
        {
          id: 1,
          title: '好看上衣',
          image: 'https://picsum.photos/200/300',
        },
      ],
    },
  });
}

export async function addProductToCollection(req: Request, res: Response) {
  /** #swagger.tags = ['Collection']
      #swagger.parameters['Authorization'] = {
      in: 'header',
      description: 'Bearer Token',
      schema: { $ref: '#/definitions/Token' }
      }
      #swagger.summary = '加入或刪除使用者收藏的商品'
      #swagger.parameters['body'] = {
        in: 'body',
        description: 'method: create or delete',
        required: true,
        schema: { $ref: '#/definitions/CollectionPostMethods' }
      }
      #swagger.responses[200] = {
      schema: { $ref: '#/definitions/CollectionSuccess' }
      }
   */
  return res.json({
    success: true,
    message: '已加入收藏',
    id: 1,
  });
}
