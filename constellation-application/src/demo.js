import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

const App = () => {
  const [screen, setScreen] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [accessToken, setAccessToken] = useState(null);

  // Step 1: Fetch Access Token
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
            server: process.env.REACT_APP_PEGA_SERVER, // Added server
            username: process.env.REACT_APP_USER, // Added user
            password: process.env.REACT_APP_PASSWORD, // Added password
            origin_channel: process.env.REACT_APP_ORIGIN_CHANNEL, // Added origin channel
          }).toString(),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setAccessToken(data.access_token);
        console.log("Access token fetched successfully:", data.access_token);
      } else {
        console.error("Failed to fetch access token. Response:", response.status);
        Alert.alert("Error", "Failed to fetch access token.");
      }
    } catch (error) {
      console.error("Error fetching token:", error);
      Alert.alert("Error", "An error occurred while fetching the access token.");
    }
  };

  // Step 2: Submit Case to Pega
  const handleSubmit = async () => {
    if (!accessToken) {
      console.error("No access token available");
      Alert.alert("Error", "No access token available.");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_PEGA_BASE_URL}${process.env.REACT_APP_CASES_API}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`, // Add token here
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        Alert.alert("Success", `Case created with ID: ${data.caseID}`);
      } else {
        console.error("Failed to submit case");
        Alert.alert("Error", "Failed to submit case.");
      }
    } catch (error) {
      console.error("Error submitting case:", error);
      Alert.alert("Error", "An error occurred while submitting the case.");
    }
  };

  // Handle Next Screen Navigation
  const handleNext = async () => {
    if (screen === 1) {
      await fetchAccessToken(); // Fetch token before moving forward
    }
    setScreen(2);
  };

  // Handle Input Changes
  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  return (
    <View style={styles.container}>
      {screen === 1 ? (
        <View style={styles.screen}>
          <Text style={styles.heading}>Screen 1</Text>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={formData.name}
            onChangeText={(value) => handleChange("name", value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={formData.email}
            onChangeText={(value) => handleChange("email", value)}
          />
          <TouchableOpacity style={styles.button} onPress={handleNext}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.screen}>
          <Text style={styles.heading}>Screen 2</Text>
          <TextInput
            style={styles.input}
            placeholder="Phone"
            value={formData.phone}
            onChangeText={(value) => handleChange("phone", value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Address"
            value={formData.address}
            onChangeText={(value) => handleChange("address", value)}
          />
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  screen: {
    width: "90%",
    padding: 20,
    borderRadius: 10,
    backgroundColor: "white",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: "#fff",
  },
  button: {
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#007bff",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});