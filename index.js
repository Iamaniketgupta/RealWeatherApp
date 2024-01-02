const express = require('express');
const app = express();
const axios = require('axios').default;
require('dotenv').config();

// using parsing
const bodyParser = require('body-parser');
app.use(express.urlencoded({ extended: true }));

// getting middle wares
const path = require('path');
app.use(express.static(path.join(__dirname, 'views')));

// setting up view engine
let ejs = require('ejs');
app.set('view engine', ejs);

const PORT = process.env.PORT;
const API_KEY = process.env.API_KEY;

// getting location
var geoip = require('geoip-lite');

let q = "chandigarh";
let data = {};
let isLoading = false;

const forcast = 'forecast.json';
const future = 'future.json';

const url = `https://api.weatherapi.com/v1/`;


const result = async (q) => {
    isLoading = true; 
    try {

        const response = await axios.get(url + forcast + `?key=${API_KEY}` + `&q=${q}` + `&days=3&aqi=yes&alerts=yes`);
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

            forecast_array:response.data.forecast.forecastday,
        };
    } catch (e) {
        console.log('Error is Found ' + e);
    } finally {
        isLoading = false; 
    }
}

app.get('/', async (req, res) => {
    const ip = req.socket.remoteAddress;
    const geo = geoip.lookup(ip);

    await result(geo);
    res.render('index.ejs', { data, isLoading });
});

app.post('/', async (req, res) => {
    q = req.body.q;
    q = q.trim();
    if (!q) {
        return;
    } else {
        await result(q);
        res.render('index.ejs', { data, isLoading });
    }
});

// listening route
app.listen(PORT, () => {
    console.log(`"Listening at ${PORT}"`);
});
