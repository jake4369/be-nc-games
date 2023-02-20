const request = require("supertest");
const assert = require("assert");
const db = require("./../db/connection");
const data = require("./../db/data/test-data");
const seed = require("./../db/seeds/seed");
const app = require("./../app");

beforeEach(() => {
  return seed(data);
});

afterAll(() => db.end());

describe("GET /api/categories", () => {
  it("responds with a json object", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .then(({ body }) => {
        expect(typeof body).toBe("object");
      });
  });
  it("responds with a json object containing a key of categories", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then(({ body }) => {
        expect(body).toHaveProperty("categories");
      });
  });
  it("responds with an array", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then(({ body }) => {
        const { categories } = body;
        expect(Array.isArray(categories)).toBe(true);
      });
  });
  it("responds with an array of category objects", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then(({ body }) => {
        const { categories } = body;
        categories.forEach((catagory) => {
          expect(typeof catagory).toBe("object");
        });
      });
  });
  it("should response with an array of objects with the properties 'slug' and 'description", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then(({ body }) => {
        const { categories } = body;
        categories.forEach((catagory) => {
          expect(catagory).toHaveProperty("slug", expect.any(String));
          expect(catagory).toHaveProperty("description", expect.any(String));
        });
      });
  });
});
