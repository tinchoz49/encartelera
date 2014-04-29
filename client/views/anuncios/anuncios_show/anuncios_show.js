Template.AnunciosShow.helpers({
  cartelera: function(){
    return Carteleras.findOne({ _id : this.cartelera_id });
  }
});

/*****************************************************************************/
/* AnunciosShow: Lifecycle Hooks */
/*****************************************************************************/
Template.AnunciosShow.created = function () {
};

Template.AnunciosShow.rendered = function () {
};

Template.AnunciosShow.destroyed = function () {
};

Template.textarea.rendered = function () {
  this.$('.wysihtml5').wysihtml5();
  
};

Template.AnunciosShow.events({
  'click #btnGuardarAnuncio': function(e) {
    e.preventDefault();

    var anuncio;
    if (this.is_new){
      anuncio = {
        titulo: $('[name=titulo]').val(), 
        contenido: $('[name=contenido]').val(),
        cartelera_id: this.cartelera_id
      };
    }else{
      anuncio = this;
      anuncio.titulo = $('[name=titulo]').val();
      anuncio.contenido = $('[name=contenido]').val();
    }
    
    Meteor.call('crudAnuncio', anuncio, function(error, id) {
      if (error)
        return alert(error.reason);
      Router.go('carteleras.show', {_id: anuncio.cartelera_id});
    });
  },
  'click #btnDeleteAnuncio': function (e, tmpl) {
    e.preventDefault();
    var anuncio = this;
    Meteor.call('deleteAnuncio', this._id, function(error, id) {
      if (error)
        return alert(error.reason);
      Router.go('carteleras.show', {_id: anuncio.cartelera_id});
    });
  }
});