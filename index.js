require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./Utils/db');
const app = express();
const auth_route = require('./Routers/auth-router')
const blog_route = require('./Routers/blog-router')
const admin_route = require('./Routers/admin-router');
const errorMiddleware = require('./Middlewares/error-middleware');
const helmet = require('helmet');

const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use('/uploads', express.static('uploads'))
app.use(helmet());

app.use('/api/auth', auth_route)
app.use('/api/blogs', blog_route)
app.use('/api/admin', admin_route);






app.use(errorMiddleware)



const PORT = process.env.SERVER_PORT || 3002;

const startServer = async () => {
    try {
        console.log('🟡Before connecting to the database ');

        await connectDB();

        app.listen(PORT, () => {
            console.log(`🚀 Server is running on http://localhost:${PORT}`);
        });

        console.log('🟢After connecting to the database ');
    } catch (error) {
        console.error('❌ Failed to start server:', error);
    }
};

startServer();
