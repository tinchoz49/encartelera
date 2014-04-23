/*****************************************************************************/
/* Client App Namespace  */
/*****************************************************************************/
_.extend(App, {
});

App.helpers = {
  'formatDate': function(date){
    return moment(date).lang('es').fromNow();
  } 
};

_.each(App.helpers, function (helper, key) {
  Handlebars.registerHelper(key, helper);
});