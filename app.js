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
												'<content><h2><%= subject%></h2>'+
												'<article><%= body %></article></content>'+
												'</div>'),
	render: function(){

	}
});



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
