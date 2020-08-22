var noteButtonID = ""
var dynamicModalButton = ""

$(".scrape").on("click", () => {
  console.log("scrape button")
  $.get({
    type: "GET",
    url: "/api/scrape",
    success: (data) => {
      console.log(data);
      location.reload();   
    }
  })
})

$(".save-button").on("click", function(){
  var thisId = $(this).attr("data-id")
  $.ajax({
    method: "POST",
    url: "api/save/" + thisId
  })
  alert("Article saved!")
})

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

$(".modalSubmitButtonMaker").on("click", function(){
  noteButtonID = $(this).prev().attr("data-id")
  dynamicModalButton = $("<button>")
  dynamicModalButton.addClass("btn btn-primary noteSubmit")
  dynamicModalButton.text("Submit")
  dynamicModalButton.attr("data-id", noteButtonID)
  dynamicModalButton.appendTo("#dynamicModalButton")
})