const express = require("express");
const app = express();
// const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
// app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());

const bookModel = require("./book.model.js");
const Book = mongoose.model("books");
// const url = process.env.MONGO_URL || "mongodb://mongo:27017/books";
const url = process.env.MONGO_URL;

//-------------------------------
//--------------------------------------------------------------
const winston = require('winston');
const rootLogger = winston.createLogger({
  level: 'info',    // Log only if info.level is less than or equal to this level
  transports: [
    new winston.transports.Console(),
  ]
})
// generating reauest id
const crypto = require('crypto');

function getRequestId() {
  let uuid = crypto.randomUUID();
  return uuid;
}


//----------------------------------------------------------------------







mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connection established with Book");
  })
  .catch(() => {
    console.log("Connection failed");
  });

app.get("/", (req, res) => {
  res.send("Hello everyone!!!! This is my greeeeeeeeeeeeeeeeaaaaaaaaaaaaaaaaat test");
});

app.post("/book", async (req, res) => {
  const book = new Book(req.body);
  console.log(book);
  try {
    const newBook = await bookModel.create(book);
    res.status(201).send(newBook)
  } catch (e) {
    res.status(500).send(e);
  }

});

app.get("/books", (req, res) => {

  var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
  let reqID = req.headers['X-Request-ID']
  if (!reqID)
    reqID = getRequestId();
  requestLogger = rootLogger.child({
    userIp: ip,
    request_id: reqID
  })

  Book.find()
    .then((data) => {

      requestLogger.log({
        level: "info",
        message: `Inside book service: data fetched`
      })

      res.status(200).send(data);
    })
    .catch((err) => {
      console.log("ERROR 400!!")

      res.status(400).send(err);
    });
});

app.get("/book/:id", (req, res) => {
  Book.findById(req.params.id)
    .then((book) => {
      if (book) {
        res.status(200).send(book);
      } else {
        res.status(404).send("No such book found");
      }
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

app.delete("/book/:id", (req, res) => {
  Book.findByIdAndDelete(req.params.id)
    .then((book) => {
      if (book) {
        res.status(200).send(book);
      } else {
        res.status(404).send("No book found");
      }
    })
    .catch((err) => res.status(400).send(err));
});


const port = parseInt(process.env.BOOK_PORT) || 3000;
app.listen(port, () => {
  console.log(`Listening: http://localhost:${port}`);
  console.log("Up and running books service");
});
