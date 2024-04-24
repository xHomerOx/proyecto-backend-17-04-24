import express from "express";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import handlebars from "express-handlebars";
import __dirname from "./utils/constantsUtil.js";
import viewsRouter from "./routes/views.router.js";
import { Server } from "socket.io";
import Sockets from "./sockets.js";
import mongoStore from "connect-mongo";
import mongoose from "mongoose";
import session from "express-session";
import usersRouter from "./routes/users.router.js";



const app = express();
const port = 8080;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/../views");



const uri = "mongodb+srv://lma:Nelson1204@cluster0.9d6vkgf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(uri, { dbName: "ecommerce" })
  .then(() => {
    console.log("Conexión exitosa a la base de datos");
    const server = app.listen(port, () =>
      console.log(`Servidor corriendo en http://localhost:${port}`)
    );

app.use(
  session({
    store: mongoStore.create({ mongoUrl: uri, ttl: 200 }),
    secret: 'secretPhrase',
    resave: true,
    saveUninitialized: true
  })
);
app.use('/api/sessions', usersRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);
  


const io = new Server(server);
Sockets(io);
})
.catch((error) => {
console.log("No se puede conectar con la DB: " + error);
process.exit(1);
});
