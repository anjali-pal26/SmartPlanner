const request = require("supertest");
const app = require("../server");

describe("POST /api/test/submit", () => {

  test("empty answers → error", async () => {
    const res = await request(app)
      .post("/api/test/submit")
      .send({
        userId: "123",
        topic: "algebra",
        answers: []
      });
      

    expect(res.statusCode).toBe(400);
  });

  test("invalid format → error", async () => {
    const res = await request(app)
      .post("/api/test/submit")
      .send({
        userId: "123",
        topic: "algebra",
        answers: [{}]
      });

    expect(res.statusCode).toBe(400);
  });

  test("valid input → success", async () => {
    const res = await request(app)
      .post("/api/test/submit")
      .send({
        userId: "123",
        topic: "algebra",
        answers: [
          { questionId: 1, isCorrect: true, concept: "Linear Equations" }
        ]
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.decision).toBe("advance");
  });

});
describe("GET /api/test/progress", () => {

  test("should return latest session", async () => {
    const res = await request(app)
      .get("/api/test/progress/123");

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("score");
  });

});
describe("GET /api/test/recovery", () => {

  test("should return recovery message", async () => {
    const res = await request(app)
      .get("/api/test/recovery/123");

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message");
  });

});

afterAll(async () => {
  const mongoose = require("mongoose");
  await mongoose.connection.close();
});