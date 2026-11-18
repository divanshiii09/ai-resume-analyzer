const test = require("node:test");
const assert = require("node:assert/strict");
const jwt = require("jsonwebtoken");

const requireAuth = require("../middleware/auth");
const { sameUser } = require("../middleware/auth");

const SECRET = "test-secret";

// Minimal stand-in for an Express response object.
function fakeRes() {
  return {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };
}

function run(headers) {
  const req = { headers };
  const res = fakeRes();
  let calledNext = false;
  requireAuth(req, res, () => {
    calledNext = true;
  });
  return { req, res, calledNext };
}

test.beforeEach(() => {
  process.env.JWT_SECRET = SECRET;
});

test("sameUser compares emails case-insensitively and ignores spaces", () => {
  assert.equal(sameUser("Student@Example.com ", "student@example.com"), true);
  assert.equal(sameUser("a@example.com", "b@example.com"), false);
});

test("rejects a request with no token", () => {
  const { res, calledNext } = run({});
  assert.equal(calledNext, false);
  assert.equal(res.statusCode, 401);
});

test("rejects an invalid token", () => {
  const { res, calledNext } = run({ authorization: "Bearer not-a-real-token" });
  assert.equal(calledNext, false);
  assert.equal(res.statusCode, 401);
});

test("rejects a token signed with a different secret", () => {
  const token = jwt.sign({ email: "a@example.com" }, "wrong-secret");
  const { res, calledNext } = run({ authorization: `Bearer ${token}` });
  assert.equal(calledNext, false);
  assert.equal(res.statusCode, 401);
});

test("rejects an expired token", () => {
  const token = jwt.sign({ email: "a@example.com" }, SECRET, { expiresIn: -10 });
  const { res, calledNext } = run({ authorization: `Bearer ${token}` });
  assert.equal(calledNext, false);
  assert.equal(res.statusCode, 401);
});

test("accepts a valid token and attaches the user", () => {
  const token = jwt.sign({ email: "a@example.com", name: "A" }, SECRET);
  const { req, calledNext } = run({ authorization: `Bearer ${token}` });
  assert.equal(calledNext, true);
  assert.equal(req.user.email, "a@example.com");
});

test("returns 500 when JWT_SECRET is missing", () => {
  delete process.env.JWT_SECRET;
  const { res, calledNext } = run({ authorization: "Bearer x" });
  assert.equal(calledNext, false);
  assert.equal(res.statusCode, 500);
});
