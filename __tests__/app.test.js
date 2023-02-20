const request = require("supertest");
const db = require("./../db/connection");
const data = require("./../db/data/test-data");
const seed = require("./../db/seeds/seed");
const app = require("./../app");

beforeEach(() => {
  return seed(data);
});

afterAll(() => db.end());

describe("GET /api/categories", () => {
  it("should response with an array of objects with the properties 'slug' and 'description", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then(({ body }) => {
        const { categories } = body;
        expect(categories.length).toBe(4);
        categories.forEach((catagory) => {
          expect(catagory).toHaveProperty("slug", expect.any(String));
          expect(catagory).toHaveProperty("description", expect.any(String));
        });
      });
  });
});

describe("404 error on /api/not-path", () => {
  it("status 404 returns error message bad path when provided an invalid path", () => {
    return request(app)
      .get("/api/not-path")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Path not found!");
      });
  });
});
