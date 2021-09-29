// ****************Ananlysis**********************

app.controller('analysisController', function ($scope, $http, $rootScope) {

    // fetch school => student
    $scope.FetchAnalyticDetails = function (fetchSchool, limit) {
        var data = {
            school: fetchSchool,
            limit: limit
        }
        $http.post("http://localhost:8000/analysis/indiviualSchoolStudent", { data }).then(function (res) {
            $rootScope.indivualschoolStudentArr = res.data
        }).catch(function (err) {
            console.log(err)
        })
    }

    // fetch top 3 student of india
    $scope.FetchTop3StudentDetails = function () {
        $http.get("/analysis/topStudent").then(function (res) {
            $rootScope.indivualschoolStudentArr = res.data
        }).catch(function (err) {
            console.log(err)
        })
    }

    // fetch top 3 student of that region
    $scope.FetchTop3StudentOfRegion = function (regionName) {
        var data = {
            region: regionName
        }
        $http.post("http://localhost:8000/analysis/topRegionStudent", { data }).then(function (res) {
            $rootScope.indivualschoolStudentArr = res.data
        }).catch(function (err) {
            console.log(err)
        })
    }

    // fetch top 3 student of that area
    $scope.FetchTop3StudentOfArea = function (AreaName) {
        var data = {
            area: AreaName
        }
        $http.post("http://localhost:8000/analysis/topAreaStudent", { data }).then(function (res) {
            $rootScope.indivualschoolStudentArr = res.data
        }).catch(function (err) {
            console.log(err)
        })
    }

    // fetch all student that having percentage greater than criteria percentage
    $scope.fetchstudentAccToPer = function (schoolName, crteria) {
        var data = {
            school: schoolName,
            crteria: crteria
        }
        $http.post("http://localhost:8000/analysis/criteria", { data }).then(function (res) {
            $rootScope.indivualschoolStudentArr = res.data
        }).catch(function (err) {
            console.log(err)
        })
    }

    // top 3 student of that city
    $scope.FetchTop3StudentOfCity=function(cityName){
        var data = {
            city: cityName
        }
        $http.post("http://localhost:8000/analysis/city", { data }).then(function (res) {
            $rootScope.indivualschoolStudentArr = res.data
        }).catch(function (err) {
            console.log(err)
        })
    }
})



