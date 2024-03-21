const User = require("./models/User");
const Data = require("./models/Data");
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
          .json({ success: false, message: "Ошибка при регистрации" });
      }
      const { email, password } = req.body;
      const candidate = await User.findOne({ email });
      if (candidate) {
        return res.status(400).json({
          success: false,
          message: "Пользователь с таким именем уже существует",
        });
      }
      const hashPassword = bcrypt.hashSync(password, 7);
      const user = new User({ email, password: hashPassword });
      await user.save();

      return res.json({
        success: true,
        messsage: "Пользователь был успешно заригистрирован",
      });
    } catch (e) {
      console.log(e);
      res.status(400).json({ success: false, message: "Registration error" });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
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
      const update = { token };
      await User.findByIdAndUpdate(user._id, update);
      return res.json({ success: true, token });
    } catch (e) {
      console.log(e);
      res.status(400).json({ success: false, message: "Login error" });
    }
  }
  async getData(req, res) {
    try {
      const token = req.header("Authorization").split(" ")[1];
      // Проверяю токен в базе данных присутствует ли такой такой токен (жив ли ещё токен)
      // const users = await readFileUsers();
      // const user = await users.find((u) => u.token === token);
      const user = await User.findOne({ token });
      if (!user) {
        return res
          .status(400)
          .json({ success: false, message: `Ошибка авторизации` });
      }
      //const data = await readFileData();
      const data = await Data.find();
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
      // Тут немного харкода (файл только один, поэтому не посылаю имя файла с клиента, а жестко в коде определяю!)
      const file = path.resolve(__dirname, "assets/ResumeJohn.doc");

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
  // async setData(req, res) {
  //   try {
  //     const reqData = await readFileData();
  //     const postData = reqData.posts;
  //     const workData = reqData.works;
  //     const data = new Data({
  //       resume: reqData.resume,
  //       posts: postData,
  //       works: workData,
  //     });
  //     await data.save();
  //     return res.json({
  //       success: true,
  //       message: "Данные успешно записались в MongoDB",
  //     });
  //   } catch (e) {
  //     res.status(400).json({ success: false, message: "Ошибка записи данных" });
  //   }
  // }
}

module.exports = new authController();
