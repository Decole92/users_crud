const express = require("express");
const { body } = require("express-validator");
const {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

const router = express.Router();
router.get("/", getUsers);
router.post(
  "/",
  [
    body("name").trim().isLength({ min: 1 }).withMessage("Name is required"),
    body("email").isEmail().withMessage("Invalid email"),
    body("age")
      .isInt({ min: 0 })
      .withMessage("Age must be a non-negative integer"),
  ],
  createUser
);

router.put(
  "/:id",
  [
    body("name").trim().isLength({ min: 1 }).withMessage("Name is required"),
    body("email").isEmail().withMessage("Invalid email"),
    body("age")
      .isInt({ min: 0 })
      .withMessage("Age must be a non-negative integer"),
  ],
  updateUser
);

router.delete("/:id", deleteUser);

module.exports = router;
