const express = require('express')
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})

const UserRouter = require("./routes/users")
const TaskRouter = require("./routes/tasks")

const app = express()

app.use(express.json())


app.use(UserRouter);
app.use(TaskRouter);


module.exports = app;