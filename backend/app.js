const express = require('express');
const cookieParser = require('cookie-parser');
const createError = require('http-errors');
const logger = require('morgan')
const cors = require('cors');

const marksRouter = require('./routes/marks')
const questionsRouter = require('./routes/questions')
const studentsRouter = require('./routes/students')
const unitsRouter = require('./routes/units')
const modulesRouter = require('./routes/modules')
const loginRouter = require('./routes/login')


const app = express();

// Module dependencies for express
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

// Route declarations

app.use('/marks', marksRouter);
app.use('/questions', questionsRouter);
app.use('/student', studentsRouter)
app.use('/unit', unitsRouter)
app.use('/module', modulesRouter)
app.use('/login', loginRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
  });

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.setHeader('Content-Type', 'application/json');
    res.status(500);
    res.send(JSON.stringify(res.locals));
  });

  module.exports = app;