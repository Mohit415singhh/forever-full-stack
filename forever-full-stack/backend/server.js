import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRoute.js'
import productRouter from './routes/productRoute.js'
import cartRouter from './routes/cartRoute.js'
import orderRouter from './routes/orderRoute.js'
import newsletterRouter from './routes/newsletterRoute.js'

// App Config
const app = express()
const port = process.env.PORT || 4000

const configuredOrigins = (process.env.CORS_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)

if (process.env.NODE_ENV === 'production' && configuredOrigins.length === 0) {
    throw new Error('CORS_ORIGINS must contain the deployed storefront and admin origins in production.')
}

const allowedOrigins = new Set(configuredOrigins)
if (process.env.NODE_ENV !== 'production') {
    allowedOrigins.add('http://localhost:5173')
    allowedOrigins.add('http://localhost:5174')
}

connectDB()
connectCloudinary()

// middlewares
app.use(express.json())
app.use(cors({
    origin(origin, callback) {
        if (!origin || allowedOrigins.has(origin)) {
            return callback(null, true)
        }
        return callback(new Error('Origin not allowed by CORS'))
    }
}))
app.use((error, req, res, next) => {
    if (error.message === 'Origin not allowed by CORS') {
        return res.status(403).json({ success: false, message: error.message })
    }
    return next(error)
})

// api endpoints
app.use('/api/user',userRouter)
app.use('/api/product',productRouter)
app.use('/api/cart',cartRouter)
app.use('/api/order',orderRouter)
app.use('/api/newsletter',newsletterRouter)

app.get('/',(req,res)=>{
    res.send("API Working")
})

app.listen(port, ()=> console.log('Server started on PORT : '+ port))