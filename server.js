require("dotenv").config();
var express = require("express");
var exphbs = require("express-handlebars");

var db = require("./models");

var app = express();
var PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: false, limit: "5mb" }));
app.use(express.json());
app.use(express.static("public"));

// Handlebars
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

// Routes
require("./routes/api-routes")(app);
require("./routes/html-routes")(app);

var syncOptions = { force: true };

// If running a test, set syncOptions.force to true
// clearing the `testdb`
if (process.env.NODE_ENV === "test") {
  syncOptions.force = true;
}

// Starting the server, syncing our models ------------------------------------/
db.sequelize.sync(syncOptions).then(function() {
  //if sync drops tables, seed database
  if (syncOptions.force) {
    db.sequelize.models.User.bulkCreate([
      {
        id: 1,
        firstName: "Daffy",
        lastName: "Duck",
        email: "rabbitsAreDumb@aol.com",
        password: "Test1"
      },
      {
        id: 2,
        firstName: "Bugs",
        lastName: "Bunny",
        email: "bugs.bunny@gmail.com",
        password: "Test2"
      },
      {
        id: 3,
        firstName: "Elmer",
        lastName: "Fudd",
        email: "bestHunterEver@comcast.net",
        password: "Test3"
      }
    ]);

    db.sequelize.models.Category.bulkCreate([
      {
        id: 1,
        name: "Electronics"
      },
      {
        id: 2,
        name: "Kitchen"
      },
      {
        id: 3,
        name: "Lawn and Garden"
      },
      {
        id: 4,
        name: "Automotive"
      }
    ]);

    db.sequelize.models.Item.bulkCreate([
      {
        id: 1,
        name: "Playstation 4",
        description: "This is a playstation 4 with 1 controller.",
        price: 299.99,
        image:
          "data:image/webp;base64,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",
        CategoryId: 1,
        UserId: 1
      },
      {
        id: 2,
        name: "Stand Mixer",
        description: "Red stand mixer",
        price: 105,
        image:
          "data:image/jpeg;base64,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",
        CategoryId: 2,
        UserId: 2
      },
      {
        id: 3,
        name: "Toaster Oven",
        description: "Slightly used toaster oven, works great!",
        price: 35.25,
        image:
          "data:image/jpeg;base64,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",
        CategoryId: 2,
        UserId: 2
      },
      {
        name: "Lawn Mower",
        description: "Gas powered, push mower",
        price: 165.87,
        image:
          "data:image/webp;base64,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",
        CategoryId: 3,
        UserId: 3
      }
    ]);
  }

  app.listen(PORT, function() {
    console.log(
      "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
      PORT,
      PORT
    );
  });
});

module.exports = app;
