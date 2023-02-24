const request = require("supertest");
const db = require("./../db/connection");
const data = require("./../db/data/test-data");
const seed = require("./../db/seeds/seed");
const app = require("./../app");
require("jest-sorted");
const fs = require("fs/promises");

beforeEach(() => {
  return seed(data);
});

afterAll(() => db.end());

// 3. GET /api/categories
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

// 4. GET /api/reviews
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
        expect(reviews).toBeSorted({ descending: true });
      });
  });
});

// 5. GET /api/reviews/:review_id
describe("GET /api/reviews/:review_id", () => {
  it("should respond with a single review object", () => {
    const expectedReview = {
      review_id: 1,
      title: expect.any(String),
      designer: expect.any(String),
      owner: expect.any(String),
      review_img_url: expect.any(String),
      review_body: expect.any(String),
      category: expect.any(String),
      created_at: expect.any(String),
      votes: expect.any(Number),
    };

    return request(app)
      .get("/api/reviews/1")
      .expect(200)
      .then(({ body }) => {
        const { review } = body;
        expect(review).toMatchObject(expectedReview);
      });
  });
  it("responds with a 400 status code and an error message when passed a invalid review id", () => {
    return request(app)
      .get("/api/reviews/notAnID")
      .expect(400)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Bad request");
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

// 6. GET /api/reviews/:review_id/comments
describe("GET /api/reviews/:review_id/comments", () => {
  it("should respond with an empty array if there are no comments for the given review_id", () => {
    return request(app)
      .get("/api/reviews/1/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toEqual([]);
      });
  });
  it("should respond with an array of comments for the given review_id", () => {
    return request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        const sortedComments = [...comments].sort((a, b) =>
          a.created_at > b.created_at ? -1 : 1
        );

        expect(comments.length).toBe(3);
        expect(comments).toEqual(sortedComments);
        comments.forEach((comment) => {
          expect(comment).toHaveProperty("comment_id", expect.any(Number));
          expect(comment).toHaveProperty("votes", expect.any(Number));
          expect(comment).toHaveProperty("created_at", expect.any(String));
          expect(comment).toHaveProperty("author", expect.any(String));
          expect(comment).toHaveProperty("body", expect.any(String));
          expect(comment).toHaveProperty("review_id", expect.any(Number));
        });
      });
  });

  it("responds with a 400 status code and an error message when passed an invalid review id", () => {
    return request(app)
      .get("/api/reviews/notAnID/comments")
      .expect(400)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Bad request");
      });
  });
  it("should respond with a 404 status code if given a non-existent review ID", () => {
    const testComment = {
      username: "mallionaire",
      body: "Test review",
    };

    return request(app)
      .post(`/api/reviews/1000000/comments`)
      .send(testComment)
      .expect(404)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Review not found");
      });
  });
});

// 7. POST /api/reviews/:review_id/comments
describe("POST /api/reviews/:reviewId/comments", () => {
  it("should respond with the posted comment and status code 201", () => {
    const testComment = {
      username: "mallionaire",
      body: "Test review",
    };

    return request(app)
      .post(`/api/reviews/2/comments`)
      .send(testComment)
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment.author).toBe(testComment.username);
        expect(comment.body).toBe(testComment.body);
        expect(comment).toHaveProperty("comment_id", expect.any(Number));
        expect(comment).toHaveProperty("votes", expect.any(Number));
        expect(comment).toHaveProperty("created_at", expect.any(String));
      })
      .then(() => {
        return request(app)
          .get("/api/reviews/2/comments")
          .expect(200)
          .then(({ body }) => {
            const { comments } = body;
            expect(comments.length).toBe(4);
          });
      });
  });
  it("should respond with the posted comment and status code 201, ignoring extra content", () => {
    const testComment = {
      username: "mallionaire",
      body: "Test review",
      fruit: "banana",
    };

    return request(app)
      .post(`/api/reviews/2/comments`)
      .send(testComment)
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment.author).toBe(testComment.username);
        expect(comment.body).toBe(testComment.body);
        expect(comment).toHaveProperty("comment_id", expect.any(Number));
        expect(comment).toHaveProperty("votes", expect.any(Number));
        expect(comment).toHaveProperty("created_at", expect.any(String));
      });
  });
  it("should respond with a 400 status code if posted without a username", () => {
    const testComment = {
      body: "Test review",
    };

    return request(app)
      .post(`/api/reviews/2/comments`)
      .send(testComment)
      .expect(400)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Author or body is missing");
      });
  });
  it("should respond with a 400 status code if posted without a body", () => {
    const testComment = {
      username: "mallionaire",
    };

    return request(app)
      .post(`/api/reviews/2/comments`)
      .send(testComment)
      .expect(400)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Author or body is missing");
      });
  });
  it("should respond with a 400 status code if given an invalid review ID", () => {
    const testComment = {
      username: "mallionaire",
      body: "Test review",
    };

    return request(app)
      .post(`/api/reviews/monkey/comments`)
      .send(testComment)
      .expect(400)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Bad request");
      });
  });
  it("should respond with a 400 status code if given a non-existent username", () => {
    const testReview = {
      username: "Test user",
      body: "Test review",
    };

    return request(app)
      .post("/api/reviews/2/comments")
      .send(testReview)
      .expect(400)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("User not found");
      });
  });
  it("should respond with a 404 status code if given a non-existent review ID", () => {
    const testComment = {
      username: "mallionaire",
      body: "Test review",
    };

    return request(app)
      .post("/api/reviews/7777777/comments")
      .send(testComment)
      .expect(404)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Review not found");
      });
  });
});

