import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import trainService from '../services/trainService';

const Dashboard = () => {
  const [trains, setTrains] = useState([]);
  const [searchForm, setSearchForm] = useState({ source: '', destination: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadAllTrains();
  }, []);

  const loadAllTrains = async () => {
    try {
      setLoading(true);
      const data = await trainService.getAllTrains();
      setTrains(data);
    } catch (err) {
      setError('Failed to load trains');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchForm.source || !searchForm.destination) {
      setError('Please enter both source and destination');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const data = await trainService.searchTrains(searchForm.source, searchForm.destination);
      setTrains(data);
      if (data.length === 0) {
        setError('No trains found for this route');
      }
    } catch (err) {
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <nav className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Train Reservation System</h1>
          <div className="flex items-center gap-4">
            <span>Welcome, {user?.username}</span>
            <button
              onClick={() => navigate('/cancel')}
              className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-100"
            >
              Cancel Ticket
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto p-6">
        {/* Search Form */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-bold mb-4">Search Trains</h2>
          <form onSubmit={handleSearch} className="flex gap-4">
            <input
              type="text"
              placeholder="Source Station"
              value={searchForm.source}
              onChange={(e) => setSearchForm({ ...searchForm, source: e.target.value })}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Destination Station"
              value={searchForm.destination}
              onChange={(e) => setSearchForm({ ...searchForm, destination: e.target.value })}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
            >
              Search
            </button>
            <button
              type="button"
              onClick={loadAllTrains}
              className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600"
            >
              Show All
            </button>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-8">
            <div className="text-xl text-gray-600">Loading trains...</div>
          </div>
        )}

        {/* Trains List */}
        {!loading && trains.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trains.map((train) => (
              <div key={train.id} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-blue-600 mb-2">{train.trainName}</h3>
                <p className="text-gray-600 mb-1">Train Number: {train.trainNumber}</p>
                <p className="text-gray-600 mb-1">
                  Route: {train.source} → {train.destination}
                </p>
                <p className="text-gray-600 mb-1">
                  Timing: {train.departureTime} - {train.arrivalTime}
                </p>
                <p className="text-gray-600 mb-4">
                  Available Seats: <span className="font-bold">{train.availableSeats}</span> / {train.totalSeats}
                </p>
                <button
                  onClick={() => navigate(`/book/${train.trainNumber}`)}
                  disabled={train.availableSeats === 0}
                  className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {train.availableSeats === 0 ? 'Sold Out' : 'Book Now'}
                </button>
              </div>
            ))}
          </div>
        )}

        {!loading && trains.length === 0 && !error && (
          <div className="text-center py-8 text-gray-600">
            No trains available. Try searching for a specific route.
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;