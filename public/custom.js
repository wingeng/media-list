"#amazing".onClick(function(event) {
    event.stop();
    $$('h2')[0].fade();
    $$('h2')[1].fade();
});

"#time".onClick(function(event) {
    event.stop();
    $('msg').load("/time");
});

"#server".onClick(function(event) {
    event.stop();
    $('msg').load("/response");
});

"#reverse".onSubmit(function(event) {
    event.stop();
    this.send({
	onSuccess: function() {
	    $('msg').update(this.responseText);
	}
    });
});
Xhr.Options.spinner = 'spinner';