const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const userRouter = require("./src/routers/account.router.js");
dotenv.config();

const app = express();
const port = 5000;

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
);

app.use(userRouter);

app.listen(port, () => {
  console.log(`server running perfectly at port ${port}`);
});
