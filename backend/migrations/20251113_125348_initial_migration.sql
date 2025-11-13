/**
 * Database Migration
 * Generated: 2025-11-13T12:53:48.280Z
 * Timestamp: 20251113_125348
 *
 * This migration includes:
 * - Schema structures (tables, indexes, constraints)
 * - Initial data
 * - Stored procedures
 *
 * Note: This file is automatically executed by the migration runner
 * on application startup in Azure App Service.
 */

-- Set options for better SQL Server compatibility
SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
SET ANSI_PADDING ON;
SET CONCAT_NULL_YIELDS_NULL ON;
SET ANSI_WARNINGS ON;
SET NUMERIC_ROUNDABORT OFF;
GO

PRINT 'Starting database migration...';
PRINT 'Timestamp: 20251113_125348';
GO


-- ============================================
-- STRUCTURE
-- Database schemas, tables, indexes, and constraints
-- ============================================

-- File: functional/_structure.sql
/**
 * @schema functional
 * Business logic schema for task management system
 */
CREATE SCHEMA [functional];
GO

/**
 * @table task Task management table
 * @multitenancy true
 * @softDelete true
 * @alias tsk
 */
CREATE TABLE [functional].[task] (
  [idTask] INTEGER IDENTITY(1, 1) NOT NULL,
  [idAccount] INTEGER NOT NULL,
  [idUser] INTEGER NOT NULL,
  [title] NVARCHAR(100) NOT NULL,
  [description] NVARCHAR(1000) NULL,
  [dueDate] DATE NOT NULL,
  [priority] INTEGER NOT NULL,
  [status] INTEGER NOT NULL,
  [recurrenceConfig] NVARCHAR(MAX) NULL,
  [tags] NVARCHAR(MAX) NULL,
  [dateCreated] DATETIME2 NOT NULL DEFAULT (GETUTCDATE()),
  [dateModified] DATETIME2 NOT NULL DEFAULT (GETUTCDATE()),
  [deleted] BIT NOT NULL DEFAULT (0)
);
GO

/**
 * @table subtask Subtask management table
 * @multitenancy true
 * @softDelete true
 * @alias sbtsk
 */
CREATE TABLE [functional].[subtask] (
  [idSubtask] INTEGER IDENTITY(1, 1) NOT NULL,
  [idAccount] INTEGER NOT NULL,
  [idTask] INTEGER NOT NULL,
  [title] NVARCHAR(100) NOT NULL,
  [completed] BIT NOT NULL DEFAULT (0),
  [dateCreated] DATETIME2 NOT NULL DEFAULT (GETUTCDATE()),
  [dateModified] DATETIME2 NOT NULL DEFAULT (GETUTCDATE()),
  [deleted] BIT NOT NULL DEFAULT (0)
);
GO

/**
 * @table attachment Task attachment management table
 * @multitenancy true
 * @softDelete true
 * @alias att
 */
CREATE TABLE [functional].[attachment] (
  [idAttachment] INTEGER IDENTITY(1, 1) NOT NULL,
  [idAccount] INTEGER NOT NULL,
  [idTask] INTEGER NOT NULL,
  [fileName] NVARCHAR(255) NOT NULL,
  [fileType] VARCHAR(50) NOT NULL,
  [fileSize] INTEGER NOT NULL,
  [filePath] NVARCHAR(500) NOT NULL,
  [dateCreated] DATETIME2 NOT NULL DEFAULT (GETUTCDATE()),
  [deleted] BIT NOT NULL DEFAULT (0)
);
GO

/**
 * @primaryKey pkTask
 * @keyType Object
 */
ALTER TABLE [functional].[task]
ADD CONSTRAINT [pkTask] PRIMARY KEY CLUSTERED ([idTask]);
GO

/**
 * @primaryKey pkSubtask
 * @keyType Object
 */
ALTER TABLE [functional].[subtask]
ADD CONSTRAINT [pkSubtask] PRIMARY KEY CLUSTERED ([idSubtask]);
GO

/**
 * @primaryKey pkAttachment
 * @keyType Object
 */
ALTER TABLE [functional].[attachment]
ADD CONSTRAINT [pkAttachment] PRIMARY KEY CLUSTERED ([idAttachment]);
GO

