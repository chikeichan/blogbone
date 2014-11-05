//app.js
var BlogModel = Backbone.Model.extend({
	default: {
		author: '',
		subject: '',
		body: '',
		timestamp: ''
	},
	validate: function(attributes){
		if (!attributes.author || !attributes.subject || !attributes.body){
			return 'Please fill out all fields';
		}
	},
	initialize: function(){
		this.on('invalid', function(model,error){
			alert(error);
		})
	}
});

var BlogList = Backbone.Collection.extend({
	model: BlogModel,
	url: "/blogs",
	initialize: function(){
		this.fetch({reset: true});

		this.on('reset',function(){
			var bloglistsnapshot = new BlogListSnapShot({collection: bloglist});
			bloglistsnapshot.render();
		})

		this.on('add',function(blog){
			if (blog.isValid()){
				blog.save();
				bloglistsnapshot.addOne(blog);
				creatorView.discard();
				headerView.highlighted();
			} else {
				blog.destroy();
			}
		});
	}
});

var BlogSnapShot = Backbone.View.extend({
	el: $('content'),
	template: _.template(	'<div class="snapshot">'+
												'<a href="#<%= cid %>"><%= subject%></a>'+
												'<article><%= body %></article>'+
												'<p>By <%= author %> on <%= timestamp %></p>'+
												'</div>'),
	render: function(){
		var attribute = this.model.toJSON();
		attribute.cid = this.model.cid;
		var html = this.template(attribute);
		this.$el.append(html);
	}
});

var BlogListSnapShot = Backbone.View.extend({
	render: function(){
		$('content').html('');
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
		'click img': 'highlighted',
		'keypress input': 'search'
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
	},
	search:function(e){
		var query;
		if(e.keyCode === 13) {
			query = $('header input').val();
		}

		if(query){
			appRouter.navigate('#search/'+query.replace(' ', '+'), true);
			$('header input').val('');
		}
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
		$('input').val('');
		$('textarea').val('');
	},
	submit: function(){
		var blog = {
			author: $('input[name="author"]').val(),
			subject: $('input[name="subject"]').val(),
			body: $('textarea').val(),
			timestamp: Date().slice(4,15)
		};
		this.collection.add(blog);
	}
}));

var DetailView = new (Backbone.View.extend({
	el: $('content'),
	template: _.template(	'<div class="snapshot detail">'+
												'<h2><%= subject%></h2>'+
												'<a href="#<%= author %>"><p><%= author %></p></a>'+
												'<img id="delete" src="./style/clear5.png" />'+
												'<a href="#edit/<%= cid %>"><img id="edit" src="./style/create3.png" /></a>'+
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
		var blog = bloglist.get(id)
		this.model = blog;
		var attributes = blog.toJSON();
		attributes.cid = blog.cid;
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
												'<a href="#<%= cid %>"><img id="reject" src="./style/clear5.png" /></a>'+
												'<img id="accept" src="./style/check52.png" />'+
												"Author: <input type='text' name='author' value='<%= author %>''><br>"+
												"Subject: <input type='text' name='subject' value='<%= subject %>'><br>"+
												"<br>Article: <br><textarea rows='13' cols='100'><%= body %></textarea>"+
												'</div>'),
	events: {
		'mouseenter img': 'highlight',
		'mouseleave img': 'nohighlight',
		'click #accept' : 'accept'
	},
	highlight: function(x){
		$(x.currentTarget).addClass('highlight');
	},
	nohighlight: function(x){
		$(x.currentTarget).removeClass('highlight');
	},
	render: function(id){
		this.model = bloglist.get(id);
		var attributes = this.model.toJSON();
		attributes.cid = this.model.cid
		var html = this.template(attributes);
		this.$el.html(html);
	},
	accept: function(){
		var blog = {
			author: $('.editing>input[name="author"]').val(),
			subject: $('.editing >input[name="subject"]').val(),
			body: $('.editing>textarea').val(),
			timestamp: Date().slice(4,15)
		};
		this.model.set(blog);
		if (this.model.isValid()){
			this.model.save();
			appRouter.navigate(this.model.id, true);
		}

	}
}))

var AppRouter = Backbone.Router.extend({
	routes: {
		":id" : "detail",
		"edit/:id": 'edit',
		"search/:query": 'search',
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
	},
	search: function(query){
		query = query.replace('+', ' ').toLowerCase();
		var results =[];
		_.each(bloglist.models, function(blog){
			_.each(blog.attributes, function(values){
				if(values.toLowerCase().match(query)){
					results.push(blog);
				}
			})
		})

		results = _.uniq(results)
		$('content').html('<p id="seach">Searching...</p>')
		setTimeout(function(){
			if(results.length>0){
				results = new BlogListSnapShot({collection: results});
				results.render();
			} else {
				$('content').html('<p id="seach">No results</p>')
			}
		},250);
	}
});

appRouter = new AppRouter();
Backbone.history.start();
