// *************************Script file *********************************

var app = angular.module('portfolio', ['ngRoute', 'ui.bootstrap', 'ngTouch', 'ngAnimate'])

// interceptor 
app.config(function ($httpProvider) {
    $httpProvider.interceptors.push(["$rootScope", function ($rootScope, $q) {
        return {
            request: function (config) {
                console.log('request started...');
                //Validating the requests and assign the csrf token to each requests   
                var token = document.cookie
                config.headers['x-csrf-token'] = token;
                return config;
            },
            requestError: function (rejection) {
                console.log(rejection);
                // Contains the data about the error on the request and return the promise rejection.    
                return $q.reject(rejection);
            },
            response: function (result) {
                console.log('request completed');
                return result;
            },
            // handle request response
            responseError: function (response) {
                console.log('response error started...');
                //Check different response status.   
                if (response.status === 400) {
                    $rootScope.ErrorMsg = "Bad Request";
                    $rootScope.showFeedBack($rootScope.ErrorMsg)
                }
                if (response.status === 401) {
                    $rootScope.ErrorMsg = "Unauthorized User";
                    $rootScope.showFeedBack($rootScope.ErrorMsg)
                }

                if (response.status === 500) {
                    $rootScope.ErrorMsg = "Internal Server Error";
                    $rootScope.showFeedBack($rootScope.ErrorMsg)
                }

                if (response.status === 404) {
                    $rootScope.ErrorMsg = "Request Not Found";
                    $rootScope.showFeedBack($rootScope.ErrorMsg)
                }
                return response;
            }
        };
    }]);
});

// run app
app.run(["$rootScope", "$timeout", function ($rootScope, $timeout) {
    $rootScope.showFeedBack = function (message) {
        $rootScope.isVisible = true;
        $rootScope.flashMessage = message;
        $timeout(function () { $rootScope.isVisible = false }, 10000)
    }
}]);

// Factory
app.factory('myFact', function ($rootScope, $location, $http) {
    return {
        Signup: Signup,
        Login: Login,
        FillStudentDetails: FillStudentDetails,
        DeleteDetails: DeleteDetails,
        Logout: Logout,
        Message:Message
    }

    // Signup
    function Signup(name, email, password, confirmPassword, url, mypath) {
        // empty data
        if (name === undefined || email === undefined || password === undefined || confirmPassword === undefined) {
            Message('danger','Please fill all details')
        }
        else {
            var flag = 0;
            if (password !== confirmPassword) {
                Message('danger','Password and confirm Password must be same')
                flag = 1;
            }
            if (flag == 0) {
                var data = {
                    "name": name,
                    "email": email,
                    "password": password
                }
                $http.post(url, {
                    data
                }).then(function (response) {
                    if (response.status == 200) {
                        $location.path(mypath);
                        Message('success','Account Created, Plz login')
                    }
                    else if(response.status==400){
                        Message('danger','Email Already Exist')
                    }
                }).catch(function (error) {
                    console.log(error);
                })
            }
        }
    }

    function Login(url, data, uemail, key, Fn, role) {
        localStorage.setItem('roles', role);
        $rootScope.GetRole();
        $http.post(url, {
            data
        }).then(function (response) {
            if (response.status == 200) {
                localStorage.setItem(key, uemail);
                
                // Go to dashBoard
                Fn(uemail);
                Message('success','Login Successfully')
            }
            else {
                Message('danger','Enter Correct Login Details')
            }
        }).catch(function (error) {
            console.log(error);
        })
    }

    function Logout(url) {
        $http.get(url).then(function (data) {
            if (data.status === 200) {
                $location.path('/')
                Message('danger','Logout')
            }
        }).catch(function (err) {
            console.log(err)
        })
    }

    function FillStudentDetails() {
        $location.path('/student-details')
    }

    function DeleteDetails(url, data, path, task) {
        $http.post(url, { data }).then(function (data) {
            $location.path(path)
            if (task === 'regSchool') {
                $rootScope.SchoolNameArrFn()
                $rootScope.areaNameArrFn()
                $rootScope.schoolPageChanged()
            }
            else {
                $rootScope.pageChanged()
            }

        }).catch(function (err) {
            console.log(err)
        })
    }
    
    function Message(type,msg){
        $.bootstrapGrowl(msg, {
            ele: 'body',
            type: type, 
            offset: { from: 'top', amount: 20 }, 
            align: 'right',
            width: 250, 
            delay: 4000,
            allow_dismiss: true,
            stackup_spacing: 10 
        });
    }
})