/**
 * @foreignKey fkTask_Account Multi-tenancy account isolation
 * @target subscription.account
 * @tenancy true
 */
ALTER TABLE [functional].[task]
ADD CONSTRAINT [fkTask_Account] FOREIGN KEY ([idAccount])
REFERENCES [subscription].[account]([idAccount]);
GO

/**
 * @foreignKey fkTask_User Task creator reference
 * @target security.user
 */
ALTER TABLE [functional].[task]
ADD CONSTRAINT [fkTask_User] FOREIGN KEY ([idUser])
REFERENCES [security].[user]([idUser]);
GO

/**
 * @foreignKey fkSubtask_Account Multi-tenancy account isolation
 * @target subscription.account
 * @tenancy true
 */
ALTER TABLE [functional].[subtask]
ADD CONSTRAINT [fkSubtask_Account] FOREIGN KEY ([idAccount])
REFERENCES [subscription].[account]([idAccount]);
GO

/**
 * @foreignKey fkSubtask_Task Parent task reference
 * @target functional.task
 */
ALTER TABLE [functional].[subtask]
ADD CONSTRAINT [fkSubtask_Task] FOREIGN KEY ([idTask])
REFERENCES [functional].[task]([idTask]);
GO

/**
 * @foreignKey fkAttachment_Account Multi-tenancy account isolation
 * @target subscription.account
 * @tenancy true
 */
ALTER TABLE [functional].[attachment]
ADD CONSTRAINT [fkAttachment_Account] FOREIGN KEY ([idAccount])
REFERENCES [subscription].[account]([idAccount]);
GO

/**
 * @foreignKey fkAttachment_Task Parent task reference
 * @target functional.task
 */
ALTER TABLE [functional].[attachment]
ADD CONSTRAINT [fkAttachment_Task] FOREIGN KEY ([idTask])
REFERENCES [functional].[task]([idTask]);
GO

/**
 * @check chkTask_Priority Priority level validation
 * @enum {0} Low priority
 * @enum {1} Medium priority
 * @enum {2} High priority
 */
ALTER TABLE [functional].[task]
ADD CONSTRAINT [chkTask_Priority] CHECK ([priority] BETWEEN 0 AND 2);
GO

/**
 * @check chkTask_Status Task status validation
 * @enum {0} Pending
 * @enum {1} In progress
 * @enum {2} Completed
 */
ALTER TABLE [functional].[task]
ADD CONSTRAINT [chkTask_Status] CHECK ([status] BETWEEN 0 AND 2);
GO

/**
 * @index ixTask_Account Multi-tenancy account filtering
 * @type ForeignKey
 */
CREATE NONCLUSTERED INDEX [ixTask_Account]
ON [functional].[task]([idAccount])
WHERE [deleted] = 0;
GO

/**
 * @index ixTask_Account_User User task filtering
 * @type Search
 */
CREATE NONCLUSTERED INDEX [ixTask_Account_User]
ON [functional].[task]([idAccount], [idUser])
INCLUDE ([title], [dueDate], [priority], [status])
WHERE [deleted] = 0;
GO

/**
 * @index ixTask_Account_DueDate Due date filtering and sorting
 * @type Performance
 */
CREATE NONCLUSTERED INDEX [ixTask_Account_DueDate]
ON [functional].[task]([idAccount], [dueDate])
INCLUDE ([title], [priority], [status])
WHERE [deleted] = 0;
GO

/**
 * @index ixTask_Account_Priority Priority filtering
 * @type Search
 */
CREATE NONCLUSTERED INDEX [ixTask_Account_Priority]
ON [functional].[task]([idAccount], [priority])
INCLUDE ([title], [dueDate], [status])
WHERE [deleted] = 0;
GO

/**
 * @index ixTask_Account_Status Status filtering
 * @type Search
 */
CREATE NONCLUSTERED INDEX [ixTask_Account_Status]
ON [functional].[task]([idAccount], [status])
INCLUDE ([title], [dueDate], [priority])
WHERE [deleted] = 0;
GO

/**
 * @index ixSubtask_Account Multi-tenancy account filtering
 * @type ForeignKey
 */
CREATE NONCLUSTERED INDEX [ixSubtask_Account]
ON [functional].[subtask]([idAccount])
WHERE [deleted] = 0;
GO

