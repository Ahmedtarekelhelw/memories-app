const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");
const corsOptions = require("./config/corsOptions");
const credentials = require("./middleware/credentials");

const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts");
const refreshRoute = require("./routes/refresh");

//init app
const app = express();
dotenv.config();

//middleware
app.use(credentials);
app.use(cors(corsOptions));

app.use(cookieParser());
app.use(express.json({ limit: "30mb" }));

//routes
app.get("/", (req, res) => {
  res.send("Hello To Memeories API");
});

app.use("/auth", authRoutes);
app.use("/posts", postRoutes);
app.use("/refresh", refreshRoute);

//db connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() =>
    app.listen(process.env.PORT || 5000, () =>
      console.log(`Server is Running on Port ${process.env.PORT}`)
    )
  )
  .catch((err) => console.log(err.message));
