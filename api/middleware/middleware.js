const Users = require("../users/users-model");
const Posts = require("../posts/posts-model");

function logger(req, res, next) {
  // DO YOUR MAGIC
  console.log(`[${req.method}] ${req.url}`);
  next();
}

async function validateUserId(req, res, next) {
  const { id } = req.params;
  try {
    const existingUser = await Users.getById(id);
    if (!existingUser) {
      next({ status: 404, message: `user not found` });
    } else {
      req.user = existingUser;
      next();
    }
  } catch (err) {
    next(err);
  }
}

function validateUser(req, res, next) {
  // DO YOUR MAGIC
  const { name } = req.body;
  if (!name) {
    next({ status: 400, message: "missing required name field" });
  } else {
    next();
  }
}

function validatePost(req, res, next) {
  // DO YOUR MAGIC
  const { text } = req.body;
  if (!text) {
    next({ status: 400, message: "missing required text field" });
  } else {
    next();
  }
}

// do not forget to expose these functions to other modules

module.exports = {
  logger,
  validateUserId,
  validateUser,
  validatePost,
};
