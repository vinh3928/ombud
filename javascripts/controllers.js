
app.controller("HomeController", ["$http", "$scope", "Auth", "GitHub", function ($http, $scope, Auth, GitHub) {
  var Jan = 29;
  $scope.message = "This is HomeController";
  $scope.view = {};
  $scope.repos = GitHub.repos;
  $scope.events = GitHub.events;
  $scope.followers = GitHub.followers;
  $scope.loginGitHub = GitHub.loginGitHub;
  $scope.loginGitHub = function () {
    Auth.$onAuth(function(authData) {
      $scope.authData = authData;
      GitHub.authData = authData;
      if (authData) {
        GitHub.getRepos();
        $scope.repos = GitHub.repos;
        GitHub.getEvents();
        $scope.events = GitHub.events;
        GitHub.getFollowers();
        $scope.followers = GitHub.followers;
      }
    });
    Auth.$authWithOAuthPopup("github").catch(function(error) {
        console.log(error);
    });
  };
  $scope.authData = GitHub.authData;
  $scope.logoutGitHub = GitHub.logoutGitHub;
  $scope.getFollowerInfo = GitHub.getFollowerInfo;
  $scope.followInfo = GitHub.followInfo;
  $scope.falseOut = function(Event, boole) {
    $scope.view.showRepos = false;
    $scope.view.showFollower = false;
    $scope.view.showEvents = false;
    $scope.view[Event] = boole;
  };
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

app.controller("ShowController", ["$http", "$scope", "GitHub", function($http, $scope, GitHub) {
  $scope.message = "This is ShowController";
  $scope.data = GitHub.authData;
}]);
