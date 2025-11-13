import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import {
  CrudController,
  errorResponse,
  StatusGeneralError,
  successResponse,
} from '@/middleware/crud';
import { taskCreate, taskList, taskGet, taskUpdate, taskDelete } from '@/services/task';
import { zString, zNullableString, zFK } from '@/utils/zodValidation';

const securable = 'TASK';

/**
 * @api {get} /api/v1/internal/task List Tasks
 * @apiName ListTasks
 * @apiGroup Task
 * @apiVersion 1.0.0
 *
 * @apiDescription Lists all tasks for the authenticated user with optional filters
 *
 * @apiParam {Number} [priority] Filter by priority (0=low, 1=medium, 2=high)
 * @apiParam {Number} [status] Filter by status (0=pending, 1=in_progress, 2=completed)
 *
 * @apiSuccess {Array} data Array of task objects
 * @apiSuccess {Number} data.idTask Task identifier
 * @apiSuccess {String} data.title Task title
 * @apiSuccess {String} data.description Task description
 * @apiSuccess {String} data.dueDate Task due date
 * @apiSuccess {Number} data.priority Task priority
 * @apiSuccess {Number} data.status Task status
 *
 * @apiError {String} ValidationError Invalid parameters provided
 * @apiError {String} UnauthorizedError User lacks permission
 * @apiError {String} ServerError Internal server error
 */
export async function listHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'READ' }]);

  const querySchema = z.object({
    priority: z.coerce.number().int().min(0).max(2).optional(),
    status: z.coerce.number().int().min(0).max(2).optional(),
  });

  const [validated, error] = await operation.read(req, querySchema);

  if (!validated) {
    return next(error);
  }

  try {
    const data = await taskList({
      ...validated.credential,
      ...validated.params,
    });

    res.json(successResponse(data));
  } catch (error: any) {
    if (error.number === 51000) {
      res.status(400).json(errorResponse(error.message));
    } else {
      next(StatusGeneralError);
    }
  }
}

/**
 * @api {post} /api/v1/internal/task Create Task
 * @apiName CreateTask
 * @apiGroup Task
 * @apiVersion 1.0.0
 *
 * @apiDescription Creates a new task with title, description, due date, and priority
 *
 * @apiParam {String} title Task title (3-100 characters)
 * @apiParam {String} [description] Task description (max 1000 characters)
 * @apiParam {String} dueDate Task due date (ISO format)
 * @apiParam {Number} priority Task priority (0=low, 1=medium, 2=high)
 * @apiParam {Object} [recurrenceConfig] Recurrence configuration
 * @apiParam {Array} [tags] Task tags
 *
 * @apiSuccess {Number} idTask Created task identifier
 *
 * @apiError {String} ValidationError Invalid parameters provided
 * @apiError {String} UnauthorizedError User lacks permission
 * @apiError {String} ServerError Internal server error
 */
export async function createHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'CREATE' }]);

  const bodySchema = z.object({
    title: zString(100).min(3),
    description: zNullableString(1000),
    dueDate: z.string().refine((date) => {
      const parsedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return parsedDate >= today;
    }, 'dueDateCannotBeInPast'),
    priority: z.number().int().min(0).max(2),
    recurrenceConfig: zNullableString(),
    tags: zNullableString(),
  });

  const [validated, error] = await operation.create(req, bodySchema);

  if (!validated) {
    return next(error);
  }

  try {
    const data = await taskCreate({
      ...validated.credential,
      ...validated.params,
    });

    res.status(201).json(successResponse(data));
  } catch (error: any) {
    if (error.number === 51000) {
      res.status(400).json(errorResponse(error.message));
    } else {
      next(StatusGeneralError);
    }
  }
}

/**
 * @api {get} /api/v1/internal/task/:id Get Task
 * @apiName GetTask
 * @apiGroup Task
 * @apiVersion 1.0.0
 *
 * @apiDescription Retrieves a specific task by ID with all details
 *
 * @apiParam {Number} id Task identifier
 *
 * @apiSuccess {Object} data Task details
 * @apiSuccess {Number} data.idTask Task identifier
 * @apiSuccess {String} data.title Task title
 * @apiSuccess {String} data.description Task description
 * @apiSuccess {String} data.dueDate Task due date
 * @apiSuccess {Number} data.priority Task priority
 * @apiSuccess {Number} data.status Task status
 * @apiSuccess {Array} data.subtasks Array of subtasks
 * @apiSuccess {Array} data.attachments Array of attachments
 *
 * @apiError {String} ValidationError Invalid parameters provided
 * @apiError {String} NotFoundError Task not found
 * @apiError {String} UnauthorizedError User lacks permission
 * @apiError {String} ServerError Internal server error
 */
