console.log("Server file running");

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const testRoutes = require("./routes/testRoutes");

dotenv.config();
console.log("MONGO_URI:", process.env.MONGO_URI); 
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/test", testRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});