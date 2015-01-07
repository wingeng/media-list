var audio_ctx
var current_sort = "timestamp"
var current_desc = "desc"
var focus_on

function beep (duration, type, continue_function) {

    if (typeof continue_function != "function") {
	continue_function = function () {};
    }

    duration = +duration;

    // Only 0-4 are valid types.
    type = (type % 5) || 0;

    var osc = audio_ctx.createOscillator();

    osc.type = type;

    osc.connect(audio_ctx.destination);
    osc.noteOn(0);

    setTimeout(function () {
	osc.noteOff(0);
	continue_function()
    }, duration);
}

function beep_beep (duration, type, count) {
    beep(duration, type, function () {
	if (count > 1) {
	    setTimeout(function () {
		beep_beep(duration, type, count - 1 )
	    }, 70)
	}
    })
}

function redisplay_media_list () {
    var list_name = $("#list-names-id").val();

    $.getJSON("/isbn-list-in-media", {sort: current_sort, desc: current_desc, list_name: list_name})
	.done(function(data) {
	    set_media_list_from_json(data)
	    $("#media-isbn-text").select()
	})
	.fail(function() {
	    console.log("error fetching");
	})
}

function redisplay_name_list () {
    $.getJSON("/list-names", {})
	.done(function(data) {
	    set_list_names_from_json(data)
	})
	.fail(function() {
	    console.log("error fetching");
	})


    $("#list-names-id").change(function() {
	redisplay_media_list()
	var list_name = $("#list-names-id").val();
	$('#tcpl-list').attr('href', '/tcpl-list.html?list_name=' + list_name)
    })


}

function toggle_to_tcpl (isbn) {
    $.ajax( {
	type: "POST",
	url: "/toggle-to-tcpl",
	dataType:"json",
	data: { isbn: isbn },
	success: function (data) {
	    console.log("json reterun " + data.return_code);
	    redisplay_media_list()
	}
    })
}

function delete_isbn (isbn) {
    $.ajax( {
	type: "POST",
	url: "/delete-media",
	dataType:"json",
	data: { isbn: isbn },
	success: function (data) {
	    console.log("json returned " + data);
	    redisplay_media_list();
	}
    })
}

function set_list_names_from_json (data) {
    var list_names = $("#list-names-id")

    var all_list = ""
    data.forEach(function(item) {
	all_list +=  '  <option value="' + item.list_name +'" '
	if (item.current != 0) {
	    all_list += ' selected'
	}
	all_list += '>'
	all_list += item.list_name
	all_list += '</option>\n'
    })

    list_names.html(all_list)
}

function set_media_list_from_json (data) {
    var media_list = $("#media-list")

    var all_list = ""
    data.forEach(function(item) {
	if (item.to_tcpl) {
	    tcpl_checked = " checked "
	} else {
	    tcpl_checked =  ""
	}

	item_str =  "<li>\n"

	item_str += '<input class="tcpl-check" type="checkbox" isbn="' + item.isbn + '" '
	item_str += tcpl_checked + ' class="pull-left">\n'

	item_str += ' <h3 class="lesser title">' + item.title + '</h3>\n'
	item_str += ' <a ' + 'isbn="' + item.isbn + '" '
	item_str += 'class="flags badge pull-right glyphicon glyphicon-trash media-delete" > </a>\n'
	item_str += ' <br>\n'
	item_str += ' <div class="lesser author">' + item.author + '</div>\n'
	item_str += ' <div class="lesser date">' + item.date_of_publication + '</div>\n'
	item_str += ' <div class="lesser">' + item.binding + '</div>\n'
	item_str += ' <div class="lesser">' + item.list_name + '</div>\n'
	item_str += ' <div class="lesser isbn">' + item.isbn + '</div>\n'

	item_str += "</li>\n"

	all_list += item_str
    })

    media_list.html(all_list)

    $(".media-delete").click(function(e) {
	console.log("clicked on : " + $(this).attr("isbn"))
	delete_isbn($(this).attr("isbn"))
    })

    $(".tcpl-btn").click(function(e) {
	console.log("toggle tcpl on : " + $(this).attr("isbn"))
	toggle_to_tcpl($(this).attr("isbn"))
    })

    var options = {
	valueNames: [ 'author', 'title', 'date' ]
    };

}

function add_media_isbn () {
    console.log($("#media-isbn-text").val());

    // Reset the error message
    $("#error-message").html("");

    var isbn = $("#media-isbn-text").val();
    var list_name = $("#list-names-id").val();
    if (list_name == "all") {
	alert("Can not add to 'all' list-name")
    } else {
	$.ajax( {
	    type: "POST",
	    url: "/isbn-insert-media",
	    dataType:"json",
	    data: { isbn: isbn, list_name: list_name },
	    success: function (data) {
		console.log("json reterun " + data);
		console.log("return-code: " + data["return-code"]);
		if (data["return-code"] == false) {

		    $("#error-message").html("Couldn't find: " + isbn);
		    beep_beep(50, 3, 2)

		} else {
		    beep_beep(50, 3, 1)
		}
		redisplay_media_list();
	    }
	})
    }
}


$(document).ready(function () {
    var options = {
	valueNames: [ 'author', 'title', 'date' ]
    };


    $(".sort").click(function (e) {
	console.log("current " + current_sort + " " + this.getAttribute("column") + " " +
		   this.getAttribute("desc"))
	if (this.getAttribute("column") == current_sort) {
	    console.log("same ")
	    if (this.getAttribute("desc") == "") {
		this.setAttribute("desc", "desc")
	    } else {
		this.setAttribute("desc", "")
	    }
	}
	current_sort = this.getAttribute("column")
	current_desc = this.getAttribute("desc")
	console.log("xx " + current_sort + " " + current_desc);

	redisplay_media_list()
    })

    $("#butid").click(function() {
	event.preventDefault;
    })

    // Handle the return key on isbn: text field
    $("#media-isbn-text").keyup(function(e) {
	if (e.keyCode == 13) {
	    add_media_isbn()
	}
    })

    $("#clear-list-btn").click(function() {
	if (confirm("Clear entire media-list?")) {
	    delete_isbn("all")
	}
    })

    // populate the media-list
    redisplay_media_list();
    
    redisplay_name_list();

    // Change the focus to the media-list-text field
    set_focus_timer()

    function set_focus_timer () {
	if (focus_on != undefined) {
	    $(focus_on).focus(function() {
		this.select();
	    })
	}

	text_timeout = setTimeout(set_focus_timer, 2000)
    }

    $('#tabs a[href="#media-list-tab"]').click(function(e) {
	focus_on = $("#media-isbn-text")
    })
    $('#tabs a[href="#scan-tab"]').click(function(e) {
	focus_on = $("#isbn-text")
    })

    // Add the ISBN to the media list and refresh the
    // list
    $("#add-media-btn").click(function() {
	event.preventDefault;
	add_media_isbn()
    })

    audio_ctx = new(window.audioContext || window.webkitAudioContext);
})
