import mongoose from "mongoose";

mongoose.connect(process.env.DB_URL);

const db = mongoose.connection;

// on: manytimes print
db.on("error", (error) => console.log(`❌ DB Error: ${error}`));

// once: only once print
db.once("open", () => console.log("✅ DB Connected"));
