"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';

const AnalysisPage = () => {
  const { id } = useParams();
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5000/api/resumes/${id}/analysis`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setAnalysis(res.data.analysis);
      } catch (err: any) {
        setError(err.response?.data?.message || 'An error occurred while fetching analysis.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [id]);

  if (loading) {
    return <div className="container mx-auto p-4 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-center text-red-500">{error}</div>;
  }

  if (!analysis) {
    return <div className="container mx-auto p-4 text-center">No analysis found.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Resume Analysis</h2>
        <div className="bg-gray-100 p-4 rounded-md mt-2">
          <pre>{JSON.stringify(analysis, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
};

export default AnalysisPage;