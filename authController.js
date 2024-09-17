const User = require("./models/User");
const Data = require("./models/Data");
const Post = require("./models/Post");
const Work = require("./models/Work");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const generateAccessToken = require("./utils/generateAccessToken");
const readFileData = require("./utils/readFileData");
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
        message: "Пользователь был успешно заригистрирован",
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
      // Переделать!!!!!!
      const resume = await Data.findOne({}, { _id: 0, resume: 1 });
      const posts = await Post.find().sort({ date: -1 }).limit(2);
      const works = await Work.find({ date: { $lte: "2020" } })
        .sort({ date: -1 })
        .limit(3);
      const allData = { resume: resume.resume, posts, works };
      res.json({
        success: true,
        data: allData,
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
  async getPosts(req, res) {
    try {
      const posts = await Post.find();
      res.json({
        success: true,
        data: posts,
        message: "Данные успешно получены",
      });
    } catch (e) {
      res.status(400).json({ success: false, message: "Посты не найдены" });
    }
  }
  async getPost(req, res) {
    try {
      const id = req.params.id;
      const post = await Post.findById(id);
      res.json({
        success: true,
        data: post,
        message: "Данные успешно получены",
      });
    } catch (e) {
      res
        .status(400)
        .json({ success: false, message: "Пост с таким id не найден" });
    }
  }
  async getWorks(req, res) {
    try {
      const works = await Work.find();
      res.json({
        success: true,
        data: works,
        message: "Данные успешно получены",
      });
    } catch (e) {
      res.status(400).json({ success: false, message: "Работы не найдены" });
    }
  }
  async getWork(req, res) {
    try {
      const id = req.params.id;
      const work = await Work.findById(id);
      res.json({
        success: true,
        data: work,
        message: "Данные успешно получены",
      });
    } catch (e) {
      res
        .status(400)
        .json({ success: false, message: "Работа с таким id не найдена" });
    }
  }
  async getContact(req, res) {
    try {
      const contact = await Data.aggregate([
        { $unwind: "$contact" },
        { $replaceRoot: { newRoot: "$contact" } },
      ]);
      res.json({
        success: true,
        data: contact[0],
        message: "Данные успешно получены",
      });
    } catch (e) {
      res
        .status(400)
        .json({ success: false, message: "Информация о контактах не найдена" });
    }
  }

  // async setData(req, res) {
  //   try {
  //     const reqData = await readFileData();
  //     const postData = reqData.posts;
  //     const workData = reqData.works;
  //     const contactData = reqData.contact;
  //     const data = new Data({
  //       resume: reqData.resume,
  //       contact: reqData.contact,
  //     });
  //     await data.save();
  //     // await Post.insertMany(postData);
  //     // await Work.insertMany(workData);
  //     return res.json({
  //       success: true,
  //       message: "Данные успешно записались в MongoDB",
  //     });
  //   } catch (e) {
  //     console.log(e);
  //     res.status(400).json({ success: false, message: "Ошибка записи данных" });
  //   }
  // }
}

module.exports = new authController();
