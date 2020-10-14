import express from 'express'
import compression from 'compression'
import session from 'express-session'
import bodyParser from 'body-parser'
import lusca from 'lusca'
import mongo from 'connect-mongo'
import flash from 'express-flash'
import path from 'path'
import mongoose from 'mongoose'
import bluebird from 'bluebird'
import cookieParser from 'cookie-parser'
import cors from 'cors'

const MongoStore = mongo(session)
import passport from './config/passport'
import { MONGODB_URI, SESSION_SECRET } from './util/secrets'

import movieRouter from './routers/movie'
import productRouter from './routers/product'
import authRouter from './routers/auth'
import userRouter from './routers/user'

import apiErrorHandler from './middlewares/apiErrorHandler'
import apiContentType from './middlewares/apiContentType'

const app = express()
const mongoUrl = MONGODB_URI

mongoose.Promise = bluebird
mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    /** ready to use. The `mongoose.connect()` promise resolves to undefined. */
  })
  .catch((err: Error) => {
    console.log(
      'MongoDB connection error. Please make sure MongoDB is running. ' + err
    )
    process.exit(1)
  })
app.use(cookieParser())
app.use(
  cors({
    origin: 'http://localhost:3001',
    credentials: true,
  })
)

// Express configuration
app.set('port', process.env.PORT || 3000)

// Use common 3rd-party middlewares
app.use(compression())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(lusca.xframe('SAMEORIGIN'))
app.use(lusca.xssProtection(true))
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: SESSION_SECRET,
    store: new MongoStore({
      url: mongoUrl,
      autoReconnect: true,
    }),
  })
)

// init and configure passport
app.use(passport.initialize())
app.use(passport.session())

// Use movie router
app.use('/api/v1/movies', movieRouter)
// Use product router
app.use('/api/v1/products', productRouter)
// Use auth router
app.use('/api/v1/auth', authRouter)
// Use user router
app.use('/api/v1/users', userRouter)

/**
 * example code how to set and get cookie
 */
// //basic route for homepage
// app.get('/', (req, res) => {
//   res.send('welcome to express app')
// })

// //JSON object to be added to cookie
// const users = {
//   name: 'Ritik',
//   Age: '18',
// }

// //Route for adding cookie
// app.get('/setuser', (req, res) => {
//   res.cookie('userData', users)
//   res.send('user data added to cookie')
// })

// //Iterate users data from cookie
// app.get('/getuser', (req, res) => {
//   //shows all the cookies
//   console.log(req)
//   res.send(req.cookies)
// })

// //Route for destroying cookie
// app.get('/logout', (req, res) => {
//   //it will clear the userData cookie
//   res.clearCookie('userData')
//   res.send('user logout successfully')
// })

// Custom API error handler
app.use(apiErrorHandler)

export default app
