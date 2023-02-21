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
      review_id: 1,
      title: "Agricola",
      designer: "Uwe Rosenberg",
      owner: "mallionaire",
      review_img_url:
        "https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?w=700&h=700",
      review_body: "Farmyard fun!",
      category: "euro game",
      created_at: "2021-01-18T10:00:20.514Z",
      votes: 1,
    };

    return request(app)
      .get("/api/reviews/1")
      .expect(200)
      .then(({ body }) => {
        const { review } = body;
        expect(review).toMatchObject(expectedReview);
      });
  });
  it("responds with a 400 status code and an error message when passed a bad review id", () => {
    return request(app)
      .get("/api/reviews/notAnID")
      .expect(400)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Invalid input");
      });
  });
  it("should respond with a 404 status code if no review is found", () => {
    return request(app)
      .get("/api/reviews/100")
      .expect(404)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Review not found");
      });
  });
});

describe("GET /api/reviews/:review_id/comments", () => {
  it("should respond with an array of comments for the given review_id", () => {
    const expectedComments = [
      {
        author: "bainesface",
        body: "I loved this game too!",
        comment_id: 1,
        created_at: "2017-11-22T12:43:33.389Z",
        review_id: 2,
        votes: 16,
      },
      {
        author: "bainesface",
        body: "EPIC board game!",
        comment_id: 4,
        created_at: "2017-11-22T12:36:03.389Z",
        review_id: 2,
        votes: 16,
      },
      {
        author: "mallionaire",
        body: "Now this is a story all about how, board games turned my life upside down",
        comment_id: 5,
        created_at: "2021-01-18T10:24:05.410Z",
        review_id: 2,
        votes: 13,
      },
    ];

    return request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toEqual(expectedComments);
      });
  });
});

describe("400 error on /api/not-path", () => {
  it("status 400 returns error message bad path when provided an invalid path", () => {
    return request(app)
      .get("/api/not-path")
      .expect(400)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Path not found!");
      });
  });
});