/**
 * @index ixSubtask_Account_Task Parent task filtering
 * @type ForeignKey
 */
CREATE NONCLUSTERED INDEX [ixSubtask_Account_Task]
ON [functional].[subtask]([idAccount], [idTask])
INCLUDE ([title], [completed])
WHERE [deleted] = 0;
GO

/**
 * @index ixAttachment_Account Multi-tenancy account filtering
 * @type ForeignKey
 */
CREATE NONCLUSTERED INDEX [ixAttachment_Account]
ON [functional].[attachment]([idAccount])
WHERE [deleted] = 0;
GO

/**
 * @index ixAttachment_Account_Task Parent task filtering
 * @type ForeignKey
 */
CREATE NONCLUSTERED INDEX [ixAttachment_Account_Task]
ON [functional].[attachment]([idAccount], [idTask])
INCLUDE ([fileName], [fileType], [fileSize])
WHERE [deleted] = 0;
GO



-- ============================================
-- STORED PROCEDURES
-- Database stored procedures and functions
-- ============================================

-- File: functional/task/spTaskCreate.sql
/**
 * @summary
 * Creates a new task with title, description, due date, priority, and optional
 * recurrence configuration and tags. Validates all required fields and business rules.
 *
 * @procedure spTaskCreate
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - POST /api/v1/internal/task
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier for multi-tenancy
 *
 * @param {INT} idUser
 *   - Required: Yes
 *   - Description: User creating the task
 *
 * @param {NVARCHAR(100)} title
 *   - Required: Yes
 *   - Description: Task title (3-100 characters)
 *
 * @param {NVARCHAR(1000)} description
 *   - Required: No
 *   - Description: Task description (max 1000 characters)
 *
 * @param {DATE} dueDate
 *   - Required: Yes
 *   - Description: Task due date (cannot be in the past)
 *
 * @param {INT} priority
 *   - Required: Yes
 *   - Description: Priority level (0=low, 1=medium, 2=high)
 *
 * @param {NVARCHAR(MAX)} recurrenceConfig
 *   - Required: No
 *   - Description: JSON configuration for recurring tasks
 *
 * @param {NVARCHAR(MAX)} tags
 *   - Required: No
 *   - Description: JSON array of task tags
 *
 * @returns {INT} idTask - Created task identifier
 *
 * @testScenarios
 * - Valid task creation with all required fields
 * - Task creation with optional fields (description, recurrence, tags)
 * - Validation failure for title length (< 3 or > 100 characters)
 * - Validation failure for due date in the past
 * - Validation failure for invalid priority value
 * - Validation failure for invalid account or user
 */
CREATE OR ALTER PROCEDURE [functional].[spTaskCreate]
  @idAccount INTEGER,
  @idUser INTEGER,
  @title NVARCHAR(100),
  @description NVARCHAR(1000) = NULL,
  @dueDate DATE,
  @priority INTEGER,
  @recurrenceConfig NVARCHAR(MAX) = NULL,
  @tags NVARCHAR(MAX) = NULL
