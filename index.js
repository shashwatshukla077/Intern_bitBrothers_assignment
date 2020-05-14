const express = require("express");
const mongoose = require("mongoose");
//const morgan = require("morgan");
//const fs = require('fs')
const bodyParser = require("body-parser");
const UsersModel = require('./models/user');
const app = express();
app.use(bodyParser.json());
//app.use(morgan("combined"));
//var accessLogStream = fs.createWriteStream(path.join(__dirname, "access.log"), {
  //flags: "a"
//});
//app.use(morgan("combined", { stream: accessLogStream }));

//DB CONNECTION
mongoose
  .connect("mongodb://localhost:27017/shashwatAssignment", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => {
    console.log("DB CONNECTED");
  })
  .catch(err => {
    console.log("DB CONNECTION ERROR => " + err);
  });

app.post("/api/users", (req, res) => {
  let name = req.body.name;
  let email = req.body.email;
  UsersModel.create(
    {
      name: name,
      email: email
    },
    (err, docs) => {
      if (!err) {
        return res.status(200).json({ status: "added to DB" });
      }
    }
  );
});

app.get("/api/users", (req, res) => {
  UsersModel.find({}, (err, docs) => {
    if (err) {
      return res.status(400).json({ error: "There was some error" });
    }
    return res.status(200).json(docs);
  });
});

app.get("/api/users/:id", (req, res) => {
  let user_id = req.params.id;
  UsersModel.find({ _id: user_id }, (err, docs) => {
    if (err) {
      return res.status(400).json({ error: "There was some error" });
    }
    return res.status(200).json(docs);
  });
});

app.put("/api/users/:id", (req, res) => {
  let user_id = req.params.id;
  UsersModel.findByIdAndUpdate(
    { _id: user_id },
    { $set: req.body },
    { new: true, useFindAndModify: false },
    (err, user) => {
      if (err) {
        return res.status(400).json({ error: "There was some error" });
      }
      return res.json(user);
    }
  );
});

app.delete("/api/users/:id", (req, res) => {
  let user_id = req.params.id;
  UsersModel.deleteOne({ _id: user_id }, (err, user) => {
    if (err) {
      return res.status(400).json({ error: "There was some error" });
    }
    return res.status(200).json({ status: "deleted successfully" });
  });
});

app.listen(3000 || process.env.PORT);
