app.controller('homeCtrl', ['$scope', '$http', '$log', '$timeout', '$state', '$location', '$localStorage', function ($scope, $http, $log, $timeout, $state, $location, $localStorage) {

    $scope.getStatusfacebook();
    $scope.setSelectTable = function () {
        $("#select2").select2();
    };

    $(document.body).on("change", ".select2", function () {
        if ($scope.boxInsert == false) {
            $scope.selectedType(2)
            return;
        }
        $scope.setLocationPath();
        $scope.selectedType($(".select2").val())
        var res = $(".select2 option:selected").text().substr(0, $(".select2 option:selected").text().length - 6);
        $scope.titleTalble = res;
    });
    $scope.setTitleTable = function () {
        if ($scope.boxInsert == false) {
            $scope.selectedType(2)
            return;
        }
        var res = $("#select2 option:selected").text();
        $scope.titleTalble = res;
    };
    $scope.init = function () {
        $scope.titleTalble = 'ปราชญ์';
        $scope.getDataAll = [{ "title": "" }, { "title": "" }, { "title": "" }, { "title": "" }, { "title": "" }, { "title": "" }, { "title": "" }, { "title": "" }, { "title": "" }, { "title": "" }]
        $scope.data = {};
        //person
        jQuery.AdminLTE.layout.activate();
        $scope.data.fullName = '';
        $scope.data.category = '';
        $scope.data.talent = '';
        $scope.data.education = '';
        $scope.data.train = '';

        //data
        $scope.data.details = '';
        $scope.data.title = '';

        //all
        $scope.data.latitude = '';
        $scope.data.longitude = '';
        $scope.data.locationName = '';
        $scope.data.note = '';
        $scope.data.url = '';
        $scope.data.radius = '';
        $scope.data.timeline = '';
        $scope.data.startDate = '';
        $scope.data.endDate = '';
        $scope.data.type = 1;

        $scope.address = '';
        $scope.locationAddress = '';

        $scope.files = [];
        $scope.multiFile = [];
        $scope.checkType = 'insert';

        $scope.repaging = false;
        $scope.loadingData = true;
        // $scope.search = '';

    };
    $scope.paging = function () {
        $scope.getLengthData = 0;
        $scope.take = 10;
        $scope.maxSize = 11;
        $scope.activated = function (page) {
            // $scope.getPageReturn = page;

            if (page == 1) {
                $scope.getPage = page;
            } else {
                $scope.getPage = page * 10 - 9;
            };

            if ($scope.data.type == '' || $scope.data.type == null) {

            } else {
                $scope.loadingData = false;
                if ($scope.search == '' || $scope.search == null) {
                    var urlGetData = $scope.urlConfig + 'getdataParam.php?page=' + page + '&search=';
                } else {
                    var urlGetData = $scope.urlConfig + 'getdataParam.php?page=' + page + '&search=' + $scope.search;
                }
                $http.post(urlGetData, { 'type': $scope.data.type })
                    .success(function (res) {
                        $timeout(function () {
                            $scope.loadingData = true;
                        }, 200);
                        $scope.getDataAll = '';
                        $scope.getDataAll = res;
                        // console.log(res.image);
                        // console.log(res);
                    }).error(function (error) {
                        $timeout(function () {
                            $scope.loadingData = true;
                        }, 10000);
                    });
            }
        }
    };
    $scope.initMap = function () {
        // console.log('initMap');
        $('#us3').locationpicker({
            location: {
                latitude: $scope.data.latitude,
                longitude: $scope.data.longitude
            },
            radius: 0,
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
                // console.log($scope.data.latitude + ' ' + $scope.data.longitude);
                // $scope.initMap();
                var latlng = { lat: $scope.data.latitude, lng: $scope.data.longitude };
                geocoder.geocode({ 'location': latlng }, function (results, status) {
                    if (status === 'OK') {
                        if (results[1]) {
                            $timeout(function () {
                                $scope.locationAddress = results[1].formatted_address;
                                $scope.initMap();
                                // console.log('locationName', $scope.locationAddress)
                            }, 1000);
                        } else {
                            $scope.data.latitude = 13.7245601;
                            $scope.data.longitude = 100.4930238;
                            $scope.initMap();
                            console.log('No results found');
                        }
                    } else {
                        $scope.data.latitude = 13.7245601;
                        $scope.data.longitude = 100.4930238;
                        $scope.initMap();
                        console.log('Geocoder failed due to: ' + status);
                    }
                });
            }, function (error) {
                $scope.data.latitude = 13.7245601;
                $scope.data.longitude = 100.4930238;
                $scope.initMap();
                $scope.getLatLong('1');
                console.log(error)
            });

        };
    };
    $scope.setVisible = function () {
        $scope.setVisibleInit = function () {
            $scope.showPerson = true;
            $scope.showData = true;
            $scope.showTablePerson = true;
            $scope.showTableData = true;
            $scope.boxData = false;
            $scope.boxInsert = true;
            $scope.showSave = true;
            $scope.boxImage = true;
        };
        $scope.setVisibleInit();
        $scope.boxMap = true;
        $scope.setShowBoxData = function () {
            $scope.boxInsert = true;
            $scope.boxData = false;
        };
        $scope.setShowBoxInsert = function () {
            $scope.boxData = true;
            $scope.boxInsert = false;
        };
        $scope.showAllInsert = function () {
            if ($scope.data.type == '1') {
                console.log('showPerson');
                $scope.showData = true;
                $scope.showPerson = false;
            } else {
                console.log('showData');
                $scope.showPerson = true;
                $scope.showData = false;
            };
        }



    };
    $scope.setSelect = function () {
        var urlData = $scope.urlConfig + 'data.php';
        $http.get(urlData)
            .success(function (res) {
                $scope.type = res.type;
                $scope.types = {
                    "value": '1',
                    "values": $scope.type
                };
                console.log($scope.type)
            }).error(function (err) {
                $scope.showNotification();
            });
    };
    $scope.setPage = function () {
        $scope.dataPage = [];
        $scope.dataPages = {
            "value": '1',
            "values": $scope.dataPage
        };
    };
    $scope.clearData = function () {
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
        $scope.data.latitude = '';
        $scope.data.longitude = '';
        $scope.data.locationName = '';
        $scope.data.note = '';
        $scope.data.url = '';
        $scope.data.radius = '';
        $scope.data.timeline = '';
        $scope.data.startDate = '';
        $scope.data.endDate = '';

        $scope.address = '';
        $scope.locationAddress = '';

        $scope.files = [];
        $scope.multiFile = [];
        $scope.checkType = 'insert';
        // $scope.init();
        $scope.getLatLong();
    };
    $scope.getCount = function (type) {
        $scope.dataPage = [];
        // console.log($scope.search)
        if ($scope.search == '' || $scope.search == null) {
            var ulrCount = $scope.urlConfig + 'countPagin.php?type=' + type + '&search=';
        } else {
            var ulrCount = $scope.urlConfig + 'countPagin.php?type=' + type + '&search=' + $scope.search;
        };
        $http.get(ulrCount)
            .success(function (res) {
                $scope.getLengthData = 0;
                // console.log(res)
                $timeout(function () {
                    $scope.getLengthData = res.countPaging;
                    if ($scope.repaging == true) {
                        // $location.url('index/home?page=' + Math.ceil(res.countPaging / 10))
                        $scope.setLocationPath();
                        // $scope.activated(1);
                        $scope.repaging = false;
                    }
                }, 500);
            })
            .error(function (res) {
                // console.log("Connect Fail")
                // $scope.showNotification();
            });
    };
    $scope.selectedType = function (res) {
        $scope.setLocationPath();
        $scope.handleType();
        $scope.dataPage = [];
        $scope.data.type = res;
        // console.log('type', res);
        if (res == undefined || res == null) {
            $scope.boxMap = true;
            $scope.Image = true;
            return;
        } else {
            console.log()
            if ($scope.boxInsert == false) {
                $scope.showAllInsert();
                $scope.boxMap = false;
                $scope.boxImage = false;
                // $scope.types.value = $scope.data.type;
                $scope.dataPage = [];


            } else {
                // $scope.types.value = $scope.data.type;
                $scope.boxMap = true;
                $scope.boxImage = true;
            }

        };



        $scope.getCount(res);
        $scope.activated(1)
        // var urlGetData = $scope.urlConfig + 'getdataParam.php?page=1&search=';
        // $scope.typeParam = { 'type': res };
        // $http.post(urlGetData, $scope.typeParam)
        //     .success(function (res, status) {
        //         // console.log(res);
        //         $scope.getDataAll = res;
        //         $scope.showAllInsert();
        //     })
        //     .error(function (err) {
        //         console.log('err', err);
        //         return;
        //     });
    };
    $scope.handleType = function () {
        $scope.boxType = true;
        $scope.showDataType = true;

        $scope.showDataTypeFcn = function () {
            $scope.getLengthData = 0;
            $scope.setVisibleInit();
            $scope.boxMap = true;
            $scope.boxType = false;
            $scope.showDataType = false;
            // $scope.setVisible();
        };
    };
    $scope.setLocationPath = function () {
        $location.url('index/home?page=1')
    }
    $scope.fileNameChanged = function () {
        //console.log($scope.files)
        $timeout(function () {
            angular.forEach($scope.files, function (item) {
                $scope.multiFile.push({ 'id': Math.floor((Math.random() * 100000) + 1), 'name': item.name, 'url': item.url, 'file': item.file });
            });
            console.log($scope.multiFile)
        }, 1000);

    };
    $scope.showImage = function (id) {
        // console.log(id)
        // $state.go('image', { 'data': obj.image });
        var url = $state.href('index.image', { param1: id });
        window.open(url, '_blank');
    };
    $scope.removeImage = function (res) {
        $scope.oldImage = [];
        angular.forEach($scope.multiFile, function (item) {
            if (item.id == res) {
            } else {
                $scope.oldImage.push(item);
            }
        });
        $scope.multiFile = [];
        $scope.multiFile = $scope.oldImage;
    };
    $scope.insertData = function () {
        // console.log('insertData');
        $scope.data.locationName = $scope.address + ' ' + $scope.locationAddress;
        $scope.data.radius = $('#us3-radius').val();
        // console.log($scope.data);
        var urlInsert = $scope.urlConfig + 'insertService.php';
        $http.post(urlInsert, $scope.data)
            .success(function (data) {
                console.log('Resdata', data);
                if ($scope.files == '' || $scope.files == null) {
                    $scope.alert();
                } else {
                    $scope.imageId = data.id;
                    $scope.uploadFile();
                }

            })
            .error(function (err) {
                console.log('err', err);
                return;
            });
    };
    $scope.updateData = function (id) {
        // console.log(id)
        $state.go('index.update', { param1: id });
        // var url = $state.href('update', { param1: id });
        // window.open(url, '_blank');
    };
    $scope.delete = function (id) {
        bootbox.confirm("ต้องการลบข้อมูลหรือไม่", function (result) {
            if (result == true) {
                var urlDelete = $scope.urlConfig + 'delete.php';
                $http.post(urlDelete, { 'id': id })
                    .success(function (data) {
                        console.log(data)
                        $scope.repaging = true;
                        $scope.getCount($scope.data.type);
                        $scope.selectedType($scope.data.type)
                    })
                    .error(function (err) {
                        console.log('err', err);
                        $scope.showNotification('ไม่สามารถลบได้ ขาดการเชื่อมต่อจาก Server');
                        return;
                    });
            };
        });

    };
    $scope.uploadFile = function () {
        //$scope.files
        $scope.CheckImg = 0;
        $scope.CheckUploaded = 0;
        angular.forEach($scope.multiFile, function (item) {
            $scope.CheckImg++;
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
                    $scope.showNotification();
                    console.log(error);
                });
        }
        angular.forEach($scope.multiFile, function (item) {
            var file = item.file;
            console.log('file is ');
            console.dir(file);
            var uploadUrl = "https://mvec.betimes.biz/mictService/upload.php";
            var text = $scope.imageId;
            $scope.uploadFilePerson(file, uploadUrl, text);
        });
    };
    $scope.alert = function () {
        bootbox.alert({
            message: "บันทึกเรียบร้อย",
            callback: function () {
                console.log('บันทึกเรียบร้อย');
                $scope.setShowBoxData();
                $scope.boxMap = true;
                $scope.Image = true;
                $scope.repaging = true;

                $scope.getCount($scope.data.type);
                $scope.selectedType($scope.data.type)

            }
        })
    };

    $scope.init();
    $scope.handleType();
    $scope.setVisible();
    $scope.setSelect();
    $scope.setPage();
    $scope.paging();


    if ($state.params.data == '' || $state.params.data == null) {
        // console.log('null')
        $scope.setLocationPath();
        $scope.selectedType('1');
    } else {
        // console.log($state.params.data)
        // $scope.types.value = $state.params.data;
        $scope.data.type = $state.params.data;
        $location.url('index/home?page=' + $state.params.data)
        $scope.selectedType($state.params.data);
    }


}])
app.directive('ngFileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var model = $parse(attrs.ngFileModel);
            var isMultiple = attrs.multiple;
            var modelSetter = model.assign;
            element.bind('change', function () {
                var values = [];
                angular.forEach(element[0].files, function (item) {
                    var value = {
                        // File Name 
                        name: item.name,
                        //File Size 
                        size: item.size,
                        //File URL to view 
                        url: URL.createObjectURL(item),
                        // File Input Value 
                        file: item
                    };
                    values.push(value);
                });
                scope.$apply(function () {
                    if (isMultiple) {
                        modelSetter(scope, values);
                    } else {
                        modelSetter(scope, values[0]);
                    }
                });
            });
        }
    };
}]);
