import apiClient from './apiService';

const trainService = {
  // Get all trains
  getAllTrains: async () => {
    const response = await apiClient.get('/trains');
    return response.data;
  },

  // Search trains by source and destination
  searchTrains: async (source, destination) => {
    const response = await apiClient.get('/trains/search', {
      params: { source, destination }
    });
    return response.data;
  },

  // Get train by number
  getTrainByNumber: async (trainNumber) => {
    const response = await apiClient.get(`/trains/${trainNumber}`);
    return response.data;
  },
};

export default trainService;