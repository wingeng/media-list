$(document).ready (function() {

    // Bring the cursor back to the 'isbn' text box
    function focus_on_isbn() {
	$("#isbn-text").focus()
	setTimeout(focus_on_isbn, 2000);
    }

    // Initial set of focus, soon as page gets up
    focus_on_isbn()


    // Submit of find
    $("#find-form").submit(function() {
	event.preventDefault();
	var values = $(this).serialize()

	$.ajax( { url: "/scanner",
		  type: "post",
		  data: values,
		  success: function(data) {
		      $("#output-title").html(data);
		  },
		  error: function() {
		      alert("failure")
		  }
		})
    })
})




