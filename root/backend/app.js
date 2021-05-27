const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const { graphqlHTTP } = require('express-graphql');

const graphqlSchema = require('./graphql/schema');
const graphqlResolver = require('./graphql/resolvers');

//Use MongoDB Atlas, set the DB URI in dbsetting.js
const dbsetting = require('./util/dbsetting');
const dbUri = dbsetting.dbUri;
const auth = require('./middleware/auth');
const { delOldImage } = require('./util/file');

const app = express();

const fileStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'images');
    },
    filename: function(req, file, cb) {
        cb(null, uuidv4())
    }
});

const fileFilter = (req, file, cb) => {
    if( file.mimetype === 'image/png' || 
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg')
    {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json
app.use(multer({ storage: fileStorage, fileFilter: fileFilter}).single('image'));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use(auth);

app.put('/post-image', (req, res, next)=> {
    if (!req.isAuth) {
        throw new Error('Not authenticated!');
    }
    if (!req.file) {
        //It may not change the image when editing post, so return 200
        return res.status(200).json({ message: 'No file provided.' });
    }
    if (req.body.oldPath) {
        delOldImage(req.body.oldPath);
    }
    return res.status(201)
        .json({ message: 'File stored.', filePath: req.file.path });
});

app.use('/graphql', 
    graphqlHTTP({
        schema: graphqlSchema,
        rootValue: graphqlResolver,
        graphiql: true,   // enable in-browser tool for testing GraphQL queries.
        customFormatErrorFn(err) {
            if (!err.originalError) {
                return err;
            }
            const data = err.originalError.data;
            const message = err.message || 'An error occurred.';
            const code = err.originalError.code || 500;
            return { message: message, status: code, data: data };
        }
    })
);

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.StatusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({message: message, data: data });
});

mongoose.connect(dbUri,
    { useNewUrlParser: true , useUnifiedTopology: true})
  .then(result => {
    app.listen(8080);
  })
  .catch(err => {
      console.log(err);
  });