export async function getHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'READ' }]);

  const paramsSchema = z.object({
    id: z.coerce.number().int().positive(),
  });

  const [validated, error] = await operation.read(req, paramsSchema);

  if (!validated) {
    return next(error);
  }

  try {
    const data = await taskGet({
      ...validated.credential,
      idTask: validated.params.id,
    });

    res.json(successResponse(data));
  } catch (error: any) {
    if (error.number === 51000) {
      res.status(400).json(errorResponse(error.message));
    } else {
      next(StatusGeneralError);
    }
  }
}

/**
 * @api {put} /api/v1/internal/task/:id Update Task
 * @apiName UpdateTask
 * @apiGroup Task
 * @apiVersion 1.0.0
 *
 * @apiDescription Updates an existing task with new values
 *
 * @apiParam {Number} id Task identifier
 * @apiParam {String} title Task title (3-100 characters)
 * @apiParam {String} [description] Task description (max 1000 characters)
 * @apiParam {String} dueDate Task due date (ISO format)
 * @apiParam {Number} priority Task priority (0=low, 1=medium, 2=high)
 * @apiParam {Number} status Task status (0=pending, 1=in_progress, 2=completed)
 * @apiParam {Object} [recurrenceConfig] Recurrence configuration
 * @apiParam {Array} [tags] Task tags
 *
 * @apiSuccess {Number} idTask Updated task identifier
 *
 * @apiError {String} ValidationError Invalid parameters provided
 * @apiError {String} NotFoundError Task not found
 * @apiError {String} UnauthorizedError User lacks permission
 * @apiError {String} ServerError Internal server error
 */
export async function updateHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'UPDATE' }]);

  const paramsSchema = z.object({
    id: z.coerce.number().int().positive(),
  });

  const bodySchema = z.object({
    title: zString(100).min(3),
    description: zNullableString(1000),
    dueDate: z.string().refine((date) => {
      const parsedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return parsedDate >= today;
    }, 'dueDateCannotBeInPast'),
    priority: z.number().int().min(0).max(2),
    status: z.number().int().min(0).max(2),
    recurrenceConfig: zNullableString(),
    tags: zNullableString(),
  });

  const combinedSchema = paramsSchema.merge(bodySchema);

  const [validated, error] = await operation.update(req, combinedSchema);

  if (!validated) {
    return next(error);
  }

  try {
    const data = await taskUpdate({
      ...validated.credential,
      idTask: validated.params.id,
      ...validated.params,
    });

    res.json(successResponse(data));
  } catch (error: any) {
    if (error.number === 51000) {
      res.status(400).json(errorResponse(error.message));
    } else {
      next(StatusGeneralError);
    }
  }
}

/**
 * @api {delete} /api/v1/internal/task/:id Delete Task
 * @apiName DeleteTask
 * @apiGroup Task
 * @apiVersion 1.0.0
 *
 * @apiDescription Soft deletes a task and all associated subtasks and attachments
 *
 * @apiParam {Number} id Task identifier
 *
 * @apiSuccess {Number} idTask Deleted task identifier
 *
 * @apiError {String} ValidationError Invalid parameters provided
 * @apiError {String} NotFoundError Task not found
 * @apiError {String} UnauthorizedError User lacks permission
 * @apiError {String} ServerError Internal server error
 */
export async function deleteHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'DELETE' }]);

  const paramsSchema = z.object({
    id: z.coerce.number().int().positive(),
  });

  const [validated, error] = await operation.delete(req, paramsSchema);

  if (!validated) {
    return next(error);
  }

  try {
    const data = await taskDelete({
      ...validated.credential,
      idTask: validated.params.id,
    });

    res.json(successResponse(data));
  } catch (error: any) {
    if (error.number === 51000) {
      res.status(400).json(errorResponse(error.message));
    } else {
      next(StatusGeneralError);
    }
  }
}
