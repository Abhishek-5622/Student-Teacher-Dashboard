// *****************ModelHandlerController****************

app.controller("ModelHandlerController", function ($scope, $uibModalInstance, $http, $rootScope,myFact) {

    // cancel modal
    $scope.cancelModal = function () {
        $uibModalInstance.result.catch(function () { $uibModalInstance.close(); });
        $uibModalInstance.dismiss('close');
    }

    // Add city n region and area
    $scope.ok = function (region, city, area) {
        if (region != undefined && city != undefined && area != undefined) {
            var data = {
                city: city,
                region: region
            }
            var data2 = {
                area: area,
                city: city
            }
            var promise1 = $http.post('http://localhost:8000/admin/addcity', { data })
            var promise2 = $http.post('http://localhost:8000/admin/addArea', { data2 })
            Promise.all([promise1, promise2]).then(function (data) {
                $rootScope.FetchAllregionName()
            }).catch(function (err) {
                console.log(err)
            })
            $uibModalInstance.close('save');
            myFact.Message('success',"Data Added")
        }
        else{
        
            myFact.Message('danger',"Please enter all details")
        }
    }
});