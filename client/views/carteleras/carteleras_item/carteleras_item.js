/*****************************************************************************/
/* CartelerasItem: Event Handlers and Helpers */
/*****************************************************************************/
Template.CartelerasItem.events({
  'click .btnDeleteCartelera': function (e, tmpl) {
    e.preventDefault();
    Meteor.call('deleteCartelera', this._id, function(error, id) {
      if (error)
        return alert(error.reason);
    });
  }
});

Template.CartelerasItem.helpers({
  ultimoAnuncio: function(){
    return Anuncios.findOne({cartelera_id: this._id});
  },
  autor: function(){
    return Meteor.users.findOne({_id : this.userId});
  }
});

/*****************************************************************************/
/* CartelerasItem: Lifecycle Hooks */
/*****************************************************************************/
Template.CartelerasItem.created = function () {
};

Template.CartelerasItem.rendered = function () {
  this.$('.qrcode').qrcode({width: 130,height: 130, text: this.data._id});
};

Template.CartelerasItem.destroyed = function () {
};