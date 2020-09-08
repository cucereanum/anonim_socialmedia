const express = require("express");
const app = express();
const config = require("config");

const mongoose = require("mongoose");
const screams = require("./routes/screams");
const users = require("./routes/users");
const login = require("./routes/login");
const like = require("./routes/likes");
const unlike = require("./routes/unlikes");
const comment = require("./routes/comments");
const notification = require("./routes/notifications");

require("./util/prod")(app);

if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwtPrivateKey is not defined");
  process.exit(1);
}

mongoose
  .connect("mongodb://localhost/my-app", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
  })
  .then(() => console.log("Connected to MongoDb..."))
  .catch((err) => console.log("Could not connect to MongoDb...", err));

app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/api/screams", screams);
app.use("/api/users", users);
app.use("/api/login", login);
app.use("/api/like", like);
app.use("/api/unlike", unlike);
app.use("/api/comments", comment);
app.use("/api/notifications", notification);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on port ${port}...`));
