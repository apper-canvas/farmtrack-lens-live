import { getApperClient } from "@/services/apperClient";

const cropService = {
  getAll: async () => {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.fetchRecords("crop_c", {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "crop_name_c" } },
          { field: { Name: "variety_c" } },
          { field: { Name: "planting_date_c" } },
          { field: { Name: "expected_harvest_date_c" } },
          { field: { Name: "area_planted_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "farm_id_c" }, referenceField: { field: { Name: "Name" } } }
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching crops:", error?.message || error);
      return [];
    }
  },

  getById: async (id) => {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.getRecordById("crop_c", parseInt(id), {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "crop_name_c" } },
          { field: { Name: "variety_c" } },
          { field: { Name: "planting_date_c" } },
          { field: { Name: "expected_harvest_date_c" } },
          { field: { Name: "area_planted_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "farm_id_c" }, referenceField: { field: { Name: "Name" } } }
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data || null;
    } catch (error) {
      console.error(`Error fetching crop ${id}:`, error?.message || error);
      return null;
    }
  },

  getByFarmId: async (farmId) => {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.fetchRecords("crop_c", {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "crop_name_c" } },
          { field: { Name: "variety_c" } },
          { field: { Name: "planting_date_c" } },
          { field: { Name: "expected_harvest_date_c" } },
          { field: { Name: "area_planted_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "farm_id_c" }, referenceField: { field: { Name: "Name" } } }
        ],
        where: [{
          FieldName: "farm_id_c",
          Operator: "EqualTo",
          Values: [parseInt(farmId)]
        }]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error(`Error fetching crops for farm ${farmId}:`, error?.message || error);
      return [];
    }
  },

  create: async (cropData) => {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const payload = {
        records: [{
Name: `${cropData.cropName} - ${cropData.variety}`,
          crop_name_c: cropData.cropName || "",
          variety_c: cropData.variety || "",
          planting_date_c: cropData.plantingDate || "",
          expected_harvest_date_c: cropData.expectedHarvestDate || "",
          area_planted_c: parseFloat(cropData.areaPlanted) || 0,
          status_c: cropData.status || "growing",
          notes_c: cropData.notes || "",
          farm_id_c: cropData.farmId ? parseInt(cropData.farmId) : null
        }]
      };

      const response = await apperClient.createRecord("crop_c", payload);

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
      console.error("Error creating crop:", error?.message || error);
      return null;
    }
  },

  update: async (id, cropData) => {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const payload = {
        records: [{
          Id: parseInt(id),
Name: `${cropData.cropName} - ${cropData.variety}`,
          crop_name_c: cropData.cropName || "",
          variety_c: cropData.variety || "",
          planting_date_c: cropData.plantingDate || "",
          expected_harvest_date_c: cropData.expectedHarvestDate || "",
          area_planted_c: parseFloat(cropData.areaPlanted) || 0,
          status_c: cropData.status || "growing",
          notes_c: cropData.notes || "",
          farm_id_c: cropData.farmId ? parseInt(cropData.farmId) : null
        }]
      };

      const response = await apperClient.updateRecord("crop_c", payload);

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
      console.error("Error updating crop:", error?.message || error);
      return null;
    }
  },

  delete: async (id) => {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.deleteRecord("crop_c", {
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
      console.error("Error deleting crop:", error?.message || error);
      return false;
    }
  }
};

export default cropService;