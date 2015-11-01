
app.config(["$routeProvider", function($routeProvider) {
  $routeProvider
    .when("/", {
      templateUrl: "partials/home.html",
      controller: "HomeController"
    })
    .when("/show", {
      templateUrl: "partials/show.html",
      controller: "ShowController"
    })
    .when("/show/:id", {
      templateUrl: "partials/showone.html",
      controller: "ShowOneController"
    })
    .when("/edit/:id", {
      templateUrl: "partials/edit.html",
      controller: "EditController"
    });
}]);

