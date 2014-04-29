Template.Header.events({
  'keyup #filter': function(e) {
    e.preventDefault();
    console.log("Buscando por: "+e.target.value);
    Session.set('filter', e.target.value);
  }
});

Template.Header.helpers({
  'filter': function(){
    return Session.get('filter');
  }
});