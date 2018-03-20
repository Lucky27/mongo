var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

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
mongoose.connect("mongodb:",{//need help!!!!
	useMongoClient: true
});

// Routes

// GET route for scraping the NBA website
app.get("/scrape", function(req, res){
	axios.get("http://www.nba.com").then(function(response){
		var $ = cheerio.load(response.data);

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
				attr("href");

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


















