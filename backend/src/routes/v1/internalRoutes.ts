import { Router } from 'express';
import * as taskController from '@/api/v1/internal/task/controller';

const router = Router();

// Task routes
router.get('/task', taskController.listHandler);
router.post('/task', taskController.createHandler);
router.get('/task/:id', taskController.getHandler);
router.put('/task/:id', taskController.updateHandler);
router.delete('/task/:id', taskController.deleteHandler);

export default router;
