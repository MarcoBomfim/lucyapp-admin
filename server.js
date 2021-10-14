const express = require('express');
const cors = require('cors');
const serveStatic = require("serve-static")
const path = require('path');

const app = express();
app.use(cors());
app.use(serveStatic(path.join(__dirname, 'dist')));

const port = process.env.PORT || 8000;

app.listen(port);