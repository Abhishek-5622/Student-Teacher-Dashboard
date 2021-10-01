// *************************Script file *********************************

var app = angular.module('portfolio', ['ngRoute', 'ui.bootstrap', 'ngTouch', 'ngAnimate','myroute','myInterceptor','Factory','myAppRun'])

// controller
app.controller('mainCtrl', function ($scope, $http, $rootScope, $location, myFact, $log) {
    // function call when page load
    $scope.init = function () {
        var email = localStorage.getItem('C_Email');
        var Temail = localStorage.getItem('T_Email');
        $scope.techEmail = Temail
        $rootScope.SchoolNameArrFn();
        $rootScope.areaNameArrFn();
        $rootScope.getallRegionSchool()
        $rootScope.FetchAllregionName()
        $rootScope.getallCitySchool()
        $rootScope.GetRole();
    };

    // get role 
    $rootScope.GetRole=function(){
        var data={
            myrole:localStorage.getItem('roles')
        }
        $http.post('/getRoleValue',{data}).then(function(data){
            
        }).catch(function(err){
            console.log(err)
        })
    }

    // Go to  Dashboard
    $scope.goToTeacherDashBoard = function () {
        if (localStorage.getItem('roles') == 'admin') {
            $location.path('/auth_dasboard')
        }
        else if (localStorage.getItem('roles') == 'teacher') {

            $location.path('/teacher-dashboard')
        }
    }

    // ********************Admin***********************

    // go to new admin tab
    $scope.addNewAdmin = function () {
        $location.path("/addNewAdmin")
    }

    // create new admin 
    $scope.addAdminFn = function (newAdminName, newAdminEmail, newAdminPassword) {
        if (newAdminName === undefined || newAdminEmail === undefined || newAdminPassword === undefined) {
            myFact.Message('danger',"Please enter all details")
        }
        else {
            var data = {
                "name": newAdminName,
                "email": newAdminEmail,
                "password": newAdminPassword
            }
            $http.post("http://localhost:8000/admin/addNewAdmin", {
                data
            }).then(function (response) {
                if (response.status == 200) {
                    $location.path('/auth_dasboard');
                    myFact.Message('success','Account Created')
                }
                else if(response.status==400){
                    myFact.Message('danger','Email already Exist')
                }
            }).catch(function (error) {
                console.log(error);
            })
        }
    }

    // Admin login 
    $scope.getAdminData = function (name, email, password) {
        if (name === undefined || email === undefined || password === undefined) {
            myFact.Message('danger',"Please enter all details")
        }
        else {
            localStorage.setItem('roles', 'admin');
            $rootScope.GetRole();
            var data = {
                name: name,
                email: email,
                password: password
            }
            $http.post('http://localhost:8000/admin/adminAuth', { data }).then(function (data) {
                if (data.status == 200) {
                    
                    $location.path('/auth_dasboard')
                }
                else {
                    myFact.Message('danger','Enter Correct Login Details')
                }

            }).catch(function (err) {
                console.log(err)
            })
        }
    }

    // Add school
    $scope.AddSchoolFn = function (school_name, school_email, city, region, area) {
        if (school_name === undefined || school_email === undefined || city === undefined || region === undefined || area === undefined) {
            myFact.Message('danger','Please fill all infomation')
        }
        else {
            var myObj = {
                school_name: school_name,
                school_email: school_email,
                city: city,
                region: region,
                area: area
            }
            $http.post("http://localhost:8000/admin/addSchoolDetails", {
                myObj
            }).then(function (response) {
                if (response.status == 200) 
                {
                    myFact.Message('success',"School Added")
                    $location.path('/registered-school')
                    $scope.init()
                    $rootScope.schoolPageChanged()
                    
                }
                // else if(response.status==400){
                //     myFact.Message('danger',"Validation Fail")
                // }
            }).catch(function (error) {
                console.log("Myerr", error);
            })
        }
    }

    // go to register school page
    $scope.viewAllRegisterSchool = function () {
        $location.path('/registered-school')
    }

    // Pagination 
    // function that give total no. of school document modal
    $scope.getLengthOfSchool = function () {
        $http.get('/admin/getSchoolLength').then(function (data) {
            $scope.totalitems = data.data
        }).catch(function (err) {
            console.log(err)
        })
    }
    $scope.getLengthOfSchool()

    let data = {};
    data.page = 0;
    data.limit = 5;
    $scope.itemsPerPage = 5;
    $scope.currentPage = 1;
    $scope.pagination = {
        currentPage: 1
    };
    $scope.SchoolAllDetailsArr = []
    $rootScope.schoolPageChanged = function () {
        // console.log("Page changed to: " + $scope.pagination.currentPage);
        data.page = $scope.pagination.currentPage - 1;
        $http.post("/admin/fetchSchoolDetails", data).then(function (response) {
            $scope.SchoolAllDetailsArr = response.data
        });
    };
    $rootScope.schoolPageChanged()

    // function that remove duplicate from array
    $scope.removeDuplicate = function (arr) {
        $scope.uniqueNames = [];
        arr.forEach((val, i, arr) => {
            if (!$scope.uniqueNames.includes(val)) {
                $scope.uniqueNames.push(val);
            }
        });
        return $scope.uniqueNames
    }

    // go to analytic page
    $scope.analticFn = function () {
        $location.path("/analytic")
    }

     // get all school name present (Db) in array
     $rootScope.SchoolNameArrFn = function () {
        $scope.SchoolNameList = [];
        $http.get("http://localhost:8000/analysis/schoolName").then(function (response) {
            for (let i = 0; i < response.data.length; i++) {
                $scope.SchoolNameList.push(response.data[i].schoolname)
            }
        }).catch(function (error) {
            console.log(error);
        })
    }

    // get all region name present (Db) in array
    $scope.regionSchoolNameList = [];
    $rootScope.getallRegionSchool = function () {
        $http.get("http://localhost:8000/analysis/schoolName").then(function (response) {
            for (let i = 0; i < response.data.length; i++) {
                $scope.regionSchoolNameList.push(response.data[i].region)
            }
            $scope.regionSchoolNameList = $scope.removeDuplicate($scope.regionSchoolNameList)
        }).catch(function (error) {
            console.log(error);
        })
    }

     // get all city name present (Db) in array
     $scope.citySchoolNameList = [];
     $rootScope.getallCitySchool = function () {
         $http.get("http://localhost:8000/analysis/schoolName").then(function (response) {
             for (let i = 0; i < response.data.length; i++) {
                 $scope.citySchoolNameList.push(response.data[i].city)
             }
             $scope.citySchoolNameList = $scope.removeDuplicate($scope.citySchoolNameList)
         }).catch(function (error) {
             console.log(error);
         })
     }

    // get all area name present (Db) in array
    $rootScope.areaNameArrFn = function () {
        $scope.areaNameList = [];
        $http.get("http://localhost:8000/analysis/schoolName").then(function (response) {
            for (let i = 0; i < response.data.length; i++) {
                $scope.areaNameList.push(response.data[i].area)
            }
            $scope.areaNameList = $scope.removeDuplicate($scope.areaNameList)
        }).catch(function (error) {
            console.log(error);
        })
    }

    // cancel form => go to 
    $scope.cancaeldetailsFn = function () {
        $location.path('/teacher-dashboard')
    }

    // delete school
    $scope.deleteSchoolDetailsFromDb = function (id) {
        var data = {
            id: id
        }
        myFact.DeleteDetails("http://localhost:8000/admin/deleteSchool", data, '/registered-school', 'regSchool')

    }

    // fetch all school of that area
    $scope.FetchAllSchoolAccToArea = function (areaName) {
        $http.post('/analysis/fetchallAreaSchool', {
            area: areaName
        }).then(function (data) {
            $scope.SchoolAllDetailsArr = data;
            $scope.SchoolAllDetailsArr = $scope.SchoolAllDetailsArr.data
            $location.path('/registered-school')


        }).catch(function (err) {
            console.log(err);
        })
    }

    // for menu bar 
    $scope.isCollapsed = true;
    $scope.isCollapsedHorizontal = false;

    // fetch area
    $scope.FetchAllareaName = function (city) {
        $scope.areaNameArr = [];
        var data = {
            city: city
        }
        $http.post('/analysis/getareaList', { data }).then(function (data) {

            for (let i = 0; i < data.data.length; i++) {
                $scope.areaNameArr.push(data.data[i].area)
            }
            $scope.areaNameArr = $scope.removeDuplicate($scope.areaNameArr)
        }).catch(function (err) {
            console.log(err)
        })
    }

    $scope.addSchoolScreenFn = function () {
        $location.path('/auth_dasboard')
    }

    // fetch region
    $rootScope.FetchAllregionName = function () {
        $scope.regionNameList = [];
        var data = {
            my: "my"
        }
        $http.post('/analysis/getRegionList', { data }).then(function (data) {
            for (let i = 0; i < data.data.length; i++) {
                $scope.regionNameList.push(data.data[i].region)
            }
            $scope.regionNameList = $scope.removeDuplicate($scope.regionNameList)
           
        }).catch(function (err) {
            console.log(err)
        })

    }

    // fetch city
    $scope.FetchAllCityName = function (region) {
        $scope.cityNameArr = [];
        var data = {
            region: region
        }
        $http.post('/analysis/getcityList', { data }).then(function (data) {

            for (let i = 0; i < data.data.length; i++) {
                $scope.cityNameArr.push(data.data[i].city)
            }
            $scope.cityNameArr = $scope.removeDuplicate($scope.cityNameArr)
        }).catch(function (err) {
            console.log(err)
        })
    }

    // Asmin logout
    $scope.Adminlogout = function () {
        myFact.Logout('/admin/adminlogout')
    }

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
      };

});



