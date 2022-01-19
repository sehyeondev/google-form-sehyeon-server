const db = require("../models");
const Form = db.Form;
const FormQuestion = db.FormQuestion;
const FormQuestionOption = db.FormQuestionOption;
const FormQuestionAnswer = db.FormQuestionAnswer;
const FormQuestionAnswerOption = db.FormQuestionAnswerOption;
const config = require("../config/auth.config")
var jwt = require("jsonwebtoken");

const { forEach } = require('p-iteration');
const { JsonWebTokenError } = require("jsonwebtoken");


exports.home = async (req, res) => {
  console.log('---');
  console.log(Form)
  const form = await Form.findAll()
  res.json({ message: "Welcome to Sehyeon's application.", form:form});
}

exports.getForm = async (req, res) => {
  console.log('-----');
  console.log('get form in server')
  const id = parseInt(req.params.id)

  const form = await Form.findOne({
      where: {id: id}
    })

  if (!form){
    res.json({success:false, message: "form not found"})
    return
  }

  const formQuestions = await FormQuestion.findAll({
      include: [{model: FormQuestionOption, as: "FormQuestionOptions"}],
      where: {formId: form.id}
    })

  res.json({success: true, formId:form.id, title:form.title, desc: form.desc, form: form, formQuestions: formQuestions})
}

exports.getResult =  async (req, res) => {
  console.log('-----');
  console.log('get result in server')
  const id = parseInt(req.params.id)

  const form = await Form.findOne({
      where: {id: id}
  })

  if (!form){
    res.json({success:false, message: "form not found"})
    return
  }

  const formQuestions = await form.getFormQuestions()
  let answers = {}

  await forEach(formQuestions, async(formQuestion, index) => {
    const formQuestionAnswers = await FormQuestionAnswer.findAll({
      include: [{ model: FormQuestionAnswerOption, as: "FormQuestionAnswerOptions"}],
      where: {formQuestionId: formQuestion.id}
    })
    answers[formQuestion.id] = formQuestionAnswers
  })

  res.json({success: true, form: form, formQuestions: formQuestions, answers:answers,})
}

exports.createForm = async (req, res) => {
  console.log("create form in server")
  const form = await Form.create({
    title:req.body.title,
    desc: req.body.desc,
  })
  const questions = req.body.questions;
  await forEach(questions, async (question, index) => {
    const options = question.selectOptions;
    const formQuestion = await FormQuestion.create({
      formId: form.id,
      title: question.title,
      desc: question.desc,
      qType: question.qType,
    })
    await forEach(options, async (option, index) => {
      const formQuestionOption = await FormQuestionOption.create({
        formQuestionId: formQuestion.id,
        title: option.title,
        oType: option.type,
      })
    })
  })

  res.json({success: true, form:form})
}

exports.createResult = async (req, res) => {
  console.log("result create")
  console.log(req.headers)

  let token = req.headers["authorization"].split(" ")[1];

  console.log(token)

  const options = {
    ignoreExpiration: true
  }

  if (token === undefined || token === "undefined" || token === "" || !token){
    res.json({success: false, message: "token is undefined"})
    return
  }

  const verifyPromise = () => new Promise(function(resolve, reject){
    jwt.verify(token, config.secret, options, function(err, decoded){
      if(err){
        reject(err)
        return
      }
      resolve(decoded)
    })
  })

  const decoded = await verifyPromise();

  console.log(decoded)

  if (!decoded.id){
    res.json({success: false, message: "not verified user"})
    return
  };

  const userId = decoded.id;

  const { userUuid, answers } = req.body
  console.log(userUuid);
  console.log(answers);
  await forEach(Object.keys(answers), async(formQuestionId,index) => {

    const formQuestion = await FormQuestion.findOne({
      where: {id: formQuestionId}
    })

    if (!formQuestion){
      res.json({success:false, message: "form not found"})
      return
    }

    if ((formQuestion.qType === "text") || (formQuestion.qType === "longText")) {
      const formQuestionAnswer = await FormQuestionAnswer.create({
        userUuuid: userUuid,
        formQuestionId: formQuestionId,
        answerText: answers[formQuestionId]
      })
      console.log(userUuid)
      console.log(formQuestionAnswer)
    } else {
      const formQuestionAnswer = await FormQuestionAnswer.create({
        userUuuid: userUuid,
        formQuestionId: formQuestionId,
      })

      const options = answers[formQuestionId]
      await forEach(options, async(optionTitle, index) => {
        const formQuestionAnswerOption = await FormQuestionAnswerOption.create({
          userUuid: userUuid,
          formQuestionAnswerId: formQuestionAnswer.id,
          title: optionTitle,
        })
        // console.log(formQuestionAnswerOption)
      })
      
    }
  })
  res.json({success: true, userUuid: userUuid, answers: answers, userId: userId})

}