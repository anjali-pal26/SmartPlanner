const getDecision = (score, answers) => {
  let decision = "";
  let weakAreas = [];

  // decision logic
  if (score < 50) {
    decision = "revise";
  } else if (score >= 50 && score <= 75) {
    decision = "practice";
  } else {
    decision = "advance";
  }

  // weak areas निकालना
  answers.forEach((ans) => {
    if (!ans.isCorrect) {
      weakAreas.push(ans.concept);
    }
  });

  // duplicate हटाना
  weakAreas = [...new Set(weakAreas)];

  return {
    decision,
    weakAreas,
  };
};

module.exports = getDecision;