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
									"<div class='logo'><h1>BlogBone<h1></div>"+
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

var AppRouter = Backbone.Router.extend({
	routes: {
		":id" : "detail",
		'': 'index'
	},
	index: function(){
		$('content').html('');
		bloglistsnapshot.render();
	},
	template: _.template(	'<div class="snapshot detail">'+
												'<a href="#<%= id %>"><%= subject%></a>'+
												'<article><%= body %></article>'+
												'<p>By <%= author %> on <%= timestamp %></p>'+
												'</div>'),
	detail: function(id){
		var blog = bloglist.at(id);
		var attributes = blog.toJSON();
		var html = this.template(attributes);
		$('content').html(html);
	}
});

appRouter = new AppRouter();
Backbone.history.start();
