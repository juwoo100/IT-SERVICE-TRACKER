// backend/tests/tickets.test.js

import request from "supertest";
import mongoose from "mongoose";
import app from "../app.js";
import { registerUser, auth, validTicket } from "./helpers.js";

let token;
let user;

beforeEach(async () => {
  ({ token, user } = await registerUser());
});

async function createTicket(body = validTicket) {
  const res = await request(app).post("/tickets").set(auth(token)).send(body);
  expect(res.status).toBe(201);
  return res.body.ticket;
}

describe("tickets CRUD", () => {
  test("create returns 201 with defaults and owner set", async () => {
    const res = await request(app)
      .post("/tickets")
      .set(auth(token))
      .send(validTicket);

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Ticket created");
    expect(res.body.ticket).toMatchObject({
      ...validTicket,
      status: "open",
      category: "general",
      username: user.username,
      createdBy: user._id,
    });
  });

  test("list returns tickets newest first", async () => {
    const first = await createTicket({ ...validTicket, title: "First" });
    const second = await createTicket({ ...validTicket, title: "Second" });

    const res = await request(app).get("/tickets").set(auth(token));

    expect(res.status).toBe(200);
    expect(res.body.map((t) => t._id)).toEqual([second._id, first._id]);
  });

  test("read one returns the ticket", async () => {
    const ticket = await createTicket();

    const res = await request(app).get(`/tickets/${ticket._id}`).set(auth(token));

    expect(res.status).toBe(200);
    expect(res.body._id).toBe(ticket._id);
    expect(res.body.title).toBe(validTicket.title);
  });

  test("update applies the changed fields", async () => {
    const ticket = await createTicket();

    const res = await request(app)
      .put(`/tickets/${ticket._id}`)
      .set(auth(token))
      .send({ status: "in_progress", category: "hardware" });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      _id: ticket._id,
      status: "in_progress",
      category: "hardware",
      title: validTicket.title,
    });
  });

  test("delete removes the ticket", async () => {
    const ticket = await createTicket();

    const res = await request(app).delete(`/tickets/${ticket._id}`).set(auth(token));
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Ticket deleted");

    const after = await request(app).get(`/tickets/${ticket._id}`).set(auth(token));
    expect(after.status).toBe(404);
  });
});

describe("ticket ID handling", () => {
  test.each(["get", "put", "delete"])(
    "%s with an invalid ID returns 400",
    async (method) => {
      const res = await request(app)
        [method]("/tickets/abc")
        .set(auth(token))
        .send({ title: "x" });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Invalid ticket ID");
    },
  );

  test.each(["get", "put", "delete"])(
    "%s with a nonexistent ID returns 404",
    async (method) => {
      const id = new mongoose.Types.ObjectId().toString();

      const res = await request(app)
        [method](`/tickets/${id}`)
        .set(auth(token))
        .send({ title: "x" });

      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Ticket not found");
    },
  );
});

describe("server-controlled fields", () => {
  test("create ignores username and createdBy from the body", async () => {
    const otherId = new mongoose.Types.ObjectId().toString();

    const res = await request(app)
      .post("/tickets")
      .set(auth(token))
      .send({ ...validTicket, username: "hacker", createdBy: otherId });

    expect(res.status).toBe(201);
    expect(res.body.ticket.username).toBe(user.username);
    expect(res.body.ticket.createdBy).toBe(user._id);
  });

  test("update with only username/createdBy returns 400 and changes nothing", async () => {
    const ticket = await createTicket();
    const otherId = new mongoose.Types.ObjectId().toString();

    const res = await request(app)
      .put(`/tickets/${ticket._id}`)
      .set(auth(token))
      .send({ username: "hacker", createdBy: otherId });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("No valid fields provided for update");

    const after = await request(app).get(`/tickets/${ticket._id}`).set(auth(token));
    expect(after.body.username).toBe(user.username);
    expect(after.body.createdBy).toBe(user._id);
  });
});

describe("enum validation", () => {
  test.each([
    ["status", "done"],
    ["category", "printer"],
    ["reportTo", "manager"],
  ])("create with invalid %s (%s) returns 400", async (field, value) => {
    const res = await request(app)
      .post("/tickets")
      .set(auth(token))
      .send({ ...validTicket, [field]: value });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(field);
  });

  test("update with invalid status returns 400 and keeps the old value", async () => {
    const ticket = await createTicket();

    const res = await request(app)
      .put(`/tickets/${ticket._id}`)
      .set(auth(token))
      .send({ status: "done" });

    expect(res.status).toBe(400);

    const after = await request(app).get(`/tickets/${ticket._id}`).set(auth(token));
    expect(after.body.status).toBe("open");
  });
});
