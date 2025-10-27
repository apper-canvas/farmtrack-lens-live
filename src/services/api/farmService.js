import { getApperClient } from "@/services/apperClient";

const farmService = {
  getAll: async () => {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.fetchRecords("farm_c", {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "name_c" } },
          { field: { Name: "location_c" } },
          { field: { Name: "total_area_c" } },
          { field: { Name: "unit_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "CreatedOn" } }
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching farms:", error?.message || error);
      return [];
    }
  },

  getById: async (id) => {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.getRecordById("farm_c", parseInt(id), {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "name_c" } },
          { field: { Name: "location_c" } },
          { field: { Name: "total_area_c" } },
          { field: { Name: "unit_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "CreatedOn" } }
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data || null;
    } catch (error) {
      console.error(`Error fetching farm ${id}:`, error?.message || error);
      return null;
    }
  },

  create: async (farmData) => {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const payload = {
        records: [{
          Name: farmData.name || "",
          name_c: farmData.name || "",
          location_c: farmData.location || "",
          total_area_c: parseFloat(farmData.totalArea) || 0,
          unit_c: farmData.unit || "acres",
          notes_c: farmData.notes || ""
        }]
      };

      const response = await apperClient.createRecord("farm_c", payload);

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
      console.error("Error creating farm:", error?.message || error);
      return null;
    }
  },

  update: async (id, farmData) => {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const payload = {
        records: [{
          Id: parseInt(id),
          Name: farmData.name || "",
          name_c: farmData.name || "",
          location_c: farmData.location || "",
          total_area_c: parseFloat(farmData.totalArea) || 0,
          unit_c: farmData.unit || "acres",
          notes_c: farmData.notes || ""
        }]
      };

      const response = await apperClient.updateRecord("farm_c", payload);

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
      console.error("Error updating farm:", error?.message || error);
      return null;
    }
  },

  delete: async (id) => {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.deleteRecord("farm_c", {
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
      console.error("Error deleting farm:", error?.message || error);
      return false;
    }
  }
};

export default farmService;