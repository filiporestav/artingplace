import express from "express";

const port = 8989;
const app = express(); // Build an express server

app.get("/status", (req, res) => {
    res.send({
        message: "Hello world"
    });
})

app.listen(process.env.PORT || port);