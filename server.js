// REQUIRE NPM PACKAGES

var express = require("express")
var exphbs = require("express-handlebars");
var logger = require("morgan");
var mongoose = require("mongoose"); 
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = 3000;
// Initialize Express
var app = express();

// Handlebars
app.engine(
"handlebars",
exphbs({
  defaultLayout: "main", 
  helpers: {
    toJSON: function(object){
      return JSON.stringify(object);
    }
  }
})
);
app.set("view engine", "handlebars");

// Configure middleware
// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));
// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/scrapedisc", { useNewUrlParser: true });

// =================================================================================
// HTML ROUTES
// =================================================================================

// INDEX

app.get("/", function(req, res) {
db.Article.find({}).lean()
.then(function(data) {
  res.render("index", {
    articleList: data
  }) 
});
});

// SAVED

app.get("/saved", function(req, res) {
db.Article.find({saved: {$ne: false}}).populate("note").lean()
.then(function(data){
  res.render("saved", {
    articleList: data
  })
})
.catch((err) => console.log(err));
});

// =================================================================================
// API ROUTES 
// =================================================================================

// SCRAPE ROUTE

app.get("/api/scrape", function(req, res) {
// First, we grab the body of the html with axios
axios.get("http://www.slippedisc.com/").then(function(response) {
  // Then, we load that into cheerio and save it to $ for a shorthand selector
  var $ = cheerio.load(response.data);
  
  $body = $(response.data),
  $articles = $body.find("article")

  $articles.each(function(i, element) {
    // Save an empty result object
    var result = {};
    // Add the data
    var $a = $(element).children("a"),
        $title = $(element).find("h3").text(),
        $img = $(element).find("img"),
        $summary = $(element).find("p").text()
      
    result.items = {
      href: $a.attr("href"),
      title: $title.trim(),
      img: $img.attr("src"),
      summary: $summary.trim()
    }

    // Create a new Article using the `result` object built from scraping
    db.Article.create(result.items)
      .then(function(dbArticle) {
        // View the added result in the console
        console.log("Added to DB:")
        console.log(dbArticle);   
      })
      .catch(function(err) {
        // If an error occurred, log it
        console.log(err);
      });
    });
  });
});

// GET ALL ARTICLES - RAW JSON

app.get("/api/articles", function(req, res) {
  // Grab every document in the Articles collection
  db.Article.find({})
    .then(function(dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// GET ALL SAVED ARTICLES 

app.get("/api/saved", function(req,res) {
  db.Article.find({saved: true}).lean().then(function(data){
    res.json(data)
  })
})

// SAVE ARTICLE

app.post("/api/save/:id/", function(req,res) {
  db.Article.updateMany(
    { _id: req.params.id},{saved: true}
  ).lean().then((data) => res.json(data));
})

// REMOVE SAVED ARTICLE

app.post("/api/unsave/:id/", function(req,res) {
  db.Article.updateMany(
    { _id: req.params.id},{saved: false}).lean()
    .then((data) => res.json(data));
})

// DELETE NOTE

app.post("/api/deletenote/:id", function(req,res){
    var noteID = req.params.id
    console.log(noteID)
    db.Note.deleteOne(
      { _id: noteID }).lean()
      .then(function (data) {
        db.Article.findOneAndUpdate({ note: noteID }, { $unset: {note: ""} }).lean()
        .then(function(data2){
          console.log(data2)
        }).catch(function (err2) {
          console.log(err2)
        })

      console.log(data)
      res.json(data) // <--- Returns null
      console.log("Note Deleted") 
    }).catch(function (err) {
      console.log(err); // Need to delete note from associated Article
  })
})

// POST NEW NOTE

app.post("/api/note", function (req, res) {
  db.Note.create({ title: req.body.title, body: req.body.body })
    .then(function (dbNote) {
      console.log(dbNote);
      db.Article.findOneAndUpdate(
        { _id: req.body.artNum },
        { note: dbNote._id }, { new: true }
      )
      .populate("note")
      .lean()
      .then(function (dbArticle) {
        console.log(dbArticle)
        res.json(dbArticle);  
      });
    })
  .catch(function (err) {
    console.log(err);
  });
});

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});