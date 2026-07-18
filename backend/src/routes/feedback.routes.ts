import { Router } from 'express';
import {
  createFeedbackHandler,
  getFeedbackHandler,
} from '../controllers/feedback.controller';
import { validate } from '../middleware/validate';
import {
  createFeedbackSchema,
  getFeedbackQuerySchema,
} from '../validators/feedback.validator';

const router = Router();

router.post('/', validate(createFeedbackSchema), createFeedbackHandler);
router.get('/', validate(getFeedbackQuerySchema, 'query'), getFeedbackHandler);

export default router;
