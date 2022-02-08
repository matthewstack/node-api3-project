const express = require("express");

// You will need `users-model.js` and `posts-model.js` both
// The middleware functions also need to be required
const Users = require("./users-model");
const Posts = require("../posts/posts-model");
const {
  validateUserId,
  validateUser,
  validatePost,
} = require("../middleware/middleware");
const router = express.Router();

router.get("/", async (req, res, next) => {
  // RETURN AN ARRAY WITH ALL THE USERS
  try {
    const theUsers = await Users.get();
    res.json(theUsers);
  } catch (err) {
    res.status(500).json({
      message: "An error has happened",
    });
  }
});

router.get("/:id", validateUserId, (req, res, next) => {
  // RETURN THE USER OBJECT
  // this needs a middleware to verify user id
  res.json(req.user);
});

router.post("/", validateUser, (req, res, next) => {
  // RETURN THE NEWLY CREATED USER OBJECT
  // this needs a middleware to check that the request body is valid
  Users.insert(req.body)
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      next(err);
    });
});

router.put("/:id", validateUser, validateUserId, (req, res, next) => {
  // RETURN THE FRESHLY UPDATED USER OBJECT
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid

  Users.update(req.params.id, req.body)
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      next(err);
    });
});

router.delete("/:id", validateUserId, (req, res, next) => {
  // RETURN THE FRESHLY DELETED USER OBJECT
  // this needs a middleware to verify user id
  Users.remove(req.params.id)
    .then(() => {
      return res.json(req.user);
    })
    .catch((err) => {
      next(err);
    });
});

router.get("/:id/posts", validateUserId, (req, res, next) => {
  // RETURN THE ARRAY OF USER POSTS
  // this needs a middleware to verify user id
  Users.getUserPosts(req.params.id)
    .then((postList) => {
      res.json(postList);
    })
    .catch((err) => {
      next(err);
    });
});

router.post("/:id/posts", validateUserId, validatePost, (req, res, next) => {
  // RETURN THE NEWLY CREATED USER POST
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  Posts.insert({ ...req.body, user_id: req.params.id })
    .then((post) => {
      res.json(post);
    })
    .catch((err) => {
      next(err);
    });
});

router.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    custom: "something went wrong in the users router",
    message: err.message,
    stack: err.stack,
  });
});

// do not forget to export the router
module.exports = router;
