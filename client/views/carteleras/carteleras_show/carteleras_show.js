Template.CartelerasShow.helpers({
  anuncios: function(){
    var filter = Session.get('filter') ? Session.get('filter') : '';
    filter = filter.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
    return Anuncios.find({ cartelera_id: this._id, titulo: { $regex : filter, $options:"i" } }, {sort: {updatedAt: -1} });
  },
  "quedanAnuncios" : function (){
    return (Counts.findOne("cartelera_"+Session.get('cartelera_id')) && Session.get('limit_anuncios') < Counts.findOne("cartelera_"+Session.get('cartelera_id')).count) ? "display: auto;" : "display: none;";
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
  },
  'click #masAnuncios' : function (e, tmpl){
    e.preventDefault();
    Session.set('limit_anuncios', Session.get('limit_anuncios') + ITEMS_ANUNCIOS_INCREMENT);
  }
});

/*****************************************************************************/
/* CartelerasShow: Lifecycle Hooks */
/*****************************************************************************/
Template.CartelerasShow.created = function () {
};

Template.CartelerasShow.rendered = function () {
  // run the above func every time the user scrolls
};

Template.CartelerasShow.destroyed = function () {
};