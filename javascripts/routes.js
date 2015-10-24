
app.config(["$routeProvider", function($routeProvider) {
  $routeProvider
    .when("/", {
      templateUrl: "partials/home.html",
      controller: "HomeController"
    })
    .when("/show", {
      templateUrl: "partials/show.html",
      controller: "ShowController",
    });
}]);

