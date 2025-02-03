import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

const useNave = () => {
  const [naveData, setNaveData] = useState(null);
  const [naveNames, setNaveNames] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all nave data
  const fetchNaveData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/ship/nave`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setNaveData(response.data);
    } catch (err) {
      setError((err as any).response?.data?.error || 'Error fetching nave data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch nave names
  const fetchNaveNames = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/ship/naveName`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setNaveNames(response.data);
    } catch (err) {
      setError((err as any).response?.data?.error || 'Error fetching nave names');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Optionally fetch data on mount
    fetchNaveData();
    fetchNaveNames();
  }, []);

  return {
    naveData,
    naveNames,
    loading,
    error,
    fetchNaveData,
    fetchNaveNames,
  };
};

export default useNave;
