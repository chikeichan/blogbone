var http = require('http');
var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/db2');
var Schema = mongoose.Schema;
var bodyParser = require('body-parser');


var Blog = new Schema({
	author: String,
	subject: String,
	body: String,
	timestamp: String
})

var BlogModel = mongoose.model('Blog', Blog);
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));


//Express: Set Port 
app.set('port', process.env.PORT || 8080);

//Express: use view engine jade as template. Look into /views subfolder
app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'jade');


//Express: serve base route / to localhost8080
app.use(express.static(path.join(__dirname,'/')));


//Express: Create
app.post('/blogs', function (req,res) {
	var blog = new BlogModel({
		author: req.body.author,
		subject: req.body.subject,
		body: req.body.body,
		timestamp: req.body.timestamp
	});
	blog.save(function(err,blog){
		if (err) {
			return console.error(err);
		} else {
			console.log('Successful');
		}
	});

});

//Express: Read
app.get('/blogs', function (req,res) {
	BlogModel.find({}, function(err, blog) {
    res.send(blog);
    console.log(blog.length+' blog');
  });
});

//Express: delete
app.delete('/blogs/:id', function (req,res) {
	BlogModel.remove({_id: req.params.id}, function(err){
		if(err) {
			console.log(err);
		} else {
			console.log('Deleted');
		}
	})
});

/*
BlogModel.find({}, function(err, blog) {
    for(var i=0; i<blog.length; i++){
    	blog[i].remove();
    }
    console.log('delete all');
});
*/

app.use(function(req,res){
	res.render('404',{url: req.url});
})

//Http: create server
http.createServer(app).listen(app.get('port'),function(){
	console.log('Express Server listing on port '+app.get('port'));
});