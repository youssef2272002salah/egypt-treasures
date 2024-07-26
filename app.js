const express = require('express');
const dbConnect = require('./dbConnect');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

dotenv.config();

const userRoutes = require('./routes/userRoutes');
const placeRoutes = require('./routes/placeRoutes');


dbConnect();
const app = express();
app.use(express.json());
app.use(cookieParser());


app.use('/api/v1/users', userRoutes);
app.use('/api/v1/places', placeRoutes);


app.use((err, req, res, next) => {
    console.log(err)

    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(e => ({
            field: e.path,
            messages: e.message // Assuming the message is an object with english and arabic properties
        }));
        return res.status(400).json({ errors });
    }
    

    res.status(err.statusCode || 500).json({
        status: 'error',
        message: err.message,
        //stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

app.use('*', (req, res) => {
    res.status(404).json({
        status: 'fail',
        message: 'Not found'
    })
})
module.exports = app