/*
 * Add query methods like this:
 *  Carteleras.findPublic = function () {
 *    return Carteleras.find({is_public: true});
 *  }
 */

Carteleras.allow({
  insert: function (userId, doc) {
    // the user must be logged in, and the document must be owned by the user
    return (userId && doc.userId === userId);
  },
  update: function (userId, doc, fields, modifier) {
    // can only change your own documents
    return doc.userId === userId;
  },
  remove: function (userId, doc) {
    // can only remove your own documents
    return doc.userId === userId;
  }
});

Carteleras.deny({
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
  "crudCartelera": function(attributes) {
    attributes.updatedAt = new Date().getTime();
    if (attributes._id){
      var cartelera = Carteleras.findOne(attributes._id);
      cartelera = _.extend(_.pick(attributes, 'titulo', 'updatedAt'));
      Carteleras.update( attributes._id, {$set: cartelera});
      return attributes._id;
    }else{

      var cartelera = _.extend(_.pick(attributes, 'titulo', 'updatedAt'), {
        userId: Meteor.userId()
      });
      return Carteleras.insert(cartelera);
    }
  },
  "deleteCartelera": function(id) {
    return Carteleras.remove({ _id: id })
  }
});

Meteor.publish('cartelerasUnAnuncio', function(filter, limit, userId) {
  
  var sub = this, anunciosHandles = [], cartelerasHandle = null;
  function publishAnuncios(cartelera_id) {
    var anunciosCursor = Anuncios.find({cartelera_id: cartelera_id}, {sort: {updatedAt: -1}, limit: 1});
    anunciosHandles[cartelera_id] = Meteor.Collection._publishCursor(anunciosCursor, sub, 'anuncios');
  }

  if (filter){
    filter = filter.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
    filter = { titulo: { $regex : filter, $options:"i" } };
    console.log(filter);
  }else{
    filter = {};
  }

  if (userId && this.userId){
    filter.userId = this.userId;
  }

  cartelerasHandle = Carteleras.find(filter, {limit: limit}).observeChanges({
    added: function(id, cartelera) {
      publishAnuncios(id);
      sub.added('carteleras', id, cartelera);
    },
    changed: function(id, fields) {
      sub.changed('carteleras', id, fields);
    },
    removed: function(id) {
      // stop observing changes on the post's comments
      anunciosHandles[id] && anunciosHandles[id].stop();
      // delete the post
      sub.removed('carteleras', id);
    }
  });

  sub.ready();

  // make sure we clean everything up (note `_publishCursor`
  //   does this for us with the comment observers)
  sub.onStop(function() { cartelerasHandle.stop(); });
});

Meteor.publish('cartelerasByIdWithAnuncios', function(id, filter, limit) {
  var self = this;
  var count = 0;
  var initializing = true;
  var cartelera_id = id;
  if (filter){
    filter = filter.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
    filter = { titulo: { $regex : filter, $options:"i" }, cartelera_id : id };
  }else{
    filter = { cartelera_id : id };
  }

  // observeChanges only returns after the initial `added` callbacks
  // have run. Until then, we don't want to send a lot of
  // `self.changed()` messages - hence tracking the
  // `initializing` state.
  var handle = Anuncios.find(filter).observeChanges({
    added: function (id) {
      count++;
      if (!initializing)
        self.changed("counts", "cartelera_"+cartelera_id, {count: count});
    },
    removed: function (id) {
      count--;
      self.changed("counts", "cartelera_"+cartelera_id, {count: count});
    }
    // don't care about changed
  });

  // Instead, we'll send one `self.added()` message right after
  // observeChanges has returned, and mark the subscription as
  // ready.
  initializing = false;
  self.added("counts", "cartelera_"+cartelera_id, {count: count});
  self.ready();

  // Stop observing the cursor when client unsubs.
  // Stopping a subscription automatically takes
  // care of sending the client any removed messages.
  self.onStop(function () {
    handle.stop();
  });

  return [Carteleras.find({ _id : id }), Anuncios.find(filter, {limit: limit})]; 
});

// server: publish the current size of a collection
Meteor.publish("cartelerasCount", function (filter, userId) {
  var self = this;
  var count = 0;
  var initializing = true;

  if (filter){
    filter = filter.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
    filter = { titulo: { $regex : filter, $options:"i" } };
  }else{
    filter = {};
  }

  if (userId && this.userId){
    filter.userId = this.userId;
  }

  // observeChanges only returns after the initial `added` callbacks
  // have run. Until then, we don't want to send a lot of
  // `self.changed()` messages - hence tracking the
  // `initializing` state.
  var handle = Carteleras.find(filter).observeChanges({
    added: function (id) {
      count++;
      if (!initializing)
        self.changed("counts", "carteleras", {count: count});
    },
    removed: function (id) {
      count--;
      self.changed("counts", "carteleras", {count: count});
    }
    // don't care about changed
  });

  // Instead, we'll send one `self.added()` message right after
  // observeChanges has returned, and mark the subscription as
  // ready.
  initializing = false;
  self.added("counts", "carteleras", {count: count});
  self.ready();

  // Stop observing the cursor when client unsubs.
  // Stopping a subscription automatically takes
  // care of sending the client any removed messages.
  self.onStop(function () {
    handle.stop();
  });
});