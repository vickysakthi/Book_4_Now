var movieapp = angular.module("myapp", ['ngRoute']);

// Routes Section
movieapp.config(function ($routeProvider) {
  $routeProvider
    .when("/", {
      templateUrl: "pages/loginpage.html",
      controller: "loginpageController",
    })
    .when("/registerpage", {
      templateUrl: "pages/registerpage.html",
      controller: "registerController",
    })
    .when("/userpage", {
      templateUrl: "pages/userpage.html",
      controller: "userController",
    })
    .when("/adminpage", {
      templateUrl: "pages/adminpage.html",
      controller: "adminpageController",
    })
    .when("/searchpage", {
      templateUrl: 'pages/searchpage.html',
      controller: 'searchpageController'
    })
    .otherwise({
      redirectTo: '/'
    });
});

// Movies & Bevarage services
movieapp.factory('DataService', function () {
  var movies = [];
  var beverages = [];

  return {
    getMovies: function () {
      return movies;
    },
    updateMovie: function (updatedMovie) {
      for (var i = 0; i < movies.length; i++) {
        if (movies[i].id === updatedMovie.id) {
          movies[i] = updatedMovie;
          break;
        }
      }
    },
    setMovies: function (newMovies) {
      movies = newMovies;
    },
    getBeverages: function () {
      return beverages;
    },
    updateBeverage: function (updatedBeverage) {
      for (var i = 0; i < beverages.length; i++) {
        if (beverages[i].id === updatedBeverage.id) {
          beverages[i] = updatedBeverage;
          break;
        }
      }
    },
    setBeverages: function (newBeverages) {
      beverages = newBeverages;
    }
  };
});

// Friend Requests & View Friends Services
movieapp.service('dataService', function() {
  var friendRequests = [
    { name: 'Udhaya' },
    { name: 'Ajay' },
    { name: 'Sanjay' },
    { name: 'Jaanu' },
    { name: 'Vijay' }
  ];
  
  var friends = [];
  
  this.getFriendRequests = function() {
    return friendRequests;
  };
  
  this.getFriends = function() {
    return friends;
  };
  
  this.acceptRequest = function(request) {
    friends.push(request);
    friendRequests.splice(friendRequests.indexOf(request), 1);
  };
  
  this.rejectRequest = function(request) {
    friendRequests.splice(friendRequests.indexOf(request), 1);
  };
});

// Registerpage Controller
movieapp.controller("registerController", function ($scope) {
  $('#register').addClass('active');
  $('#search').removeClass('active');
  $('#login').removeClass('active');

  $scope.user = {};
  $scope.register = function () {
    if ($scope.registerForm.$valid) {
      localStorage.setItem($scope.user.username, JSON.stringify($scope.user));
      alert('Registration successful');
      window.location.href = "#!/";
    } else {
      alert('Please fill all required fields.');
    }
  };
});

// Loginpage Controller
movieapp.controller("loginpageController", function ($scope) {
  $('#register').removeClass('active');
  $('#search').removeClass('active');
  $('#login').addClass('active');
  $scope.loginData = {};
  $scope.login = function () {
    if ($scope.loginData.username === "admin" && $scope.loginData.password === "admin") {
      alert('Admin login successful');
      window.location.href = "#!/adminpage";
    } else {
      let storedUser = JSON.parse(localStorage.getItem($scope.loginData.username));
      if (storedUser && storedUser.password === $scope.loginData.password) {
        alert('Login successful');
        localStorage.setItem('currentUser', JSON.stringify(storedUser));
        window.location.href = "#!/userpage";
      } else {
        alert('Invalid username or password');
      }
    }
  };
});

