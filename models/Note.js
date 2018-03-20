var mongoose = require("mongoose");

//Save reference to the Schema contructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new NoteSchema object.
var NoteSchema = new Schema({
	//title is a String
	title: String,
	//body is a String
	body: String
});

//this creates model from above schema. using mongoose model method
var Note = mongoose.model("Note", NoteSchema);

//Export the Note model
module.exports = Note;
