app.controller('typeCtrl', ['$scope', '$http', '$log', '$timeout', '$state', '$location', '$localStorage', function ($scope, $http, $log, $timeout, $state, $location, $localStorage) {
    $scope.getStatusfacebook();
    $(document.body).on("change", ".select2", function () {
        $scope.setLocationPath();
        $scope.selectedType($(".select2").val())
    });
    $scope.init = function () {
        jQuery.AdminLTE.layout.activate();
        $scope.files = [];
        $scope.checkType = 'insert';

        $scope.repagingType = false;
        $scope.loadingType = true;
        $scope.typePaging = [{ "name": "" }, { "name": "" }, { "name": "" }, { "name": "" }, { "name": "" }, { "name": "" }, { "name": "" }, { "name": "" }, { "name": "" }, { "name": "" }]
    };
    $scope.getTypeCount = function () {
        $scope.typegetLengthData = 0;
        $scope.typetake = 10;
        $scope.typemaxSize = 11;
        $scope.typeactivated = function (page) {
            $scope.loadingType = false;
            $scope.getTypePageReturn = page;
            if (page == 1) {
                $scope.getTypePage = page;
            } else {
                $scope.getTypePage = page * 10 - 9;
            };
            if ($scope.typeSearch == '' || $scope.typeSearch == null) {
                var urlGetType = $scope.urlConfig + 'getTypeParam.php?page=' + page + '&search=';
            } else {
                var urlGetType = $scope.urlConfig + 'getTypeParam.php?page=' + page + '&search=' + $scope.typeSearch;
            }
            $http.get(urlGetType)
                .success(function (type) {
                    $timeout(function () {
                        $scope.loadingType = true;
                    }, 200);
                    $scope.typePaging = type.data;
                    // console.log(type.data)
                    $scope.typegetLengthData = type.countPaging;
                }).error(function (err) {
                    $timeout(function () {
                        $scope.loadingType = true;
                        $scope.showNotification();
                    }, 10000);
                });
        }

    };
    $scope.setLocationPath = function () {
        $location.url('index/type?page=1')
    };
    $scope.setInUpType = function () {
        $scope.txtType = 'เพิ่มหมวดหมู่';
        $scope.checkType = 'insert';
        $scope.typeId = '';
        $scope.typeData = '';
        $scope.icon = '';
        // console.log($scope.checkType);
    };
    $scope.inSertType = function () {
        // console.log($scope.typeData);
        //insert
        if ($scope.checkType == 'insert') {
            // console.log($scope.checkType);
            if ($scope.typeData == '' || $scope.typeData == null) {
                return;
            }
            var urlInsertType = $scope.urlConfig + 'insertType.php';
            $http.post(urlInsertType, { 'name': $scope.typeData })
                .success(function (data) {
                    console.log(data)
                    if ($scope.icon == '' || $scope.icon == null) {
                        $scope.alertType();
                        return;
                    } else {
                        $scope.iconID = data.type_id;
                        $scope.uploadFileIcon();
                    };

                })
                .error(function (err) {
                    console.log('err', err);
                    $scope.showNotification();
                    return;
                });
        } else {
            //update
            console.log($scope.checkType);
            var urlInsertType = $scope.urlConfig + 'updateType.php';
            $http.post(urlInsertType, { 'name': $scope.typeData, 'id': $scope.typeId })
                .success(function (data) {
                    // console.log(data)
                    if ($scope.icon.update == 'false') {
                        $scope.alertType();
                        return;
                    } else {
                        $scope.iconID = $scope.typeId;
                        $scope.uploadFileIcon();
                    };
                })
                .error(function (err) {
                    $scope.showNotification();
                    // console.log('err', err);
                    return;
                });
        };
    };
    $scope.uploadFileIcon = function () {
        var fileIcon = $scope.icon;
        // console.log('file icon is ');
        // console.dir(fileIcon.file);
        var uploadUrlIcon = $scope.urlConfig + "uploadicon.php";
        var type_id = $scope.iconID;
        $scope.uploadFileToUrl = function (file, uploadUrl, id) {
            var fd = new FormData();
            fd.append('file', file);
            fd.append('id', id);
            $http.post(uploadUrl, fd, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            })
                .success(function (res) {
                    $scope.alertType();
                    // console.log('Upload Success', res);
                })
                .error(function (error) {
                    // console.log(error);
                });
        }
        $scope.uploadFileToUrl(fileIcon.file, uploadUrlIcon, type_id);


    };
    $scope.updateType = function (obj) {
        $scope.txtType = 'แก้ไขหมวดหมู่'
        $scope.checkType = 'update';
        $scope.typeId = obj.id;
        $scope.typeData = obj.name;
        if (obj.url == '' || obj.url == null) {
            $scope.icon = '';
        } else {
            $scope.icon = { 'url': obj.url, 'update': 'false' };
        }

        $('#insertType').modal({
            backdrop: 'static',
            keyboard: false
        })
        // $scope.imageAll.push({ 'id': obj.id, 'url': obj.url, 'update': 'false' })
    };
    $scope.deleteType = function (id, name) {
        bootbox.confirm("ต้องการลบข้อมูลหรือไม่", function (result) {
            if (result == true) {
                var urlDeleteType = $scope.urlConfig + 'deleteType.php';
                $http.post(urlDeleteType, { 'id': id, 'name': name })
                    .success(function (data) {
                        $scope.typeactivated($scope.getTypePageReturn);
                    })
                    .error(function (err) {
                        $scope.showNotification();
                        return;
                    });
            };
        });
    };
    $scope.alertType = function () {
        bootbox.alert({
            message: "บันทึกหมวดหมู่เรียบร้อย",
            callback: function () {
                $scope.repagingType = true;
                $scope.setLocationPath();
                $scope.typeactivated(1);
                $('#insertType').modal('hide');
            }
        })
    };
    $scope.init();
    $scope.getTypeCount();


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
