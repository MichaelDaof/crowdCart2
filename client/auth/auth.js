angular.module('crowdcart.auth', [])// make an auth module

.controller('AuthController', function ($scope, $window, $location, Auth) {

  $scope.signin = function () {
    Auth.signin($scope.user)
      .then(function (data) {
        console.log(data.address);
        //Save token, user_id and address to local storage
        $window.localStorage.setItem('crowdcarttoken', data.token)
        $window.localStorage.setItem('crowdcartuser', data.userid);
        $window.localStorage.setItem('crowdcartuserstreet', data.address.street);
        $window.localStorage.setItem('crowdcartusercity', data.address.city);
        $window.localStorage.setItem('crowdcartuserstate', data.address.state);
        $window.localStorage.setItem('crowdcartuserzip', data.address.zip_code);
        // may need to keep some stripe info locally
        // and also as a condition for payment requests to appear
        // but that sounds more like a state thing ($rootScope)
        // $window.localStorage.setItem('crowdcartstripe', data.stripe);
        $location.path('/mylists');
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  $scope.signup = function () {

    Auth.signup($scope.user)
      .then(function (data) {
        // FIXME: (style) these localStorage settings aren't the same as the
        // settings in "signin" for some reason.
        $window.localStorage.setItem('crowdcarttoken', data.token);
        // saving username to localstorage
        $window.localStorage.setItem('crowdcartuser', data.userid);

        // payment signup after user signup is a concern of flow
        // previously routed straight to mylists
        $location.path('/cc-input')
      })
      .catch(function (error) {
        console.error(error);
      });
  };
});
