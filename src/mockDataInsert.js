require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./Models/User"); // Adjust path accordingly

const usersData = [
  {
    interestIn: "Female",
    fullName: "john doe",
    userName: "johndoe123",
    email: "johndoe@example.com",
    password: "password123",
    gender: "Male",
    dob: "1995-06-15",
    isVerified: true,
    isProfileSetup: true,
    bio: "Love to explore new places.",
    profilePicture: "https://example.com/profile1.jpg",
    twoBestPics: [
      "https://example.com/pic1.jpg",
      "https://example.com/pic2.jpg",
    ],
    locationName: "New York",
    locationcoordiantes: { type: "Point", coordinates: [-74.006, 40.7128] },
    interest: ["travel", "music", "fitness"],
    matches: [],
    isPremiumUser: false,
    lastActive: new Date(),
  },
  {
    interestIn: "Male",
    fullName: "jane smith",
    userName: "janesmith456",
    email: "janesmith@example.com",
    password: "password456",
    gender: "Female",
    dob: "1998-09-22",
    isVerified: false,
    isProfileSetup: false,
    bio: "Book lover and coffee addict ☕.",
    profilePicture: "https://example.com/profile2.jpg",
    twoBestPics: [
      "https://example.com/pic3.jpg",
      "https://example.com/pic4.jpg",
    ],
    locationName: "Los Angeles",
    locationcoordiantes: { type: "Point", coordinates: [-118.2437, 34.0522] },
    interest: ["reading", "cooking", "hiking"],
    matches: [],
    isPremiumUser: true,
    lastActive: new Date(),
  },
  {
    interestIn: "Non-binary",
    fullName: "alex taylor",
    userName: "alextaylor789",
    email: "alextaylor@example.com",
    password: "password789",
    gender: "Non-binary",
    dob: "2000-01-10",
    isVerified: true,
    isProfileSetup: true,
    bio: "Tech enthusiast 🚀",
    profilePicture: "https://example.com/profile3.jpg",
    twoBestPics: [
      "https://example.com/pic5.jpg",
      "https://example.com/pic6.jpg",
    ],
    locationName: "San Francisco",
    locationcoordiantes: { type: "Point", coordinates: [-122.4194, 37.7749] },
    interest: ["coding", "gaming", "travel"],
    matches: [],
    isPremiumUser: false,
    lastActive: new Date(),
  },
];

// Generate 7 more users dynamically
for (let i = 4; i <= 10; i++) {
  usersData.push({
    interestIn: ["Male", "Female", "Non-binary"][Math.floor(Math.random() * 3)],
    fullName: `User ${i}`,
    userName: `user${i}`,
    email: `user${i}@example.com`,
    password: `123456789@Pr`,
    gender: ["Male", "Female", "Non-binary"][Math.floor(Math.random() * 3)],
    dob: `199${Math.floor(Math.random() * 10)}-0${
      Math.floor(Math.random() * 9) + 1
    }-1${Math.floor(Math.random() * 9)}`,
    isVerified: Math.random() < 0.5,
    isProfileSetup: Math.random() < 0.5,
    bio: "This is a randomly generated user.",
    profilePicture: "https://example.com/default.jpg",
    twoBestPics: [
      "https://example.com/random1.jpg",
      "https://example.com/random2.jpg",
    ],
    locationName: "Random City",
    locationcoordiantes: {
      type: "Point",
      coordinates: [Math.random() * 180 - 90, Math.random() * 180 - 90],
    },
    interest: ["music", "sports", "reading"],
    matches: [],
    isPremiumUser: Math.random() < 0.3,
    lastActive: new Date(),
  });
}

// Function to seed users
const seedUsers = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/DatingApp", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("📡 Connected to MongoDB");

    // Hash passwords before inserting
    for (let user of usersData) {
      user.password = await bcrypt.hash(user.password, 10);
    }

    await User.insertMany(usersData);
    console.log("✅ 10 Users Inserted Successfully");
    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error inserting users:", error);
    mongoose.connection.close();
  }
};

// Run the function
seedUsers();
