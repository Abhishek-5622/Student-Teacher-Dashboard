app.controller('analysisController', function ($scope, $http, $rootScope, $location, myFact) {
    
    $scope.FetchAnalyticDetails = function (fetchSchool, limit) {
        var data = {
            school: fetchSchool,
            limit: limit
        }
        $http.post("http://localhost:8000/indiviualSchoolStudent", { data }).then(function (res) {
            $rootScope.indivualschoolStudentArr = res.data
        }).catch(function (err) {
            console.log(err)
        })
    }

    $scope.FetchTop3StudentOfArea = function (AreaName) {
        var data = {
            area: AreaName
        }
        $http.post("http://localhost:8000/topAreaStudent", { data }).then(function (res) {

            $rootScope.indivualschoolStudentArr = res.data

        }).catch(function (err) {
            console.log(err)
        })

        $scope.FetchTop3StudentDetails = function () {
            $http.get("http://localhost:8000/topStudent").then(function (res) {
                $rootScope.indivualschoolStudentArr = res.data
            }).catch(function (err) {
                console.log(err)
            })
        }
        
    }


    $scope.fetchstudentAccToPer = function (schoolName, crteria) {

        var data = {
            school: schoolName,
            crteria: crteria
        }
        $http.post("http://localhost:8000/criteria", { data }).then(function (res) {
            $rootScope.indivualschoolStudentArr = res.data
        }).catch(function (err) {
            console.log(err)
        })
    }

    })