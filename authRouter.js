const controller = require("./authController");
const { check } = require("express-validator");
const authMiddleware = require("./middleware/authMiddleware");
const express = require("express");
const router = express.Router(); 

router.post(
  "/registration",
  [
    check("email", "Имя пользователя не может быть пустым").notEmpty().isEmail(),
    check(
      "password",
      "Пароль должен быть более 4 символов и не более 18 символов"
    )
      .notEmpty()
      .isLength({ min: 4, max: 18 }),
  ],
  controller.registration
);
router.post("/login", controller.login);

router.use(authMiddleware)

router.get("/getData", controller.getData);
router.get("/downloadResume", controller.getFile);
router.get("/getPosts", controller.getPosts);
router.get("/getPost/:id", controller.getPost);
router.get("/getWorks", controller.getWorks);
router.get("/getWork/:id", controller.getWork);
router.get("/getContact", controller.getContact);
// router.get("/saveImage", controller.saveImage);
// router.get("/setData", controller.setData);

module.exports = router;
