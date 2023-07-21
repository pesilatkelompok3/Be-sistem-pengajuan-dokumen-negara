const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const accountRouter = require("./routers/account.router.js");
const formRouter = require("./routers/form.router.js")
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
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-access-token',
  );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
  next();
});


app.use(accountRouter);
app.use(formRouter);

app.listen(port, () => {
  console.log(`server running perfectly at port ${port}`);
});