AS
BEGIN
  SET NOCOUNT ON;

  /**
   * @validation Required parameter validation
   * @throw {idAccountRequired}
   */
  IF (@idAccount IS NULL)
  BEGIN
    ;THROW 51000, 'idAccountRequired', 1;
  END;

  /**
   * @validation Required parameter validation
   * @throw {idUserRequired}
   */
  IF (@idUser IS NULL)
  BEGIN
    ;THROW 51000, 'idUserRequired', 1;
  END;

  /**
   * @validation Required parameter validation
   * @throw {titleRequired}
   */
  IF (@title IS NULL OR LTRIM(RTRIM(@title)) = '')
  BEGIN
    ;THROW 51000, 'titleRequired', 1;
  END;

  /**
   * @validation Title length validation
   * @throw {titleMinLength}
   */
  IF (LEN(LTRIM(RTRIM(@title))) < 3)
  BEGIN
    ;THROW 51000, 'titleMinLength', 1;
  END;

  /**
   * @validation Title length validation
   * @throw {titleMaxLength}
   */
  IF (LEN(@title) > 100)
  BEGIN
    ;THROW 51000, 'titleMaxLength', 1;
  END;

  /**
   * @validation Required parameter validation
   * @throw {dueDateRequired}
   */
  IF (@dueDate IS NULL)
  BEGIN
    ;THROW 51000, 'dueDateRequired', 1;
  END;

  /**
   * @validation Due date cannot be in the past
   * @throw {dueDateCannotBeInPast}
   */
  IF (@dueDate < CAST(GETUTCDATE() AS DATE))
  BEGIN
    ;THROW 51000, 'dueDateCannotBeInPast', 1;
  END;

  /**
   * @validation Required parameter validation
   * @throw {priorityRequired}
   */
  IF (@priority IS NULL)
  BEGIN
    ;THROW 51000, 'priorityRequired', 1;
  END;

  /**
   * @validation Priority value validation
   * @throw {priorityInvalidValue}
   */
  IF (@priority NOT BETWEEN 0 AND 2)
  BEGIN
    ;THROW 51000, 'priorityInvalidValue', 1;
  END;

  /**
   * @validation Description length validation
   * @throw {descriptionMaxLength}
   */
  IF (@description IS NOT NULL AND LEN(@description) > 1000)
  BEGIN
    ;THROW 51000, 'descriptionMaxLength', 1;
  END;

  /**
   * @validation Account existence validation
   * @throw {accountDoesntExist}
   */
  IF NOT EXISTS (SELECT * FROM [subscription].[account] acc WHERE acc.[idAccount] = @idAccount)
  BEGIN
    ;THROW 51000, 'accountDoesntExist', 1;
  END;

  /**
   * @validation User existence and account association validation
   * @throw {userDoesntExist}
   */
  IF NOT EXISTS (SELECT * FROM [security].[user] usr WHERE usr.[idUser] = @idUser AND usr.[idAccount] = @idAccount)
  BEGIN
    ;THROW 51000, 'userDoesntExist', 1;
  END;

  BEGIN TRY
    /**
     * @rule {db-multi-tenancy,fn-task-creation} Create task with account isolation
     */
    BEGIN TRAN;

      DECLARE @idTask INTEGER;

      INSERT INTO [functional].[task] (
        [idAccount],
        [idUser],
        [title],
        [description],
        [dueDate],
        [priority],
        [status],
        [recurrenceConfig],
        [tags],
        [dateCreated],
        [dateModified],
        [deleted]
      )
      VALUES (
        @idAccount,
        @idUser,
        @title,
        @description,
        @dueDate,
        @priority,
        0,
        @recurrenceConfig,
        @tags,
        GETUTCDATE(),
        GETUTCDATE(),
        0
      );

      SET @idTask = SCOPE_IDENTITY();

      /**
       * @output {TaskCreated, 1, 1}
       * @column {INT} idTask
       * - Description: Created task identifier
       */
      SELECT @idTask AS [idTask];

    COMMIT TRAN;
  END TRY
  BEGIN CATCH
    ROLLBACK TRAN;
    THROW;
  END CATCH;
END;
GO


-- File: functional/task/spTaskDelete.sql
/**
 * @summary
 * Soft deletes a task by setting the deleted flag. Also soft deletes all
 * associated subtasks and attachments to maintain referential integrity.
 *
 * @procedure spTaskDelete
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - DELETE /api/v1/internal/task/:id
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier for multi-tenancy
 *
 * @param {INT} idTask
 *   - Required: Yes
 *   - Description: Task identifier to delete
 *
 * @testScenarios
 * - Valid task deletion
 * - Deletion cascades to subtasks and attachments
 * - Validation failure for non-existent task
 * - Validation failure for task from different account
 * - Validation failure for already deleted task
 */
CREATE OR ALTER PROCEDURE [functional].[spTaskDelete]
  @idAccount INTEGER,
  @idTask INTEGER
