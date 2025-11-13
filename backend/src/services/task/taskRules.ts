import { dbRequest, ExpectedReturn } from '@/utils/database';
import type { IRecordSet } from '@/utils/database';
import {
  TaskCreateRequest,
  TaskListRequest,
  TaskGetRequest,
  TaskUpdateRequest,
  TaskDeleteRequest,
  TaskEntity,
  SubtaskEntity,
  AttachmentEntity,
} from './taskTypes';

/**
 * @summary
 * Creates a new task with title, description, due date, priority, and optional
 * recurrence configuration and tags
 *
 * @function taskCreate
 * @module services/task
 *
 * @param {TaskCreateRequest} params - Task creation parameters
 * @param {number} params.idAccount - Account identifier
 * @param {number} params.idUser - User identifier
 * @param {string} params.title - Task title
 * @param {string | null} params.description - Task description
 * @param {string} params.dueDate - Task due date
 * @param {number} params.priority - Task priority
 * @param {string | null} params.recurrenceConfig - Recurrence configuration JSON
 * @param {string | null} params.tags - Task tags JSON
 *
 * @returns {Promise<{ idTask: number }>} Created task identifier
 *
 * @throws {ValidationError} When parameters fail validation
 * @throws {BusinessRuleError} When business rules are violated
 * @throws {DatabaseError} When database operation fails
 */
export async function taskCreate(params: TaskCreateRequest): Promise<{ idTask: number }> {
  const result = await dbRequest(
    '[functional].[spTaskCreate]',
    {
      idAccount: params.idAccount,
      idUser: params.idUser,
      title: params.title,
      description: params.description,
      dueDate: params.dueDate,
      priority: params.priority,
      recurrenceConfig: params.recurrenceConfig,
      tags: params.tags,
    },
    ExpectedReturn.Single
  );

  return result;
}

/**
 * @summary
 * Lists all tasks for a specific account and user with optional filters
 *
 * @function taskList
 * @module services/task
 *
 * @param {TaskListRequest} params - Task list parameters
 * @param {number} params.idAccount - Account identifier
 * @param {number} params.idUser - User identifier
 * @param {number} [params.priority] - Filter by priority
 * @param {number} [params.status] - Filter by status
 *
 * @returns {Promise<TaskEntity[]>} Array of task entities
 *
 * @throws {ValidationError} When parameters fail validation
 * @throws {DatabaseError} When database operation fails
 */
export async function taskList(params: TaskListRequest): Promise<TaskEntity[]> {
  const result = await dbRequest(
    '[functional].[spTaskList]',
    {
      idAccount: params.idAccount,
      idUser: params.idUser,
      priority: params.priority,
      status: params.status,
    },
    ExpectedReturn.Multi
  );

  // ExpectedReturn.Multi returns IRecordSet<any>[] (array of recordsets)
  // First recordset contains the task list
  const recordsets = result as IRecordSet<TaskEntity>[];
  return recordsets[0] || [];
}

/**
 * @summary
 * Retrieves a specific task by ID with all details including subtasks and attachments
 *
 * @function taskGet
 * @module services/task
 *
 * @param {TaskGetRequest} params - Task get parameters
 * @param {number} params.idAccount - Account identifier
 * @param {number} params.idTask - Task identifier
 *
 * @returns {Promise<TaskEntity & { subtasks: SubtaskEntity[], attachments: AttachmentEntity[] }>} Task with details
 *
 * @throws {ValidationError} When parameters fail validation
 * @throws {NotFoundError} When task doesn't exist
 * @throws {DatabaseError} When database operation fails
 */
export async function taskGet(
  params: TaskGetRequest
): Promise<TaskEntity & { subtasks: SubtaskEntity[]; attachments: AttachmentEntity[] }> {
  const result = await dbRequest(
    '[functional].[spTaskGet]',
    {
      idAccount: params.idAccount,
      idTask: params.idTask,
    },
    ExpectedReturn.Multi
  );

  // ExpectedReturn.Multi returns array of recordsets
  const recordsets = result as any[];
  const taskDetails = recordsets[0][0];
  const subtasks = recordsets[1] || [];
  const attachments = recordsets[2] || [];

  return {
    ...taskDetails,
    subtasks,
    attachments,
  };
}

/**
 * @summary
 * Updates an existing task with new values
 *
 * @function taskUpdate
 * @module services/task
 *
 * @param {TaskUpdateRequest} params - Task update parameters
 * @param {number} params.idAccount - Account identifier
 * @param {number} params.idTask - Task identifier
 * @param {string} params.title - Updated task title
 * @param {string | null} params.description - Updated task description
 * @param {string} params.dueDate - Updated task due date
 * @param {number} params.priority - Updated task priority
 * @param {number} params.status - Updated task status
 * @param {string | null} params.recurrenceConfig - Updated recurrence configuration
 * @param {string | null} params.tags - Updated task tags
 *
 * @returns {Promise<{ idTask: number }>} Updated task identifier
 *
 * @throws {ValidationError} When parameters fail validation
 * @throws {NotFoundError} When task doesn't exist
 * @throws {BusinessRuleError} When business rules are violated
 * @throws {DatabaseError} When database operation fails
 */
export async function taskUpdate(params: TaskUpdateRequest): Promise<{ idTask: number }> {
  const result = await dbRequest(
    '[functional].[spTaskUpdate]',
    {
      idAccount: params.idAccount,
      idTask: params.idTask,
      title: params.title,
      description: params.description,
      dueDate: params.dueDate,
      priority: params.priority,
      status: params.status,
      recurrenceConfig: params.recurrenceConfig,
      tags: params.tags,
    },
    ExpectedReturn.Single
  );

  return result;
}

/**
 * @summary
 * Soft deletes a task and all associated subtasks and attachments
 *
 * @function taskDelete
 * @module services/task
 *
 * @param {TaskDeleteRequest} params - Task delete parameters
 * @param {number} params.idAccount - Account identifier
 * @param {number} params.idTask - Task identifier
 *
 * @returns {Promise<{ idTask: number }>} Deleted task identifier
 *
 * @throws {ValidationError} When parameters fail validation
 * @throws {NotFoundError} When task doesn't exist
 * @throws {DatabaseError} When database operation fails
 */
export async function taskDelete(params: TaskDeleteRequest): Promise<{ idTask: number }> {
  const result = await dbRequest(
    '[functional].[spTaskDelete]',
    {
      idAccount: params.idAccount,
      idTask: params.idTask,
    },
    ExpectedReturn.Single
  );

  return result;
}
