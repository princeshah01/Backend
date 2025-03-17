const express = require("express");
const userAuth = require("../Middleware/userAuth");
const Issue = require("../Models/Issue");

const infoRouter = express.Router();

const faqData = [
  {
    id: "1",
    question: "How do I create an account?",
    answer:
      "To create an account, download the app, sign up using your email or phone number, and complete your profile setup.",
  },
  {
    id: "2",
    question: "How do I set up my profile?",
    answer:
      "After signing up and logging in, you will be guided through the profile setup screen where you can add your details and preferences.",
  },
  {
    id: "3",
    question: "How does swiping work?",
    answer:
      "Swipe right to like a profile, left to pass. Premium users can use super swipe (up) to show extra interest.",
  },
  {
    id: "4",
    question: "How can I schedule a date?",
    answer:
      "Use the dating scheduling feature to set up a date with a match. Choose a time and place, and send an invite.",
  },
  {
    id: "5",
    question: "How do I chat with other users?",
    answer:
      "Once you match with a user, you can start a conversation in the chat section.",
  },
  {
    id: "6",
    question: "What is the support section for?",
    answer:
      "The support section allows you to raise issues or get help regarding app usage.",
  },
  {
    id: "7",
    question: "How do I report a user?",
    answer:
      "Visit the user’s profile, scroll to the bottom, click 'Report User,' and submit your report with a specific message.",
  },
  {
    id: "8",
    question: "Can I edit my profile after setup?",
    answer:
      "Yes, go to your profile section and click the edit option at the top to update your details.",
  },
  {
    id: "9",
    question: "What features are available in the premium version?",
    answer:
      "Premium users get access to Super Swipe, enhanced matching options, and additional perks.",
  },
];

issueType = [
  "General Query",
  "Search Issue",
  "UI/UX Improvement Suggestion",
  "Report Abuse/Spam",
  "Chat/Messaging Issues",
  "Friend Request Issues",
  "Privacy Settings Issue",
  "Location Issues",
  "Verification Issues",
  "Notification Issues",
  "Profile Update Issue",
  "Bug Report",
  "Feature Request",
  "Account Issues",
  "Payment Issues",
];
// faq API

infoRouter.get("/faq", userAuth, async (req, res) => {
  try {
    res.status(200).json({ success: true, faqData });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Error while fetching FAQ", success: false });
  }
});

//support

infoRouter.post("/support", userAuth, async (req, res) => {
  const loggedUser = req.user;
  let newIssue = {
    userId: loggedUser._id,
    message: req.body.message,
    issueType: req.body.issueType,
  };
  // console.log(newIssue);
  try {
    if (loggedUser) {
      const newIssueToSave = new Issue(newIssue);
      await newIssueToSave.save();
    }
    return res
      .status(200)
      .json({ message: "Issue raised successfully", success: true });
  } catch (err) {
    console.log(err.message);
    return res
      .status(500)
      .json({ message: "failed to raise issue !!", success: false });
  }
});
//issueType list
infoRouter.get("/issueType", async (_, res) => {
  try {
    return res.status(200).json({ success: true, data: [...issueType] });
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "someThing Went wrong" });
  }
});

infoRouter.get("/helphistory", userAuth, async (req, res) => {
  const LoggedInUserId = req.user._id;
  try {
    const IssueHistory = await Issue.find({ userId: LoggedInUserId });
    console.log(IssueHistory);
    if (IssueHistory.length >= 1) {
      res.status(200).json({
        historyData: IssueHistory.reverse(),
        success: true,
        message: "Successfully retrived previous Issue raised",
      });
    }
    res.status(404).json({ message: "No History Found", success: false });
  } catch (error) {
    res
      .status(400)
      .json({ message: "failed to retrive past Issues", success: false });
  }
});

module.exports = infoRouter;
