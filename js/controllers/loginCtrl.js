app.controller('loginCtrl', ['$scope', '$http', '$log', '$timeout', '$state', '$stateParams', '$localStorage', function ($scope, $http, $log, $timeout, $state, $stateParams, $localStorage) {

        $scope.init = function () {
                $scope.data = {};
                $scope.data.username = '';
                $scope.data.password = '';
                $localStorage.session = 'true';
                $scope.checked = false;
                $scope.txtLogin = 'เข้าสู่ระบบ';
                $scope.showLoading = false;
                $scope.loginerror = '';
        };
        $scope.checkLogin = function () {
                $scope.loginerror = '';
                $scope.txtLogin = 'กำลังตรวจสอบ';
                $scope.showLoading = true;
                console.log($scope.data, 'session ' + $localStorage.session);

                if ($scope.data.username == 'administator' && $scope.data.password == 'P@ssw0rd') {
                        $scope.txtLogin = 'กำลังเข้าสู่ระบบ';
                        $localStorage.session = 'true';
                        $localStorage.email = '';
                        $localStorage.name = $scope.data.username;
                        $localStorage.image = '';
                        $state.go('index.home');
                } else {
                        $scope.txtLogin = 'เข้าสู่ระบบ';
                        $scope.showLoading = false;
                        $scope.checked = true;
                }


                // var urlCheck = 'http://redemption.demotoday.net/Marketplace/api/login';
                // $http({
                //         method: "POST",
                //         dataType: 'json',
                //         headers: {
                //                 'Accept': 'application/json',
                //                 'Content-Type': 'text/plain'
                //         },
                //         url: urlCheck,
                //         data: $scope.data
                // }).then(function (res) {
                //         console.log('succ', res.data)

                //         if (res.data.status == '1') {
                //                 $scope.txtLogin = 'กำลังเข้าสู่ระบบ';
                //                 $localStorage.session = 'true';
                //                 $localStorage.email = '';
                //                 $localStorage.name = $scope.data.username;
                //                 $localStorage.image = '';
                //                 $state.go('index.home');
                //         } else if (res.data.status == '0') {
                //                 //user หรือ passwordd ผิด
                //                 $scope.txtLogin = 'เข้าสู่ระบบ';
                //                 $scope.showLoading = false;
                //                 $scope.checked = true;
                //         } else {
                //                 $scope.txtLogin = 'เข้าสู่ระบบ';
                //                 $scope.showLoading = false;
                //                 //error
                //         }


                // }, function (error) {
                //         console.log('error', error)
                //         $scope.txtLogin = 'เข้าสู่ระบบ';
                //         $scope.showLoading = false;
                //         $scope.loginerror = 'ขาดการเชื่อมต่อจาก Server';
                //         return;

                // });
        };

        $scope.$on('event:social-sign-in-success', function (event, userDetails) {
                $scope.result = userDetails;
                // $scope.$apply();
                $localStorage.session = 'true';
                $localStorage.email = userDetails.email;
                $localStorage.name = userDetails.name;
                $localStorage.image = userDetails.imageUrl;
                $state.go('index.home');
                console.log(userDetails);
        })
        $scope.$on('event:social-sign-out-success', function (event, userDetails) {
                $scope.result = userDetails;
                console.log('2');
        })

        $scope.init();


}])