// UserPage Controller
movieapp.controller("userController", function ($scope, DataService, dataService,$location) {
  $scope.bookingMessage = '';
  $scope.showBooking = false;
  $scope.showBeverage = false;
  $scope.showDetails = false;
  $scope.historyList = false;  
  $scope.showFriendRequestsSection = false;
  $scope.showFriendsSection = false;
  $scope.bookingDetailsList = [];
  $scope.totalPrice = 0;

  $scope.selectedMovie = {
    title: 'Default Movie',
    price: 0
  };

  var currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (!currentUser) {
    $location.path('/');
    return;
  }

  $scope.username = currentUser.username;
  $scope.bookingDetailsList = currentUser.bookings || [];

  $scope.movies = DataService.getMovies();
  $scope.beverages = DataService.getBeverages();

  $scope.selectedBeverages = [];
  $scope.numTickets = 1;

  $scope.$watch(function () {
    return DataService.getMovies();
  }, function (newVal, oldVal) {
    if (newVal !== oldVal) {
      $scope.movies = newVal;
    }
  }, true);

  $scope.$watch(function () {
    return DataService.getBeverages();
  }, function (newVal, oldVal) {
    if (newVal !== oldVal) {
      $scope.beverages = newVal;
    }
  }, true);

  $scope.bookticket = function () {
    $scope.bookingMessage = 'Your ticket booking process has started!';
    $scope.showBooking = true;
    $scope.showBeverage = false;
    $scope.showDetails = false;
    $scope.historyList = false; 
    $scope.showFriendRequestsSection = false;
    $scope.showFriendsSection = false;
  };

  $scope.bevarageSnacks = function () {
    $scope.bookingMessage = 'Available Beverages';
    $scope.showBeverage = true;
    $scope.showBooking = false;
    $scope.showDetails = false;
    $scope.historyList = false; 
    $scope.showFriendRequestsSection = false;
    $scope.showFriendsSection = false;
  };

  $scope.detailsListFun = function () {
    $scope.bookingMessage = 'Booking details lists';
    $scope.historyList = true;
    $scope.showBeverage = false;
    $scope.showDetails = false;
    $scope.showBooking = false; 
    $scope.showFriendRequestsSection = false;
    $scope.showFriendsSection = false;
  };

  $scope.bookingDetails = function (selectedMovie) {
    $scope.bookingMessage = "booking data";
    $scope.showDetails = true;
    $scope.showBooking = false;
    $scope.showBeverage = false;
    $scope.showFriendRequestsSection = false;
    $scope.showFriendsSection = false;
    $scope.historyList = false; 
    $scope.selectedMovie = selectedMovie || $scope.selectedMovie;
    $scope.totalTickets = 1;  
    $scope.calculateTotalPrice();
  };

  $scope.calculateTotalPrice = function () {
    $scope.totalPrice = ($scope.selectedMovie ? $scope.selectedMovie.price * $scope.numTickets : 0) +
      ($scope.selectedBeverages ? $scope.selectedBeverages.reduce((total, beverage) => total + (beverage.price * beverage.quantity), 0) : 0);
  };

  $scope.confirmBooking = function () {
    var movieTitle = $scope.selectedMovie.title;
    var moviePrice = $scope.selectedMovie.price;
    var totalMoviePrice = moviePrice * $scope.numTickets;
    var totalBeveragePrice = $scope.selectedBeverages.reduce((total, beverage) => total + (beverage.price * beverage.quantity), 0);
    var totalPrice = totalMoviePrice + totalBeveragePrice;

    var bookingDetails = {
      title: movieTitle,
      tickets: $scope.numTickets,
      moviePrice: moviePrice,
      totalMoviePrice: totalMoviePrice,
      beverages: $scope.selectedBeverages.map(bev => ({
        itemName: bev.itemName,
        quantity: bev.quantity,
        price: bev.price
      })),
      totalBeveragePrice: totalBeveragePrice,
      totalPrice: totalPrice
    };

    // $scope.bookingDetailsList.push({
    //   title: movieTitle,
    //   tickets: $scope.numTickets,
    //   moviePrice: moviePrice,
    //   totalMoviePrice: totalMoviePrice,
    //   beverages: $scope.selectedBeverages.map(bev => ({
    //     itemName: bev.itemName,
    //     quantity: bev.quantity,
    //     price: bev.price
    //   })),
    //   totalBeveragePrice: totalBeveragePrice,
    //   totalPrice: totalPrice
    // });

    if (!currentUser.bookings) {
      currentUser.bookings = [];
    }
    currentUser.bookings.push(bookingDetails);
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    localStorage.setItem(currentUser.username, JSON.stringify(currentUser));
    $scope.bookingDetailsList = currentUser.bookings;

    // Reset values after booking
    $scope.selectedMovie = {
      title: 'Default Movie',
      price: 0
    };
    $scope.selectedBeverages = [];
    $scope.numTickets = 1;
    $scope.totalPrice = 0;
    $scope.showDetails = false;
    $scope.showBooking = true;
  // $scope.bookingDetailsList = currentUser.bookings || [];

  };

  $scope.bookNowBtn = function (beverage) {
    const existingBeverage = $scope.selectedBeverages ? $scope.selectedBeverages.find(b => b.id === beverage.id) : null;
    if (existingBeverage) {
      existingBeverage.quantity++;
    } else {
      if (!$scope.selectedBeverages) {
        $scope.selectedBeverages = [];
      }
      $scope.selectedBeverages.push({ ...beverage, quantity: 1 });
    }
    $scope.calculateTotalPrice();
  };

  // $scope.username = "User1"; 
  $scope.friendRequests = dataService.getFriendRequests();
  $scope.friends = dataService.getFriends();

  $scope.showFriendRequests = function() {
    $scope.showFriendRequestsSection = true;
    $scope.showFriendsSection = false;
    $scope.showBooking = false;
    $scope.showBeverage = false;
    $scope.showDetails = false;
    $scope.historyList = false; 
  };
  
  $scope.showFriends = function() {
    $scope.showFriendsSection = true;
    $scope.showFriendRequestsSection = false;
    $scope.showBooking = false;
    $scope.showBeverage = false;
    $scope.showDetails = false;
    $scope.historyList = false; 
  };

  $scope.acceptRequest = function(request) {
    dataService.acceptRequest(request);
    $scope.friendRequests = dataService.getFriendRequests();
    $scope.friends = dataService.getFriends();
  };
  
  $scope.rejectRequest = function(request) {
    dataService.rejectRequest(request);
    $scope.friendRequests = dataService.getFriendRequests();
  };

});

