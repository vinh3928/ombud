
app.config(["$routeProvider", function($routeProvider) {
  $routeProvider
    .when("/", {
      templateUrl: "partials/home.html",
      controller: "HomeController"
    })
    .when("/show", {
      templateUrL: "partials/show.html",
      controller: "ShowController"
    });
}]);


