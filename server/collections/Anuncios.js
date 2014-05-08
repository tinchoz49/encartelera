/*
 * Add query methods like this:
 *  Carteleras.findPublic = function () {
 *    return Carteleras.find({is_public: true});
 *  }
 */

Anuncios.allow({
  insert: function (userId, doc) {
    // the user must be logged in, and the document must be owned by the user
    var cartelera = Carteleras.findOne({ _id : doc.cartelera_id });
    return (userId && cartelera.userId === userId);
  },
  update: function (userId, doc, fields, modifier) {
    // can only change your own documents
    var cartelera = Carteleras.findOne({ _id : doc.cartelera_id });
    return cartelera.userId === userId;
  },
  remove: function (userId, doc) {
    // can only remove your own documents
    var cartelera = Carteleras.findOne({ _id : doc.cartelera_id });
    return cartelera.userId === userId;
  }
});

Anuncios.deny({
  insert: function (userId, doc) {
    return false;
  },

  update: function (userId, doc, fieldNames, modifier) {
    return false;
  },

  remove: function (userId, doc) {
    return false;
  }
});


Meteor.methods({
  "crudAnuncio": function(attributes) {
    attributes.updatedAt = new Date().getTime();
    if (attributes._id){
      var anuncios = Anuncios.findOne(attributes._id);
      anuncio = _.pick(attributes, 'titulo', 'contenido', 'updatedAt');
      Anuncios.update( attributes._id, {$set: anuncio});
      return attributes._id;
    }else{
      anuncio = _.pick(attributes, 'titulo', 'contenido', 'cartelera_id', 'updatedAt');
      return Anuncios.insert(anuncio);
    }
  },
  "deleteAnuncio": function(id) {
    return Anuncios.remove({ _id: id })
  }
});

Meteor.publish('anunciosById', function(id) {
  var cartelera_id = Anuncios.findOne(id).cartelera_id;
  return [ Anuncios.find({_id: id}, {limit: 1}), Carteleras.find({ _id : cartelera_id }) ];
});