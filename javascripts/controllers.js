
app.controller("HomeController", ["$http", "$scope", "Auth", "GitHub", function ($http, $scope, Auth, GitHub) {
  var Jan = 29;
  $scope.message = "This is HomeController";
  $scope.view = {};
  $scope.repos = GitHub.repos;
  $scope.events = GitHub.events;
  $scope.followers = GitHub.followers;
  $scope.loginGitHub = function () {
    Auth.$onAuth(function(authData) {
      $scope.authData = authData;
      console.log(authData);
      GitHub.authData = authData;
      if (authData) {
        GitHub.getRepos();
        $scope.repos = GitHub.repos;
        GitHub.getEvents();
        $scope.events = GitHub.events;
        GitHub.getFollowers();
        $scope.followers = GitHub.followers;
        $scope.history = GitHub.history;
      }
    });
    Auth.$authWithOAuthPopup("github").catch(function(error) {
        console.log(error);
    });
  };
  $scope.getCommits = GitHub.getReposCommits;
  $scope.commits = GitHub.commits;
  $scope.authData = GitHub.authData;
  $scope.logoutGitHub = GitHub.logoutGitHub;
  $scope.getFollowerInfo = GitHub.getFollowerInfo;
  $scope.followInfo = GitHub.followInfo;
  $scope.falseOut = function(Event, boole) {
    $scope.view.showRepos = false;
    $scope.view.showFollower = false;
    $scope.view.showEvents = false;
    $scope.view.showCommits = false;
    $scope.view[Event] = boole;
  };
}]);

app.controller("ShowController", ["$http", "$scope", "GitHub", "$firebaseObject","$firebaseArray", "Auth", function($http, $scope, GitHub, $firebaseObject, $firebaseArray, Auth) {
    var ref = new Firebase("https://github-cards.firebaseio.com/");
    $scope.githubCards = $firebaseArray(ref);

  $scope.message = "This is ShowController";
  $scope.authData = GitHub.authData;
  $scope.events = GitHub.events;
  $scope.history = GitHub.history;
  $scope.repos = GitHub.repos;
  $scope.error = [];
  $scope.addShow = function () {
    if (!GitHub.authData) {
      $scope.error.push("please sign in to be added to the cards");
    }
    for (var i = 0; i < $scope.githubCards.length; i ++) {
      if ($scope.githubCards[i].authData.github.id === $scope.authData.github.id) {
        $scope.error.push("Card is already in database; please update instead");
      }
    }
    if ($scope.error.length === 0) {
      $scope.githubCards.$add({
        authData: GitHub.authData,
        events: GitHub.events,
        history: GitHub.history,
        repos: GitHub.repos,
      });
    }
  };
  $scope.update = function () {
    $scope.error = [];
    if (!GitHub.authData) {
      $scope.error.push("please sign in to update cards");
    }
    if ($scope.error.length === 0 ) {
      for (var i = 0; i <$scope.githubCards.length; i ++) {
        if ($scope.githubCards[i].authData.github.id === $scope.authData.github.id) {
          $scope.githubCards[i].authData = GitHub.authData;
          $scope.githubCards[i].events = GitHub.events;
          $scope.githubCards[i].history = GitHub.history;
          $scope.githubCards[i].repos = GitHub.repos;
        }
      }
    }
  };


}]);
