
app.controller("HomeController", ["$http", "$scope", "$route", "Auth", "$location", "$firebaseArray", function($http, $scope, $route, Auth, $location, $firebaseArray) {
  var Jan = 29;
  $scope.message = "This is HomeController";
  $scope.loginGitHub = function () {
    Auth.$onAuth(function(authData) {
      $scope.authData = authData;
      if (authData) {
        getRepos();
        getEvents();
        $scope.followInfo = {};
        $scope.view = {};
        getFollowers();
      }
      console.log(authData);
    });
    Auth.$authWithOAuthPopup("github").catch(function(error) {
        console.log(error);
      });
  };
  $scope.logoutGitHub = function () {
    Auth.$unauth();
    console.log("logout?");
  };
  $scope.getFollowerInfo = function (url, id) {
    $http.get(url)
      .success(function (followerInfo) {
        $scope.followInfo[id] = followerInfo;
        console.log($scope.followInfo[id]);
      })
      .error(function (error) {
        console.log(error);
      });
  };
  $scope.falseOut = function(Event, boole) {
    $scope.view.showRepos = false;
    $scope.view.showFollower = false;
    $scope.view.showEvents = false;
    $scope.view[Event] = boole;
  };
  function getRepos() {
    $http.get($scope.authData.github.cachedUserProfile.repos_url + "?per_page=100")
      .success(function (repos) {
        $scope.repos = repos;
      })
      .error(function (error) {
        console.log(error);
      });
  }
  function getEvents() {
    $http.get($scope.authData.github.cachedUserProfile.received_events_url + "?per_page=100")
      .success(function (events) {
        $scope.events = events;
        getHistory();
      })
      .error(function (error) {
        console.log(error);
      });
  }
  function getFollowers() {
    $http.get($scope.authData.github.cachedUserProfile.followers_url)
      .success(function (followers) {
        $scope.followers = followers;
      })
      .error(function (error) {
        console.log(error);
      });
  }
  function getHistory() {
    $scope.history = [];
    for (var i = 0; i < $scope.events.length; i ++) {
      var time = moment($scope.events[i].created_at).format("YYYY.MM.DD");
      date = new Date(time).getTime();
      if ((Date.now() - date) < 604800000) {
        $scope.history.push($scope.events[i].created_at);
      }
    }
  }
  barchart.draw([
    { month : 'Jan', commits: 29 },
    { month : 'Feb', commits: 32 },
    { month : 'Mar', commits: 48 },
    { month : 'Apr', commits: 49 },
    { month : 'May', commits: 58 },
    { month : 'Jun', commits: 68 },
    { month : 'Jul', commits: 74 },
    { month : 'Aug', commits: 73 },
    { month : 'Sep', commits: 65 },
    { month : 'Oct', commits: 54 },
    { month : 'Nov', commits: 45 },
    { month : 'Dec', commits: 35 }
  ]);
}]);

app.controller("ShowController", ["$http", "$scope", function($http, $scope) {
  $scope.message = "This is ShowController";
}]);
