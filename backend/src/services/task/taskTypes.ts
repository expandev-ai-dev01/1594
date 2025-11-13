/**
 * @interface TaskEntity
 * @description Represents a task entity in the system
 *
 * @property {number} idTask - Unique task identifier
 * @property {number} idAccount - Associated account identifier
 * @property {number} idUser - Task creator identifier
 * @property {string} title - Task title
 * @property {string | null} description - Task description
 * @property {string} dueDate - Task due date
 * @property {number} priority - Task priority (0=low, 1=medium, 2=high)
 * @property {number} status - Task status (0=pending, 1=in_progress, 2=completed)
 * @property {string | null} recurrenceConfig - Recurrence configuration JSON
 * @property {string | null} tags - Task tags JSON array
 * @property {Date} dateCreated - Creation timestamp
 * @property {Date} dateModified - Last modification timestamp
 */
export interface TaskEntity {
  idTask: number;
  idAccount: number;
  idUser: number;
  title: string;
  description: string | null;
  dueDate: string;
  priority: number;
  status: number;
  recurrenceConfig: string | null;
  tags: string | null;
  dateCreated: Date;
  dateModified: Date;
}

/**
 * @interface SubtaskEntity
 * @description Represents a subtask entity in the system
 *
 * @property {number} idSubtask - Unique subtask identifier
 * @property {number} idAccount - Associated account identifier
 * @property {number} idTask - Parent task identifier
 * @property {string} title - Subtask title
 * @property {boolean} completed - Subtask completion status
 * @property {Date} dateCreated - Creation timestamp
 */
export interface SubtaskEntity {
  idSubtask: number;
  idAccount: number;
  idTask: number;
  title: string;
  completed: boolean;
  dateCreated: Date;
}

/**
 * @interface AttachmentEntity
 * @description Represents an attachment entity in the system
 *
 * @property {number} idAttachment - Unique attachment identifier
 * @property {number} idAccount - Associated account identifier
 * @property {number} idTask - Parent task identifier
 * @property {string} fileName - Attachment file name
 * @property {string} fileType - Attachment file type
 * @property {number} fileSize - Attachment file size in bytes
 * @property {string} filePath - Attachment file storage path
 * @property {Date} dateCreated - Upload timestamp
 */
export interface AttachmentEntity {
  idAttachment: number;
  idAccount: number;
  idTask: number;
  fileName: string;
  fileType: string;
  fileSize: number;
  filePath: string;
  dateCreated: Date;
}

/**
 * @interface TaskCreateRequest
 * @description Request parameters for creating a task
 *
 * @property {number} idAccount - Account identifier
 * @property {number} idUser - User identifier
 * @property {string} title - Task title
 * @property {string | null} description - Task description
 * @property {string} dueDate - Task due date
 * @property {number} priority - Task priority
 * @property {string | null} recurrenceConfig - Recurrence configuration JSON
 * @property {string | null} tags - Task tags JSON
 */
export interface TaskCreateRequest {
  idAccount: number;
  idUser: number;
  title: string;
  description: string | null;
  dueDate: string;
  priority: number;
  recurrenceConfig: string | null;
  tags: string | null;
}

/**
 * @interface TaskListRequest
 * @description Request parameters for listing tasks
 *
 * @property {number} idAccount - Account identifier
 * @property {number} idUser - User identifier
 * @property {number} [priority] - Filter by priority
 * @property {number} [status] - Filter by status
 */
export interface TaskListRequest {
  idAccount: number;
  idUser: number;
  priority?: number;
  status?: number;
}

/**
 * @interface TaskGetRequest
 * @description Request parameters for getting a task
 *
 * @property {number} idAccount - Account identifier
 * @property {number} idTask - Task identifier
 */
export interface TaskGetRequest {
  idAccount: number;
  idTask: number;
}

/**
 * @interface TaskUpdateRequest
 * @description Request parameters for updating a task
 *
 * @property {number} idAccount - Account identifier
 * @property {number} idTask - Task identifier
 * @property {string} title - Updated task title
 * @property {string | null} description - Updated task description
 * @property {string} dueDate - Updated task due date
 * @property {number} priority - Updated task priority
 * @property {number} status - Updated task status
 * @property {string | null} recurrenceConfig - Updated recurrence configuration
 * @property {string | null} tags - Updated task tags
 */
export interface TaskUpdateRequest {
  idAccount: number;
  idTask: number;
  title: string;
  description: string | null;
  dueDate: string;
  priority: number;
  status: number;
  recurrenceConfig: string | null;
  tags: string | null;
}

/**
 * @interface TaskDeleteRequest
 * @description Request parameters for deleting a task
 *
 * @property {number} idAccount - Account identifier
 * @property {number} idTask - Task identifier
 */
export interface TaskDeleteRequest {
  idAccount: number;
  idTask: number;
}

/**
 * @enum TaskPriority
 * @description Task priority levels
 */
export enum TaskPriority {
  Low = 0,
  Medium = 1,
  High = 2,
}

/**
 * @enum TaskStatus
 * @description Task status values
 */
export enum TaskStatus {
  Pending = 0,
  InProgress = 1,
  Completed = 2,
}
