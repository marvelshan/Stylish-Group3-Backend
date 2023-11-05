import { Router } from 'express';
import {
  getCampaigns,
  checkProductExist,
  createCampaign,
} from '../controllers/campaign.js';
import { uploadToDisk } from '../middleware/multer.js';
import { getHotProducts } from '../controllers/product.js';

const router = Router();

router.route('/marketing/campaigns').get(getCampaigns);
router.route('/marketing/hots').get(getHotProducts);

router
  .route('/marketing/campaigns')
  .post(
    uploadToDisk.single('campaign_picture'),
    checkProductExist,
    createCampaign,
  );

export default router;