// routing
app.config(function ($routeProvider) {

    $routeProvider
        .when("/", {
            templateUrl: "main.html"
        })
        .when("/student-login", {
            templateUrl: "templates/student_templates/login.html",
            controller: 'studentController'
        })
        .when("/student-new_user", {
            templateUrl: "templates/student_templates/newUser.html",
            controller: 'studentController'
        })
        .when("/student-dashboard", {
            resolve: {
                function($location,myFact) {
                    if (document.cookie == '' || localStorage.getItem('roles') !== 'student') {
                        myFact.Message('danger',"You Are Not Allow To Access This Page")
                        $location.path('/')
                    }
                }
            },
            templateUrl: "templates/student_templates/studentDashboard.html",
            controller: 'studentController'
        })

        .when("/teacher-login", {
            templateUrl: "templates/teacher_templates/teacherlogin.html",
            controller: 'teacherController'
        })
        .when("/teacher-new_user", {
            templateUrl: "templates/teacher_templates/newTeacher.html",
            controller: 'teacherController'
        })
        .when("/teacher-dashboard", {
            resolve: {
                function($location,myFact) {
                    if (document.cookie == '' || localStorage.getItem('roles') !== 'teacher') {
                        myFact.Message('danger',"You Are Not Allow To Access This Page")
                        $location.path('/')
                    }
                }
            },
            templateUrl: "templates/teacher_templates/teacherDashboard.html",
            controller: 'teacherController'
        })
        .when("/student-details", {
            resolve: {
                function($location,myFact) {
                    if (document.cookie == '' || localStorage.getItem('roles') !== 'teacher') {
                        myFact.Message('danger',"You Are Not Allow To Access This Page")
                        $location.path('/')
                    }
                }
            },
            templateUrl: "templates/teacher_templates/detailForm.html",
            controller: 'teacherController'
        })

        .when("/analytic", {
            resolve: {
                function($location,myFact) {
                    if (document.cookie == '' || localStorage.getItem('roles') !== 'admin') {
                        myFact.Message('danger',"You Are Not Allow To Access This Page")
                        $location.path('/')
                    }
                }
            },
            templateUrl: "templates/admin_templates/analytic.html",
            controller: 'analysisController'
        })
        .when("/auth_dasboard", {
            resolve: {
                function($location,myFact) {
                    if (document.cookie == '' || localStorage.getItem('roles') !== 'admin') {
                        myFact.Message('danger',"You Are Not Allow To Access This Page")
                        $location.path('/')
                    }
                }
            },
            templateUrl: "templates/admin_templates/auth_dashboard.html"
        })
        .when("/admin-login", {
            templateUrl: "templates/admin_templates/admin_login.html"
        })
        .when("/view-student-details", {
            resolve: {
                function($location,myFact) {
                    if (document.cookie == '' || (localStorage.getItem('roles') !== 'admin' && localStorage.getItem('roles') !== 'teacher')) {
                        myFact.Message('danger',"You Are Not Allow To Access This Page")
                        $location.path('/')
                    }
                }
            },
            templateUrl: "templates/teacher_templates/viewStudentDetails.html"
        })
        .when("/registered-school", {
            resolve: {
                function($location,myFact) {
                    if (document.cookie == '' || localStorage.getItem('roles') !== 'admin') {
                        myFact.Message('danger',"You Are Not Allow To Access This Page")
                        $location.path('/')
                    }
                }
            },
            templateUrl: "templates/admin_templates/viewRegisteredSchool.html"
        })
        .when("/addNewAdmin", {
            resolve: {
                function($location,myFact) {
                    if (document.cookie == '' || localStorage.getItem('roles') !== 'admin') {
                        myFact.Message('danger',"You Are Not Allow To Access This Page")
                        $location.path('/')
                    }
                }
            },
            templateUrl: "templates/admin_templates/addNewAdmin.html"
        })
        .otherwise({ redirectTo: '/' });
})

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
            console.log(data);
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



