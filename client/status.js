Meteor.startup(function () {
  Meteor.setInterval(function() {
    if (Meteor.status().connected) {
      Meteor.call('keepalive');
    }
  }, 1000*3);
});

Viewers = new Meteor.Collection("viewers");

Meteor.autosubscribe(function() {
  Meteor.subscribe("current-viewers");
});

Template.status.viewersCount = function() {
  return Viewers.find().count();
};
