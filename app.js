const express = require('express');
const dbConnect = require('./dbConnect');
const dotenv = require('dotenv');
const path = require('path');

const cookieParser = require('cookie-parser');
const errorControllers = require('./controllers/errorControllers');

dotenv.config();

const userRoutes = require('./routes/userRoutes');
const placeRoutes = require('./routes/placeRoutes');


dbConnect();
const app = express();
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(cookieParser());


app.use('/api/v1/users', userRoutes);
app.use('/api/v1/places', placeRoutes);

app.get('/reset-password/:token', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'resetPassword.html'));
  });




app.use('*', (req, res) => {
    res.status(404).json({
        message: {
            english: 'Page not found',
            arabic: 'صفحة غير موجودة'
        }
    })
})
app.use(errorControllers)
module.exports = app