app.controller('imageCtrl', ['$scope', '$http', '$log', '$timeout', '$state', '$stateParams', function ($scope, $http, $log, $timeout, $state, $stateParams) {
        $scope.getStatusfacebook();
        $scope.init = function () {
                jQuery.AdminLTE.layout.activate();
                $scope.id = '';
                $scope.id = $stateParams.param1;
                $scope.multiFile = [];
                console.log('stat', $stateParams);
                $scope.txtImage = 'ไม่พอข้อมูล';
                $scope.showTxtImage = true;
        };
        $scope.getImage = function () {
                var urlImages = $scope.urlConfig + 'getImage.php';
                $http.post(urlImages, { 'id': $scope.id })
                        .success(function (data) {
                                $scope.multiFile = data.image;
                                if ($scope.multiFile == '' || $scope.multiFile == null) {
                                        console.log('null');
                                        $scope.showTxtImage = false;
                                } else {
                                        console.log('have');
                                        $scope.showTxtImage = true;
                                }
                        })
                        .error(function (err) {
                                console.log('err', err);
                                return;
                        });
        };
        $scope.init();
        $scope.getImage();
}])
