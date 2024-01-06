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

const PORT = process.env.PORT || 8000;
const API_KEY = process.env.API_KEY;
const EMAIL_ADD = process.env.EMAIL_ADD;
const EMAIL_PASS = process.env.EMAIL_PASS;
const auto_search =process.env.S_URL;
const url = process.env.API_URL;

let data = {
    forecast_array: [],
};
  
let error = false;

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
        console.log('Error :  ' +e);
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
            html: `<html><body> Your Feedback matters </br> to me: ${feedback}</body> </html>`,
        });
        console.log('Email sent:', info.response);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

app.get("/", async (req, res) => {

    try{

        const ip = req.socket.remoteAddress;
        const geo = geoip.lookup(ip);
        await result(geo);
    }
    catch(e){
       console.log(e); 
    }

    if (error) {
         console.error('server is not responding, try again');
    }
    res.render('index.ejs', {data});
})

// weather search routes
app.get('/weather', async (req, res) => {
    res.render('index.ejs', {data});
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

// autocomplete route
app.get('/autocomplete', async (req, res) => {
    try {
        const qry = req.query.q;
        const respond = await axios.get(`${auto_search}?key=${API_KEY}&q=${qry}`);
        const autocompleteData = respond.data; 
 
        res.json(autocompleteData);
    } catch (error) {
        console.error('Autocomplete error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
 

app.listen(PORT, () => {
    console.log(`Listening at ${PORT}`);
});
