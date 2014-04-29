/*****************************************************************************/
/* Index: Event Handlers and Helpers */
/*****************************************************************************/
Template.Index.events({
  /*
   * Example: 
   *  'click .selector': function (e, tmpl) {
   *
   *  }
   */
});

Template.Index.helpers({

});

/*****************************************************************************/
/* Index: Lifecycle Hooks */
/*****************************************************************************/
Template.Index.created = function () {
};

Template.Index.rendered = function () {
  // run the above func every time the user scrolls
  $(window).unbind('scroll');
  $(window).scroll(showMoreCarteleras);
};

Template.Index.destroyed = function () {
};