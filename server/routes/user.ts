import { Router, Response, Request } from "express";
import { body } from "express-validator";
import { signUp, signIn, fbLogin, getProfile } from "../controllers/user.js";
import { PROVIDER } from "../models/userProvider.js";
import * as validator from "../middleware/validator.js";
import branch from "../middleware/branch.js";
import authenticate from "../middleware/authenticate.js";

const router = Router();

router.route("/user/signup").post([
  /**
  #swagger.tags = ['User']
  #swagger.summary = '註冊'
  #swagger.description = '註冊'
  #swagger.responses[200] = {
    schema: { $ref: '#/definitions/SuccessSignIn' }
  } 
  */
  body("email").isEmail().normalizeEmail(),
  body("name").exists().notEmpty().trim(),
  body("password").exists().notEmpty(),
  validator.handleResult,
  signUp,
]);

router.route("/user/signin").post([
  /**
  #swagger.tags = ['User']
  #swagger.summary = '登入'
  #swagger.description = '登入'
  #swagger.parameters['Native'] = {
    in: 'body',
    description: '登入資料',
    schema: { $ref: '#/definitions/SignIn' }
  } 
  #swagger.parameters['Facebook'] = {
    in: 'body',
    description: '登入資料',
    schema: { $ref: '#/definitions/SignInFB' }
  }
  #swagger.responses[200] = {
    schema: { $ref: '#/definitions/SuccessSignIn' }
  } 
  */
  branch(
    (req) => req.body.provider === PROVIDER.NATIVE,
    [
      body("email").isEmail().normalizeEmail(),
      body("password").exists().notEmpty(),
      validator.handleResult,
      signIn,
    ],
  ),
  branch(
    (req) => req.body.provider === PROVIDER.FACEBOOK,
    [body("access_token").exists().notEmpty(), fbLogin],
  ),
  (req: Request, res: Response) => {
    res.status(400).json({ errors: "invalid provider" });
  },
]);

router.route("/user/profile").get([authenticate, getProfile]);

export default router;
