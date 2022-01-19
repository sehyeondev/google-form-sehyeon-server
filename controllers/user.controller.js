const db = require("../models");
const User = db.User;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const config = require("../config/auth.config")

exports.list = async (req, res) => {
  const users = await User.findAll();
  res.send({success: true, users: users})
}

exports.signup = async (req, res) => {
  const usernamePresent = await User.findAll({where:{username: req.body.username}})
  const emailPresent = await User.findOne({where: {email: req.body.email}})

  if (usernamePresent){
    res.json({
      success:false,
      message: "username exists"
    })
    return
  } 
  if (emailPresent){
    res.json({
      success: false,
      message: "email exists"
    })
    return
  }

  const user = await User.create({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8), // user가 입력한 비번을 hash한다. 8은 뭐지??
  })

  var token = jwt.sign({id: user.id}, config.secret, {
    expiresIn: 86400
  })

  res.json({
    success: true,
    user:user,
    accessToken: token,
    message: "user created"
  })
}

exports.signin = async (req, res) => {
  const user = await User.findOne({where: {email: req.body.email}})

  if (!user) {
    return res.status(404).send({message: "User not found"})
  }

  // password를 비교하자
  var passwordIsValid = bcrypt.compareSync(
    req.body.password, // Sync는 뭐하는 얘인가? 찾아보자
    user.password
  )

  // token을 발행하자
  // 여기서 config가 쓰이는 데 어디서 온 것인가
  if (!passwordIsValid) {
    res.json({
      success:false,
      message: "Invalid password",
    })
  }

  var token = jwt.sign({id: user.id}, config.secret, {
    expiresIn: 86400
  })

  // response를 보내주자
  res.json({
    success:true,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      accessToken: token,
    }
  })
}