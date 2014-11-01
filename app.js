//app.js
var BlogModel = Backbone.Model.extend({
	default: {
		author: '',
		subject: '',
		body: '',
		timestamp: '',
		id: ''
	}
});

var BlogList = Backbone.Collection.extend({
	model: BlogModel,
	localStorage: new Backbone.LocalStorage('blogboneDB'),
	initialize: function(){
		this.fetch();
		this.on('add',function(blog){
			bloglistsnapshot.addOne(blog);
			blog.save();
		});
	}
});

var BlogSnapShot = Backbone.View.extend({
	el: $('content'),
	template: _.template(	'<div class="snapshot">'+
												'<a href="#<%= id %>"><%= subject%></a>'+
												'<article><%= body %></article>'+
												'<p>By <%= author %> on <%= timestamp %></p>'+
												'</div>'),
	render: function(){
		var attribute = this.model.toJSON();
		var html = this.template(attribute);
		this.$el.append(html);
	}
});

var BlogListSnapShot = Backbone.View.extend({
	render: function(){
		this.collection.forEach(this.addOne,this);
	},
	addOne: function(blog){
		var snapshot = new BlogSnapShot({model: blog});
		snapshot.render();
	}
});
//
var bloglist = new BlogList();
var bloglistsnapshot = new BlogListSnapShot({collection: bloglist});
bloglistsnapshot.render();
//

var headerView = new(Backbone.View.extend({
	el: $('header'),
	initialize: function(){
		this.render();
	},
	render: function(){
		this.$el.html("<div class='icon'></div>"+
									"<div class='logo'><a href='#'><h1>BlogBone<h1></a></div>"+
									"<input type='text' placeholder='Search'>"+
									"<img src='./style/plus-5-256.png' />");
	},
	events: {
		'mouseenter img': 'highlight',
		'mouseleave img': 'nohighlight',
		'click img': 'highlighted'
	},
	highlight: function(x){
		$(x.currentTarget).addClass('highlight');
	},
	nohighlight: function(x){
		$(x.currentTarget).removeClass('highlight');
	},
	highlighted: function(){
		$('img').toggleClass('highlighted');
		creatorView.toggle();
	}
}));

var creatorView = new(Backbone.View.extend({
	collection: bloglist,
	el: $('body'),
	render: function(){
		this.$el.prepend(	"<div class='create'>"+
											"<input type='text' placeholder='Author Name' name='author'>"+
											"<input type='text' placeholder='Subject' name='subject'>"+
											"<textarea rows='13' cols='100' placeholder='Type your article here...'></textarea>"+
											"<img id='submit' src='./style/check52.png' /><img id='discard' src='./style/clear5.png' /></div>");
	},
	events: {
		'click #discard': 'discard',
		'click #submit' : 'submit'
	},
	initialize: function(){
		this.render();
	},
	toggle: function(){
		$('.create').slideToggle('slow');
	},
	discard: function(){
		console.log(this);
		$('input').val('');
		$('textarea').val('');
	},
	submit: function(){
		var blog = {
			author: $('input[name="author"]').val(),
			subject: $('input[name="subject"]').val(),
			body: $('textarea').val(),
			timestamp: Date().slice(4,15),
			id: bloglist.length
		};
		this.collection.add(blog);
		this.discard();
		headerView.highlighted();
	}
}));

var DetailView = new (Backbone.View.extend({
	el: $('content'),
	template: _.template(	'<div class="snapshot detail">'+
												'<h2><%= subject%></h2>'+
												'<a href="#<%= author %>"><p><%= author %></p></a>'+
												'<img id="delete" src="./style/clear5.png" />'+
												'<a href="#edit/<%= id %>"><img id="edit" src="./style/create3.png" /></a>'+
												'<p><%= timestamp %></p>'+
												'<article><%= body %></article>'+
												'</div>'),
	events: {
		'mouseenter img': 'highlight',
		'mouseleave img': 'nohighlight',
		'click #delete' : 'delete'
	},
	highlight: function(x){
		$(x.currentTarget).addClass('highlight');
	},
	nohighlight: function(x){
		$(x.currentTarget).removeClass('highlight');
	},
	render: function(id){
		var blog = bloglist.at(id);
		this.model = blog;
		var attributes = blog.toJSON();
		var html = this.template(attributes);
		$('content').html(html);
	},
	delete: function(){
		var confirm = window.confirm("Do you want to delete this blog post?");
		if(confirm) {
			this.model.destroy();
			appRouter.navigate('',true);
			this.model.save();
		}
	}
}))

var EditView = new (Backbone.View.extend({
	el: $('content'),
	template: _.template( '<div class="snapshot detail editing">'+
												'<img id="reject" src="./style/clear5.png" />'+
												'<img id="accept" src="./style/check52.png" />'+
												"Author: <input type='text' name='author' value=<%= author %>><br>"+
												"Subject: <input type='text' name='subject' value=<%= subject %>><br>"+
												"<br>Article: <br><textarea rows='13' cols='100'><%= body %></textarea>"+
												'</div>'),
	events: {
		'mouseenter img': 'highlight',
		'mouseleave img': 'nohighlight',
	},
	highlight: function(x){
		$(x.currentTarget).addClass('highlight');
	},
	nohighlight: function(x){
		$(x.currentTarget).removeClass('highlight');
	},
	render: function(id){
		var blog = bloglist.at(id);
		this.model = blog;
		var attributes = blog.toJSON();
		var html = this.template(attributes);
		this.$el.html(html);
	}
}))

var AppRouter = Backbone.Router.extend({
	routes: {
		":id" : "detail",
		"edit/:id": 'edit',
		'': 'index'
	},
	index: function(){
		$('content').html('');
		bloglistsnapshot.render();
	},
	detail: function(id){
		DetailView.render(id);
	},
	edit: function(id){
		EditView.render(id);
	}
});

appRouter = new AppRouter();
Backbone.history.start();
