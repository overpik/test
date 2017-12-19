angular.module('starter.controllers', [])
  .controller('AppCtrl', function ($scope, $timeout, $http, $state, $localStorage) {
    // console.log('AppCtrl')

    $scope.getStatusfacebook = function () {
      $scope.fbemail = $localStorage.email;
      $scope.fbName = $localStorage.name;
      $scope.fbimage = $localStorage.image;
      // console.log('name',$localStorage.name)
    }

    $scope.urlConfig = 'http://redemption.demotoday.net/mictService/';
    $scope.showNotification = function (text) {
      if(text == '' || text == null){
        $scope.notiMessage = 'ขาดการเชื่อมต่อจาก Server';
      }else{
        $scope.notiMessage = text;
      }
      $.notify({
        icon: "icon fa fa-warning",
        message: $scope.notiMessage
      }, {
          type: 'danger',
          delay: 50000
        });
    };
    $scope.logout = function () {
      $localStorage.session = '';
      $localStorage.email = '';
      $localStorage.name = '';
      $localStorage.image = '';
      // socialLoginService.logout();
      $state.go('login');
      document.location.reload(true);
    }
    // $scope.$on('event:social-sign-out-success', function (event, userDetails) {
    //   $scope.result = userDetails;
    //   console.log('2');
    // })

  });