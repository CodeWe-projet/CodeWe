const express = require("express");
const promBundle = require("express-prom-bundle");

const promMetrics = promBundle({
    includeMethod: true,
    includePath: true,
    autoregister: false
});

const { promClient, metricsMiddleware } = promMetrics;

const metricsApp = express();
metricsApp.disable("x-powered-by");
metricsApp.use(metricsMiddleware);

module.exports = { metricsMiddleware, metricsApp };