import express from "express";
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";
import { localsMiddleware } from "./middlewares";
import globalRouter from "./routers/globalRouter";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";
import apiRouter from "./routers/apiRouter";
import flash from "express-flash";

const app = express();

// View engine
app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");

// To use req.body
app.use(express.urlencoded({ extended: true }));

// To convert json
app.use(express.json());

// Session
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    // cookie: {
    //   maxAge: 200000,
    // },
    store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
  })
);

// Flash message
app.use(flash());

// Multer, Protect pages
app.use(localsMiddleware);

// To access static files
app.use("/static", express.static("assets"));

// Routers
app.use("/", globalRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);
app.use("/api", apiRouter);

export default app;
