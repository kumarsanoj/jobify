import express from 'express';
import { createJob, deleteJob, getAllJobs, updateJobs, showStatus} from '../controller/jobController.js';

const router = express.Router();

router.route('/').post(createJob).get(getAllJobs);
router.route('/status').get(showStatus);
router.route('/:id').delete(deleteJob).patch(updateJobs);

export default router;