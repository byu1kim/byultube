import express from "express";
import {
  watch,
  getUpload,
  postUpload,
  getRecord,
  getEdit,
  postEdit,
  deleteVideo,
} from "../controllers/videoController";
import { protectorMiddleware, videoUpload } from "../middlewares";

const videoRouter = express.Router();

// Video detail
videoRouter.get("/:id([0-9a-f]{24})", watch);

// Edit Video
videoRouter
  .route("/:id([0-9a-f]{24})/edit")
  .all(protectorMiddleware)
  .get(getEdit)
  .post(videoUpload.single("thumb"), postEdit);

// Delete Video
videoRouter.route("/:id([0-9a-f]{24})/delete").all(protectorMiddleware).get(deleteVideo);

// Create Video
videoRouter
  .route("/upload")
  .all(protectorMiddleware)
  .get(getUpload)
  .post(videoUpload.fields([{ name: "video" }, { name: "thumb" }]), postUpload);

// Record Video
videoRouter.route("/record").get(getRecord);

export default videoRouter;
