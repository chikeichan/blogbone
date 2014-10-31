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
	comparator: 'fullName'
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

//testing article!
var bloglist = new BlogList([{
	author: 'Jacky',
	subject: 'Virgin Galactic Crashed',
	body: 'Virigin Galactic\'s SpaceShipTwo rocket plane exploded and crashed during a test flight on Friday, killing one crew member and seriously injuring another, authorities said.', 
	timestamp: '10/31/2014',
	id: 0
},{
	author: 'Jacky',
	subject: 'Virgin Galactic Crashed',
	body: 'Virigin Galactic\'s SpaceShipTwo rocket plane exploded and crashed during a test flight on Friday, killing one crew member and seriously injuring another, authorities said.', 
	timestamp: '10/31/2014',
	id: 1
},{
	author: 'Jacky',
	subject: 'Virgin Galactic Crashed',
	body: 'Virigin Galactic\'s SpaceShipTwo rocket plane exploded and crashed during a test flight on Friday, killing one crew member and seriously injuring another, authorities said.', 
	timestamp: '10/31/2014',
	id:2
},{
	author: 'Jacky',
	subject: 'Virgin Galactic Crashed',
	body: 'Virigin Galactic\'s SpaceShipTwo rocket plane exploded and crashed during a test flight on Friday, killing one crew member and seriously injuring another, authorities said.', 
	timestamp: '10/31/2014',
	id:3
}]);
var bloglistsnapshot = new BlogListSnapShot({collection: bloglist});
bloglistsnapshot.render();
//================================================================

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
	highlighted: function(x){
		$(x.currentTarget).toggleClass('highlighted');
	}
}));
