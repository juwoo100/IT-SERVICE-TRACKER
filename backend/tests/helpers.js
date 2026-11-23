// backend/tests/helpers.js

import request from "supertest";
import app from "../app.js";

let counter = 0;

export async function registerUser(overrides = {}) {
  counter += 1;
  const body = {
    username: `user${counter}`,
    email: `user${counter}@example.com`,
    password: "password123",
    ...overrides,
  };
  const res = await request(app).post("/auth/register").send(body);
  if (res.status !== 201) {
    throw new Error(`registerUser failed: ${res.status} ${JSON.stringify(res.body)}`);
  }
  return { token: res.body.token, user: res.body.user, password: body.password };
}

export const auth = (token) => ({ Authorization: `Bearer ${token}` });

export const validTicket = {
  title: "Laptop won't boot",
  description: "Black screen after the BIOS logo",
  reportTo: "support",
};
