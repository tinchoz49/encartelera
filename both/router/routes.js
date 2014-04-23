Router.configure({
  layoutTemplate: 'MasterLayout',
  loadingTemplate: 'Loading',
  notFoundTemplate: 'NotFound',
  templateNameConverter: 'upperCamelCase',
  routeControllerNameConverter: 'upperCamelCase'
});

Router.map(function () {
  /*
    Example:
      this.route('home', {path: '/'});
  */
  this.route('carteleras.index', {path: '/'});
  this.route('carteleras.new', {path: '/cartelera/nuevo'});
  this.route('carteleras.detalle', { 
    path: '/cartelera/:_id',
    data: function() { return Carteleras.findOne(this.params._id); }
  });
  this.route('anuncios.detalle', { 
    path: '/anuncio/:_id',
    data: function() { return Anuncios.findOne(this.params._id); }
  });
  this.route('anuncios.new', {
    path: '/anuncio/nuevo/:_id',
    data: function() { return Carteleras.findOne(this.params._id); }
  });
});

var requireLogin = function() {
  if (! Meteor.user()) {
    if (Meteor.loggingIn())
      this.render(this.loadingTemplate);
    else
      this.render('accessDenied');
    this.stop();
  }
};