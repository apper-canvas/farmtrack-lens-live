import { getApperClient } from "@/services/apperClient";

const incomeService = {
  getAll: async () => {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.fetchRecords("income_c", {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "date_c" } },
          { field: { Name: "crop_id_c" }, referenceField: { field: { Name: "Name" } } },
          { field: { Name: "quantity_c" } },
          { field: { Name: "price_per_unit_c" } },
          { field: { Name: "buyer_c" } },
          { field: { Name: "total_amount_c" } }
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching income:", error?.message || error);
      return [];
    }
  },

  getById: async (id) => {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.getRecordById("income_c", parseInt(id), {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "date_c" } },
          { field: { Name: "crop_id_c" }, referenceField: { field: { Name: "Name" } } },
          { field: { Name: "quantity_c" } },
          { field: { Name: "price_per_unit_c" } },
          { field: { Name: "buyer_c" } },
          { field: { Name: "total_amount_c" } }
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data || null;
    } catch (error) {
      console.error(`Error fetching income ${id}:`, error?.message || error);
      return null;
    }
  },

  create: async (incomeData) => {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const quantity = parseFloat(incomeData.quantity) || 0;
      const pricePerUnit = parseFloat(incomeData.pricePerUnit) || 0;
      const totalAmount = quantity * pricePerUnit;

      const payload = {
        records: [{
          Name: `Income - ${incomeData.buyer}` || "",
          date_c: incomeData.date || "",
          crop_id_c: incomeData.cropId ? parseInt(incomeData.cropId) : null,
          quantity_c: quantity,
          price_per_unit_c: pricePerUnit,
          buyer_c: incomeData.buyer || "",
          total_amount_c: totalAmount
        }]
      };

      const response = await apperClient.createRecord("income_c", payload);

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
      console.error("Error creating income:", error?.message || error);
      return null;
    }
  },

  update: async (id, incomeData) => {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const quantity = parseFloat(incomeData.quantity) || 0;
      const pricePerUnit = parseFloat(incomeData.pricePerUnit) || 0;
      const totalAmount = quantity * pricePerUnit;

      const payload = {
        records: [{
          Id: parseInt(id),
          Name: `Income - ${incomeData.buyer}` || "",
          date_c: incomeData.date || "",
          crop_id_c: incomeData.cropId ? parseInt(incomeData.cropId) : null,
          quantity_c: quantity,
          price_per_unit_c: pricePerUnit,
          buyer_c: incomeData.buyer || "",
          total_amount_c: totalAmount
        }]
      };

      const response = await apperClient.updateRecord("income_c", payload);

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
      console.error("Error updating income:", error?.message || error);
      return null;
    }
  },

  delete: async (id) => {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.deleteRecord("income_c", {
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
      console.error("Error deleting income:", error?.message || error);
      return false;
    }
  }
};

export default incomeService;