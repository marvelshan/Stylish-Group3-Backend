<<<<<<< HEAD
import { Router } from 'express';
import {
  addProductToCollection,
  getCollection,
} from '../controllers/collection.js';

const router = Router();

router.route('/v1/collection').get(getCollection);
router.route('/v1/collection').post(addProductToCollection);

export default router;
