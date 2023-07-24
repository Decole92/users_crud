const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const errorHandler = require("./middleware/errorHandler");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

const PORT = process.env.PORT;
app.use("/users", userRoutes);
app.use(errorHandler);
app.listen(PORT, () => console.log(`The server is running at port ${PORT}`));
module.exports = app;
