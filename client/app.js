/*****************************************************************************/
/* Client App Namespace  */
/*****************************************************************************/
_.extend(App, {
});

App.helpers = {
  'formatDate': function(date){
    return moment(date).lang('es').fromNow();
  },
  'short': function(str){
    if (str.length > 200){
      return str.substring(0, 200)+'...';
    }
    return str;
  },
  'own': function() {
    var cartelera;
    if (this.cartelera_id){
      cartelera = Carteleras.findOne({_id: this.cartelera_id});
    }else{
      cartelera = this;
    }
    return ((cartelera.userId === Meteor.userId()) || (this.is_new !== undefined));
  }
};

_.each(App.helpers, function (helper, key) {
  Handlebars.registerHelper(key, helper);
});

Accounts.ui.config({
  passwordSignupFields: 'USERNAME_AND_OPTIONAL_EMAIL'
});

ITEMS_CARTELERAS_INCREMENT = 2;
Session.setDefault('limit_carteleras', ITEMS_CARTELERAS_INCREMENT);
ITEMS_ANUNCIOS_INCREMENT = 2;
Session.setDefault('limit_anuncios', ITEMS_ANUNCIOS_INCREMENT);

showMoreCarteleras = function() {
    var threshold, target = $('#footer');
    if (!target.length) return;
 
    threshold = $(window).scrollTop() + $(window).height();
 
    if ((target.offset().top < threshold) && (Counts.findOne("carteleras") && Session.get('limit_carteleras') < Counts.findOne("carteleras").count)) {
      Session.set('limit_carteleras', Session.get('limit_carteleras') + ITEMS_CARTELERAS_INCREMENT);
    }
}

showMoreAnuncios = function() {
    var threshold, target = $('#footer');
    if (!target.length) return;
 
    threshold = $(window).scrollTop() + $(window).height();
 
    if ((target.offset().top < threshold) && (Counts.findOne("cartelera_"+Session.get('cartelera_id')) && Session.get('limit_anuncios') < Counts.findOne("cartelera_"+Session.get('cartelera_id')).count)) {
      Session.set('limit_anuncios', Session.get('limit_anuncios') + ITEMS_ANUNCIOS_INCREMENT);
    }
}