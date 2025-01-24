import React, { useState } from "react";
import "./App.css";

const App = () => {
  const [screen, setScreen] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [accessToken, setAccessToken] = useState(null);

  // Fetch Access Token
  const fetchAccessToken = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_PEGA_ACCESSS_TOKEN_URL}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            grant_type: "password",
            client_id: process.env.REACT_APP_CLIENT_ID,
            client_secret: process.env.REACT_APP_CLIENT_SECRET,
            server: process.env.REACT_APP_PEGA_SERVER,
            username: process.env.REACT_APP_USER,
            password: process.env.REACT_APP_PASSWORD,
            origin_channel: process.env.REACT_APP_ORIGIN_CHANNEL,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setAccessToken(data.access_token); // Save to state
        console.log("Access token fetched successfully:", data.access_token);
        return data.access_token; // Return token directly
      } else {
        console.error("Failed to fetch access token. Response:", response.status);
        throw new Error("Failed to fetch access token");
      }
    } catch (error) {
      console.error("Error fetching token:", error);
      throw error;
    }
  };

  // Fetch Assignment Details
  const fetchAssignmentDetails = async (token) => {
    const assignmentID = '/ASSIGN-WORKLIST XYZ-CONSTSDKDEMO-WORK S-2021!COLLECTINFORMATION_FLOW?viewType=&pageName='; // Replace with your dynamic assignment ID
    try {
      const response = await fetch(
        `${process.env.REACT_APP_PEGA_BASE_URL}${process.env.REACT_APP_CASES_API}${assignmentID}`, 
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, 
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Assignment details fetched successfully:", data);
        setFormData({
          name: data.data.caseInfo.content.FirstName || "",
          lastname: data.data.caseInfo.content.LastName || "",
          email: data.data.caseInfo.content.Email || "",
          Company: data.data.caseInfo.content.CompanyName || "",
        }); // Update formData with details
        setScreen(2); // Navigate to the form screen
      } else {
        console.error("Failed to fetch assignment details. Response:", response.status);
      }
    } catch (error) {
      console.error("Error fetching assignment details:", error);
    }
};

  // Handle Fill the Form
  const handleFillForm = async () => {
    try {
      const token = await fetchAccessToken(); // Fetch token
      if (token) {
        await fetchAssignmentDetails(token); // Fetch assignment details
      }
    } catch (error) {
      console.error("Error in handleFillForm:", error);
    }
  };

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle Submit
  const handleSubmit = () => {
    console.log("Form submitted with data:", formData);
    alert("Form submitted!");
  };

  return (
    <div className="app-container">
      {screen === 1 ? (
        <div>
          <h1>Screen 1</h1>
          <button onClick={handleFillForm}>Fill the Form</button>
        </div>
      ) : (
        <div>
          <h1>Screen 2</h1>
          <input
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
          />
          <input
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            name="phone"
            placeholder="Phone"
            value={formData.lastname}
            onChange={handleChange}
          />
          <input
            name="address"
            placeholder="Address"
            value={formData.Company}
            onChange={handleChange}
          />
          <button onClick={handleSubmit}>Submit</button>
        </div>
      )}
    </div>
  );
};

export default App;
