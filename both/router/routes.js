Router.configure({
  layoutTemplate: 'MasterLayout',
  templateNameConverter: 'upperCamelCase',
  routeControllerNameConverter: 'upperCamelCase'
});

var requireLogin = function() {
  if (! Meteor.user()) {
    if (Meteor.loggingIn()){
      this.render(this.loadingTemplate);
    }
    else{
      Router.go('/');
    }
    this.stop();
  }
};


Router.map(function () {
  /*
    Example:
      this.route('home', {path: '/'});
  */
  this.route('index', {
    path: '/',
    waitOn: function() {
      if (Meteor.isClient){
        return (Meteor.subscribe('cartelerasUnAnuncio', Session.get('filter'), Session.get('limit_carteleras')) && 
          Meteor.subscribe('cartelerasCount', Session.get('filter')));
      }
    },
    data: function(){
      return { carteleras: Carteleras.find({}, {sort: {updatedAt: 1}}) };
    },
    fastRender: true
  });
  this.route('carteleras.show', {
    path: '/carteleras/ver/:_id',
    onBeforeAction: function(){
      if (Meteor.isClient){
        Session.set('cartelera_id', this.params._id);
      }
    },
    waitOn: function() {
      if (Meteor.isClient){
        return Meteor.subscribe('cartelerasByIdWithAnuncios', this.params._id, Session.get('filter'), Session.get('limit_anuncios'));
      }
    },
    data: function(){
      return Carteleras.findOne();
    },
    onStop: function () {
      // This is called when you navigate to a new route
      if (Meteor.isClient){
        Session.set('cartelera_id', null);
      }
    },
    fastRender: true
  });
  this.route('carteleras.new', {
    path: '/carteleras/crear/',
    template: 'CartelerasShow',
    onBeforeAction: requireLogin,
    data: function(){
      return {is_new: true};
    },
    fastRender: true
  });

  this.route('anuncios.show', {
    path: '/anuncios/ver/:_id',
    waitOn: function() { 
      return Meteor.subscribe('anunciosById', this.params._id);
    },
    data: function(){
      return Anuncios.findOne();
    },
    fastRender: true
  });
  this.route('anuncios.new', {
    path: '/anuncios/crear/:cartelera_id',
    template: 'AnunciosShow',
    onBeforeAction: requireLogin,
    waitOn: function() {
      if (Meteor.isClient){
        return Meteor.subscribe('cartelerasByIdWithAnuncios', this.params.cartelera_id);
      }
    },
    data: function(){
      return {'is_new': true, 'cartelera_id' : this.params.cartelera_id};
    },
    fastRender: true
  });



  this.route('carteleras.user', {
    path: '/misCarteleras/',
    onBeforeAction: requireLogin,
    template: 'Index',
    waitOn: function() {
      if (Meteor.isClient){
        return (Meteor.subscribe('cartelerasUnAnuncio', Session.get('filter'), Session.get('limit_carteleras'), true)  && 
          Meteor.subscribe('cartelerasCount', Session.get('filter'), true));
      }
    },
    data: function(){
      return { carteleras: Carteleras.find({}, {sort: {updatedAt: 1}}) };
    },
    fastRender: true
  });

  // catch all route for unhandled routes 
  this.route("notfound", {
    path:"*",
    action: function () {
      Router.go('/');
    },
    fastRender: true
  });
});
