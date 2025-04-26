const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// Routes
const landmarkRoutes = require("./src/routes/landmark.routes");
const visitedRoutes = require("./src/routes/visited.routes");

app.use("/api/landmarks", landmarkRoutes);
app.use("/api/visited", visitedRoutes);

// DB Sync
const db = require("./src/models");
db.sequelize.sync();

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
