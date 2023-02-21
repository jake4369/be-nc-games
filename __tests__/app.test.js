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
  it("should respond with an array of objects with the properties 'slug' and 'description", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then(({ body }) => {
        const { categories } = body;
        expect(categories.length).toBe(4);
        categories.forEach((category) => {
          expect(category).toHaveProperty("slug", expect.any(String));
          expect(category).toHaveProperty("description", expect.any(String));
        });
      });
  });
});

describe("GET /api/reviews", () => {
  it("should respond with an array of review objects with the correct properties", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews.length).toBe(13);
        reviews.forEach((review) => {
          expect(review).toHaveProperty("owner", expect.any(String));
          expect(review).toHaveProperty("title", expect.any(String));
          expect(review).toHaveProperty("review_id", expect.any(Number));
          expect(review).toHaveProperty("category", expect.any(String));
          expect(review).toHaveProperty("review_img_url", expect.any(String));
          expect(review).toHaveProperty("created_at", expect.any(String));
          expect(review).toHaveProperty("votes", expect.any(Number));
          expect(review).toHaveProperty("designer", expect.any(String));
          expect(review).toHaveProperty("comment_count", expect.any(Number));

          const matchingReview = [...reviews].find(
            (testReview) => testReview.review_id === review.review_id
          );
          expect(review.comment_count).toBe(matchingReview.comment_count);
        });
      });
  });
  it("should respond with data sorted by date in descending order", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        const sortedReviews = [...reviews].sort((a, b) =>
          a.created_at > b.created_at ? -1 : 1
        );
        expect(reviews).toEqual(sortedReviews);
      });
  });
});

describe("GET /api/reviews/:review_id", () => {
  it("should respond with a single review object", () => {
    const expectedReview = {
      review_id: 14,
      title: "Velit tempor ullamco amet ipsum dolor voluptate.",
      category: "hidden-roles",
      designer: "Don Keigh",
      owner: "cooljmessy",
      review_body:
        "Nostrud anim cupidatat incididunt officia cupidatat magna. Cillum commodo voluptate laboris id incididunt esse elit ipsum consectetur non elit elit magna. Aliquip sint amet eiusmod magna. Fugiat non ut ex eiusmod elit. Esse anim irure laborum aute ut ad reprehenderit. Veniam laboris dolore mollit mollit in. Cillum in aliquip adipisicing ipsum et dolor veniam qui ut ullamco aliquip in. Dolor fugiat elit laborum elit cupidatat aute qui nostrud. Duis incididunt ea nostrud minim consequat. Reprehenderit mollit cupidatat do culpa aliqua culpa mollit minim eiusmod. Deserunt occaecat ipsum ex ut pariatur eu veniam cillum nulla ex nostrud. Do nostrud amet duis proident nostrud eiusmod occaecat reprehenderit. Quis et cupidatat tempor qui dolor id veniam in sunt ipsum eiusmod. Sint tempor commodo consectetur mollit proident culpa nulla est tempor ullamco tempor aliquip laboris.",
      review_img_url:
        "https://images.pexels.com/photos/8111357/pexels-photo-8111357.jpeg?w=700&h=700",
      created_at: "2021-02-05T11:27:26.563Z",
      votes: 3,
      comment_count: 0,
    };

    return request(app)
      .get("/api/reviews/14")
      .expect(200)
      .then(({ body }) => {
        const { review } = body;
        expect(review).toMatchObject(expectedReview);
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
