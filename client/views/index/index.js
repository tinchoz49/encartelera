/*****************************************************************************/
/* Index: Event Handlers and Helpers */
/*****************************************************************************/
Template.Index.events({
  'click #masCarteleras' : function (e, tmpl){
    e.preventDefault();
    Session.set('limit_carteleras', Session.get('limit_carteleras') + ITEMS_CARTELERAS_INCREMENT);
  }
});

Template.Index.helpers({
  "quedanCarteleras" : function (){
    return (Counts.findOne("carteleras") && Session.get('limit_carteleras') < Counts.findOne("carteleras").count) ? "display: auto;" : "display: none;";
  }
});

/*****************************************************************************/
/* Index: Lifecycle Hooks */
/*****************************************************************************/
Template.Index.created = function () {
};

Template.Index.rendered = function () {
  // run the above func every time the user scrolls
};

Template.Index.destroyed = function () {
};