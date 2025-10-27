import { getApperClient } from "@/services/apperClient";

const taskService = {
  getAll: async () => {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.fetchRecords("task_c", {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "completed_c" } },
          { field: { Name: "completed_at_c" } },
          { field: { Name: "farm_id_c" }, referenceField: { field: { Name: "Name" } } },
          { field: { Name: "crop_id_c" }, referenceField: { field: { Name: "Name" } } }
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching tasks:", error?.message || error);
      return [];
    }
  },

  getById: async (id) => {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.getRecordById("task_c", parseInt(id), {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "completed_c" } },
          { field: { Name: "completed_at_c" } },
          { field: { Name: "farm_id_c" }, referenceField: { field: { Name: "Name" } } },
          { field: { Name: "crop_id_c" }, referenceField: { field: { Name: "Name" } } }
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data || null;
    } catch (error) {
      console.error(`Error fetching task ${id}:`, error?.message || error);
      return null;
    }
  },

  create: async (taskData) => {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const payload = {
        records: [{
          Name: taskData.title || "",
          title_c: taskData.title || "",
          description_c: taskData.description || "",
          due_date_c: taskData.dueDate || "",
          priority_c: taskData.priority || "medium",
          completed_c: false,
          farm_id_c: taskData.farmId ? parseInt(taskData.farmId) : null,
          crop_id_c: taskData.cropId ? parseInt(taskData.cropId) : null
        }]
      };

      const response = await apperClient.createRecord("task_c", payload);

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          return result.data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error creating task:", error?.message || error);
      return null;
    }
  },

  update: async (id, taskData) => {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const payload = {
        records: [{
          Id: parseInt(id),
          Name: taskData.title || "",
          title_c: taskData.title || "",
          description_c: taskData.description || "",
          due_date_c: taskData.dueDate || "",
          priority_c: taskData.priority || "medium",
          farm_id_c: taskData.farmId ? parseInt(taskData.farmId) : null,
          crop_id_c: taskData.cropId ? parseInt(taskData.cropId) : null
        }]
      };

      const response = await apperClient.updateRecord("task_c", payload);

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          return result.data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error updating task:", error?.message || error);
      return null;
    }
  },

  toggleComplete: async (id) => {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      // First get current task state
      const currentTask = await taskService.getById(id);
      if (!currentTask) {
        return null;
      }

      const newCompletedState = !currentTask.completed_c;

      const payload = {
        records: [{
          Id: parseInt(id),
          completed_c: newCompletedState,
          completed_at_c: newCompletedState ? new Date().toISOString() : null
        }]
      };

      const response = await apperClient.updateRecord("task_c", payload);

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          return result.data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error toggling task completion:", error?.message || error);
      return null;
    }
  },

  delete: async (id) => {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.deleteRecord("task_c", {
        RecordIds: [parseInt(id)]
      });

      if (!response.success) {
        console.error(response.message);
        return false;
      }

      if (response.results && response.results.length > 0) {
        return response.results[0].success;
      }

      return false;
    } catch (error) {
      console.error("Error deleting task:", error?.message || error);
      return false;
    }
  }
};

export default taskService;