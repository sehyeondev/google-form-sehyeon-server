// const http = require('http');
const express = require('express');
const cors = require('cors');
const { forEach } = require('p-iteration');

// const port = process.env.PORT || 80;
const port = 8000
const app = express();

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(cors());
app.use('/static', express.static('public')); 

app.listen(port, () => console.log(`Server up and running on port ${port}.`));

const db = require("./models");
const Form = db.Form;
const FormQuestion = db.FormQuestion;
const FormQuestionOption = db.FormQuestionOption;
const FormQuestionAnswer = db.FormQuestionAnswer;
const FormQuestionAnswerOption = db.FormQuestionAnswerOption;

app.get("/", async (req, res) => {
  console.log('---');
  console.log(Form)
  const form = await Form.findOne({
    where: {id: 1}
  })
  res.json({ message: "Welcome to our application.", form:form});
});

app.get("/api/form/:id", async (req, res) => {
  console.log('-----');
  console.log('get form in server')
  const id = parseInt(req.params.id)

  const form = await Form.findOne({
      where: {id: id}
    })

  const formQuestions = await FormQuestion.findAll({
      include: [{model: FormQuestionOption, as: "FormQuestionOptions"}],
      where: {formId: form.id}
    })

  res.json({success: true, formId:form.id, title:form.title, desc: form.desc, form: form, formQuestions: formQuestions})
})

app.get("/api/result/:id", async (req, res) => {
  console.log('-----');
  console.log('get result in server')
  const id = parseInt(req.params.id)

  const form = await Form.findOne({
      where: {id: id}
    })

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
})

app.post("/api/form/create", async (req, res) => {
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

})

app.post("/api/result/create", async (req, res) => {
  console.log("result create")
  const { userUuid, answers } = req.body
  console.log(userUuid);
  console.log(answers);
  await forEach(Object.keys(answers), async(formQuestionId,index) => {

    const formQuestion = await FormQuestion.findOne({
      where: {id: formQuestionId}
    })

    if ((formQuestion.qType === "text") || (formQuestion.qType === "longText")) {
      const formQuestionAnswer = await FormQuestionAnswer.create({
        userUuuid: "11",
        formQuestionId: formQuestionId,
        answerText: answers[formQuestionId]
      })
    } else {
      const formQuestionAnswer = await FormQuestionAnswer.create({
        userUuuid: "11",
        formQuestionId: formQuestionId,
      })

      const options = answers[formQuestionId]
      await forEach(options, async(optionTitle, index) => {
        const formQuestionAnswerOption = await FormQuestionAnswerOption.create({
          formQuestionAnswerId: formQuestionAnswer.id,
          title: optionTitle,
        })
      })
    }
  })
  res.json({success: true, userUuid: userUuid, answers: answers, fail: false})

})