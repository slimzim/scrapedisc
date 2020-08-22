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
  // alert("Article saved!")
  // For When Toast Works
  $(".toast").toast("show") 
})

$(".unsave-button").on("click", function(){
  var thisId = $(this).attr("data-id")
  $.ajax({
    method: "POST",
    url: "api/unsave/" + thisId,
    success: (data) => {
      console.log(data);
      location.reload(); 
    }
  })
})

$(".noteSubmit").on("click", function(){
  var note = {
    artNum: $(this).attr("data-id"),
  }

  console.log(note.artNum)

    note.title = $("#noteTitle").val();
    note.body = $("#noteBody").val();

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