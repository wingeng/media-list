var current_media = "all"
var current_sort = "timestamp"
var current_desc = "desc"

function url_query( query ) {
    query = query.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var expr = "[\\?&]"+query+"=([^&#]*)";
    var regex = new RegExp( expr );
    var results = regex.exec( window.location.href );
    if ( results !== null ) {
        return results[1];
    } else {
        return false;
    }
}

function redisplay_media_list () {
    $(".sort").each(function() {
	console.log("obj name " + $(this).attr("column") + " " + current_sort)
	if ($(this).attr("column") == current_sort) {
	    $(this).addClass("active")
	} else {
	    $(this).removeClass("active")
	}
    })

    var list_name = url_query('list_name')

    $.getJSON("/isbn-list-in-media",
	      {
		  limit_to: current_media,
		  sort: current_sort,
		  desc: current_desc,
		  list_name: list_name
	      })
	.done(function(data) {
	    set_media_list_from_json(data)
	    $("#media-isbn-text").select()
	})
	.fail(function() {
	    console.log("error fetching");
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

function set_media_list_from_json (data) {
    var media_list = $("#media-list")

    all_list = ""
    data.forEach(function(item) {
	if (item.to_tcpl) {
	    tcpl_checked = " checked "
	} else {
	    tcpl_checked =  ""
	}

	date_of_pub = "unkn"
	if (item.date_of_publication) {
	    date_of_pub = item.date_of_publication.split("-")[0]
	}

	item_str =  "<li>\n"

	item_str += '<input class="tcpl-check" type="checkbox" isbn="' + item.isbn + '" '
	item_str += tcpl_checked + ' class="pull-left">\n'

	item_str += ' <h3 class="lesser title">' + item.title + '</h3>\n'

	item_str += ' <div class="lesser author ">' + item.author + '</div>\n'
	item_str += ' <div class="lesser date ">' + date_of_pub + '</div>\n'

	item_str += ' <h3 class="lesser binding">' + item.binding + '</h3>\n'

	item_str += "</li>\n"

	all_list += item_str
    })

    media_list.html(all_list)

    $(".tcpl-check").click(function(e) {
	console.log("toggle tcpl on : " + $(this).attr("isbn"))
	toggle_to_tcpl($(this).attr("isbn"))
	return false
	toggle_to_tcpl($(this).attr("isbn"))
    })
}

$(document).ready(function () {
    redisplay_media_list()

    var list_name = url_query('list_name')
    $('#list-title-id').html(list_name)

    $('.limit').click(function(e) {
	current_media = $(this).attr("media")
	console.log("current_media " + current_media)
	redisplay_media_list()
    })

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
})
