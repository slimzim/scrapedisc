// VARIABLES FOR MODAL BUTTON CREATION
var noteButtonID = ""
var dynamicModalButton = ""

// SCRAPE BUTTON
$(document).on("click", "#scrape", (event) => {
  console.log("scrape button")
  $.get({
    type: "GET",
    url: "/api/scrape",
    success: (data) => {
      console.log("hello there")
      location.reload();   
    }
  })
})

// SAVE ARTICLES BUTTON
$(".save-button").on("click", function(){
  var thisId = $(this).attr("data-id")
  $.ajax({
    method: "POST",
    url: "api/save/" + thisId
  })
  alert("Article saved!")
})

// REMOVE SAVED ARTICLES BUTTON
$(".unsave-button").on("click", function(){
  var thisId = $(this).attr("data-id")
  $.ajax({
    method: "POST",
    url: "api/unsave/" + thisId,
    success: (data) => {
      console.log(data); 
      location.reload()
    }
  })
})

// SUBMIT NOTE IN MODAL
$(document).on("click", ".noteSubmit", function(){
  var note = {
    artNum: noteButtonID,
    title: $("#noteTitle").val(),
    body: $("#noteBody").val()
  }

  $.post("/api/note", note).then((res) => {
    console.log(res)
      $('#noteModal').modal('toggle');
      location.reload();
    })
  })

// DELETE NOTE 
$(".deleteNote").on("click", function(){
  var thisId = $(this).attr("data-id")
  console.log(thisId)
  $.ajax({
    method: "POST",
    url: "/api/deletenote/" + thisId,
    success: (data) => {
      console.log(data);
      location.reload(); 
    }
  })
})

// DELETE ALL
$(document).on("click", "#delete", () => {
  $.get({
    type: "GET",
    url: "/delete",
    success: (data) => {
      console.log("delete reloading")
      location.reload()
    },
  });
});

// DYNAMICALLY CREATE SUBMIT BUTTON INSIDE MODAL
$(".modalSubmitButtonMaker").on("click", function(){
  noteButtonID = $(this).prev().attr("data-id")
  dynamicModalButton = $("<button>")
  dynamicModalButton.addClass("btn btn-primary noteSubmit")
  dynamicModalButton.text("Submit")
  dynamicModalButton.attr("data-id", noteButtonID)
  dynamicModalButton.appendTo("#dynamicModalButton")
})