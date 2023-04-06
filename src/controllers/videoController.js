import Video from "../models/Video";
import User from "../models/User";
import Comment from "../models/Comment";

// Home Page
export const home = async (req, res) => {
  const videos = await Video.find({}).sort({ createdAt: "desc" }).populate("owner");

  // tags : sort by number of tags
  let tags = [];
  videos.forEach((video) =>
    video.hashtags.map((item) => {
      if (!!tags.find((i) => i.name == item)) {
        const index = tags.findIndex((i) => i.name == item);
        tags[index].count++;
      } else {
        tags.push({ name: item, count: 1 });
      }
    })
  );
  tags.sort((a, b) => (a.count > b.count ? -1 : a.count < b.count ? 1 : 0));

  return res.render("home", { pageTitle: "Home", videos, tags });
};

// Video Details
export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id)
    .populate("owner")
    .populate({ path: "comments", populate: { path: "owner" } });

  const videos = await Video.find({}).sort({ createdAt: "desc" }).populate("owner");

  if (!video) {
    return res.render("404", { pageTitle: "Video not found." });
  }
  return res.render("watch", { pageTitle: video.title, video, comments: video.comments, videos });
};

// GET : Create Video
export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload Video", video: {}, errorMessage: "" });
};

// POST : Create Video
export const postUpload = async (req, res) => {
  const {
    user: { _id },
  } = req.session;
  const file = req.files;
  const { title, description, hashtags } = req.body;

  console.log(req.files);
  try {
    // Create Video Object
    const newVideo = await Video.create({
      title,
      description,
      fileUrl: file.video[0].location,
      thumbUrl: file.thumb ? file.thumb[0].location : "",
      owner: _id,
      hashtags: Video.formatHashtags(hashtags),
    });

    // Add User reference to the Video Model
    const user = await User.findById(_id);
    user.videos.push(newVideo._id);
    user.save();

    return res.redirect("/");
  } catch (error) {
    // Error handle with re-render page
    console.log(error);
    return res.status(400).render("upload", {
      pageTitle: "Upload Video",
      video: { title, description, hashtags },
      errorMessage: error._message,
    });
  }
};

// GET : Record Video
export const getRecord = (req, res) => {
  return res.render("record", { pageTitle: "Record Video", video: {}, errorMessage: "" });
};

// GET : Video Edit
export const getEdit = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }

  if (String(video.owner._id) !== String(_id)) {
    req.flash("error", "Not authorized");
    return res.status(403).redirect("/");
  }
  return res.render("edit", { pageTitle: `Edit: ${video.title}`, video });
};

// POST : Video Edit
export const postEdit = async (req, res) => {
  const { id } = req.params;

  const {
    session: {
      user: { _id },
    },
    body: { title, description, hashtags, thumbUrl },
    file,
  } = req;

  console.log(req.file);

  const video = await Video.findById({ _id: id });
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }

  if (String(video.owner) !== String(_id)) {
    req.flash("error", "You are not the the owner of the video.");
    return res.status(403).redirect("/");
  }

  try {
    await Video.findByIdAndUpdate(id, {
      thumbUrl: file ? file.location : thumbUrl,
      title,
      description,
      hashtags: Video.formatHashtags(hashtags),
    });

    req.flash("success", "Changes saved.");
  } catch (e) {
    req.flash("error", `Update failed : ${e}`);
  }

  return res.redirect(`/videos/${id}`);
};

// GET Delete
export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  if (String(video.owner) !== String(_id)) {
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndDelete(id);
  return res.redirect("/");
};

// SEARCH
export const search = async (req, res) => {
  const { keyword } = req.query;
  let videos = [];
  if (keyword) {
    videos = await Video.find({
      title: {
        $regex: new RegExp(`${keyword}`, "i"),
      },
    }).populate("owner");
  }
  return res.render("home", { pageTitle: "Search", videos, tags: [], keyword });
};

// API
export const registerView = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  video.meta.views = video.meta.views + 1;
  await video.save();
  return res.sendStatus(200);
};

// COMMENT
export const createComment = async (req, res) => {
  const {
    session: { user },
    body: { text },
    params: { id },
  } = req;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  const comment = await Comment.create({
    text,
    owner: user._id,
    video: id,
  });
  video.comments.push(comment._id);
  video.save();
  return res.sendStatus(201);
};
