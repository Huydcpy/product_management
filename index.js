const express = require("express");

require("dotenv").config();

const database = require("./config/database");
database();

const routeAdmin = require("./routes/admin/index.route");
const route = require("./routes/client/index.route");
const systemConfig = require("./config/system")


const app = express();
const port = process.env.PORT;

app.set("views", "./views");
app.set("view engine", "pug");

//App Locals Variables
app.locals.prefixAdmin = systemConfig.prefixAdmin
routeAdmin(app);
route(app);
app.use(express.static("public"));

// app.get("/", (req, res) => {
//     res.render("client/pages/home/index");
// });

// app.get("/products", (req, res) => {
//     res.render("client/pages/products/index");
// });

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
