const controller = require("./authController");
const { check } = require("express-validator");
const authMiddleware = require("./middleware/authMiddleware");
const express = require("express");
const router = express.Router(); 

router.post(
  "/registration",
  [
    check("email", "Имя пользователя не может быть пустым").notEmpty(),
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
router.get("/get_data", authMiddleware, controller.getData);
router.get("/download_resume", authMiddleware, controller.getFile);
router.get("/getPosts", authMiddleware, controller.getPosts);
router.get("/getPost/:id", authMiddleware, controller.getPost);
router.get("/getWorks", authMiddleware, controller.getWorks);
router.get("/getWork/:id", authMiddleware, controller.getWork);
router.get("/getContact", authMiddleware, controller.getContact);
// router.get("/setData", controller.setData);

module.exports = router;
