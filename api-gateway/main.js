const express = require("express");
const app = express();
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
require("dotenv").config();
const axios = require("axios");
app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());

const bookUrl = "http://" + process.env.BOOK_HOST + ":" + process.env.BOOK_PORT + "/"
const customerUrl = "http://" + process.env.CUSTOMER_HOST + ":" + process.env.CUSTOMER_PORT + "/"
const orderUrl = "http://" + process.env.ORDER_HOST + ":" + process.env.ORDER_PORT + "/"

app.get("/", (req, res) => {
    res.send("This is API gateway");
});

app.get("/api/v1/orders", async (req, res) => {
    let orders = await axios
        .get(orderUrl + "orders")
    res.status(200).send(orders.data);
})
app.get("/api/v1/orders/:id", async (req, res) => {
    const id = req.params.id
    let order = await axios
        .get(orderUrl + "order/" + id)
    res.status(200).send(order.data);
})
app.delete("/api/v1/orders/:id", async (req, res) => {
    const id = req.params.id
    let order = await axios
        .delete(orderUrl + "order/" + id)
    res.status(200).send(order.data);
})


app.get("/api/v1/books", async (req, res) => {
    let books = await axios
        .get(bookUrl + "books")
    res.status(200).send(books.data);
})

app.get("/api/v1/books/:id", async (req, res) => {
    const id = req.params.id
    let orders = await axios
        .get(bookUrl + "book/" + id)
    res.status(200).send(orders.data);
})
app.post("/api/v1/books", async (req, res) => {
    const book = req.body;
    let newBook = await axios
        .post(bookUrl + "book", book)
    res.status(200).send(newBook.data);
})
app.delete("/api/v1/books/:id", async (req, res) => {
    const id = req.params.id
    let orders = await axios
        .delete(bookUrl + "book/" + id)
    res.status(200).send(orders.data);
})


app.get("/api/v1/customers", async (req, res) => {
    let customers = await axios
        .get(customerUrl + "customers")
    res.status(200).send(customers.data);
})
app.get("/api/v1/customers/id", async (req, res) => {
    let customers = await axios
        .get(customerUrl + "customer/" + id)
    res.status(200).send(customers.data);
})
app.delete("/api/v1/customers/id", async (req, res) => {
    let customers = await axios
        .delete(customerUrl + "customer/" + id)
    res.status(200).send(customers.data);
})

const port = parseInt(process.env.API_GATEWAY_PORT);

app.listen(port, () => {
    console.log(`Listening: on port ${port}`);
    console.log("Up and running order service");
});
