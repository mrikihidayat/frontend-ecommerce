import React, { useState, useEffect } from 'react';
import AdminRecentOrders from '../../components/admin/dashboard/AdminRecentOrders';
import { apiRequest, HTTP_METHODS } from "../../utils/utils";

const AdminDashboard = () => {
  const [users, setUsers] = useState(0);
  const [orders, setOrders] = useState(0);
  const [produk, setProduks] = useState(0);

  useEffect(() => {
    const fetchTotalUsers = async () => {
      try {
        const response = await apiRequest(HTTP_METHODS.GET, '/api/users/count');
        setUsers(response.data.count); // Mengambil jumlah pengguna dari respons
      } catch (error) {
        console.error('Error fetching total users count:', error);
      }
    };

    fetchTotalUsers(); // Memanggil fungsi untuk mengambil jumlah pengguna
  }, []);  

  useEffect(() => {
    const fetchTotalProduks = async () => {
      try {
        const response = await apiRequest(HTTP_METHODS.GET, '/api/products/amount/count');
        setProduks(response.data.count); // Mengambil jumlah pengguna dari respons
      } catch (error) {
        console.error('Error fetching total users count:', error);
      }
    };

    fetchTotalProduks(); // Memanggil fungsi untuk mengambil jumlah pengguna
  }, []); 

  useEffect(() => {
    const fetchTotalOrders = async () => {
      try {
        const response = await apiRequest(HTTP_METHODS.GET, '/api/transactions/count');
        setOrders(response.data.count); // Mengambil jumlah pengguna dari respons
      } catch (error) {
        console.error('Error fetching total users count:', error);
      }
    };

    fetchTotalOrders(); // Memanggil fungsi untuk mengambil jumlah pengguna
  }, []); 


  const handleDownloadReport = async () => {
    const url = "/api/transactions/rekap/report"; // URL relatif
  
    // Menggunakan apiRequest untuk mengunduh laporan
    const response = await apiRequest(HTTP_METHODS.GET, url, {}, { responseType: 'blob' });
  
    // Membuat blob dan memulai unduhan
    const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const urlBlob = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = urlBlob;
    a.download = 'report.xlsx'; // Nama file yang akan diunduh
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div className="p-4 bg-white min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-black">Dashboard</h1>
        <p className="text-sm text-gray-500">Home &gt; Dashboard</p>
      </div>

      {/* Statistics Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-black text-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-semibold">Total Users</h2>
          <p className="text-2xl font-bold">{users}</p>
        </div>
        <div className="bg-black text-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-semibold">Total Transactions</h2>
          <p className="text-2xl font-bold">{orders}</p>
        </div>
        <div className="bg-black text-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-semibold">Total Products</h2>
          <p className="text-2xl font-bold">{produk}</p>
        </div>
      </div>

      {/* Download Button */}
      <div className="mb-6">
        <button 
          onClick={handleDownloadReport}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Download Report
        </button>
      </div>

      {/* Recent Orders */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold text-black mb-4">Recent Orders</h2>
        <AdminRecentOrders />
      </div>
    </div>
  );
};

export default AdminDashboard;