AS
BEGIN
  SET NOCOUNT ON;

  /**
   * @validation Required parameter validation
   * @throw {idAccountRequired}
   */
  IF (@idAccount IS NULL)
  BEGIN
    ;THROW 51000, 'idAccountRequired', 1;
  END;

  /**
   * @validation Required parameter validation
   * @throw {idTaskRequired}
   */
  IF (@idTask IS NULL)
  BEGIN
    ;THROW 51000, 'idTaskRequired', 1;
  END;

  /**
   * @validation Task existence and account association validation
   * @throw {taskDoesntExist}
   */
  IF NOT EXISTS (SELECT * FROM [functional].[task] tsk WHERE tsk.[idTask] = @idTask AND tsk.[idAccount] = @idAccount AND tsk.[deleted] = 0)
  BEGIN
    ;THROW 51000, 'taskDoesntExist', 1;
  END;

  BEGIN TRY
    /**
     * @rule {db-multi-tenancy,fn-task-deletion} Soft delete task and related entities with account isolation
     */
    BEGIN TRAN;

      UPDATE [functional].[task]
      SET
        [deleted] = 1,
        [dateModified] = GETUTCDATE()
      WHERE [idAccount] = @idAccount
        AND [idTask] = @idTask
        AND [deleted] = 0;

      UPDATE [functional].[subtask]
      SET
        [deleted] = 1,
        [dateModified] = GETUTCDATE()
      WHERE [idAccount] = @idAccount
        AND [idTask] = @idTask
        AND [deleted] = 0;

      UPDATE [functional].[attachment]
      SET
        [deleted] = 1
      WHERE [idAccount] = @idAccount
        AND [idTask] = @idTask
        AND [deleted] = 0;

      /**
       * @output {TaskDeleted, 1, 1}
       * @column {INT} idTask
       * - Description: Deleted task identifier
       */
      SELECT @idTask AS [idTask];

    COMMIT TRAN;
  END TRY
  BEGIN CATCH
    ROLLBACK TRAN;
    THROW;
  END CATCH;
END;
GO


-- File: functional/task/spTaskGet.sql
/**
 * @summary
 * Retrieves a specific task by ID with all details including subtasks and attachments.
 * Returns task information, associated subtasks, and attachment metadata.
 *
 * @procedure spTaskGet
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - GET /api/v1/internal/task/:id
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier for multi-tenancy
 *
 * @param {INT} idTask
 *   - Required: Yes
 *   - Description: Task identifier
 *
 * @testScenarios
 * - Retrieve existing task with all details
 * - Retrieve task with subtasks
 * - Retrieve task with attachments
 * - Validation failure for non-existent task
 * - Validation failure for task from different account
 */
CREATE OR ALTER PROCEDURE [functional].[spTaskGet]
  @idAccount INTEGER,
  @idTask INTEGER
