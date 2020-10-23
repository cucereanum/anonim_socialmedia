const express = require("express");
const app = express();
const config = require("config");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const screams = require("./routes/screams");
const users = require("./routes/users");
const login = require("./routes/login");
const like = require("./routes/likes");
const unlike = require("./routes/unlikes");
const comment = require("./routes/comments");
const notification = require("./routes/notifications");
const uploadImage = require("./routes/uploadImage");

//"mongodb+srv://admin:Mmn2RDk1HQBcor9O@cluster0.vew6i.mongodb.net/Pixel-DB?retryWrites=true&w=majority"

require("./util/prod")(app);

if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwtPrivateKey is not defined");
  process.exit(1);
}

const connection_url = config.get("connection_url");

mongoose
  .connect(connection_url, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
  })
  .then(() => console.log("Connected to MongoDb Cloud..."))
  .catch((err) => console.log("Could not connect to MongoDb Cloud...", err));

app.use(express.json());
app.use(bodyParser.json());
app.use(methodOverride("_method"));
app.use("/uploads", express.static("uploads"));
app.use("/api/screams", screams);
app.use("/api/users", users);
app.use("/api/login", login);
app.use("/api/like", like);
app.use("/api/unlike", unlike);
app.use("/api/comments", comment);
app.use("/api/notifications", notification);
app.use("/api/uploadImage", uploadImage);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on port ${port}...`));
