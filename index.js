import dotenv from'dotenv'
dotenv.config()
import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import router from './router.js';
import auth from './models/auth.js'
import userRouter from './controllers/UserController.js'


mongoose.connect(process.env.MONGODB_URI,
{useNewUrlParser: true, useUnifiedTopology: true,}
).then(() => {
    console.log('Connect to MONGODB success')
}).catch(err => {
    console.log('Connect to failed ' + err)
})

const app = express()

// Middlewares
app.use(express.json())
app.use(morgan('dev'))
app.get('/', (req, res) => {
    res.json({
      message: 'success',
    })
  })
app.use('/api', router)
app.use('/api/user',userRouter)
app.use('/api/auth',auth)
var port = process.env.PORT || 3000;
app.listen(port , () => {
  console.log(`App listens On Port:${port}`)
})