AS
BEGIN
  SET NOCOUNT ON;

  /**
   * @validation Required parameter validation
   * @throw {idAccountRequired}
   */
  IF (@idAccount IS NULL)
  BEGIN
    ;THROW 51000, 'idAccountRequired', 1;
  END;

  /**
   * @validation Required parameter validation
   * @throw {idTaskRequired}
   */
  IF (@idTask IS NULL)
  BEGIN
    ;THROW 51000, 'idTaskRequired', 1;
  END;

  /**
   * @validation Task existence and account association validation
   * @throw {taskDoesntExist}
   */
  IF NOT EXISTS (SELECT * FROM [functional].[task] tsk WHERE tsk.[idTask] = @idTask AND tsk.[idAccount] = @idAccount AND tsk.[deleted] = 0)
  BEGIN
    ;THROW 51000, 'taskDoesntExist', 1;
  END;

  /**
   * @rule {db-multi-tenancy,fn-task-retrieval} Retrieve task with account isolation
   */
  /**
   * @output {TaskDetails, 1, n}
   * @column {INT} idTask
   * - Description: Task identifier
   * @column {INT} idUser
   * - Description: Task creator identifier
   * @column {NVARCHAR} title
   * - Description: Task title
   * @column {NVARCHAR} description
   * - Description: Task description
   * @column {DATE} dueDate
   * - Description: Task due date
   * @column {INT} priority
   * - Description: Task priority (0=low, 1=medium, 2=high)
   * @column {INT} status
   * - Description: Task status (0=pending, 1=in_progress, 2=completed)
   * @column {NVARCHAR} recurrenceConfig
   * - Description: Recurrence configuration JSON
   * @column {NVARCHAR} tags
   * - Description: Task tags JSON array
   * @column {DATETIME2} dateCreated
   * - Description: Task creation date
   * @column {DATETIME2} dateModified
   * - Description: Task last modification date
   */
  SELECT
    [tsk].[idTask],
    [tsk].[idUser],
    [tsk].[title],
    [tsk].[description],
    [tsk].[dueDate],
    [tsk].[priority],
    [tsk].[status],
    [tsk].[recurrenceConfig],
    [tsk].[tags],
    [tsk].[dateCreated],
    [tsk].[dateModified]
  FROM [functional].[task] [tsk]
  WHERE [tsk].[idAccount] = @idAccount
    AND [tsk].[idTask] = @idTask
    AND [tsk].[deleted] = 0;

  /**
   * @output {SubtaskList, n, n}
   * @column {INT} idSubtask
   * - Description: Subtask identifier
   * @column {NVARCHAR} title
   * - Description: Subtask title
   * @column {BIT} completed
   * - Description: Subtask completion status
   * @column {DATETIME2} dateCreated
   * - Description: Subtask creation date
   */
  SELECT
    [sbtsk].[idSubtask],
    [sbtsk].[title],
    [sbtsk].[completed],
    [sbtsk].[dateCreated]
  FROM [functional].[subtask] [sbtsk]
  WHERE [sbtsk].[idAccount] = @idAccount
    AND [sbtsk].[idTask] = @idTask
    AND [sbtsk].[deleted] = 0
  ORDER BY
    [sbtsk].[dateCreated] ASC;

  /**
   * @output {AttachmentList, n, n}
   * @column {INT} idAttachment
   * - Description: Attachment identifier
   * @column {NVARCHAR} fileName
   * - Description: Attachment file name
   * @column {VARCHAR} fileType
   * - Description: Attachment file type
   * @column {INT} fileSize
   * - Description: Attachment file size in bytes
   * @column {NVARCHAR} filePath
   * - Description: Attachment file storage path
   * @column {DATETIME2} dateCreated
   * - Description: Attachment upload date
   */
  SELECT
    [att].[idAttachment],
    [att].[fileName],
    [att].[fileType],
    [att].[fileSize],
    [att].[filePath],
    [att].[dateCreated]
  FROM [functional].[attachment] [att]
  WHERE [att].[idAccount] = @idAccount
    AND [att].[idTask] = @idTask
    AND [att].[deleted] = 0
  ORDER BY
    [att].[dateCreated] ASC;
END;
GO


-- File: functional/task/spTaskList.sql
/**
 * @summary
 * Lists all tasks for a specific account and user with filtering options.
 * Returns task details including title, description, due date, priority, and status.
 *
 * @procedure spTaskList
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - GET /api/v1/internal/task
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier for multi-tenancy
 *
 * @param {INT} idUser
 *   - Required: Yes
 *   - Description: User identifier for filtering tasks
 *
 * @param {INT} priority
 *   - Required: No
 *   - Description: Filter by priority (0=low, 1=medium, 2=high)
 *
 * @param {INT} status
 *   - Required: No
 *   - Description: Filter by status (0=pending, 1=in_progress, 2=completed)
 *
 * @testScenarios
 * - List all tasks for user without filters
 * - List tasks filtered by priority
 * - List tasks filtered by status
 * - List tasks with combined filters
 * - Validation failure for invalid account or user
 */
CREATE OR ALTER PROCEDURE [functional].[spTaskList]
  @idAccount INTEGER,
  @idUser INTEGER,
  @priority INTEGER = NULL,
  @status INTEGER = NULL
