const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./utils/db");
const userRoute = require("./routes/user.route");
const entryRoute = require("./routes/entry.route");
const path = require("path");

const filePath = path.join(__dirname, "../frontend/dist");

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));

app.use("/api/user", userRoute);
app.use("/api/entry", entryRoute);

app.use(express.static(filePath));
app.get("/*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend", "dist", "index.html"));
});
app.listen(port, () => {
  connectDB();
  console.log(`Server is running on port ${port}`);
});
