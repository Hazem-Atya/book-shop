const express = require("express");
const app = express();
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const axios = require("axios");
app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());

require("./order.model.js");
const Order = mongoose.model("orders");

const url = process.env.MONGO_URL;

const bookUrl = process.env.BOOK_URL || "http://localhost:3000/book/";
const customerUrl =
  process.env.CUSTOMER_URL || "http://localhost:4000/customer/";

console.log(url, bookUrl, customerUrl);

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connection established with OrderService");
  })
  .catch(() => {
    console.log("Connection failed");
  });

app.get("/", (req, res) => {
  res.send("This is order service");
});

app.post("/order", async (req, res) => {
  const newOrder = {
    customerId: mongoose.Types.ObjectId(req.body.customerId),
    bookId: mongoose.Types.ObjectId(req.body.bookId),
    initialDate: req.body.initialDate,
    deliveryDate: req.body.deliveryDate,
  };
  console.log(newOrder);
  try {
    const returnedCustomer = await Order.create(newOrder);
    res.status(201).send(returnedCustomer)
  } catch (e) {
    res.status(500).send(e);
  }

});

app.get("/orders", (req, res) => {
  Order.find()
    .then((orders) => {
      if (orders) {
        res.status(200).send(orders);
      } else {
        res.send("No orders placed");
      }
    })
    .catch((err) => res.send(err));
});

app.get("/order/:id", async (req, res) => {

  const order = await Order.findById(req.params.id);
  const orderObj = {
    id: order.id,
    initialDate: order.initialDate,
    deliveryDate: order.deliveryDate,
    customerName: "",
    bookTitle: "",
  };
  if (order) {
    console.log(customerUrl);
    console.log(order.customerId);
    // axios.get("http://localhost:4000/customer/63c3c7c72dcffe5965edd524")
    // let response = await axios(`${customerUrl}${order.customerId}`);
    //  console.log(response.body);
    let customerResponse = await axios
      .get(customerUrl + "customer/" + order.customerId)
    orderObj.customerName = customerResponse.data.name;
    let bookResponse = await axios
      .get(bookUrl + "book/" + order.bookId)
    orderObj.bookTitle = bookResponse.data.title;
    res.status(200).send(orderObj);
  } else {
    res.status(404).send("No order found with given id");
  }
});

app.delete("/order/:id", (req, res) => {
  Order.findByIdAndDelete(req.params.id)
    .then((order) => {
      if (order) {
        res.status(200).send(order);
      } else {
        res.status(404).send("No such order to delete");
      }
    })
    .catch((err) => res.send(err.message));
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Listening: http://localhost:${port}`);
  console.log("Up and running order service");
});
