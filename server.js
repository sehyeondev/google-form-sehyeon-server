// const http = require('http');
const express = require('express');
const cors = require('cors');

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

require('./routes/form.routes')(app);
require('./routes/user.routes')(app);


app.post("/", async (req, res) => {
  res.json({message: "test success"})
})

