
app.controller("HomeController", ["$http", "$scope", "$route", "Auth", "$location", "$firebaseArray", function($http, $scope, $route, Auth, $location, $firebaseArray) {
  $scope.message = "This is HomeController";
  $scope.loginGitHub = function () {
    Auth.$onAuth(function(authData) {
      $scope.authData = authData;
      if (authData) {
        getRepos();
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
  function getRepos() {
    $http.get($scope.authData.github.cachedUserProfile.repos_url)
      .success(function (repos) {
        $scope.repos = repos;
      })
      .error(function (error) {
        console.log(error);
      });
  }
}]);

app.controller("ShowController", ["$http", "$scope", function($http, $scope) {
  $scope.message = "This is ShowController";
}]);
