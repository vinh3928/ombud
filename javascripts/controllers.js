
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
  $scope.falseOut = function (Event, boole) {
    $scope.view.showRepos = false;
    $scope.view.showFollower = false;
    $scope.view.showEvents = false;
    $scope.view.showCommits = false;
    $scope.view[Event] = boole;
  };
}]);

app.controller("ShowController", ["$http", "$scope", "GitHub", "$firebaseObject","$firebaseArray", "Auth", function($http, $scope, GitHub, $firebaseObject, $firebaseArray, Auth) {
  $scope.githubCards = GitHub.githubCards;
  console.log(GitHub.githubCards);
  $scope.message = "This is ShowController";
  $scope.authData = GitHub.authData;
  $scope.events = GitHub.events;
  $scope.history = GitHub.history;
  $scope.repos = GitHub.repos;
  $scope.getCommits = GitHub.getReposCommits;
  $scope.falseOut = GitHub.falseOut;
  $scope.error = [];
  $scope.genChart = function (array) {
    barchart.draw(JSON.parse(JSON.stringify(array)));
  };
  $scope.design = {
    backColor: 'white',
    fontColor: 'black',
    aColor: 'aColor2'
  };
  $scope.falseOut = function (Event, boole) {
    $scope.view.showCommits = false;
    $scope.view[Event] = boole;
  };
  $scope.addShow = function () {
    if (!GitHub.authData) {
      $scope.error.push("please sign in to be added to the cards");
    }
    for (var i = 0; i < $scope.githubCards.length; i ++) {
      if ($scope.githubCards[i].authData.github.id === $scope.authData.github.id) {
        console.log("barr");
        $scope.error.push("Card is already in database; please update instead");
      }
    }
    if ($scope.error.length === 0) {
      console.log(GitHub.authData);
      console.log(GitHub.events);
      console.log(GitHub.history);
      console.log(GitHub.repos);
      console.log(GitHub.commitsToMonth);
      console.log($scope.design);

      GitHub.githubCards.$add({
        authData: GitHub.authData,
        events: GitHub.events,
        history: GitHub.history,
        repos: GitHub.repos,
        //commits: GitHub.commitsToMonth,
        design: $scope.design
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
          console.log("foobar");
          GitHub.githubCards.$save(i).then(function() {
            console.log("data saved to database");
          });
        }

      }
    }
  };
}]);


app.controller("ShowOneController", ["$http", "$routeParams", "$scope", "GitHub", "$firebaseObject","$firebaseArray", "Auth", function($http, $routeParams, $scope, GitHub, $firebaseObject, $firebaseArray, Auth) {
  $scope.githubCards = GitHub.githubCards;
  $scope.view = {};
  console.log($scope.githubCards);
  $scope.falseOut = function (Event, boole) {
    $scope.view.showRepos = false;
    $scope.view.showFollower = false;
    $scope.view.showEvents = false;
    $scope.view.showCommits = false;
    $scope.view[Event] = boole;
  };
  $scope.getEvents = function () {
    $http.get($scope.authData.github.cachedUserProfile.received_events_url + "?per_page=100")
      .success(function (events) {
        $scope.events = events;
      })
      .error(function (error) {
        console.log(error);
      });
  };
  $scope.getRepos = function () {
    $http.get($scope.authData.github.cachedUserProfile.repos_url + "?per_page=100")
      .success(function (repos) {
        $scope.repos = repos;
      })
      .error(function (error) {
        console.log(error);
      });
  };
  $scope.followInfo = {};
  $scope.getFollowerInfo = function (url, id) {
    $http.get(url)
      .success(function (followerInfo) {
       $scope.followInfo[id] = followerInfo;
      })
      .error(function (error) {
        console.log(error);
      });
  };
  $scope.getFollowers = function () {
    $http.get($scope.authData.github.cachedUserProfile.followers_url)
      .success(function (followers) {
        $scope.followers = followers;
      })
      .error(function (error) {
        console.log(error);
      });
  };
  for (var i = 0; i < $scope.githubCards.length; i ++) {
    console.log("foobar");
    console.log($routeParams.id);
    if ($routeParams.id === $scope.githubCards[i].authData.github.id) {
      $scope.authData = $scope.githubCards[i].authData;
      $scope.design = $scope.githubCards[i].design;
      $scope.getEvents();
      $scope.getRepos();
      $scope.getFollowers();
    }
  }
  $scope.getReposCommits = function () {
    $scope.commits = [];
    var username = $scope.authData.github.username;
    $scope.totalCommits = [];
    $scope.commitsByMonth = {
      "JAN": [],
      "FEB": [],
      "MAR": [],
      "APR": [],
      "MAY": [],
      "JUN": [],
      "JUL": [],
      "AUG": [],
      "SEP": [],
      "OCT": [],
      "NOV": [],
      "DEC": []
    };
    $scope.monthConversion = {
      "01": "JAN",
      "02": "FEB",
      "03": "MAR",
      "04": "APR",
      "05": "MAY",
      "06": "JUN",
      "07": "JUL",
      "08": "AUG",
      "09": "SEP",
      "10": "OCT",
      "11": "NOV",
      "12": "DEC"
    };
    $scope.commitsToMonth = [{ month : 'JAN', commits: 0 },
    { month : 'FEB', commits: 0 },
    { month : 'MAR', commits: 0 },
    { month : 'APR', commits: 0 },
    { month : 'MAY', commits: 0 },
    { month : 'JUN', commits: 0 },
    { month : 'JUL', commits: 0 },
    { month : 'AUG', commits: 0 },
    { month : 'SEP', commits: 0 },
    { month : 'OCT', commits: 0 },
    { month : 'NOV', commits: 0 },
    { month : 'DEC', commits: 0 }
  ];
    for (var i = 0; i < $scope.repos.length; i ++) {
      console.log(username);
      $http.get("https://ombud-api.herokuapp.com/commits/" + $scope.repos[i].name + "/" + username)
        .success(function (commits) {
          $scope.commits.push(commits);
         for (var j = 0; j < commits.data.length; j ++) {
           if (commits.data[j].committer.login === username) {
             var thisDate = moment(Date.now()).format("YYYY.MM.DD");
             thisDate = thisDate.split("").splice(0,4).join("");
             var date = moment(commits.data[j].commit.committer.date).format("YYYY.MM.DD");
             if (thisDate === date.split("").splice(0,4).join("")) {
               date = date.split("");
               var month = date.splice(5,2).join("");
               $scope.commitsByMonth[$scope.monthConversion[month]].push(commits.data[j]);
               var index = parseInt(month);
               $scope.commitsToMonth[index - 1].commits = $scope.commitsToMonth[index - 1].commits + 1;
               console.log($scope.commitsToMonth);
               $scope.totalCommits.push(commits.data[j]);
               barchart.draw($scope.commitsToMonth);
             }
           }
         }
          console.log($scope.totalCommits);
        })
        .error(function (error) {
          console.log("foo", error);
        });
    }
  };
}]);

