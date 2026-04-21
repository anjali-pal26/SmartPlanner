const getDecision = require("../utils/decisionEngine");
const LearningSession = require("../models/LearningSession");

// SUBMIT
exports.submitTest = async (req, res) => {
  const { userId, topic, answers } = req.body;

  if (!userId || !topic) {
  return res.status(400).json({
    error: "userId and topic are required"
  });
}

  if (!answers || answers.length === 0) {
    return res.status(400).json({
      error: "Answers cannot be empty"
    });
  }
  for (let ans of answers) {
  if (
    ans.isCorrect === undefined ||
    typeof ans.isCorrect !== "boolean" ||
    !ans.concept
  ) {
    return res.status(400).json({
      error: "Invalid answer format"
    });
  }
}

  const total = answers.length;
  const correct = answers.filter(a => a.isCorrect).length;
  const score = Math.round((correct / total) * 100);

  const result = getDecision(score, answers);
  const weakAreas = [...new Set(result.weakAreas)].filter(Boolean);

  try {
    const session = new LearningSession({
      userId,
      topic,
      score,
      weakAreas: weakAreas,
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