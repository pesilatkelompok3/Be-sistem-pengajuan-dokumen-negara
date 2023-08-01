const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const FileUpload = require("express-fileupload");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const accountRouter = require("./routers/account.router.js");
const formRouter = require("./routers/formQuestion.router.js");
const submissionRouter = require("./routers/answerSubmission.router.js");
dotenv.config();

const app = express();
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
);
app.use(cookieParser());
const port = 5000;

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(FileUpload());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, x-access-token"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});


app.use(accountRouter);
app.use(formRouter);
app.use(submissionRouter);

app.listen(port, () => {
  console.log(`server running perfectly at port ${port}`);
});
