const express = require("express");
const userAuth = require("../Middleware/userAuth");
const Issue = require("../Models/Issue");

const infoRouter = express.Router()

const faqData = [
    {
        id: "1",
        question: "How do I create an account?",
        answer:
            "To create an account, download the app, sign up using your email or phone number, and complete your profile.",
    },
    {
        id: "2",
        question: "How do I edit my profile?",
        answer:
            "Go to the 'Profile' section, tap on 'Edit Profile', and update your details, including bio, photos, and preferences.",
    },
    {
        id: "3",
        question: "How can I match with someone?",
        answer:
            "You can swipe right on profiles you like. If the other person also swipes right, it's a match, and you can start chatting!",
    },
    {
        id: "4",
        question: "How do I report a user?",
        answer:
            "To report a user, go to their profile, tap on the three-dot menu, and select 'Report'. Choose a reason and submit.",
    },
    {
        id: "5",
        question: "How do I delete my account?",
        answer:
            "Go to Settings > Account > Delete Account. Follow the instructions to permanently remove your profile.",
    },
    {
        id: "6",
        question: "How to unsubscribe from premium?",
        answer:
            "To unsubscribe, go to Settings > Subscription, and cancel your plan through the App Store or Google Play Store.",
    },
    {
        id: "7",
        question: "Can I hide my profile from others?",
        answer:
            "Yes, you can enable 'Incognito Mode' in Settings to browse profiles without appearing in recommendations.",
    },
    {
        id: "8",
        question: "How do I change my match preferences?",
        answer:
            "Go to Settings > Match Preferences and update filters like age range, distance, and interests.",
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
    "Payment Issues"
]

//FAQ

infoRouter.get("/faq", userAuth, async (req, res) => {
    try {

        res.status(200).json({ success: true, faqData })
    } catch (err) {
        res.status(400).json({ message: "Error while fetching FAQ", success: false })
    }
})

//support

infoRouter.post("/support", userAuth, async (req, res) => {
    const loggedUser = req.user;
    let newIssue = {
        userId: loggedUser._id,
        message: req.body.message,
        email: loggedUser.email,
        userName: loggedUser.userName,
    }
    // console.log(newIssue);
    try {
        if (loggedUser) {
            const newIssueToSave = new Issue(newIssue);
            await newIssueToSave.save();
        }
        return res.status(200).json({ message: "Issue raised successfully", success: true })
    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ message: "failed to raise issue !!", success: false })
    }
})
//issueType list
infoRouter.get("/issueType", userAuth, async (_, res) => {
    try {
        return res.status(200).json({ success: true, data: [...issueType] })
    } catch (error) {
        return res.status(400).json({ message: error.message || "someThing Went wrong" })
    }
})

module.exports = infoRouter;


