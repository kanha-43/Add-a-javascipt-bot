const express = require('express');
const path = require('path');
const moment = require('moment');
const RequestLog = require('./models/request_log');

const app = express();
require('mongoose').connect('mongodb://localhost/express-realtime-analytics');

app.use((req, res, next) => {
    let requestTime = Date.now();
    res.on('finish', () => {
        if (req.path === '/analytics') {
            return;
        }

        RequestLog.create({
            url: req.path,
            method: req.method,
            responseTime: (Date.now() - requestTime) / 1000, // convert to seconds
            day: moment(requestTime).format("dddd"),
            hour: moment(requestTime).hour()
        });
    });
    next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
require('hbs').registerHelper('toJson', data => JSON.stringify(data));
app.set('view engine', 'hbs');

module.exports = app;