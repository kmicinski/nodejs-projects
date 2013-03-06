/*
 * Papers server, serves papers from directory and instructs them to
 * be opened up in Skim, with options as to the page ID, etc...
 */

var http = require("http"),
url = require("url"),
path = require("path"),
fs = require("fs"),
applescript = require("applescript");
basedir = process.argv[2] || process.cwd();
port = process.argv[3] || 8888;

var generateAppleScript = function(document, noteId) {
    return "tell application \"Skim\"\n"
	+ "\tactivate\n"
	+ "\topen \"" + document + "\"\n"
	+ "\ttell document 1\n" 
	+ "\t\tgo to note " + noteId + "\n"
	+ "\tend tell\n"
	+ "end tell\n";
}

var goToNote = function(document,noteId) {
    applescript.execString(generateAppleScript(document,noteId), function(err,rtn) {
	if (err) {
	    console.log("Error: could not open " + document + " to page " + noteId);
	}
    });
}

http.createServer(function(request, response) {
    var uri = url.parse(request.url).pathname
    , filename = path.join(process.cwd(), uri);
    var query = url.parse(request.url,true).query
    var filename = path.join(basedir, uri);
    var note = query.note;
    if (typeof note === "undefined") {
	note = "1";
    }
    
    path.exists(filename, function(exists) {
	if(!exists) {
	    response.writeHead(404, {"Content-Type": "text/plain"});
	    response.write("404 Not Found\n");
	    response.end();
	    return;
	}
	if (fs.statSync(filename).isDirectory()) {
	    response.writeHead(500, {"Content-Type": "text/html"});
	    response.write("<html><ul>");
	    fs.readdir(filename, function(err,files) {
		files.forEach(function (item) {
		    response.write("<li><a href=\"" + item + "\">" + item + "</a>\n");
		});
		response.write("</ul></html>");
		response.end()});
	} else {
	    response.writeHead(500, {"Content-Type": "text/plain"});
	    response.write("opening " + filename + " to note " + query.note);
	    goToNote(filename, note);
	}});}).listen(parseInt(port, 10));

console.log("Static file server running at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown");