// 8. PATCH /api/reviews/:review_id
describe("PATCH /api/reviews/:review_id", () => {
  it("should respond with the updated review, with votes incremented and a 200 status code", () => {
    const testUpdate = { inc_votes: 100 };

    return request(app)
      .patch("/api/reviews/1")
      .send(testUpdate)
      .expect(200)
      .then(({ body }) => {
        const { review } = body;
        expect(review.votes).toBe(101);
      });
  });
  it("should respond with the updated review, with votes decremented and a 200 status code", () => {
    const testUpdate = { inc_votes: -1 };

    return request(app)
      .patch("/api/reviews/1")
      .send(testUpdate)
      .expect(200)
      .then(({ body }) => {
        const { review } = body;
        expect(review.votes).toBe(0);
      });
  });
  it("responds with a 400 status code when passed an invalid request body", () => {
    const testUpdate = { wrong_key: 100 };

    return request(app)
      .patch("/api/reviews/1")
      .send(testUpdate)
      .expect(400)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Invalid key in patch body");
      });
  });
  it("should respond with a 400 status code if given an incorrect data type", () => {
    const testUpdate = { inc_votes: "not_a_number" };

    return request(app)
      .patch(`/api/reviews/2`)
      .send(testUpdate)
      .expect(400)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Invalid data type for inc_votes");
      });
  });
  it("responds with a 400 status code and an error message when passed an invalid review id", () => {
    const testUpdate = { inc_votes: 1 };

    return request(app)
      .patch("/api/reviews/banana")
      .send(testUpdate)
      .expect(400)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Bad request");
      });
  });
  it("should respond with a 404 status code if given the ID of a non-existent review", () => {
    const testUpdate = { inc_votes: 1 };

    return request(app)
      .patch("/api/reviews/1000")
      .send(testUpdate)
      .expect(404)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Review not found");
      });
  });
});

// 9. GET /api/users
describe("GET /api/users", () => {
  it("should return an array of all users objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users.length).toBe(4);
        users.forEach((user) => {
          expect(user).toHaveProperty("username", expect.any(String));
          expect(user).toHaveProperty("name", expect.any(String));
          expect(user).toHaveProperty("avatar_url", expect.any(String));
        });
      });
  });
});

