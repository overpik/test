app.controller('updateCtrl', ['$scope', '$http', '$log', '$timeout', '$state', '$stateParams', function ($scope, $http, $log, $timeout, $state, $stateParams) {
        $scope.getStatusfacebook();
        $scope.init = function () {
                jQuery.AdminLTE.layout.activate();
                $scope.id = '';
                $scope.id = $stateParams.param1;

                $scope.data = {};
                //person
                $scope.data.fullName = '';
                $scope.data.category = '';
                $scope.data.talent = '';
                $scope.data.education = '';
                $scope.data.train = '';

                //data
                $scope.data.details = '';
                $scope.data.title = '';

                //all
                $scope.data.id = '';
                $scope.data.latitude = '';
                $scope.data.longitude = '';
                $scope.data.locationName = '';
                $scope.data.timeline = '';
                $scope.data.note = '';
                $scope.data.url = '';
                $scope.data.radius = '';
                $scope.data.startDate = '';
                $scope.data.endDate = '';
                $scope.locationAddress = '';
                $scope.address = '';

                $scope.files = [];
                $scope.multiFile = [];
                $scope.newMultiFile = [];
        };
        $scope.getID = function () {
                var urlUpdate = $scope.urlConfig + 'getdataID.php';
                $http.post(urlUpdate, { 'id': $scope.id })
                        .success(function (data) {
                                //person
                                $scope.data.fullName = data.fullName;
                                $scope.data.category = data.category;
                                $scope.data.talent = data.talent;
                                $scope.data.education = data.education;
                                $scope.data.train = data.train;

                                //data
                                $scope.data.details = data.details;
                                $scope.data.title = data.title;

                                //all
                                $scope.data.id = data.id;
                                $scope.data.latitude = data.latitude;
                                $scope.data.longitude = data.longitude;
                                $scope.data.locationName = data.locationName;
                                $scope.data.timeline = '';
                                $scope.data.note = data.note;
                                $scope.data.url = data.url;
                                $scope.data.radius = data.radius;
                                $scope.data.type = data.type;
                                $scope.locationAddress = data.locationName;
                                if (data.startDate == '' || data.startDate == null) {
                                        $scope.data.startDate = '';
                                } else {
                                        $scope.data.startDate = new Date(data.startDate.date.split(' ')[0]);
                                };
                                if (data.endDate == '' || data.endDate == null) {
                                        $scope.data.endDate = '';
                                } else {
                                        $scope.data.endDate = new Date(data.endDate.date.split(' ')[0]);
                                };

                                $scope.multiFile = data.image;

                                console.log(data)
                                $scope.setVisible();
                                $scope.initMap();
                        })
                        .error(function (err) {
                                console.log('err', err);
                                return;
                        });

        };
        $scope.setVisible = function () {
                $scope.showPerson = true;
                $scope.showData = true;
                if ($scope.data.type == 1) {
                        $scope.showPerson = false;
                        return;
                } else {
                        $scope.showData = false;
                }
        };
        $scope.initMap = function () {
                $('#us3').locationpicker({
                        location: {
                                latitude: $scope.data.latitude,
                                longitude: $scope.data.longitude
                        },
                        radius: $scope.data.radius,
                        zoom: 12,
                        inputBinding: {
                                latitudeInput: $('#us3-lat'),
                                longitudeInput: $('#us3-lon'),
                                radiusInput: $('#us3-radius'),
                                locationNameInput: $('#us3-address')
                        },
                        enableAutocomplete: true,
                        onchanged: function (currentLocation, radius, isMarkerDropped) {
                                $scope.data.latitude = currentLocation.latitude;
                                $scope.data.longitude = currentLocation.longitude;
                                $scope.getLatLong('1');
                        }
                });
        };
        $scope.getLatLong = function (id) {
                var geocoder = new google.maps.Geocoder;
                if (id == '1') {
                        var latlng = { lat: $scope.data.latitude, lng: $scope.data.longitude };
                        geocoder.geocode({ 'location': latlng }, function (results, status) {
                                if (status === 'OK') {
                                        if (results[1]) {
                                                $timeout(function () {
                                                        $scope.locationAddress = results[1].formatted_address;
                                                        //console.log('locationName', $scope.data.locationName)
                                                }, 1000);
                                        } else {
                                                console.log('No results found');
                                        }
                                } else {
                                        console.log('Geocoder failed due to: ' + status);
                                }
                        });
                        return;
                };
                if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(function (position) {
                                $scope.data.latitude = position.coords.latitude;
                                $scope.data.longitude = position.coords.longitude;
                                $scope.initLat = $scope.data.latitude;

                                $scope.initLong = $scope.data.longitude;
                                console.log($scope.data.latitude + ' ' + $scope.data.longitude);
                                var latlng = { lat: $scope.data.latitude, lng: $scope.data.longitude };
                                geocoder.geocode({ 'location': latlng }, function (results, status) {
                                        if (status === 'OK') {
                                                if (results[1]) {
                                                        $timeout(function () {
                                                                $scope.locationAddress = results[1].formatted_address;
                                                                console.log('locationName', $scope.locationAddress)
                                                        }, 1000);
                                                } else {
                                                        console.log('No results found');
                                                }
                                        } else {
                                                console.log('Geocoder failed due to: ' + status);
                                        }
                                });
                        });

                };
        };
        $scope.update = function () {
                $scope.data.locationName = $scope.address + ' ' + $scope.locationAddress;
                $scope.data.radius = $('#us3-radius').val();
                console.log($scope.data);
                var urlUpdate = $scope.urlConfig + 'update.php';
                $http.post(urlUpdate, $scope.data)
                        .success(function (data) {
                                console.log(data)
                                if ($scope.files == '' || $scope.files == null) {
                                        $scope.alert();
                                        return;
                                } else {
                                        $scope.uploadFile();
                                }

                        })
                        .error(function (err) {
                                console.log('err', err);
                                return;
                        });

        };
        $scope.alert = function () {
                bootbox.alert({
                        message: "อัปเดทเรียบร้อย",
                        callback: function () {
                                // $scope.getID();
                                $state.go('index.home', { 'data': $scope.data.type });
                        }
                })
        };
        $scope.back = function(){
                $state.go('index.home', { 'data': $scope.data.type });
        }
        $scope.testData = function () {
                $scope.data.locationName = $scope.address + ' ' + $scope.locationAddress;
                $scope.data.radius = $('#us3-radius').val();
                console.log('image upload', $scope.files);
                console.log('data', $scope.data);
        };
        $scope.fileNameChanged = function () {
                //console.log($scope.files)
                $timeout(function () {
                        angular.forEach($scope.files, function (item) {
                                $scope.multiFile.push({ 'id': Math.floor((Math.random() * 100000) + 1), 'name': item.name, 'url': item.url, 'file': item.file, 'update': 'true' });
                        });
                        console.log($scope.multiFile)
                }, 1000);

        };
        $scope.removeImage = function (res) {
                $scope.oldImage = [];
                angular.forEach($scope.multiFile, function (item) {
                        if (item.id == res) {
                                if (item.update == 'false') {
                                        console.log('delete form db' + item.id + ' ' + item.name)
                                        var urlDeleteImage = $scope.urlConfig + 'deleteImage.php';
                                        $http.post(urlDeleteImage, { 'id': item.id, 'name': item.name })
                                                .success(function (data) {
                                                        console.log('data', data);
                                                })
                                                .error(function (err) {
                                                        console.log('err', err);
                                                        return;
                                                });
                                }
                        } else {
                                $scope.oldImage.push(item);
                        }
                });
                $scope.multiFile = [];
                $scope.multiFile = $scope.oldImage;
        };
        $scope.uploadFile = function () {
                //$scope.files
                $scope.CheckImg = 0;
                $scope.CheckUploaded = 0;
                angular.forEach($scope.multiFile, function (item) {
                        if (item.update == 'true') {
                                $scope.CheckImg++;
                        };
                });
                if ($scope.CheckImg == '0') {
                        $scope.alert();
                        return;
                };
                $scope.uploadFilePerson = function (file, uploadUrl, id) {
                        var fd = new FormData();
                        fd.append('file', file);
                        fd.append('id', id);
                        $http.post(uploadUrl, fd, {
                                transformRequest: angular.identity,
                                headers: { 'Content-Type': undefined }
                        })
                                .success(function (res) {
                                        $scope.CheckUploaded++;
                                        if ($scope.CheckUploaded == $scope.CheckImg) {
                                                $scope.alert();
                                                return;
                                        };
                                        // console.log('Upload Success', res);
                                })
                                .error(function (error) {
                                        console.log(error);
                                });
                }
                angular.forEach($scope.multiFile, function (item) {
                        if (item.update == 'true') {
                                var file = item.file;
                                console.log('file is ');
                                console.dir(file);
                                var uploadUrl = "https://mvec.betimes.biz/mictService/upload.php";
                                var text = $scope.data.id;
                                $scope.uploadFilePerson(file, uploadUrl, text);
                        }
                });

        };
        $scope.init();
        $scope.getID();

}])
