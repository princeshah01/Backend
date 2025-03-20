require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const axios = require("axios");
const User = require("./Models/User"); // Adjust path accordingly

const RANDOM_USER_API = "https://randomuser.me/api/?results=1"; // Fetch 10 users

// Function to fetch random users
const fetchRandomUsers = async () => {
  try {
    const response = await axios.get(RANDOM_USER_API);
    return response.data.results;
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    return [];
  }
};

// Function to format users for MongoDB
const formatUsers = async (users) => {
  const formattedUsers = [];

  for (let user of users) {
    const hashedPassword = await bcrypt.hash("123456789@Pr", 10); // Default password for all users

    formattedUsers.push({
      interestIn: ["Male", "Female", "Non-binary"][
        Math.floor(Math.random() * 3)
      ],
      fullName: `${user.name.first} ${user.name.last}`,
      userName: user.login.username,
      email: user.email,
      password: hashedPassword,
      gender: user.gender.charAt(0).toUpperCase() + user.gender.slice(1), // Capitalize gender
      dob: user.dob.date.split("T")[0], // Extract YYYY-MM-DD
      isVerified: Math.random() < 0.5,
      isProfileSetup: true,
      bio: "Generated via RandomUser API.",
      profilePicture: user.picture.large,
      twoBestPics: [user.picture.medium, user.picture.thumbnail],
      locationName: `${user.location.city}, ${user.location.country}`,
      locationcoordiantes: {
        type: "Point",
        coordinates: [
          user.location.coordinates.longitude,
          user.location.coordinates.latitude,
        ],
      },
      interest: ["music", "sports", "reading"],
      matches: [],
      age: Math.floor(Math.random() * 36) + 5,
      isPremiumUser: Math.random() < 0.3,
      lastActive: new Date(),
    });
  }

  return formattedUsers;
};

// Function to seed users into MongoDB
const seedUsers = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/DatingApp", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("📡 Connected to MongoDB");

    const randomUsers = await fetchRandomUsers();
    if (randomUsers.length === 0) {
      console.log("❌ No users fetched. Exiting.");
      mongoose.connection.close();
      return;
    }

    const formattedUsers = await formatUsers(randomUsers);

    await User.insertMany(formattedUsers);
    console.log("✅ Random Users Inserted Successfully");

    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error inserting users:", error);
    mongoose.connection.close();
  }
};

// Run the function
seedUsers();
