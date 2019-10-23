const express = require('express')

const router = express.Router()
const { auth } = require('../middleware/isAuth')

const storiesController = require('../controllers/stories')


// Get Story
router.get('/', storiesController.getStory)
router.get('/details/:storyId', storiesController.getStoryDetails)


//Get Admin Stories
router.get('/admin-stories', auth, storiesController.getAdminStory)


// Add Story
router.get('/add-stories', auth,  storiesController.createStoryPage)
router.post('/add-stories', auth, storiesController.createStory)


// Edit Story
router.get('/edit-story', auth, storiesController.editStoryPage)
router.post('/edit-story', auth, storiesController.editStory)


router.get('/delete/:storyId', auth, storiesController.deleteStory)



module.exports = router