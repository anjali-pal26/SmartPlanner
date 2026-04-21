const getDecision = require("../utils/decisionEngine");

test("score < 50 → revise", () => {
  const result = getDecision(30, []);
  expect(result.decision).toBe("revise");
});

test("score 60 → practice", () => {
  const result = getDecision(60, []);
  expect(result.decision).toBe("practice");
});

test("score 90 → advance", () => {
  const result = getDecision(90, []);
  expect(result.decision).toBe("advance");
});