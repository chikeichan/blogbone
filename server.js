var http = require('http');
var express = require('express');
var path = require('path');

var app = express();

//Express: Set Port 
app.set('port', process.env.PORT || 8080);

//Express: use view engine jade as template. Look into /views subfolder
app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'jade');


//Express: serve base route / to localhost8080
app.use(express.static(path.join(__dirname,'/')));

/*
//Express: Route "/" Handler
app.get('/', function (req, res) {
  res.send('<html><body><h1>Hello My World</h1></body></html>');
});


//Express: Route /hi/every/body will yield a page that says 'hi every body'
app.get('/:a?/:b?/:c?', function (req,res) {
	res.send(req.params.a + ' ' + req.params.b + ' ' + req.params.c);
});
*/
app.use(function(req,res){
	res.render('404',{url: req.url});
})

//Http: create server
http.createServer(app).listen(app.get('port'),function(){
	console.log('Express Server listing on port '+app.get('port'));
});