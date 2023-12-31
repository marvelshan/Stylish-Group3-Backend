import express, { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import cookieParser from 'cookie-parser';
import productRouter from './routes/product.js';
import userRouter from './routes/user.js';
import campaignRouter from './routes/campaign.js';
import orderRouter from './routes/order.js';
import reportRouter from './routes/report.js';
import branch from './middleware/branch.js';
import authenticate from './middleware/authenticate.js';
import authorization from './middleware/authorization.js';
import rateLimiter from './middleware/rateLimiter.js';
import { errorHandler } from './utils/errorHandler.js';
import * as fs from 'fs';
import path from 'path';

const app = express();
const port = 3000;
const swaggerDocument = JSON.parse(
  fs.readFileSync(`${path.resolve()}/swagger-output.json`).toString(),
);

app.use(cookieParser());

app.enable('trust proxy');

const router = Router();

router.use(function (req, res, next) {
  next();
});

app.use(express.json());

app.use('/api', rateLimiter, [
  productRouter,
  userRouter,
  campaignRouter,
  orderRouter,
  reportRouter,
]);

app.use(
  branch(
    (req) => req.path.includes('/admin'),
    [authenticate, authorization('admin')],
  ),
  express.static('../client'),
);

app.use('/uploads', express.static('./uploads'));
app.use('/assets', express.static('./assets'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(errorHandler);

app.listen(port, () => {
  console.log(`STYLiSH listening on port ${port}`);
});
