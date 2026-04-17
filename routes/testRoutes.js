const express = require("express");
const router = express.Router();

const getDecision = require("../utils/decisionEngine");
const LearningSession = require("../models/LearningSession");
const User = require("../models/User");

// ✅ SUBMIT
router.post("/submit", async (req, res) => {
  const { userId, topic, answers } = req.body;

  const total = answers.length;
  const correct = answers.filter(a => a.isCorrect).length;
  const score = (correct / total) * 100;

  const result = getDecision(score, answers);

  try {
    const session = new LearningSession({
      userId,
      topic,
      score,
      weakAreas: result.weakAreas,
      decision: result.decision,

    });

    await session.save();

    res.json({
      score,
      weakAreas: result.weakAreas,
      decision: result.decision,
      message: `You should ${result.decision} this topic`
    });

  } catch (err) {
    console.error("DB ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ PROGRESS
router.get("/progress/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const latestSession = await LearningSession.findOne({ userId })
      .sort({ createdAt: -1 });

    if (!latestSession) {
      return res.json({ message: "No data found" });
    }

    res.json({
      topic: latestSession.topic,
      score: latestSession.score,
      decision: latestSession.decision,
      weakAreas: latestSession.weakAreas
    });

  } catch (err) {
    res.status(500).json({ error: "Error fetching progress" });
  }
});

// ✅ RECOVERY
router.get("/recovery/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const latestSession = await LearningSession.findOne({ userId })
      .sort({ createdAt: -1 });

    if (!latestSession) {
      return res.json({ message: "No previous activity found" });
    }

    const lastActivity = latestSession.lastActivity;
    const now = new Date();

    const diffDays = (now - new Date(lastActivity)) / (1000 * 60 * 60 * 24);

    if (diffDays > 2) {
      return res.json({
        message: `You stopped at ${latestSession.topic}. Let's revise before continuing.`
      });
    }

    res.json({
      message: "You are on track. Keep going 🚀"
    });

  } catch (err) {
    res.status(500).json({ error: "Recovery error" });
  }
});

// ✅ CREATE USER (यह भी add करो)
router.post("/create-user", async (req, res) => {
  const { name, email } = req.body;

  try {
    const user = new User({ name, email });
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "User creation failed" });
  }
});

// ✅ LAST LINE
module.exports = router;