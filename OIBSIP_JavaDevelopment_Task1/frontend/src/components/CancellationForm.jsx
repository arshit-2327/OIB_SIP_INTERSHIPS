import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import reservationService from '../services/reservationService';

const CancellationForm = () => {
  const [pnr, setPnr] = useState('');
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setReservation(null);
    setLoading(true);

    try {
      const data = await reservationService.getReservationByPnr(pnr);
      setReservation(data);
    } catch (err) {
      setError('PNR not found or invalid');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this reservation?')) {
      return;
    }

    try {
      setLoading(true);
      await reservationService.cancelReservation(pnr);
      setSuccess('Reservation cancelled successfully!');
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      setError('Cancellation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto max-w-2xl">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Cancel Reservation</h2>

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

          {/* PNR Search */}
          <form onSubmit={handleSearch} className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Enter PNR Number</label>
            <div className="flex gap-4">
              <input
                type="text"
                value={pnr}
                onChange={(e) => setPnr(e.target.value)}
                placeholder="Enter your PNR"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </form>

          {/* Reservation Details */}
          {reservation && (
            <div className="border border-gray-300 rounded-md p-6 mb-6">
              <h3 className="text-xl font-bold mb-4 text-gray-800">Reservation Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">PNR:</p>
                  <p className="font-bold">{reservation.pnr}</p>
                </div>
                <div>
                  <p className="text-gray-600">Status:</p>
                  <p className="font-bold text-green-600">{reservation.status}</p>
                </div>
                <div>
                  <p className="text-gray-600">Train:</p>
                  <p className="font-bold">{reservation.trainName} ({reservation.trainNumber})</p>
                </div>
                <div>
                  <p className="text-gray-600">Class:</p>
                  <p className="font-bold">{reservation.classType}</p>
                </div>
                <div>
                  <p className="text-gray-600">Journey Date:</p>
                  <p className="font-bold">{reservation.journeyDate}</p>
                </div>
                <div>
                  <p className="text-gray-600">Passengers:</p>
                  <p className="font-bold">{reservation.numberOfPassengers}</p>
                </div>
                <div>
                  <p className="text-gray-600">From:</p>
                  <p className="font-bold">{reservation.fromStation}</p>
                </div>
                <div>
                  <p className="text-gray-600">To:</p>
                  <p className="font-bold">{reservation.toStation}</p>
                </div>
              </div>

              {reservation.status === 'CONFIRMED' && (
                <button
                  onClick={handleCancel}
                  disabled={loading}
                  className="w-full mt-6 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 disabled:bg-red-300"
                >
                  {loading ? 'Cancelling...' : 'Cancel Reservation'}
                </button>
              )}

              {reservation.status === 'CANCELLED' && (
                <div className="mt-6 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
                  This reservation has already been cancelled.
                </div>
              )}
            </div>
          )}

          <button
            onClick={() => navigate('/')}
            className="w-full bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancellationForm;