
app.factory("Auth", ["$firebaseAuth", function($firebaseAuth) {
  var ref = new Firebase("https://github-cards.firebaseio.com");
  return $firebaseAuth(ref);
}]);

app.factory("GitHub", ["$http","Auth", function($http, Auth) {
  var getData = {};
  getData.logoutGitHub = function () {
    Auth.$unauth();
    console.log("logout?");
  };

  getData.followInfo = {};
  getData.getFollowerInfo = function (url, id) {
    $http.get(url)
      .success(function (followerInfo) {
        getData.followInfo[id] = followerInfo;
      })
      .error(function (error) {
        console.log(error);
      });
  };

  getData.getRepos = function () {
    $http.get(getData.authData.github.cachedUserProfile.repos_url + "?per_page=100")
      .success(function (repos) {
        getData.repos = repos;
      })
      .error(function (error) {
        console.log(error);
      });
  };
  getData.getEvents = function () {
    $http.get(getData.authData.github.cachedUserProfile.received_events_url + "?per_page=100")
      .success(function (events) {
        getData.events = events;
        getHistory();
      })
      .error(function (error) {
        console.log(error);
      });
  };
  getData.getFollowers = function () {
    $http.get(getData.authData.github.cachedUserProfile.followers_url)
      .success(function (followers) {
        getData.followers = followers;
      })
      .error(function (error) {
        console.log(error);
      });
  };
  function getHistory() {
    getData.history = [];
    for (var i = 0; i < getData.events.length; i ++) {
      var time = moment(getData.events[i].created_at).format("YYYY.MM.DD");
      date = new Date(time).getTime();
      if ((Date.now() - date) < 604800000) {
        getData.history.push(getData.events[i].created_at);
      }
    }
  }
  return getData;
}]);
