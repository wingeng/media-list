var focus_on

function redisplay_name_list () {
    $.getJSON("/list-names", {})
	.done(function(data) {
	    set_name_list_from_json(data)
	    $("#list-name-id").select()
	})
	.fail(function() {
	    console.log("error fetching");
	})
}

function delete_name_list (name) {
    $.ajax( {
	type: "POST",
	url: "/name-list-delete",
	dataType:"json",
	data: { list_name: name },
	success: function (data) {
	    console.log("json returned " + data);
	    redisplay_name_list();
	},
	error: function() {
	    alert("failure")
	}
	
    })
}

function set_name_list_from_json (data) {
    var list_names = $("#list-names-list")

    var all_list = ""
    data.forEach(function(item) {
	if (item.list_name != "all") {
	    var item_str = '<li>\n'

	    item_str += '  <h3  class="lesser name">' + item.list_name + '</h3>\n'
	    item_str += '  <a id="butid" list_name="' + item.list_name + '" '
	    item_str += ' class="flags badge pull-right glyphicon glyphicon-trash list-name-delete" > </a>\n'
	    item_str += '</li>\n'

	    all_list +=  item_str
	}
    })

    list_names.html(all_list)

    $(".list-name-delete").click(function(e) {
	console.log("clicked on : " + $(this).attr("list_name"))
	delete_name_list($(this).attr("list_name"))
    })

}

function add_name_list () {
    // Reset the error message
    $("#error-message").html("");

    var list_name = $("#list-name-text").val();
    $.ajax( {
	type: "POST",
	url: "/name-list-insert",
	dataType:"json",
	data: { list_name: list_name },
	success: function (data) {
	    console.log("json return " + data);
	    console.log("return-code: " + data["return-code"]);
	    if (data["return-code"] == false) {

		$("#error-message").html("Couldn't find: " + isbn);
	    } 
	    redisplay_name_list();
	},
	error: function() {
	    alert("failure")
	}

    })

}

$(document).ready(function () {
    $("#butid").click(function() {
	event.preventDefault;
    })

    // Handle the return key on isbn: text field
    $("#list-name-text").keyup(function(e) {
	if (e.keyCode == 13) {
	    add_name_list()
	}
    })

    redisplay_name_list();

    $("#clear-list-btn").click(function() {
	if (confirm("Clear entire media-list?")) {
	    delete_isbn("all")
	}
    })


    $("#add-list-name-btn").click(function() {
	event.preventDefault;
	add_name_list()
    })
})
