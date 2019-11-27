"use strict";

const App = require("./src/app");

const app = new App().getApp();

app.listen(app.get("PORT"), () => {
    console.log("Server is running on port: %d", app.get("PORT"));
});