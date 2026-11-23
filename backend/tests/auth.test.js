// backend/tests/auth.test.js

import request from "supertest";
import app from "../app.js";
import { registerUser, auth } from "./helpers.js";

describe("POST /auth/register", () => {
  test("creates a user and returns a token without the password", async () => {
    const res = await request(app).post("/auth/register").send({
      username: "alice",
      email: "Alice@Example.com",
      password: "password123",
    });

    expect(res.status).toBe(201);
    expect(typeof res.body.token).toBe("string");
    expect(res.body.user).toMatchObject({ username: "alice", email: "alice@example.com" });
    expect(res.body.user).not.toHaveProperty("password");
  });
});

describe("POST /auth/login", () => {
  test("returns a token with the correct password", async () => {
    const { user, password } = await registerUser();

    const res = await request(app)
      .post("/auth/login")
      .send({ email: user.email, password });

    expect(res.status).toBe(200);
    expect(typeof res.body.token).toBe("string");
    expect(res.body.user._id).toBe(user._id);
    expect(res.body.user).not.toHaveProperty("password");
  });

  test("returns 401 with a wrong password", async () => {
    const { user } = await registerUser();

    const res = await request(app)
      .post("/auth/login")
      .send({ email: user.email, password: "wrong-password" });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Invalid email or password");
    expect(res.body).not.toHaveProperty("token");
  });
});

describe("GET /auth/me", () => {
  test("returns the current user with a valid token", async () => {
    const { token, user } = await registerUser();

    const res = await request(app).get("/auth/me").set(auth(token));

    expect(res.status).toBe(200);
    expect(res.body.user._id).toBe(user._id);
    expect(res.body.user).not.toHaveProperty("password");
  });

  test("returns 401 without a token", async () => {
    const res = await request(app).get("/auth/me");

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Authentication required");
  });
});
