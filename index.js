const express = require('express');
const axios = require('axios').default;
const path = require('path');
const nodemailer = require('nodemailer');
const geoip = require('geoip-lite');
require('dotenv').config();

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'views')));
app.set('view engine', 'ejs');

const PORT = process.env.PORT;
const API_KEY = process.env.API_KEY;
const EMAIL_ADD = process.env.EMAIL_ADD;
const EMAIL_PASS = process.env.EMAIL_PASS;

let data = {
    forecast_array: [],
};

let isLoading = true;
let error = false;


const url = process.env.URL;

const result = async (q) => {
    error = false;
    try {
        const response = await axios.get(
            url + `?key=${API_KEY}` + `&q=${q}` + `&days=3&aqi=yes&alerts=yes`
        );
        data = {
            name: response.data.location.name,
            region: response.data.location.region,
            country: response.data.location.country,
            localtime: response.data.location.localtime,

            temp_c: response.data.current.temp_c,
            temp_f: response.data.current.temp_f,
            mintemp_c: response.data.forecast.forecastday[0].day.mintemp_c,

            text: response.data.current.condition.text,
            icon: response.data.current.condition.icon,

            windspeed: response.data.current.wind_kph,
            wind_dir: response.data.current.wind_dir,
            humidity: response.data.current.humidity,
            precip_in: response.data.current.precip_in,
            vis_km: response.data.current.vis_km,

            pm10: response.data.current.air_quality.pm10,

            forecast_array: response.data.forecast.forecastday,
        };
    } catch (e) {
        error = true;
        console.log('no internet');
    }
};

// Create Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL_ADD,
        pass: EMAIL_PASS,
    },
});

// Function to send feedback email
async function sendMail(details) {
    const { email, name, feedback } = details;

    try {
        const info = await transporter.sendMail({
            from: EMAIL_ADD,
            to: email, EMAIL_ADD,
            subject: 'Thanks for Feedback!',
            text: `Hello ${name}, I will surely look into it.`,
            html: `<body>Your Feedback matters </br>to me: ${feedback}</body>`,
        });
        console.log('Email sent:', info.response);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

app.get("/", async (req, res) => {
    const ip = req.socket.remoteAddress;
    const geo = geoip.lookup(ip);

    await result(geo);
    if (error) {
        return res.send('Please check the Internet and try again');
    }
    res.render('index.ejs', { data, isLoading });
})

app.get('/weather', async (req, res) => {

    res.render('index.ejs', { data, isLoading });
});


app.post('/weather', async (req, res) => {
    const q = req.body.q.trim();
    if (!q) {
        return;
    }
    await result(q);
    if (error) {
        res.send('Error rendering page. Check the Internet and try again.');
    } else {
        res.redirect("/weather");
    }
});


// Feedback route 
app.post('/feedback', (req, res) => {
    const details = req.body;
    sendMail(details);
    res.redirect('/');
});

app.listen(PORT, () => {
    console.log(`Listening at ${PORT}`);
});