// AdminPage Controller
movieapp.controller("adminpageController", function ($scope, DataService, $http) {
  $scope.message = 'Approve The Movie';
  $scope.snacksmsg = 'Approve The Snacks'
  $scope.snacksStocks= false;
  $scope.moviesStocks= true;

  $http.get('movies.json')
    .then(function (res) {
      $scope.movies = res.data.movies;
      DataService.setMovies($scope.movies);
    });

  $scope.approveMovie = function (movie) {
    movie.approved = true;
    DataService.updateMovie(movie);
  };

  $http.get('beverages.json')
    .then(function (res) {
      $scope.beverages = res.data.beverages;
      DataService.setBeverages($scope.beverages);
    });
  $scope.approveSnacks = function (beverage) {
    beverage.approved = true;
    DataService.updateBeverage(beverage);
  };

  $scope.moviesFunction = function(){
  $scope.moviesStocks= true;
  }

  $scope.snacksFunction = function(){
  $scope.snacksStocks= true;
  $scope.moviesStocks= false;
  }

});

// Searchpage Controller
movieapp.controller("searchpageController", function ($scope) {
  $('#register').removeClass('active');
  $('#search').addClass('active');
  $('#login').removeClass('active');
  $scope.message = "filtered data";
});
// Searchpage Controller
movieapp.controller('searchpageController', function ($scope, DataService) {
  $('#register').removeClass('active');
  $('#search').addClass('active');
  $('#login').removeClass('active');
  $scope.message = "filtered data";
  $scope.searchQuery = '';
  $scope.movies = DataService.getMovies();
  $scope.filteredMovies = $scope.movies;

  $scope.searchMovies = function () {
    $scope.filteredMovies = $scope.movies.filter(movie =>
      movie.title.toLowerCase().includes($scope.searchQuery.toLowerCase())
    );
  };
});

// Mainpage controller 
movieapp.controller('mainController', function ($scope, $location) {
  $scope.isUserPageOrAdminPage = function () {
    return $location.path() === '/userpage' || $location.path() === '/adminpage';
  };
});