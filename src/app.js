import express from 'express';
import usersRouter from './routes/users.js'
import authRouter from './routes/auth.js'
import postsRouter from './routes/posts.js'
import followRouter from './routes/follow.js'
import logger from './middleware/logger.js';
import errorHandler from './middleware/error.js';
import cors from './middleware/cors.js'

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(logger)
app.use(cors)

app.use("/api/v1/users", usersRouter)
app.use("/api/v1/auth", authRouter)
app.use("/api/v1/posts", postsRouter)
app.use("/api/v1/follow", followRouter)

app.use( (req, res, next) => {
    const notFoundError = new Error("Not Found")
    notFoundError.status = 404
    next(notFoundError)
})
app.use(errorHandler)

app.get('/', (req, res) => {
    res.json({"status": "healthy"})
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

export default app