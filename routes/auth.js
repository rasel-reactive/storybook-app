const express = require("express");
const User = require("../model/user");
const { auth, noAccess } = require('../middleware/isAuth')

const router = express.Router();

const authController = require("../controllers/auth");

router.get("/users", authController.getAllUser);
router.get("/signup", noAccess,  authController.signupPage);

const { body } = require("express-validator");

router.post("/signup", noAccess, [
    body("username")
      .isLength({ min: 5 })
      .withMessage("must be at least 5 chars long")
      .not()
      .isEmpty()
      .withMessage("Please Provide Username"), //. priority top

    body("email")
      .isEmail()
      .withMessage("This E-Mail not Valid Email")
      .not()
      .isEmpty()
      .withMessage("Please Provide a Email")
      .custom(value => {
        return User.findOne({ email: value }).then(user => {
          if (user) {
            return Promise.reject("This Email already Exists");
          }
        });
      }),

    body("password")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Password length should be at least 3 ")
      .not()
      .isEmpty()
      .withMessage("Please Provide Password"),

    body("confirmPassword")
      .not()
      .isEmpty()
      .withMessage("Please Provide Confirmation Password")
      .custom((value, { req }) => {
        if (req.body.password !== value) {
          throw new Error("Password confirmation does not match password");
        }
        return true;
      })
  ],
  
  authController.signup
);

router.get("/login", noAccess, authController.loginPage);
router.post("/login", noAccess, authController.login);

router.get("/logout", auth, authController.logOut);

module.exports = router;
