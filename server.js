const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
var app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: '*',
  }
});

const db = require("./app/models");
const dbConfig = require("./app/config/db.config");
const Role = db.role;
const User = db.user;


db.mongoose.connect(`mongodb+srv://${dbConfig.HOST}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });

var corsOptions = {
  Origin: "*"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb'}));

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});


io.on('connection', (socket) => {

  socket.on('online', (userId) => {
    User.findByIdAndUpdate(userId,{$set:{state: "Online",socket:socket.id}},(err,data) => {
      if (err) {
        console.log("error", err);
      }
    });
  });

  socket.on('disconnect', function () {
    User.findOneAndUpdate({socket:socket.id},{$set:{state: "Offline"}},(err,data) => {
      if (err) {
        console.log("error", err);
      }
    });
  });
  
});

require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app); 
require('./app/routes/questionBank.routes')(app); 
require('./app/routes/question.routes')(app); 
require('./app/routes/module.routes')(app);
require('./app/routes/courses.routes')(app); 
require('./app/routes/program.routes')(app); 
require('./app/routes/consolidate.routes')(app); 
require('./app/routes/comman.routes')(app); 
require('./app/routes/programAllocation.routes')(app); 
require('./app/routes/notification.routes')(app);  
require('./app/routes/quizScore.routes')(app);  
require('./app/routes/userRequests.routes')(app);  
require('./app/routes/support.routes')(app);  
require('./app/routes/policy.routes')(app);  
require('./app/routes/certificates.routes')(app);  
require('./app/routes/post.routes')(app);  

// set port, listen for requests
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function initial() {


  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'user' to roles collection");
      });

      new Role({
        name: "admin"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'admin' to roles collection");
      });
    }
  });
}
