
app.factory("Auth", ["$firebaseAuth", function($firebaseAuth) {
  var ref = new Firebase("https://github-cards.firebaseio.com");
  return $firebaseAuth(ref);
}]);
