import "dotenv/config";
import "./db";
import app from "./server";
import "./models/Video";
import "./models/User";
import "./models/Comment";

const PORT = 4000;

// Listen to the server
const handleListening = () => console.log(`✅ Server listenting on port http://localhost:${PORT} 🚀`);
app.listen(PORT, handleListening);

// sending is request, server is listening the request, when web is showing you something is response
