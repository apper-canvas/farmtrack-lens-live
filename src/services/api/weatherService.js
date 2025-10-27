import { getApperClient } from "@/services/apperClient";

const weatherService = {
  getCurrentWeather: async () => {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.fetchRecords("weather_c", {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "condition_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "high_c" } },
          { field: { Name: "humidity_c" } },
          { field: { Name: "low_c" } },
          { field: { Name: "precipitation_c" } },
          { field: { Name: "wind_speed_c" } }
        ],
        orderBy: [{ fieldName: "date_c", sorttype: "DESC" }],
        pagingInfo: { limit: 1, offset: 0 }
      });

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.data && response.data.length > 0) {
        return {
          ...response.data[0],
          current: true
        };
      }

      return null;
    } catch (error) {
      console.error("Error fetching current weather:", error?.message || error);
      return null;
    }
  },

  getForecast: async (days = 5) => {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.fetchRecords("weather_c", {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "condition_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "high_c" } },
          { field: { Name: "humidity_c" } },
          { field: { Name: "low_c" } },
          { field: { Name: "precipitation_c" } },
          { field: { Name: "wind_speed_c" } }
        ],
        orderBy: [{ fieldName: "date_c", sorttype: "ASC" }],
        pagingInfo: { limit: days, offset: 0 }
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching weather forecast:", error?.message || error);
      return [];
    }
  }
};

export default weatherService;