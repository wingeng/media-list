$(document).ready(function() {
    $("#b1").click( function () {
	$("#b1-out").html('<img src="spinner.gif">').load("/time")
    })

    $("#scanner").submit( function () {
	event.preventDefault();
	var values = $(this).serialize()

	$.ajax( { url: "/scanner",
		  type: "post",
		  data: values,
		  success: function(data) {
		      $("#scanner-output").html(data);
		  },
		  error: function() {
		      alert("failure")
		  }
		})
    })
})