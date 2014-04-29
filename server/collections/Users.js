Meteor.publish('allUsers', function(){
  Meteor.users.find({}, {fields: {'username': true}});
});