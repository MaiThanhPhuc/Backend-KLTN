const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose')
const morgan = require('morgan')
const dotenv = require('dotenv')
var bodyParser = require('body-parser')
const cookiePaser = require('cookie-parse')
const employeeRoute = require("./src/routes/employee")
const adminRoute = require("./src/routes/admin")
const jobLeaveRoute = require("./src/routes/jobLeave")
const authRoute = require("./src/routes/auth")
const departmentRoute = require("./src/routes/department")
const app = express()
dotenv.config({ path: __dirname + '/.env' });
const connectingString = process.env.MONGODB_URL
mongoose.connect(connectingString, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connect to DB success")
  })

app.use(bodyParser.json({ limit: "50mb" }))
app.use(cors())
app.use(cookiePaser())
app.use(morgan("common"))

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running`)
})

//Route

app.use('/v1/api/employee', employeeRoute);
app.use('/v1/api/contract', contractRoute);