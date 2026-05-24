const request = require("supertest");
const sinon = require("sinon");

const app = require("../src/app");
const goalIntervalRepository = require("../src/repositories/goalIntervalRepository");
const userRepository = require("../src/repositories/userRepository");
const goalRepository = require("../src/repositories/goalRepository");

describe("Goal intervals API", () => {
  afterEach(() => {
    sinon.restore();
  });

  test("GET /api/goal-intervals should return all intervals", async () => {
    const intervals = [
      {
        id: 1,
        userId: 1,
        startDate: "2026-06-01T00:00:00.000Z",
        endDate: "2026-06-30T00:00:00.000Z",
        user: {
          id: 1,
          email: "mario.rossi@email.com",
          firstName: "Mario",
          lastName: "Rossi",
        },
        goals: [],
      },
    ];

    sinon.stub(goalIntervalRepository, "findAll").resolves(intervals);

    const response = await request(app).get("/api/goal-intervals");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(intervals);
  });

  test("GET /api/goal-intervals should return 400 for invalid goalId filter", async () => {
    const response = await request(app).get("/api/goal-intervals?goalId=abc");

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Validation failed");
    expect(response.body.errors).toContain("Id obiettivo filter deve essere un numero");
  });

  test("GET /api/goal-intervals/:id should return one interval", async () => {
    const interval = {
      id: 1,
      userId: 1,
      startDate: "2026-06-01T00:00:00.000Z",
      endDate: "2026-06-30T00:00:00.000Z",
      user: {
        id: 1,
        email: "mario.rossi@email.com",
        firstName: "Mario",
        lastName: "Rossi",
      },
      goals: [],
    };

    sinon.stub(goalIntervalRepository, "findById").resolves(interval);

    const response = await request(app).get("/api/goal-intervals/1");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(interval);
  });

  test("GET /api/goal-intervals/:id should return 404 when interval does not exist", async () => {
    sinon.stub(goalIntervalRepository, "findById").resolves(null);

    const response = await request(app).get("/api/goal-intervals/999");

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Goal interval not found");
  });

  test("POST /api/goal-intervals should create an interval", async () => {
    const payload = {
      userId: 1,
      startDate: "2026-06-01",
      endDate: "2026-06-30",
    };

    const user = {
      id: 1,
      email: "mario.rossi@email.com",
      firstName: "Mario",
      lastName: "Rossi",
    };

    const createdInterval = {
      id: 1,
      ...payload,
      goals: [],
    };

    sinon.stub(userRepository, "findById").resolves(user);
    sinon.stub(goalIntervalRepository, "create").resolves(createdInterval);

    const response = await request(app)
      .post("/api/goal-intervals")
      .send(payload);

    expect(response.status).toBe(201);
    expect(response.body).toEqual(createdInterval);
  });

  test("POST /api/goal-intervals should return 404 when user does not exist", async () => {
    const payload = {
      userId: 999,
      startDate: "2026-06-01",
      endDate: "2026-06-30",
    };

    sinon.stub(userRepository, "findById").resolves(null);

    const response = await request(app)
      .post("/api/goal-intervals")
      .send(payload);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("User not found");
  });

  test("POST /api/goal-intervals should return 400 when endDate is before startDate", async () => {
    const payload = {
      userId: 1,
      startDate: "2026-06-30",
      endDate: "2026-06-01",
    };

    const response = await request(app)
      .post("/api/goal-intervals")
      .send(payload);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Validation failed");
    expect(response.body.errors).toContain(
      "La data di fine deve essere maggiore o uguale alla data di inizio"
    );
  });

  test("PUT /api/goal-intervals/:id should update an interval", async () => {
    const existingInterval = {
      id: 1,
      userId: 1,
      startDate: "2026-06-01",
      endDate: "2026-06-30",
      goals: [],
    };

    const payload = {
      userId: 1,
      startDate: "2026-07-01",
      endDate: "2026-07-31",
    };

    const user = {
      id: 1,
      email: "mario.rossi@email.com",
      firstName: "Mario",
      lastName: "Rossi",
    };

    const updatedInterval = {
      id: 1,
      ...payload,
      goals: [],
    };

    sinon.stub(goalIntervalRepository, "findById").resolves(existingInterval);
    sinon.stub(userRepository, "findById").resolves(user);
    sinon.stub(goalIntervalRepository, "update").resolves(updatedInterval);

    const response = await request(app)
      .put("/api/goal-intervals/1")
      .send(payload);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(updatedInterval);
  });

  test("DELETE /api/goal-intervals/:id should delete an interval", async () => {
    sinon.stub(goalIntervalRepository, "remove").resolves(true);

    const response = await request(app).delete("/api/goal-intervals/1");

    expect(response.status).toBe(204);
  });

  test("POST /api/goal-intervals/:id/goals should associate a goal to an interval", async () => {
    const interval = {
      id: 1,
      userId: 1,
      goals: [],
    };

    const goal = {
      id: 1,
      title: "Meditare 10 minuti al giorno",
    };

    const association = {
      id: 1,
      intervalId: 1,
      goalId: 1,
    };

    sinon.stub(goalIntervalRepository, "findById").resolves(interval);
    sinon.stub(goalRepository, "findById").resolves(goal);
    sinon.stub(goalIntervalRepository, "findGoalAssociation").resolves(null);
    sinon
      .stub(goalIntervalRepository, "addGoalToInterval")
      .resolves(association);

    const response = await request(app)
      .post("/api/goal-intervals/1/goals")
      .send({
        goalId: 1,
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Goal associated successfully");
    expect(response.body.association).toEqual(association);
  });

  test("POST /api/goal-intervals/:id/goals should return 409 when association already exists", async () => {
    const interval = {
      id: 1,
      userId: 1,
      goals: [],
    };

    const goal = {
      id: 1,
      title: "Meditare 10 minuti al giorno",
    };

    sinon.stub(goalIntervalRepository, "findById").resolves(interval);
    sinon.stub(goalRepository, "findById").resolves(goal);
    sinon.stub(goalIntervalRepository, "findGoalAssociation").resolves({
      id: 1,
      intervalId: 1,
      goalId: 1,
    });

    const response = await request(app)
      .post("/api/goal-intervals/1/goals")
      .send({
        goalId: 1,
      });

    expect(response.status).toBe(409);
    expect(response.body.message).toBe(
      "Goal is already associated to this interval"
    );
  });

  test("DELETE /api/goal-intervals/:intervalId/goals/:goalId should remove an association", async () => {
    const interval = {
      id: 1,
      userId: 1,
      goals: [],
    };

    const goal = {
      id: 1,
      title: "Meditare 10 minuti al giorno",
    };

    sinon.stub(goalIntervalRepository, "findById").resolves(interval);
    sinon.stub(goalRepository, "findById").resolves(goal);
    sinon.stub(goalIntervalRepository, "removeGoalFromInterval").resolves(true);

    const response = await request(app).delete("/api/goal-intervals/1/goals/1");

    expect(response.status).toBe(204);
  });
});