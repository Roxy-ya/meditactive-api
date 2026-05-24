const request = require("supertest");
const sinon = require("sinon");

const app = require("../src/app");
const userRepository = require("../src/repositories/userRepository");

describe("Users API", () => {
  afterEach(() => {
    sinon.restore();
  });

  test("GET /api/users should return all users", async () => {
    const users = [
      {
        id: 1,
        email: "mario.rossi@email.com",
        firstName: "Mario",
        lastName: "Rossi",
      },
    ];

    sinon.stub(userRepository, "findAll").resolves(users);

    const response = await request(app).get("/api/users");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(users);
  });

  test("GET /api/users/:id should return one user", async () => {
    const user = {
      id: 1,
      email: "mario.rossi@email.com",
      firstName: "Mario",
      lastName: "Rossi",
    };

    sinon.stub(userRepository, "findById").resolves(user);

    const response = await request(app).get("/api/users/1");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(user);
  });

  test("GET /api/users/:id should return 404 when user does not exist", async () => {
    sinon.stub(userRepository, "findById").resolves(null);

    const response = await request(app).get("/api/users/999");

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("User not found");
  });

  test("POST /api/users should create a user", async () => {
    const payload = {
      email: "anna.verdi@email.com",
      firstName: "Anna",
      lastName: "Verdi",
    };

    const createdUser = {
      id: 1,
      ...payload,
    };

    sinon.stub(userRepository, "findByEmail").resolves(null);
    sinon.stub(userRepository, "create").resolves(createdUser);

    const response = await request(app).post("/api/users").send(payload);

    expect(response.status).toBe(201);
    expect(response.body).toEqual(createdUser);
  });

  test("POST /api/users should return 400 when payload is invalid", async () => {
    const response = await request(app).post("/api/users").send({
      email: "",
      firstName: "",
      lastName: "",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Validation failed");
    expect(response.body.errors).toContain("Email è obbligatoria");
    expect(response.body.errors).toContain("Nome è obbligatorio");
    expect(response.body.errors).toContain("Cognome è obbligatorio");
  });

  test("POST /api/users should return 409 when email already exists", async () => {
    const payload = {
      email: "mario.rossi@email.com",
      firstName: "Mario",
      lastName: "Rossi",
    };

    sinon.stub(userRepository, "findByEmail").resolves({
      id: 1,
      ...payload,
    });

    const response = await request(app).post("/api/users").send(payload);

    expect(response.status).toBe(409);
    expect(response.body.message).toBe("Email already exists");
  });

  test("PUT /api/users/:id should update a user", async () => {
    const payload = {
      email: "mario.updated@email.com",
      firstName: "Mario",
      lastName: "Rossi",
    };

    const existingUser = {
      id: 1,
      email: "mario.rossi@email.com",
      firstName: "Mario",
      lastName: "Rossi",
    };

    const updatedUser = {
      id: 1,
      ...payload,
    };

    sinon.stub(userRepository, "findById").resolves(existingUser);
    sinon.stub(userRepository, "findByEmail").resolves(null);
    sinon.stub(userRepository, "update").resolves(updatedUser);

    const response = await request(app).put("/api/users/1").send(payload);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(updatedUser);
  });

  test("DELETE /api/users/:id should delete a user", async () => {
    sinon.stub(userRepository, "remove").resolves(true);

    const response = await request(app).delete("/api/users/1");

    expect(response.status).toBe(204);
  });

  test("DELETE /api/users/:id should return 404 when user does not exist", async () => {
    sinon.stub(userRepository, "remove").resolves(false);

    const response = await request(app).delete("/api/users/999");

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("User not found");
  });
});