const getDecision = require("../utils/decisionEngine");
const LearningSession = require("../models/LearningSession");

// SUBMIT
exports.submitTest = async (req, res) => {
  const { userId, topic, answers } = req.body;

  if (!answers || answers.length === 0) {
    return res.status(400).json({
      error: "Answers cannot be empty"
    });
  }

  const total = answers.length;
  const correct = answers.filter(a => a.isCorrect).length;
  const score = Math.round((correct / total) * 100);

  const result = getDecision(score, answers);

  try {
    const session = new LearningSession({
      userId,
      topic,
      score,
      weakAreas: result.weakAreas,
      decision: result.decision
    });

    await session.save();

    res.json({
      score,
      weakAreas: result.weakAreas,
      decision: result.decision,
      message: `You should ${result.decision} this topic`
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};