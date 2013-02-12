Viewers = new Meteor.Collection("viewers");

Meteor.publish("current-viewers", function () {
  return Viewers.find();
});

Meteor.methods({
  keepalive: function() {
    this.unblock();

    var currentTime = (new Date()).getTime();

    if(!this.userId || !Viewers.findOne({ _id: this.userId })) {
      var newUserId = Viewers.insert({ last_keepalive: currentTime });
      this.setUserId(newUserId);
    } else {
      Viewers.update(
        { _id: this.userId },
        { $set: { last_keepalive: currentTime } }
      );
    }
  }
});

Meteor.setInterval(function () {
  var now = (new Date()).getTime();
  var threshold = now - 60*1000; // 60 sec

  Viewers.remove({ last_keepalive: { $lt: threshold } });
}, 30*1000);
