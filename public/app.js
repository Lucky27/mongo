//grab articles as json
$.getJSON("/articles", function(data){
	for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
      $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
  }
});

$(document).on("click", "p", function(){
	//empty notes
	$("#notes").empty();
	//save p-tag id.
	var thisId = $(this).attr("data-id");

	//ajax call for the Articles.
	$.ajax({
		method: "GET",
		url: "/articles/"+ thisId
	}).done(function(data){
		console.log(data);

		$("#notes").append("<h2>"+ data.title+ "</h2>");
		$("#notes").append("<input id='titleinput' name='title' >");
		$("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
		$("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

		if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
	});
});

$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // POST request to change the note, using the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value from title input
      title: $("#titleinput").val(),
      // Value from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .done(function(data) {
     
      console.log(data);
      // Empty the notes 
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});




















