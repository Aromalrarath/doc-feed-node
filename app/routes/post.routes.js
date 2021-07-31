module.exports = app =>{
    const posts = require('../controllers/post.controller')
    
    app.post('/post', posts.create)
    app.get('/post/:userId', posts.findPostsByUserId)
    app.put('/post/update', posts.update)
    app.post('/post/status',posts.activateStatus)
    app.get('/posts', posts.findAll)
}