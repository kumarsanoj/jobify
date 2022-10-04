import express from 'express';
import dotenv from 'dotenv';
import connectDB from './db/connect.js'
import cors from 'cors';

//middleware
import notFoundMiddleware from './middleware/not-found.js';
import errorHandlerMiddleware from './middleware/error-handler.js';
import authenticateUser from './middleware/auth.js';

//routers
import authRouter from './routes/authRoutes.js'
import jobRoutes from './routes/jobRoutes.js'
import bodyParser from 'body-parser';
import morgan from 'morgan';
import 'express-async-errors';

//deployment related

import { dirname } from 'path'
import { fileURLToPath } from 'url'
import path from 'path'

//sanitize
import helmet from 'helmet'
import xss from 'xss-clean'
import mongoSanitize from 'express-mongo-sanitize'

const app = express()
app.use(cors())
dotenv.config()

if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'))
}

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(helmet())
app.use(xss())
app.use(mongoSanitize())


const __dirname = dirname(fileURLToPath(import.meta.url))

// only when ready to deploy
//comment
app.use(express.static(path.resolve(__dirname, './client/build')))

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', authenticateUser,  jobRoutes);
app.use('*', (req, res) => {
    res.sendFile(path.join(__dirname, './client/build', 'index.html'))
});
app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 5000



const start = async() => {
    try {
        console.log('process.env.MONGO_URL', process.env.MONGO_URL)
        await connectDB(process.env.MONGO_URL)
        app.listen(port, () => {
            console.log(`Server listening on ${port}`)
        })
    } catch(error) {
        console.log(error)
    }
}
start()