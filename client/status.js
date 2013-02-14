Viewers = new Meteor.Collection("viewers");

Meteor.autosubscribe(function() {
  Meteor.subscribe("viewers");
});

var currentViewer = function(){
  return Viewers.findOne(Session.get("viewerId")) || {};
};

var currentLeader = function() {
  return Viewers.findOne({ leader: true }, { sort: { slideTime: -1 } });
};

Meteor.autosubscribe(function() {
  var leader = currentLeader();
  if(leader && leader._id != Session.get("viewerId") && leader.currentSlide) {
    window.impress().goto(leader.currentSlide);
  }
});

Template.status.events({
  'click': function() {
    var viewer = currentViewer();
    Viewers.update(
      { _id: viewer._id },
      { $set: { leader: !viewer.leader } }
    );
  }
});

Template.status.viewersCount = function() {
  return Viewers.find().count();
};

Template.status.leadersCount = function() {
  return Viewers.find({ leader: true }).count();
};

Template.status.leading = function() {
  return currentViewer().leader;
};

Meteor.startup(function () {
  Meteor.setInterval(function() {
    if (Meteor.status().connected) {
      Meteor.call("keepalive");
    }
  }, 1000*10);

  document.getElementById("impress").addEventListener("impress:stepleave", function(event) {
    var entering = document.querySelector(".active").id;
    Meteor.call("setSlide", entering);
  });

  document.getElementById("impress").addEventListener("impress:stepenter", function(event) {
    Meteor.call("setSlide", event.target.id);
  });

  Meteor.call("getViewer", function(err, viewerId) {
    Session.set("viewerId", viewerId);
  });
});
