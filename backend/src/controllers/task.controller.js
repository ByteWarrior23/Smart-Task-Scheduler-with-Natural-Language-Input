import { Task } from "../models/task.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

const createTask = asyncHandler(async (req, res) => {
  const { title, description, deadline } = req.body;
    if (!title || !description) {
        throw new ApiError(400, "Title and description are required");
    }
    const task = await Task.create({
        title,
        description,
        deadline: deadline || null,
        owner: req.user.id,
    });
    return res.status(201).json(new ApiResponse(201, "Task created successfully", task));
});

const deleteTask = asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    const task = await Task.findOneAndDelete({ _id: taskId, owner: req.user.id });
    if (!task) {
        throw new ApiError(404, "Task not found or you are not authorized to delete this task");
    }               
    return res.status(200).json(new ApiResponse(200, "Task deleted successfully"));
});

const updateTask = asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    const { title, description, deadline, status } = req.body;
    const task =  await Task.findOne({ _id: taskId, owner: req.user.id });
    if (!task) {
        throw new ApiError(404, "Task not found or you are not authorized to update this task");
    }   
    task.title = title || task.title;
    task.description = description || task.description;
    task.deadline = typeof deadline !== 'undefined' ? deadline : task.deadline;
    task.status = status || task.status;
    await task.save();
    return res.status(200).json(new ApiResponse(200, "Task updated successfully", task));
});

const getTasks = asyncHandler(async (req, res) => {
    const tasks = await Task.find({ owner: req.user.id });
    return res.status(200).json(new ApiResponse(200, "Tasks retrieved successfully", tasks));
});

const getTaskById = asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    const task = await Task.findOne({ _id: taskId, owner: req.user.id });  
    if (!task) {
        throw new ApiError(404, "Task not found or you are not authorized to view this task");
    }
    return res.status(200).json(new ApiResponse(200, "Task retrieved successfully", task));
}); 

const archiveTask = asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    const task = await Task.findOne({ _id: taskId, owner: req.user.id });
    if (!task) {
        throw new ApiError(404, "Task not found or you are not authorized to archive this task");
    }
    task.archived = true;
    await task.save();
    return res.status(200).json(new ApiResponse(200, "Task archived successfully", task));
});

const unarchiveTask = asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    const task = await Task.findOne({ _id: taskId, owner: req.user.id });
    if (!task) {
        throw new ApiError(404, "Task not found or you are not authorized to unarchive this task");
    }
    task.archived = false;
    await task.save();
    return res.status(200).json(new ApiResponse(200, "Task unarchived successfully", task));
});

const addComment = asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    const { comment } = req.body;
    if (!comment) {
        throw new ApiError(400, "Comment cannot be empty");
    }
    const task = await Task.findOne({ _id: taskId, owner: req.user.id });
    if (!task) {
        throw new ApiError(404, "Task not found or you are not authorized to comment on this task");
    }
    task.comments.push(comment);
    await task.save();
    return res.status(200).json(new ApiResponse(200, "Comment added successfully", task));
});

const getComments = asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    const task = await Task.findOne({ _id: taskId, owner: req.user.id });
    if (!task) {
        throw new ApiError(404, "Task not found or you are not authorized to view comments on this task");
    }
    return res.status(200).json(new ApiResponse(200, "Comments retrieved successfully", task.comments));
});

const markTaskAsCompleted = asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    const task = await Task.findOne({ _id: taskId, owner: req.user.id });
    if (!task) {
        throw new ApiError(404, "Task not found or you are not authorized to update this task");
    }
    task.status = 'completed';
    await task.save();
    return res.status(200).json(new ApiResponse(200, "Task marked as completed", task));
});

const markTaskAsPending = asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    const task = await Task.findOne({ _id: taskId, owner: req.user.id });
    if (!task) {
        throw new ApiError(404, "Task not found or you are not authorized to update this task");
    }
    task.status = 'pending';
    await task.save();
    return res.status(200).json(new ApiResponse(200, "Task marked as pending", task));
});

const getArchivedTasks = asyncHandler(async (req, res) => {
    const tasks = await Task.find({ owner: req.user.id, archived: true });
    return res.status(200).json(new ApiResponse(200, "Archived tasks retrieved successfully", tasks));
});

const getPendingTasks = asyncHandler(async (req, res) => {
    const tasks = await Task.find({ owner: req.user.id, status: 'pending' });
    return res.status(200).json(new ApiResponse(200, "Pending tasks retrieved successfully", tasks));
});

const getCompletedTasks = asyncHandler(async (req, res) => {
    const tasks = await Task.find({ owner: req.user.id, status: 'completed' });
    return res.status(200).json(new ApiResponse(200, "Completed tasks retrieved successfully", tasks));
});

const SearchTasks = asyncHandler(async (req, res) => {
    const { query } = req.query;
    if (!query) {
        throw new ApiError(400, "Search query cannot be empty");
    }
    const tasks = await Task.find({
        owner: req.user.id,
        $or: [
            { title: { $regex: query, $options: 'i' } },
            { description: { $regex: query, $options: 'i' } },
            { category: { $regex: query, $options: 'i' } },
            { comments: { $regex: query, $options: 'i' } },
        ],
        archived: false, // archived tasks are not included in the search results
    });
    return res.status(200).json(new ApiResponse(200, "Search results", tasks));
});

const filterTasksByCategory = asyncHandler(async (req, res) => {
    const { category } = req.params;
    if (!category) {
        throw new ApiError(400, "Category cannot be empty");
    }
    const tasks = await Task.find({ owner: req.user.id, category, archived: false });
    return res.status(200).json(new ApiResponse(200, `Tasks in category: ${category}`, tasks));
});

const sortTasksByDeadlineascending = asyncHandler(async (req, res) => {
    const tasks = await Task.find({ owner: req.user.id, archived: false }).sort({ deadline: 1 });
    return res.status(200).json(new ApiResponse(200, "Tasks sorted by deadline (ascending)", tasks));
});

const sortTasksByDeadlineDescending = asyncHandler(async (req, res) => {
    const tasks = await Task.find({ owner: req.user.id, archived: false }).sort({ deadline: -1 });
    return res.status(200).json(new ApiResponse(200, "Tasks sorted by deadline (descending)", tasks));
});

const sortTasksByCreationDate = asyncHandler(async (req, res) => {
    const tasks = await Task.find({ owner: req.user.id, archived: false }).sort({ createdAt: -1 });
    return res.status(200).json(new ApiResponse(200, "Tasks sorted by creation date", tasks));
});

const sortTasksByTimeRequired = asyncHandler(async (req, res) => {
    const tasks = await Task.find({ owner: req.user.id, archived: false }).sort({ time_required: 1 });
    return res.status(200).json(new ApiResponse(200, "Tasks sorted by time required", tasks));
});

export { 
  createTask,
  deleteTask,
  updateTask,
  getTasks,
  getTaskById,
  archiveTask,
  unarchiveTask,
  addComment,
  getComments,
  markTaskAsCompleted,
  markTaskAsPending,
  getArchivedTasks,
  getPendingTasks,
  getCompletedTasks,
  SearchTasks
};