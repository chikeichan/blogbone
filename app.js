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

var BlogsList = Backbone.Collection.extend({
	model: BlogModel,
	localStorage: new Backbone.LocalStorage('blogboneDB'),
	comparator: 'fullName'
});

var BlogView = Backbone.View.extend({
	el: $('content'),
	template: _.template(	'<div class="snapshot">'+
												'<a href=""><%= subject%></a>'+
												'<article><%= body %></article>'+
												'<p>By <%= author %> on <%= timestamp %></p>'+
												'</div>'),
	render: function(){
		var attribute = this.model.toJSON();
		var html = this.template(attribute);
		this.$el.append(html);
	}
});

var blog = new BlogModel({author: 'Jacky',subject: 'Virgin Galactic Crashed', body: 'Virigin Galactic\'s SpaceShipTwo rocket plane exploded and crashed during a test flight on Friday, killing one crew member and seriously injuring another, authorities said.', timestamp: '10/31/2014'})
var blogview = new BlogView({model: blog})
blogview.render();

var headerView = new(Backbone.View.extend({
	el: $('header'),
	initialize: function(){
		this.render();
	},
	render: function(){
		this.$el.html("<div class='icon'></div>"+
									"<div class='logo'><h1>BlogBone<h1></div>"+
									"<input type='text' placeholder='Search'>"+
									"<div class='menu'></div>");
	}
}));
