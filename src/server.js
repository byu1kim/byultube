import express from "express";
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";
import { localsMiddleware } from "./middlewares";
import globalRouter from "./routers/globalRouter";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";

const app = express();

/* Middlewares */
// View engine
app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");

// Morgan
const logger = morgan("dev");
app.use(logger);

// To use req.body
app.use(express.urlencoded({ extended: true }));

// Session
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 20000,
    },
    store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
  })
);

// app.use((req, res, next) => {
//   req.sessionStore.all((error, sessions) => {
//     console.log(sessions);
//     next();
//   });
// });

// app.get("/add-one", (req, res, next) => {
//   req.session.potato += 1;
//   return res.send(`${req.session.id} ${req.session.potato}`);
// });

app.use(localsMiddleware);

// To access img files under uploads
app.use("/uploads", express.static("uploads"));
app.use("/static", express.static("assets"));

// Routers
app.use("/", globalRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);

export default app;
