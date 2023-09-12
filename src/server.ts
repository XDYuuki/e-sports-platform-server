import express, { json } from "express";

const app = express();
app.use(json());

app.get("/", (request, response) => {
    return response.send({ Hewllo: "World Test" });
});

app.listen(3000, () => {
    console.log("Started listening to Port: 3000");
});
