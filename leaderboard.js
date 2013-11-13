// Set up a collection to contain player information. On the server,
// it is backed by a MongoDB collection named "players".

Players = new Meteor.Collection("players");

if (Meteor.isClient) {

  Template.leaderboard.players = function () {
    return Players.find({}, Session.get("sorting"));
  };

  Template.leaderboard.selected_name = function () {
    var player = Players.findOne(Session.get("selected_player"));
    return player && player.name;
  };

  Template.player.selected = function () {
    return Session.equals("selected_player", this._id) ? "selected" : '';
  };

  Template.leaderboard.events({
    'click input.inc': function () {
      Players.update(Session.get("selected_player"), {$inc: {score: 5}});
    },
    'click #delete': function () {
      Players.remove(Session.get("selected_player"));
    }
  });

  Template.player.events({
    'click': function () {
      Session.set("selected_player", this._id);
    }
  });
  
  Template.sorting.events({
  	'click #n': function () {
		Session.set("sorting", {sort: {name: 1}});
	},
	'click #s': function () {
		Session.set("sorting", {sort: {score: -1}});
	}
  });
  
  Template.add.events({
  	'click #addit': function () {
  		if ($('#cientificname').val() != "") {
  			Players.insert({name: $('#cientificname').val(), score: 0});
  			$('#cientificname').val("");
  		}
	},
	'click #resetall': function () {
		Meteor.call('reseting');

	}
	});
}

// On server startup, create some players if the database is empty.
if (Meteor.isServer) {
  Meteor.startup(function () {
    if (Players.find().count() === 0) {
      var names = ["Ada Lovelace",
                   "Grace Hopper",
                   "Marie Curie",
                   "Carl Friedrich Gauss",
                   "Nikola Tesla",
                   "Claude Shannon"];
      for (var i = 0; i < names.length; i++)
        Players.insert({name: names[i], score: Math.floor(Random.fraction()*10)*5});
    }
  });
  
 Meteor.methods({
  reseting: function () {
    Players.update({},
                   { $set: { score: 0} },
                   {multi: true});
  }
});
}
