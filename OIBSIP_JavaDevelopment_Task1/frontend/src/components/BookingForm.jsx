import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import trainService from '../services/trainService';
import reservationService from '../services/reservationService';

const BookingForm = () => {
  const { trainNumber } = useParams();
  const navigate = useNavigate();
  const [train, setTrain] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    classType: 'SLEEPER',
    journeyDate: '',
    fromStation: '',
    toStation: '',
    numberOfPassengers: 1,
  });

  useEffect(() => {
    loadTrain();
  }, [trainNumber]);

  const loadTrain = async () => {
    try {
      const data = await trainService.getTrainByNumber(trainNumber);
      setTrain(data);
      setFormData({
        ...formData,
        fromStation: data.source,
        toStation: data.destination,
      });
    } catch (err) {
      setError('Failed to load train details');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const reservationData = {
        trainNumber: trainNumber,
        ...formData,
        numberOfPassengers: parseInt(formData.numberOfPassengers),
      };

      const response = await reservationService.createReservation(reservationData);
      setSuccess(`Booking successful! Your PNR is: ${response.pnr}`);
      
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (err) {
      const respData = err?.response?.data;
      const msg = respData
        ? (typeof respData === 'string' ? respData : respData.message || JSON.stringify(respData))
        : err?.message || 'Booking failed. Please try again.';
      setError(msg);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto max-w-2xl">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Book Ticket</h2>

          {/* Train Details */}
          {train && (
            <div className="bg-blue-50 p-4 rounded-md mb-6">
              <h3 className="text-xl font-bold text-blue-600">{train.trainName}</h3>
              <p className="text-gray-700">Train Number: {train.trainNumber}</p>
              <p className="text-gray-700">Route: {train.source} → {train.destination}</p>
              <p className="text-gray-700">Available Seats: {train.availableSeats}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {success}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {/* Booking Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Class Type</label>
              <select
                name="classType"
                value={formData.classType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="SLEEPER">Sleeper</option>
                <option value="AC">AC</option>
                <option value="GENERAL">General</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Journey Date</label>
              <input
                type="date"
                name="journeyDate"
                value={formData.journeyDate}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">From Station</label>
              <input
                type="text"
                name="fromStation"
                value={formData.fromStation}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">To Station</label>
              <input
                type="text"
                name="toStation"
                value={formData.toStation}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">Number of Passengers</label>
              <input
                type="number"
                name="numberOfPassengers"
                value={formData.numberOfPassengers}
                onChange={handleChange}
                min="1"
                max={train?.availableSeats || 1}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
              >
                Confirm Booking
              </button>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;