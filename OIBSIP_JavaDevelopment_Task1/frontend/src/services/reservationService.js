import apiClient from './apiService';

const reservationService = {
  // Create new reservation
  createReservation: async (reservationData) => {
    const response = await apiClient.post('/reservations', reservationData);
    return response.data;
  },

  // Get reservation by PNR
  getReservationByPnr: async (pnr) => {
    const response = await apiClient.get(`/reservations/${pnr}`);
    return response.data;
  },

  // Cancel reservation
  cancelReservation: async (pnr) => {
    const response = await apiClient.delete(`/reservations/${pnr}`);
    return response.data;
  },
};

export default reservationService;