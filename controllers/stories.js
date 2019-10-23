const Joi = require("@hapi/joi");

const Story = require("../model/story");

// Get all Stories.........
exports.getStory = async (req, res, next) => {
  try {
    let stories = await Story.find();
    res.render("pages/stories", {
      pageTitle: "Stories",
      path: "/stories",
      stories: stories
    });
  } catch (err) {
    req.flash("error_msg", "Story Fetch Fail");
    res.render("pages/stories", {
      pageTitle: "Stories",
      path: "/stories",
      stories: stories
    });
  }
};

// Get Admin all Stories.........
exports.getAdminStory = async (req, res, next) => {
  try {
    let stories = await Story.find({ createdBy: req.user._id });
    res.render("pages/admin-stories", {
      pageTitle: "Admin Stories",
      path: "/stories",
      stories: stories
    });
  } catch (err) {
    req.flash("error_msg", "Story Fetch Fail");
    res.render("pages/stories", {
      pageTitle: "Stories",
      path: "/stories",
      stories: []
    });
  }
};

// Get Story Details .........
exports.getStoryDetails = async (req, res, next) => {
  try {
    let story = await Story.findById(req.params.storyId);
    res.render("pages/story-details", {
      pageTitle: "Stories",
      path: "/stories",
      story: story
    });
  } catch (err) {
    req.flash("error_msg", "Story Fetch Fail");
    res.redirect("/stories");
  }
};

// Create Stories..........
exports.createStoryPage = (req, res, next) => {
  res.render("pages/createStory", {
    pageTitle: "Stories",
    path: "/stories",
    error: {},
    oldValue: { title: "", description: "" }
  });
};

// Post Create Stories.........
exports.createStory = async (req, res, next) => {
  const { title, description } = req.body;

  const schema = Joi.object({
    title: Joi.string()
      .required()
      .min(3),
    description: Joi.string()
      .required()
      .min(5)
  });

  let { error } = schema.validate(req.body, { abortEarly: false });

  try {
    if (error) {
      throw error;
    }

    let story = new Story({
      title,
      description,
      createdBy: req.user
    });
    story = await story.save();
    req.flash("success_msg", "Story Added");
    res.redirect("/stories");
  } catch (ex) {
    console.log(ex);

    let errorMessage = {};
    if (ex) {
      ex.details.forEach(err => {
        errorMessage[err.path] = err.message;
      });
    }

    res.render("pages/createStory", {
      pageTitle: "Stories",
      path: "/stories",
      error: errorMessage,
      oldValue: { title, description }
    });
  }
};

exports.editStoryPage = (req, res, next) => {
  const { title, description, storyId } = req.query;

  res.render("pages/edit-story", {
    pageTitle: "Edit Story",
    path: "/stories/edit-story",
    editStoryData: { title, description, storyId },
    error: {}
  });
};

exports.editStory = async (req, res, next) => {
  const { title, description, storyId } = req.body;

  let story = await Story.findById(storyId);
  if (story.createdBy.toString() == req.user._id.toString()) {
    Story.findOneAndUpdate(
      storyId,
      { title: title, description: description },
      { useFindAndModify: false }
    ).exec((err, result) => {
      if (!err) {
        req.flash("success_msg", "Story Updated.....");
        res.redirect(`/stories/details/${storyId}`);
      }
    });
  } else {
    req.flash("error_msg", "No Access To Delete");
    res.redirect(`/stories/details/${storyId}`);
  }
};


exports.deleteStory = async (req, res, next) => {
  let story = await Story.findById(req.params.storyId);

  if (story.createdBy.toString() == req.user._id.toString()) {
    Story.findByIdAndDelete(req.params.storyId)
      .then(result => {
        req.flash("success_msg", "Story Deleted");
        res.redirect("/stories");
      })
      .catch(err => {
        req.flash("error_msg", "Story Delete Fails");
        res.redirect("/stories");
      });
  } else {
    req.flash("error_msg", "No Access To Delete");
    res.redirect("/stories");
  }
};
