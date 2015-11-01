
app.factory("Auth", ["$firebaseAuth", function($firebaseAuth) {
  var ref = new Firebase("https://github-cards.firebaseio.com");
  return $firebaseAuth(ref);
}]);

app.factory("GitHub", ["$http", "$firebaseArray", "Auth", function($http, $firebaseArray, Auth) {
  var getData = {};
  getData.logoutGitHub = function () {
    Auth.$unauth();
  };

  var ref = new Firebase("https://github-cards.firebaseio.com/");
  getData.githubCards = $firebaseArray(ref);

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
  getData.getReposCommits = function () {
    getData.commits = [];
    var username = getData.authData.github.username;
    getData.totalCommits = [];
    getData.commitsByMonth = {
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
    getData.monthConversion = {
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
    getData.commitsToMonth = [{ month : 'JAN', commits: 0 },
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
    for (var i = 0; i < getData.repos.length; i ++) {
      $http.get("https://ombud-api.herokuapp.com/commits/" + getData.repos[i].name)
        .success(function (commits) {
          getData.commits.push(commits);
         for (var j = 0; j < commits.data.length; j ++) {
           if (commits.data[j].committer.login === username) {
             var thisDate = moment(Date.now()).format("YYYY.MM.DD");
             thisDate = thisDate.split("").splice(0,4).join("");
             var date = moment(commits.data[j].commit.committer.date).format("YYYY.MM.DD");
             if (thisDate === date.split("").splice(0,4).join("")) {
               date = date.split("");
               var month = date.splice(5,2).join("");
               getData.commitsByMonth[getData.monthConversion[month]].push(commits.data[j]);
               var index = parseInt(month);
               getData.commitsToMonth[index - 1].commits = getData.commitsToMonth[index - 1].commits + 1;
               console.log(getData.commitsToMonth);
               getData.totalCommits.push(commits.data[j]);
               barchart.draw(getData.commitsToMonth);
             }
           }
         }
          console.log(getData.totalCommits);
        })
        .error(function (error) {
          console.log("foo", error);
        });
    }
  };
  getData.inputCharts = function () {
    getData.commitHistory = {};
    for (var i = 0; i < getData.commits.length; i ++) {
      for (var j = 0; j <getData.commits[i].data.length; j ++) {
        if (getData.commits[i].data[j].author.login === getData.authData.github.username) {
          console.log("matched");

        }
      }

    }

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