AS
BEGIN
  SET NOCOUNT ON;

  /**
   * @validation Required parameter validation
   * @throw {idAccountRequired}
   */
  IF (@idAccount IS NULL)
  BEGIN
    ;THROW 51000, 'idAccountRequired', 1;
  END;

  /**
   * @validation Required parameter validation
   * @throw {idUserRequired}
   */
  IF (@idUser IS NULL)
  BEGIN
    ;THROW 51000, 'idUserRequired', 1;
  END;

  /**
   * @validation Account existence validation
   * @throw {accountDoesntExist}
   */
  IF NOT EXISTS (SELECT * FROM [subscription].[account] acc WHERE acc.[idAccount] = @idAccount)
  BEGIN
    ;THROW 51000, 'accountDoesntExist', 1;
  END;

  /**
   * @validation User existence and account association validation
   * @throw {userDoesntExist}
   */
  IF NOT EXISTS (SELECT * FROM [security].[user] usr WHERE usr.[idUser] = @idUser AND usr.[idAccount] = @idAccount)
  BEGIN
    ;THROW 51000, 'userDoesntExist', 1;
  END;

  /**
   * @rule {db-multi-tenancy,fn-task-listing} List tasks with account isolation and optional filters
   */
  /**
   * @output {TaskList, n, n}
   * @column {INT} idTask
   * - Description: Task identifier
   * @column {NVARCHAR} title
   * - Description: Task title
   * @column {NVARCHAR} description
   * - Description: Task description
   * @column {DATE} dueDate
   * - Description: Task due date
   * @column {INT} priority
   * - Description: Task priority (0=low, 1=medium, 2=high)
   * @column {INT} status
   * - Description: Task status (0=pending, 1=in_progress, 2=completed)
   * @column {NVARCHAR} recurrenceConfig
   * - Description: Recurrence configuration JSON
   * @column {NVARCHAR} tags
   * - Description: Task tags JSON array
   * @column {DATETIME2} dateCreated
   * - Description: Task creation date
   * @column {DATETIME2} dateModified
   * - Description: Task last modification date
   */
  SELECT
    [tsk].[idTask],
    [tsk].[title],
    [tsk].[description],
    [tsk].[dueDate],
    [tsk].[priority],
    [tsk].[status],
    [tsk].[recurrenceConfig],
    [tsk].[tags],
    [tsk].[dateCreated],
    [tsk].[dateModified]
  FROM [functional].[task] [tsk]
  WHERE [tsk].[idAccount] = @idAccount
    AND [tsk].[idUser] = @idUser
    AND [tsk].[deleted] = 0
    AND ((@priority IS NULL) OR ([tsk].[priority] = @priority))
    AND ((@status IS NULL) OR ([tsk].[status] = @status))
  ORDER BY
    [tsk].[dueDate] ASC,
    [tsk].[priority] DESC,
    [tsk].[dateCreated] DESC;
END;
GO


-- File: functional/task/spTaskUpdate.sql
/**
 * @summary
 * Updates an existing task with new values for title, description, due date,
 * priority, status, recurrence configuration, and tags. Validates all fields
 * and business rules before updating.
 *
 * @procedure spTaskUpdate
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - PUT /api/v1/internal/task/:id
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier for multi-tenancy
 *
 * @param {INT} idTask
 *   - Required: Yes
 *   - Description: Task identifier to update
 *
 * @param {NVARCHAR(100)} title
 *   - Required: Yes
 *   - Description: Updated task title (3-100 characters)
 *
 * @param {NVARCHAR(1000)} description
 *   - Required: No
 *   - Description: Updated task description (max 1000 characters)
 *
 * @param {DATE} dueDate
 *   - Required: Yes
 *   - Description: Updated task due date (cannot be in the past)
 *
 * @param {INT} priority
 *   - Required: Yes
 *   - Description: Updated priority level (0=low, 1=medium, 2=high)
 *
 * @param {INT} status
 *   - Required: Yes
 *   - Description: Updated status (0=pending, 1=in_progress, 2=completed)
 *
 * @param {NVARCHAR(MAX)} recurrenceConfig
 *   - Required: No
 *   - Description: Updated JSON configuration for recurring tasks
 *
 * @param {NVARCHAR(MAX)} tags
 *   - Required: No
 *   - Description: Updated JSON array of task tags
 *
 * @testScenarios
 * - Valid task update with all fields
 * - Task update with partial fields
 * - Validation failure for title length
 * - Validation failure for due date in the past
 * - Validation failure for invalid priority or status
 * - Validation failure for non-existent task
 * - Validation failure for task from different account
 */
CREATE OR ALTER PROCEDURE [functional].[spTaskUpdate]
  @idAccount INTEGER,
  @idTask INTEGER,
  @title NVARCHAR(100),
  @description NVARCHAR(1000) = NULL,
  @dueDate DATE,
  @priority INTEGER,
  @status INTEGER,
  @recurrenceConfig NVARCHAR(MAX) = NULL,
  @tags NVARCHAR(MAX) = NULL
