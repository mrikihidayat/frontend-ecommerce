import React, { useState, useEffect } from "react";
import Navbar from "../../components/user/Navbar";
import Footer from "../../components/user/Footer";
import { apiRequest, HTTP_METHODS, getUserSession } from "../../utils/utils";

const MyAddress = () => {
  const [addressData, setAddressData] = useState({
    street: "",
    province: "",
    regency: "",
    district: "",
    village: "",
    zipCode: "",
  });

  
  const [savedAddress, setSavedAddress] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [provinces, setProvinces] = useState([]);
  const [regencies, setRegencies] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [villages, setVillages] = useState([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      const user = getUserSession();
      if (!user) {
        console.error("User not logged in");
        return;
      }

      try {
        const response = await apiRequest(HTTP_METHODS.POST, `/api/users/detail/${user._id}`);
        if (response.data.extra1 && response.data.extra1.address) {
          setSavedAddress(response.data.extra1.address);
        }
      } catch (error) {
        console.error("Failed to fetch user details:", error);
      }
    };

    const fetchProvinces = async () => {
      try {
        const response = await apiRequest(HTTP_METHODS.GET, "/api/geolocation/provinces");
        setProvinces(response.data.data || []);
      } catch (error) {
        console.error("Failed to fetch provinces:", error);
      }
    };

    fetchInitialData();
    fetchProvinces();
  }, []);

  const handleProvinceChange = async (e) => {
    const provinceName = e.target.value;
    setAddressData({ ...addressData, province: provinceName, regency: "", district: "", village: "", zipCode: "" });
    setRegencies([]);
    setDistricts([]);
    setVillages([]);
    const selectedProvince = provinces.find((prov) => prov.name === provinceName);
    if (selectedProvince) {
      try {
        const response = await apiRequest(HTTP_METHODS.GET, `/api/geolocation/regencies/${selectedProvince.code}`);
        setRegencies(response.data.data || []);
      } catch (error) {}
    }
  };

  const handleRegencyChange = async (e) => {
    const regencyName = e.target.value;
    setAddressData({ ...addressData, regency: regencyName, district: "", village: "", zipCode: "" });
    setDistricts([]);
    setVillages([]);
    const selectedRegency = regencies.find((reg) => reg.name === regencyName);
    if (selectedRegency) {
      try {
        const response = await apiRequest(HTTP_METHODS.GET, `/api/geolocation/districts/${selectedRegency.code}`);
        setDistricts(response.data.data || []);
      } catch (error) {}
    }
  };

  const handleDistrictChange = async (e) => {
    const districtName = e.target.value;
    setAddressData({ ...addressData, district: districtName, village: "", zipCode: "" });
    setVillages([]);
    const selectedDistrict = districts.find((dist) => dist.name === districtName);
    if (selectedDistrict) {
      try {
        const response = await apiRequest(HTTP_METHODS.GET, `/api/geolocation/villages/${selectedDistrict.code}`);
        setVillages(response.data.data || []);
      } catch (error) {}
    }
  };

  const handleVillageChange = (e) => {
    const villageName = e.target.value;
    setAddressData({ ...addressData, village: villageName });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddressData({ ...addressData, [name]: value });
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    const user = getUserSession();
    if (!user) {
      console.error("User not logged in");
      return;
    }

    const payload = {
      address: addressData,
    };

    try {
      await apiRequest(HTTP_METHODS.POST, `/api/users/update/${user._id}`, payload);
      setSavedAddress(addressData);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save address:", error);
    }
  };

  const handleEditAddress = () => {
    setIsEditing(true);
    setAddressData(savedAddress);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow py-10 px-4 lg:px-10">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between space-y-6 md:space-y-0">
            <div className="w-full md:w-1/3 bg-white shadow-xl rounded-lg p-6 mb-6 md:mb-0">
              {savedAddress ? (
                <div>
                  <h3 className="text-2xl font-semibold text-gray-800 mb-6">My Address</h3>
                  <div className="space-y-2 text-gray-600">
                    <p><span className="font-semibold">Street:</span> {savedAddress.street}</p>
                    <p><span className="font-semibold">Province:</span> {savedAddress.province}</p>
                    <p><span className="font-semibold">Regency:</span> {savedAddress.regency}</p>
                    <p><span className="font-semibold">District:</span> {savedAddress.district}</p>
                    <p><span className="font-semibold">Village:</span> {savedAddress.village}</p>
                    <p><span className="font-semibold">Zip Code:</span> {savedAddress.zipCode}</p>
                  </div>
                  <button onClick={handleEditAddress} className="bg-black text-white px-6 py-2 rounded-md mt-4">
                    Edit Address
                  </button>
                </div>
              ) : (
                <p className="text-gray-600">No address saved. Please add your address.</p>
              )}
            </div>

            <div className="w-full md:w-2/3 bg-white shadow-xl rounded-lg p-6">
              <h3 className="text-2xl font-semibold mb-6">{isEditing ? "Edit Address" : "Add Your Address"}</h3>
              <form onSubmit={handleSaveAddress} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium">Street</label>
                  <input
                    type="text"
                    name="street"
                    value={addressData.street}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Province</label>
                  <select
                    name="province"
                    value={addressData.province}
                    onChange={handleProvinceChange}
                    className="w-full p-3 border rounded-md"
                    required
                  >
                    <option value="">Select Province</option>
                    {provinces.map((province) => (
                      <option key={province.code} value={province.name}>{province.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium">Regency</label>
                  <select
                    name="regency"
                    value={addressData.regency}
                    onChange={handleRegencyChange}
                    className="w-full p-3 border rounded-md"
                    required
                  >
                    <option value="">Select Regency</option>
                    {regencies.map((regency) => (
                      <option key={regency.code} value={regency.name}>{regency.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium">District</label>
                  <select
                    name="district"
                    value={addressData.district}
                    onChange={handleDistrictChange}
                    className="w-full p-3 border rounded-md"
                    required
                  >
                    <option value="">Select District</option>
                    {districts.map((district) => (
                      <option key={district.code} value={district.name}>{district.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium">Village</label>
                  <select
                    name="village"
                    value={addressData.village}
                    onChange={handleVillageChange}
                    className="w-full p-3 border rounded-md"
                    required
                  >
                    <option value="">Select Village</option>
                    {villages.map((village) => (
                      <option key={village.code} value={village.name}>{village.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium">Zip Code</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={addressData.zipCode}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-md"
                    required
                  />
                </div>
                <button type="submit" className="bg-black text-white px-6 py-2 rounded-md">
                  Save Address
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MyAddress;
