//---------------------------------------------
const client = require('prom-client');
const collectDefaultMetrics = client.collectDefaultMetrics;
const Registry = client.Registry;
const register = new Registry();
collectDefaultMetrics({ register });

const numberOfRequestsCounter = new client.Counter({
    name: 'number_of_requests',
    help: 'counts the number of requests that the fact endpoint recieved',
    labelNames: ['status'],
});

const newCustomersCounter = new client.Counter({
    name: 'new_customer_accounts',
    help: 'counts the new customer accounts'
});
register.registerMetric(numberOfRequestsCounter)
register.registerMetric(newCustomersCounter)
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


const express = require("express");
const app = express();
// const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
require("dotenv").config();
const axios = require("axios");
// app.use(morgan("dev"));
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
    var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    let reqID = req.headers['X-Request-ID']
    if (!reqID)
        reqID = getRequestId();
    requestLogger = rootLogger.child({
        userIp: ip,
        request_id: reqID
    })



    let orders = await axios
        .get(orderUrl + "orders")
    numberOfRequestsCounter.inc({ 'status': 200 });
    res.status(200).send(orders.data);
})
app.post("/api/v1/orders", async (req, res) => {
    var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    let reqID = req.headers['X-Request-ID']
    if (!reqID)
        reqID = getRequestId();
    requestLogger = rootLogger.child({
        userIp: ip,
        request_id: reqID
    })

    const order = req.body;
    try {
        let newOrder = await axios
            .post(orderUrl + "order", order)
        numberOfRequestsCounter.inc({ 'status': 201 });
        newCustomersCounter.inc();
        requestLogger.log({
            level: "info",
            message: `Customer created successfully`
        })
        res.status(201).send(newOrder.data);


    } catch (e) {
        requestLogger.log({
            level: "info",
            message: `Error creating customer`
        })
    }


})
app.get("/api/v1/orders/:id", async (req, res) => {
    var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    let reqID = req.headers['X-Request-ID']
    if (!reqID)
        reqID = getRequestId();
    requestLogger = rootLogger.child({
        userIp: ip,
        request_id: reqID
    })

    const id = req.params.id
    let order = await axios
        .get(orderUrl + "order/" + id)
    numberOfRequestsCounter.inc({ 'status': 200 });
    res.status(200).send(order.data);
})
app.delete("/api/v1/orders/:id", async (req, res) => {
    var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    let reqID = req.headers['X-Request-ID']
    if (!reqID)
        reqID = getRequestId();
    requestLogger = rootLogger.child({
        userIp: ip,
        request_id: reqID
    })
    const id = req.params.id
    let order = await axios
        .delete(orderUrl + "order/" + id)
    res.status(200).send(order.data);
})


app.get("/api/v1/books", async (req, res) => {
    var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    let reqID = req.headers['X-Request-ID']
    if (!reqID)
        reqID = getRequestId();
    requestLogger = rootLogger.child({
        userIp: ip,
        request_id: reqID
    })

    try {
        const config = {
            headers: {
                'X-Request-ID': reqID
            }
        };

        let books = await axios
            .get(bookUrl + "books", config)
        numberOfRequestsCounter.inc({ 'status': 200 });

        requestLogger.log({
            level: "info",
            message: `Books array fetched successfully`
        })
        res.status(200).send(books.data);
    } catch (e) {
        requestLogger.log({
            level: "error",
            message: `Error fetching books`
        })
        numberOfRequestsCounter.inc({ 'status': 400 });
        res.status(400).send({ message: "error fetching books" });

    }

})

app.get("/api/v1/books/:id", async (req, res) => {
    var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    let reqID = req.headers['X-Request-ID']
    if (!reqID)
        reqID = getRequestId();
    requestLogger = rootLogger.child({
        userIp: ip,
        request_id: reqID
    })

    const id = req.params.id
    try {
        let orders = await axios
            .get(bookUrl + "book/" + id)
        numberOfRequestsCounter.inc({ 'status': 200 });
        res.status(200).send(orders.data);

    }
    catch (e) {
        requestLogger.log({
            level: "error",
            message: `Error fetching books`
        })
        numberOfRequestsCounter.inc({ 'status': 400 });
        res.status(400).send({ message: "error fetching book" });
    }

})
app.post("/api/v1/books", async (req, res) => {
    var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    let reqID = req.headers['X-Request-ID']
    if (!reqID)
        reqID = getRequestId();
    requestLogger = rootLogger.child({
        userIp: ip,
        request_id: reqID
    })

    const book = req.body;
    let newBook = await axios
        .post(bookUrl + "book", book)
    res.status(200).send(newBook.data);
})
app.delete("/api/v1/books/:id", async (req, res) => {
    var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    let reqID = req.headers['X-Request-ID']
    if (!reqID)
        reqID = getRequestId();
    requestLogger = rootLogger.child({
        userIp: ip,
        request_id: reqID
    })

    const id = req.params.id
    let orders = await axios
        .delete(bookUrl + "book/" + id)
    res.status(200).send(orders.data);
})


app.get("/api/v1/customers", async (req, res) => {
    var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    let reqID = req.headers['X-Request-ID']
    if (!reqID)
        reqID = getRequestId();
    requestLogger = rootLogger.child({
        userIp: ip,
        request_id: reqID
    })

    let customers = await axios
        .get(customerUrl + "customers")
    res.status(200).send(customers.data);
})

app.post("/api/v1/customers", async (req, res) => {
    var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    let reqID = req.headers['X-Request-ID']
    if (!reqID)
        reqID = getRequestId();
    requestLogger = rootLogger.child({
        userIp: ip,
        request_id: reqID
    })

    const customer = req.body;
    let newCustomer = await axios
        .post(customerUrl + "customer", customer)
    res.status(200).send(newCustomer.data);
})
app.get("/api/v1/customers/:id", async (req, res) => {
    var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    let reqID = req.headers['X-Request-ID']
    if (!reqID)
        reqID = getRequestId();
    requestLogger = rootLogger.child({
        userIp: ip,
        request_id: reqID
    })

    const id = req.params.id
    let customers = await axios
        .get(customerUrl + "customer/" + id)
    res.status(200).send(customers.data);
})
app.delete("/api/v1/customers/:id", async (req, res) => {
    var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    let reqID = req.headers['X-Request-ID']
    if (!reqID)
        reqID = getRequestId();
    requestLogger = rootLogger.child({
        userIp: ip,
        request_id: reqID
    })

    const id = req.params.id

    let customers = await axios
        .delete(customerUrl + "customer/" + id)
    res.status(200).send(customers.data);
})
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    let metrics = await register.metrics();
    res.send(metrics);
})


const port = parseInt(process.env.API_GATEWAY_PORT);

app.listen(port, () => {
    console.log(`Listening: on port ${port}`);
    console.log("Up and running order service");
});