AS
BEGIN
  SET NOCOUNT ON;

  /**
   * @validation Required parameter validation
   * @throw {idAccountRequired}
   */
  IF (@idAccount IS NULL)
  BEGIN
    ;THROW 51000, 'idAccountRequired', 1;
  END;

  /**
   * @validation Required parameter validation
   * @throw {idTaskRequired}
   */
  IF (@idTask IS NULL)
  BEGIN
    ;THROW 51000, 'idTaskRequired', 1;
  END;

  /**
   * @validation Required parameter validation
   * @throw {titleRequired}
   */
  IF (@title IS NULL OR LTRIM(RTRIM(@title)) = '')
  BEGIN
    ;THROW 51000, 'titleRequired', 1;
  END;

  /**
   * @validation Title length validation
   * @throw {titleMinLength}
   */
  IF (LEN(LTRIM(RTRIM(@title))) < 3)
  BEGIN
    ;THROW 51000, 'titleMinLength', 1;
  END;

  /**
   * @validation Title length validation
   * @throw {titleMaxLength}
   */
  IF (LEN(@title) > 100)
  BEGIN
    ;THROW 51000, 'titleMaxLength', 1;
  END;

  /**
   * @validation Required parameter validation
   * @throw {dueDateRequired}
   */
  IF (@dueDate IS NULL)
  BEGIN
    ;THROW 51000, 'dueDateRequired', 1;
  END;

  /**
   * @validation Due date cannot be in the past
   * @throw {dueDateCannotBeInPast}
   */
  IF (@dueDate < CAST(GETUTCDATE() AS DATE))
  BEGIN
    ;THROW 51000, 'dueDateCannotBeInPast', 1;
  END;

  /**
   * @validation Required parameter validation
   * @throw {priorityRequired}
   */
  IF (@priority IS NULL)
  BEGIN
    ;THROW 51000, 'priorityRequired', 1;
  END;

  /**
   * @validation Priority value validation
   * @throw {priorityInvalidValue}
   */
  IF (@priority NOT BETWEEN 0 AND 2)
  BEGIN
    ;THROW 51000, 'priorityInvalidValue', 1;
  END;

  /**
   * @validation Required parameter validation
   * @throw {statusRequired}
   */
  IF (@status IS NULL)
  BEGIN
    ;THROW 51000, 'statusRequired', 1;
  END;

  /**
   * @validation Status value validation
   * @throw {statusInvalidValue}
   */
  IF (@status NOT BETWEEN 0 AND 2)
  BEGIN
    ;THROW 51000, 'statusInvalidValue', 1;
  END;

  /**
   * @validation Description length validation
   * @throw {descriptionMaxLength}
   */
  IF (@description IS NOT NULL AND LEN(@description) > 1000)
  BEGIN
    ;THROW 51000, 'descriptionMaxLength', 1;
  END;

  /**
   * @validation Task existence and account association validation
   * @throw {taskDoesntExist}
   */
  IF NOT EXISTS (SELECT * FROM [functional].[task] tsk WHERE tsk.[idTask] = @idTask AND tsk.[idAccount] = @idAccount AND tsk.[deleted] = 0)
  BEGIN
    ;THROW 51000, 'taskDoesntExist', 1;
  END;

  BEGIN TRY
    /**
     * @rule {db-multi-tenancy,fn-task-update} Update task with account isolation
     */
    BEGIN TRAN;

      UPDATE [functional].[task]
      SET
        [title] = @title,
        [description] = @description,
        [dueDate] = @dueDate,
        [priority] = @priority,
        [status] = @status,
        [recurrenceConfig] = @recurrenceConfig,
        [tags] = @tags,
        [dateModified] = GETUTCDATE()
      WHERE [idAccount] = @idAccount
        AND [idTask] = @idTask
        AND [deleted] = 0;

      /**
       * @output {TaskUpdated, 1, 1}
       * @column {INT} idTask
       * - Description: Updated task identifier
       */
      SELECT @idTask AS [idTask];

    COMMIT TRAN;
  END TRY
  BEGIN CATCH
    ROLLBACK TRAN;
    THROW;
  END CATCH;
END;
GO



-- ============================================
-- Migration completed successfully
-- ============================================

PRINT 'Migration completed successfully!';
GO
