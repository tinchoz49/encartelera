Template.CartelerasShow.helpers({
  anuncios: function(){
    var filter = Session.get('filter') ? Session.get('filter') : '';
    filter = filter.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
    return Anuncios.find({ cartelera_id: this._id, titulo: { $regex : filter, $options:"i" } }, {sort: {updated_at: -1} });
  }
});

Template.CartelerasShow.events({
  'click #btnGuardarCartelera': function(e) {
    e.preventDefault();

    var cartelera;
    if (this.is_new){
      cartelera = {titulo: $('[name=titulo]').val()};
    }else{
      cartelera = this;
      cartelera.titulo = $('[name=titulo]').val();
    }
    
    Meteor.call('crudCartelera', cartelera, function(error, id) {
      if (error)
        return alert(error.reason);
      Router.go('carteleras.user');
    });
  }
});

/*****************************************************************************/
/* CartelerasShow: Lifecycle Hooks */
/*****************************************************************************/
Template.CartelerasShow.created = function () {
};

Template.CartelerasShow.rendered = function () {
  // run the above func every time the user scrolls
  $(window).unbind('scroll');
  $(window).scroll(showMoreAnuncios);
};

Template.CartelerasShow.destroyed = function () {
};