// 10. GET /api/reviews (queries)
describe("/api/reviews/?query returns correct data in correct order", () => {
  it("returns an array of reviews only containing on the specified category", () => {
    return request(app)
      .get("/api/reviews?category=social%20deduction")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews.length).toBe(11);
        reviews.forEach((review) =>
          expect(review.category).toBe("social deduction")
        );
      });
  });
  it("returns an empty array if category query is valid, but has no corresponding reviews", () => {
    return request(app)
      .get("/api/reviews?category=euro%20games")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews.length).toBe(0);
        expect(reviews).toEqual([]);
      });
  });
  it("should respond with an array of review objects with the correct properties if query is omitted", () => {
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
  it("sort_by should return an array of results in ascending order, default sorted by 'created_by'", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews.length).toBe(13);
        const reviewsCopy = [...reviews];
        const sortedReviews = reviewsCopy.sort((reviewA, reviewB) => {
          return reviewA.created_at - reviewB.created_at;
        });
        expect(reviews).toEqual(sortedReviews);
      });
  });
  it("sort_by=title should return an array of results sorted by title descending order", () => {
    return request(app)
      .get("/api/reviews?sort_by=title")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews.length).toBe(13);
        const reviewsCopy = [...reviews];
        const sortedReviews = reviewsCopy.sort((reviewA, reviewB) => {
          return reviewB.title - reviewA.title;
        });
        expect(reviews).toEqual(sortedReviews);
      });
  });
  it("sort_by=votes should return an array of results sorted by votes descending order", () => {
    return request(app)
      .get("/api/reviews?sort_by=votes")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews.length).toBe(13);
        const reviewsCopy = [...reviews];
        const sortedReviews = reviewsCopy.sort((reviewA, reviewB) => {
          return reviewB.votes - reviewA.votes;
        });
        expect(reviews).toEqual(sortedReviews);
      });
  });
  it("returns reviews with order query in descending order by default", () => {
    return request(app)
      .get("/api/reviews?sort_by=votes&order")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        const reviewCopy = [...reviews];
        expect(reviews).toHaveLength(13);
        const sortedReviews = reviewCopy.sort((reviewA, reviewB) => {
          return reviewB.votes - reviewA.votes;
        });
        expect(sortedReviews).toEqual(reviews);
      });
  });
  it("returns reviews sorted by owner in ascending order", () => {
    return request(app)
      .get("/api/reviews?sort_by=owner&order=asc")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        const reviewCopy = [...reviews];
        expect(reviews).toHaveLength(13);
        const sortedReviews = reviewCopy.sort((reviewA, reviewB) => {
          return reviewA.owner - reviewB.owner;
        });
        expect(sortedReviews).toEqual(reviews);
      });
  });
  it("returns reviews sorted by votes in descending order", () => {
    return request(app)
      .get("/api/reviews?sort_by=votes&order=desc")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        const reviewCopy = [...reviews];
        expect(reviews).toHaveLength(13);
        const sortedReviews = reviewCopy.sort((reviewA, reviewB) => {
          return reviewB.votes - reviewA.votes;
        });
        expect(sortedReviews).toEqual(reviews);
      });
  });
  it("should respond with a 404 status code when given an invalid sort query where property does not exist", () => {
    return request(app)
      .get("/api/reviews?sort_by=invalid")
      .expect(404)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Property does not exist");
      });
  });
  it("should respond with a 400 status code when given an invalid order query", () => {
    return request(app)
      .get("/api/reviews?order=invalid")
      .expect(400)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Invalid order query");
      });
  });
  it("should respond with a 400 status code if sort_by and order are incorrect", () => {
    return request(app)
      .get("/api/reviews?sort_by=invalid&order=invalid")
      .expect(400)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe(
          "Invalid query, please check sort_by and order is correct"
        );
      });
  });
});

// 11. GET /api/reviews/:review_id (comment count)
describe("GET /api/reviews/:review_id", () => {
  it("should respond with a single review object", () => {
    const expectedReview = {
      review_id: 1,
      title: expect.any(String),
      designer: expect.any(String),
      owner: expect.any(String),
      review_img_url: expect.any(String),
      review_body: expect.any(String),
      category: expect.any(String),
      created_at: expect.any(String),
      votes: expect.any(Number),
      comment_count: expect.any(Number),
    };

    return request(app)
      .get("/api/reviews/1")
      .expect(200)
      .then(({ body }) => {
        const { review } = body;
        expect(review).toMatchObject(expectedReview);
      });
  });
  it("", () => {
    return request(app)
      .get("/api/reviews/notAnID")
      .expect(400)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Bad request");
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

// 12. DELETE /api/comments/:comment_id
describe("DELETE /api/comments/:comment_id", () => {
  it("should respond with a 204 status code and number of comments found by review_id should be one less", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then(() => {
        return request(app)
          .get("/api/reviews/2/comments")
          .expect(200)
          .then(({ body }) => {
            const { comments } = body;
            expect(comments.length).toBe(2);
          });
      });
  });
  it("should respond with a 404 status code if comment does not exist", () => {
    return request(app)
      .delete("/api/comments/10000")
      .expect(404)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Comment not found");
      });
  });

  it("should respond with a 400 status code if comment ID is not a number", () => {
    return request(app)
      .delete("/api/comments/invalid-id")
      .expect(400)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Bad request");
      });
  });
});

describe("GET /api/endpoints", () => {
  it("should respond with the correct JSON file", () => {
    return request(app)
      .get("/api/endpoints")
      .expect(200)
      .then(({ body }) => {
        const { endpoints } = body;
        expect(typeof endpoints).toBe("object");
        Object.values(endpoints).forEach((endpoint) => {
          expect(endpoint).toHaveProperty("description", expect.any(String));
          expect(endpoint).toHaveProperty("queries"), expect.any(Object);
          expect(endpoint).toHaveProperty(
            "exampleResponse",
            expect.any(Object)
          );
        });
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
