const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const readFileUsers = require("./utils/readFileUsers");
const generateAccessToken = require("./utils/generateAccessToken");
const readFileData = require("./utils/readFileData");
const saveDataToFile = require("./utils/saveDataToFile");
const updateUser = require("./utils/updateUser");
const path = require("path");
const fs = require("fs");

class authController {
  async registration(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ success: false, message: "Ошибка при регистрации", errors });
      }
      let { email, password } = req.body;
      // Проверка на пробелы не будет излишней в бэке
      email = email.replace(/\s/g, "");
      password = password.replace(/\s/g, "");
      const users = await readFileUsers();
      const candidate = users.find((u) => u.email === email);

      if (candidate) {
        return res.status(400).json({
          success: false,
          message: "Пользователь с таким именем уже существует",
        });
      }
      const hashPassword = bcrypt.hashSync(password, 7);
      const user = {
        email,
        password: hashPassword,
        _id: Math.random().toString(30).substring(2, 15),
      };
      saveDataToFile(user);
      return res.json({
        success: true,
        message: "Пользователь был успешно заригистрирован",
      });
    } catch (e) {
      console.log(e);
      res.status(400).json({ success: false, message: "Ошибка регистрации" });
    }
  }
  async login(req, res) {
    try {
      let { email, password } = req.body;
      // Проверка на пробелы не будет излишней в бэке
      email = email.replace(/\s/g, "");
      password = password.replace(/\s/g, "");
      const users = await readFileUsers();
      const user = await users.find((u) => u.email === email);
      if (!user) {
        return res.status(400).json({
          success: false,
          message: `Пользователь с таким ${email} не найден`,
        });
      }
      const validatePassword = bcrypt.compareSync(password, user.password);
      if (!validatePassword) {
        return res
          .status(400)
          .json({ success: false, message: `Введен неверный пароль` });
      }
      const token = generateAccessToken(user._id);
      user.token = token;
      updateUser(user);
      return res.json({ success: true, token });
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: "Ошибка логина" });
    }
  }
  async getData(req, res) {
    try {
      const token = req.header("Authorization").split(" ")[1];
      // Проверяю токен в базе данных присутствует ли такой такой токен (жив ли ещё токен)
      const users = await readFileUsers();
      const user = await users.find((u) => u.token === token);
      if (!user) {
        return res
          .status(400)
          .json({ success: false, message: `Ошибка авторизации` });
      }
      const data = await readFileData();
      res.json({
        success: true,
        data: data,
        message: "Данные успешно получены",
      });
    } catch (e) {
      res
        .status(400)
        .json({ success: false, message: "Ошибка получения данных" });
    }
  }
  async getFile(req, res) {
    try {
      const token = req.header("Authorization").split(" ")[1];
      // Проверяю токен в базе данных присутствует ли такой такой токен (жив ли ещё токен)
      const users = await readFileUsers();
      const user = await users.find((u) => u.token === token);
      if (!user) {
        return res
          .status(400)
          .json({ success: false, message: `Ошибка загрузки файла` });
      }
      // Тут немного харкода (файл только один, поэтому не посылаю имя файла с клиента, а жестко в коде его определяю!)
      const file = "assets/ResumeJohn.doc";
      const fileName = path.basename(file);
      await fs.promises.access(file, fs.constants.F_OK);

      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${fileName}"`
      );
      res.setHeader("Content-Type", "application/octet-stream");

      const fileStream = fs.createReadStream(file);
      fileStream.pipe(res);
    } catch (err) {
      return res
        .status(404)
        .json({ success: false, message: "Файл не найден" });
    }
  }
}

module.exports = new authController();
