const request = require("supertest");
const sinon = require("sinon");

const app = require("../src/app");
const goalRepository = require("../src/repositories/goalRepository");

describe("Goals API", () => {
  afterEach(() => {
    sinon.restore();
  });

  test("GET /api/goals should return all goals", async () => {
    const goals = [
      {
        id: 1,
        title: "Meditare 10 minuti al giorno",
        description: "Pratica quotidiana di meditazione breve",
        category: "meditazione",
      },
    ];

    sinon.stub(goalRepository, "findAll").resolves(goals);

    const response = await request(app).get("/api/goals");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(goals);
  });

  test("GET /api/goals/:id should return one goal", async () => {
    const goal = {
      id: 1,
      title: "Meditare 10 minuti al giorno",
      description: "Pratica quotidiana di meditazione breve",
      category: "meditazione",
    };

    sinon.stub(goalRepository, "findById").resolves(goal);

    const response = await request(app).get("/api/goals/1");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(goal);
  });

  test("GET /api/goals/:id should return 404 when goal does not exist", async () => {
    sinon.stub(goalRepository, "findById").resolves(null);

    const response = await request(app).get("/api/goals/999");

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Goal not found");
  });

  test("POST /api/goals should create a goal", async () => {
    const payload = {
      title: "Dormire almeno 8 ore",
      description: "Migliorare la qualità del sonno",
      category: "sonno",
    };

    const createdGoal = {
      id: 1,
      ...payload,
    };

    sinon.stub(goalRepository, "create").resolves(createdGoal);

    const response = await request(app).post("/api/goals").send(payload);

    expect(response.status).toBe(201);
    expect(response.body).toEqual(createdGoal);
  });

  test("POST /api/goals should return 400 when title is missing", async () => {
    const response = await request(app).post("/api/goals").send({
      title: "",
      description: "Descrizione test",
      category: "test",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Validation failed");
    expect(response.body.errors).toContain("Titolo è obbligatorio");
  });

  test("PUT /api/goals/:id should update a goal", async () => {
    const existingGoal = {
      id: 1,
      title: "Meditare 10 minuti al giorno",
      description: "Descrizione",
      category: "meditazione",
    };

    const payload = {
      title: "Meditare 15 minuti al giorno",
      description: "Descrizione aggiornata",
      category: "meditazione",
    };

    const updatedGoal = {
      id: 1,
      ...payload,
    };

    sinon.stub(goalRepository, "findById").resolves(existingGoal);
    sinon.stub(goalRepository, "update").resolves(updatedGoal);

    const response = await request(app).put("/api/goals/1").send(payload);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(updatedGoal);
  });

  test("DELETE /api/goals/:id should delete a goal", async () => {
    sinon.stub(goalRepository, "remove").resolves(true);

    const response = await request(app).delete("/api/goals/1");

    expect(response.status).toBe(204);
  });

  test("DELETE /api/goals/:id should return 404 when goal does not exist", async () => {
    sinon.stub(goalRepository, "remove").resolves(false);

    const response = await request(app).delete("/api/goals/999");

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Goal not found");
  });
});