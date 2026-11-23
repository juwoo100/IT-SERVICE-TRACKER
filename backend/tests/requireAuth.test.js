// backend/tests/requireAuth.test.js

import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../app.js";
import { registerUser } from "./helpers.js";

describe("requireAuth on /tickets", () => {
  test("returns 401 without an Authorization header", async () => {
    const res = await request(app).get("/tickets");

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Authentication required");
  });

  test("returns 401 with a non-Bearer scheme", async () => {
    const { token } = await registerUser();

    const res = await request(app)
      .get("/tickets")
      .set("Authorization", `Basic ${token}`);

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Authentication required");
  });

  test("returns 401 with a malformed token", async () => {
    const res = await request(app)
      .get("/tickets")
      .set("Authorization", "Bearer not-a-real-token");

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Invalid or expired token");
  });

  test("returns 401 with a token signed by a different secret", async () => {
    const { user } = await registerUser();
    const forged = jwt.sign({ id: user._id }, "some-other-secret");

    const res = await request(app)
      .get("/tickets")
      .set("Authorization", `Bearer ${forged}`);

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Invalid or expired token");
  });
});
