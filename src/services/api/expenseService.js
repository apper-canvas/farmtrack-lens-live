import { getApperClient } from "@/services/apperClient";

const expenseService = {
  getAll: async () => {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.fetchRecords("expense_c", {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "date_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "amount_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "farm_id_c" }, referenceField: { field: { Name: "Name" } } }
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching expenses:", error?.message || error);
      return [];
    }
  },

  getById: async (id) => {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.getRecordById("expense_c", parseInt(id), {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "date_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "amount_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "farm_id_c" }, referenceField: { field: { Name: "Name" } } }
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data || null;
    } catch (error) {
      console.error(`Error fetching expense ${id}:`, error?.message || error);
      return null;
    }
  },

  create: async (expenseData) => {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const payload = {
        records: [{
Name: `${expenseData.category} - ${expenseData.description}`,
          date_c: expenseData.date || "",
          category_c: expenseData.category || "",
          amount_c: parseFloat(expenseData.amount) || 0,
          description_c: expenseData.description || "",
          farm_id_c: expenseData.farmId ? parseInt(expenseData.farmId) : null
        }]
      };

      const response = await apperClient.createRecord("expense_c", payload);

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
      console.error("Error creating expense:", error?.message || error);
      return null;
    }
  },

  update: async (id, expenseData) => {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const payload = {
        records: [{
          Id: parseInt(id),
Name: `${expenseData.category} - ${expenseData.description}`,
          date_c: expenseData.date || "",
          category_c: expenseData.category || "",
          amount_c: parseFloat(expenseData.amount) || 0,
          description_c: expenseData.description || "",
          farm_id_c: expenseData.farmId ? parseInt(expenseData.farmId) : null
        }]
      };

      const response = await apperClient.updateRecord("expense_c", payload);

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
      console.error("Error updating expense:", error?.message || error);
      return null;
    }
  },

  delete: async (id) => {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.deleteRecord("expense_c", {
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
      console.error("Error deleting expense:", error?.message || error);
      return false;
    }
  }
};

export default expenseService;