app.controller("EditController", ["$http", "$routeParams", "$scope", "GitHub", "$firebaseObject","$firebaseArray", "Auth", function($http, $routeParams, $scope, GitHub, $firebaseObject, $firebaseArray, Auth) {
  $scope.message = "foobar";
  $scope.githubCards = GitHub.githubCards;
  $scope.backColors = {
    backColor1: "red",
    backColor2: "blue",
    backColor3: "white",
    backColor4: "green",
    backColor5: "orange",
    backColor6: "black"
  };
  $scope.fontColors = {
    fontColor1: "red",
    fontColor2: "blue",
    fontColor3: "white",
    fontColor4: "green",
    fontColor5: "orange",
    fontColor6: "black"
  };
  $scope.aColor = {
    aColor1: "red",
    aColor2: "blue",
    aColor3: "white",
    aColor4: "green",
    aColor5: "orange",
    aColor6: "black"
  };
  $scope.getEvents = function () {
    $http.get($scope.authData.github.cachedUserProfile.received_events_url + "?per_page=100")
      .success(function (events) {
        $scope.events = events;
      })
      .error(function (error) {
        console.log(error);
      });
  };
  $scope.getRepos = function () {
    $http.get($scope.authData.github.cachedUserProfile.repos_url + "?per_page=100")
      .success(function (repos) {
        $scope.repos = repos;
      })
      .error(function (error) {
        console.log(error);
      });
  };
  $scope.setAColor = function (aColor) {
    $scope.design.aColor = aColor;
    console.log($scope.design);
  };
  $scope.setBackColor = function (backColor) {
    var bColor = $scope.backColors[backColor];
    $scope.design.backColor =  bColor;
    console.log($scope.design);
  };
  $scope.setFontColor = function (color) {
    var fontColor = $scope.fontColors[color];
    $scope.design.fontColor = fontColor;
    console.log($scope.design);
  };
  $scope.saveChanges = function () {
    console.log("changes saved");
    for (var i = 0; i < GitHub.githubCards.length; i ++) {
      if ($routeParams.id === GitHub.githubCards[i].authData.github.id) {
        if ($scope.design.backColor) {
          GitHub.githubCards[i].design.backColor = $scope.design.backColor;
        }
        if ($scope.design.fontColor) {
          GitHub.githubCards[i].design.fontColor = $scope.design.fontColor;
        }
        if ($scope.design.aColor) {
          GitHub.githubCards[i].design.aColor = $scope.design.aColor;
        }
        GitHub.githubCards.$save(i).then(function() {
          console.log("data saved to database");
        });
        console.log("github changes saved");
      }
    }
  };
  for (var i = 0; i < $scope.githubCards.length; i ++) {
    if ($routeParams.id === $scope.githubCards[i].authData.github.id) {
      $scope.authData = $scope.githubCards[i].authData;
      $scope.design = $scope.githubCards[i].design;
      $scope.getRepos();
      $scope.getEvents();
    }
  }
}]);
