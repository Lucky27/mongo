var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var request = require("request");
var axios = require("axios");
var cheerio = require("cheerio");

//Require all models
var db = require("./models");

var PORT = 3000;

//Initialize Express
var app = express();

//Use morgan logger for logging requests
app.use(logger("dev"));
//Use body-parser for handling form submission
app.use(bodyParser.urlencoded({extended: false}));
//Use express.static to serve the public folder as a static directory.
app.use(express.static("public"));

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/Article",{
	// useMongoClient: true
});

// Routes

// GET route for scraping the NBA website
app.get("/scrape", function(req, res){
	request("http://www.nytimes.com", function(error, response, html){
		var $ = cheerio.load(html);

		//grab h2 within an article tag
		$("article h2").each(function(i, element){
			//an empty result object
			var result = {};

			//add the text and link "href" and save to the result object.
			result.title = $(this)
				.children("a")
				.text();
			result.link = $(this)
				.children("a")
				// attr("href");
			result.summary =$(this)
				.children("summary")
				.text();

			db.Article
				.create(result)
				.then(function(dbArticle){
					res.json("Scraped");
				}).catch(function(err){
					//if err, log err.
					res.json(err);
				});

		});
	});
});

//Route for all articles.
app.get("/articles", function(req, res){
	db.Article
		.find({}).then(function(dbArticle){
			//if successful send articles
			res.json(dbArticle);
		}).catch(function(err){
			//if err then log err.
			res.json(err);
		});
});

//route for grabbing article by id.
app.get("/articles/:id", function(req, res){
	db.Article.findOne({_id: req.params.id})
	.populate("note").then(function(dbArticle){
		res.json(dbArticle);
	}).catch(function(err){
		res.json(err)
	});
});

app.post("/articles/:id", function(req, res){
	db.Note.create(req.body).then(function(dbNote){
		return db.Article.findOneAndUpdate({_id: req.params.id}, {note: dbNote._id}, {new: true})

	}).then(function(dbArticle){
		res.json(dbArticle);
	}).catch(function(err){
		res.json(err);
	});
});

//listening to server
app.listen(PORT, function(){
	console.log("PORT: "+PORT);
});













