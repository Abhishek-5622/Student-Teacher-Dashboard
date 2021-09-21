// *************************Script file *********************************

var app = angular.module('portfolio', ['ngRoute', 'ui.bootstrap', 'ngTouch', 'ngAnimate'])

// interceptor 
app.config(function ($httpProvider) {
    $httpProvider.interceptors.push(["$rootScope", function ($rootScope) {
        return {
            // handle request response
            responseError: function (response) {
                console.log('response error started...');
                //Check different response status.   
                if (response.status === 400) {
                    $rootScope.ErrorMsg = "Bad Request";
                    $rootScope.showFeedBack($rootScope.ErrorMsg)
                }
                if (response.status === 401) {
                    $rootScope.ErrorMsg = "Unauthorized Error";
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

app.factory('myFact', function ($rootScope, $location, $http) {
    return {
        FillStudentDetails: FillStudentDetails,
        Login: Login,
        Signup: Signup,
        DeleteDetails: DeleteDetails
    }

    function FillStudentDetails() {
        $location.path('/student-details')
    }

    function Login(url, data, uemail, key, Fn, role) {
        $http.post(url, {
            data
        }).then(function (response) {
            if (response.status == 200) {
                // $window.location.href ='/student-dashboard?email='+uemail;  
                localStorage.setItem(key, uemail);
                localStorage.setItem('roles', role);
                Fn(uemail);
                // $location.path('/student-dashboard')  
            }
            else {
                alert("Please Enter valid details");


            }
        }).catch(function (error) {
            console.log(error);
        })
    }

    function Signup(name, email, password, confirmPassword, url, mypath) {
        if (name === undefined || email === undefined || password === undefined || confirmPassword === undefined) {
            // alert("Please fill all details")
            $.bootstrapGrowl("Please fill all details", {
                ele: 'body', // which element to append to
                type: 'info', // (null, 'info', 'error', 'success')
                offset: { from: 'top', amount: 20 }, // 'top', or 'bottom'
                align: 'right', // ('left', 'right', or 'center')
                width: 250, // (integer, or 'auto')
                delay: 4000,
                allow_dismiss: true,
                stackup_spacing: 10 // spacing between consecutively stacked growls.
            });
        }
        else {
            var flag = 0;
            if (password !== confirmPassword) {
                alert("Password and confirm Password must be same")
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
                    }
                }).catch(function (error) {
                    console.log(error);
                })
            }
        }
    }

    function DeleteDetails(url, data, path, task) {
        $http.post(url, { data }).then(function (data) {
            $location.path(path)
            if (task === 'regSchool') {
                $rootScope.SchoolNameArrFn()
                $rootScope.areaNameArrFn()
            }
            else {
                $rootScope.TeacherDetails2(task, 1)
            }

        }).catch(function (err) {
            console.log(err)
        })
    }


})

// routing
app.config(function ($routeProvider) {

    $routeProvider
        .when("/", {
            templateUrl: "main.html"
        })
        .when("/student-login", {
            templateUrl: "login.html"
        })
        .when("/student-new_user", {
            templateUrl: "newUser.html"
        })
        .when("/teacher-login", {
            templateUrl: "teacherlogin.html"
        })
        .when("/teacher-new_user", {
            templateUrl: "newTeacher.html"
        })
        .when("/error", {
            templateUrl: "error.html"
        })
        .when("/student-dashboard", {
            resolve: {
                function($location) {
                    if (document.cookie == '' || localStorage.getItem('roles') !== 'student') {
                        $location.path('/error')
                    }
                }
            },
            templateUrl: "studentDashboard.html"
        })

        .when("/analytic", {
            resolve: {
                function($location) {
                    if (document.cookie == '' || localStorage.getItem('roles') !== 'admin') {
                        $location.path('/error')
                    }
                }
            },
            templateUrl: "analytic.html"
        })
        .when("/teacher-dashboard", {
            resolve: {
                function($location) {
                    if (document.cookie == '' || localStorage.getItem('roles') !== 'teacher') {
                        $location.path('/error')
                    }
                }
            },
            templateUrl: "teacherDashboard.html"
        })
        .when("/auth_dasboard", {
            resolve: {
                function($location) {
                    if (document.cookie == '' || localStorage.getItem('roles') !== 'admin') {
                        $location.path('/error')
                    }
                }
            },
            templateUrl: "auth_dashboard.html"
        })
        .when("/admin-login", {
            templateUrl: "admin_login.html"
        })
        .when("/student-details", {
            resolve: {
                function($location) {
                    if (document.cookie == '' || localStorage.getItem('roles') !== 'teacher') {
                        $location.path('/error')
                    }
                }
            },
            templateUrl: "detailForm.html"
        })

        .when("/view-student-details", {
            resolve: {
                function($location) {
                    if (document.cookie == '' || (localStorage.getItem('roles') !== 'admin' && localStorage.getItem('roles') !== 'teacher')) {
                        $location.path('/error')
                    }
                }
            },
            templateUrl: "viewStudentDetails.html"
        })
        .when("/registered-school", {
            resolve: {
                function($location) {
                    if (document.cookie == '' || localStorage.getItem('roles') !== 'admin') {
                        $location.path('/error')
                    }
                }
            },
            templateUrl: "viewRegisteredSchool.html"
        })
        .when("/addNewAdmin", {
            resolve: {
                function($location) {
                    if (document.cookie == '' || localStorage.getItem('roles') !== 'admin') {
                        $location.path('/error')
                    }
                }
            },
            templateUrl: "addNewAdmin.html"
        })
        .otherwise({ redirectTo: '/' });
})

// controller
app.controller('mainCtrl', function ($scope, $http, $rootScope, $location, myFact, $log) {
    // function call when page load
    $scope.init = function () {
        var email = localStorage.getItem('C_Email');
        $scope.getStudentDetails(email)
        var Temail = localStorage.getItem('T_Email');
        $rootScope.TeacherDetails2(Temail, 1)
        $scope.techEmail = Temail
        $rootScope.SchoolNameArrFn();
        $rootScope.areaNameArrFn();
        $rootScope.FetchAllregionName()
    };

    // go to student details page
    $scope.FillStudentDetails = myFact.FillStudentDetails;

    // student signup
    $scope.Studentsignup = function (name, email, password, confirmPassword) {
        myFact.Signup(name, email, password, confirmPassword, "http://localhost:8000/add", '/student-login')
    }

    // getData => Student login
    $scope.getData = function (uname, uemail, upassword) {
        var data = {
            "name": uname,
            "email": uemail,
            "password": upassword,
        }
        myFact.Login("http://localhost:8000/getuser", data, uemail, 'C_Email', $scope.myData, 'student')
    }

    // add data => To Get API
    $scope.myData = function (myemail) {
        $http.get("http://localhost:8000/student-dashboard?email=" + myemail).then(function (response) {
            if (response.status == 200) {
                $scope.getStudentDetails(myemail)
                $location.path('/student-dashboard')
            }
            else if (response.status == 402) {
                $location.path('/error')
            }
        }).catch(function (error) {
            console.log(error);
        })
    }

    // function that get student details for student dashboard
    $scope.getStudentDetails = function (email) {
        var data = {
            email: email
        }
        $http.post("http://localhost:8000/seeStudentData", {
            data
        }).then(function (response) {
            if (response.status == 200) {
                $rootScope.name = response.data.name;
                $rootScope.email = response.data.email;
                $rootScope.mobileNo = response.data.mobileNo;
                $rootScope.address = response.data.address;
                $rootScope.city = response.data.city;
                $rootScope.area = response.data.area;
                $rootScope.motherName = response.data.motherName;
                $rootScope.fatherName = response.data.fatherName;
                $rootScope.rollNo = response.data.rollNo;
                $rootScope.classCoordinator = response.data.classCoordinator;
                $rootScope.marks = response.data.marks;
                $rootScope.sclass = response.data.sclass;
                $rootScope.school = response.data.school;
            }

        }).catch(function (error) {
            console.log(error);
        })
    }

    // get all student details 
    $scope.getstudentdetailsFn = function (rollNo, Name, email, mobileNo, address, city, area, motherName, fatherName, classCoordinator, temail, sclass, school, maths, science, english, hindi, sst) {
        if (rollNo === undefined || Name === undefined || email === undefined || mobileNo === undefined || address === undefined || city === undefined || area === undefined || motherName === undefined || fatherName === undefined || classCoordinator === undefined || temail === undefined || sclass === undefined || school === undefined || maths === undefined || science === undefined || english === undefined || hindi === undefined || sst === undefined) {
            alert("Enter All details")
        }
        else {
            var data = {
                rollNo: rollNo,
                name: Name,
                email: email,
                mobileNo: mobileNo,
                address: address,
                city: city,
                area: area,
                motherName: motherName,
                fatherName: fatherName,
                classCoordinator: classCoordinator,
                sclass: sclass,
                temail: temail,
                school: school,
                marks: [
                    { maths: maths },
                    { science: science },
                    { english: english },
                    { hindi: hindi },
                    { sst: sst }
                ]
            }
            $http.post("http://localhost:8000/addStudentDetails", {
                data
            }).then(function (response) {
                if (response.status == 200) {
                    $rootScope.TeacherDetails2(temail, 3)
                    $location.path('/teacher-dashboard');
                }
            }).catch(function (error) {
                console.log(error);
            })
        }
    }

    // get Teacher data=>teacher login
    $scope.getTeacherData = function (uname, uemail, upassword) {
        var data = {
            "name": uname,
            "email": uemail,
            "password": upassword
        }
        myFact.Login("http://localhost:8000/getTeacher", data, uemail, 'T_Email', $rootScope.TeacherData, 'teacher')
    }

    // get Api call
    $rootScope.TeacherData = function (myemail) {

        $http.get("http://localhost:8000/teacher-dashboard?email=" + myemail).then(function (response) {

            if (response.status == 200) {
                $location.path('/teacher-dashboard')
                $rootScope.TeacherDetails2(myemail, 1)
            }
            else {

            }
        }).catch(function (error) {
            console.log(error);

        })
    }

    // Teacher signup
    $scope.Teachhersignup = function (name, email, password, confirmPassword) {
        myFact.Signup(name, email, password, confirmPassword, "http://localhost:8000/addTeacher", '/teacher-login')
    }

    // teacher details
    $rootScope.TeacherDetails2 = function (email, p) {

        $rootScope.arr = []
        var data = {
            email: email
        }

        $http.post("http://localhost:8000/seeAllStudentData?page=" + p, {
            data
        }).then(function (response) {
            $rootScope.teacherArr = response.data.result;
            // $rootScope.teacherArr = response.data
            for (let i = 0; i < $rootScope.teacherArr.length; i++) {
                if ($rootScope.teacherArr[i].temail === email) {
                    $rootScope.arr.push($rootScope.teacherArr[i]);
                }
            }
        }).catch(function (error) {
            console.log(error);
        })
    }

    // pagination fn
    $scope.paginationFn = function (p) {
        $scope.pagination($scope.techEmail, p)
    }

    // redirect and get data of all students
    $scope.pagination = function (email, p) {
        $location.path('/teacher-dashboard')
        $rootScope.TeacherDetails2(email, p)
    }

    // open 
    $scope.openDetails = function (email) {
        $scope.getStudentDetails(email)
        $location.path('/view-student-details')
    }

    // Go to teacher Dashboard
    $scope.goToTeacherDashBoard = function () {
        if (localStorage.getItem('roles') == 'admin') {
            $location.path('/auth_dasboard')
        }
        else if (localStorage.getItem('roles') == 'teacher') {

            $location.path('/teacher-dashboard')
        }

    }

    // sort features of table
    $scope.sort = function (keyname) {
        $scope.sortKey = keyname;
        $scope.reverse = !$scope.reverse;
    }

    // delete student details
    $scope.deleteDetails = function (email) {
        var data = {
            email: email
        }
        myFact.DeleteDetails("http://localhost:8000/deleteStudent", data, '/teacher-dashboard', $scope.techEmail)
    }

    // go to analytic page
    $scope.analticFn = function () {
        $location.path("/analytic")
    }

    // get all school name present (Db) in array
    $rootScope.SchoolNameArrFn = function () {
        $scope.SchoolNameList = [];
        $scope.SchoolAllDetailsArr = [];

        $http.get("http://localhost:8000/schoolName").then(function (response) {
            $scope.SchoolAllDetailsArr = response.data;
            for (let i = 0; i < response.data.length; i++) {
                $scope.SchoolNameList.push(response.data[i].schoolname)
            }
        }).catch(function (error) {
            console.log(error);
        })
    }

    // get all area name present (Db) in array
    $rootScope.areaNameArrFn = function () {
        $scope.areaNameList = [];
        $http.get("http://localhost:8000/areaName").then(function (response) {
            for (let i = 0; i < response.data.length; i++) {
                $scope.areaNameList.push(response.data[i].area)
            }
            $scope.areaNameList = $scope.removeDuplicate($scope.areaNameList)
            // $scope.removeDuplicate($scope.areaNameList)

        }).catch(function (error) {
            console.log(error);
        })
    }

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

    // fetch student details on the basic of school name 
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

    // fetch top 3 student 
    $scope.FetchTop3StudentDetails = function () {
        $http.get("http://localhost:8000/topStudent").then(function (res) {
            $rootScope.indivualschoolStudentArr = res.data
        }).catch(function (err) {
            console.log(err)
        })
    }

    // fetch top 3 student od a area 
    $scope.FetchTop3StudentOfArea = function (AreaName) {
        var data = {
            area: AreaName
        }
        $http.post("http://localhost:8000/topAreaStudent", { data }).then(function (res) {

            $rootScope.indivualschoolStudentArr = res.data

        }).catch(function (err) {
            console.log(err)
        })

    }

    // fetch student detail acc to percentage
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

    // cancel form => go to analytic
    $scope.cancaeldetailsFn = function () {
        $location.path('/teacher-dashboard')
    }

    $scope.getAdminData = function (name, email, password) {

        var data = {
            name: name,
            email: email,
            password: password
        }
        $http.post('http://localhost:8000/adminAuth', { data }).then(function (data) {

            localStorage.setItem('roles', 'admin');
            $location.path('/auth_dasboard')
        }).catch(function (err) {
            console.log(err)
        })
    }



    $scope.AddSchoolFn = function (school_name, school_email, city, region, area) {

        if (school_name === undefined || school_email === undefined || city === undefined || region === undefined || area === undefined) {
            alert("Please enter the infomation")
        }
        else {
            var myObj = {
                school_name: school_name,
                school_email: school_email,
                city: city,
                region: region,
                area: area
            }

            $http.post("http://localhost:8000/addSchoolDetails", {
                myObj
            }).then(function (response) {

                if (response.status == 200) {

                    $location.path('/registered-school')
                    $scope.init()
                    $rootScope.SchoolNameArrFn();
                }


            }).catch(function (error) {
                console.log("Myerr", error);
            })
        }
    }

    $scope.addNewAdmin = function () {
        $location.path("/addNewAdmin")
    }

    $scope.addAdminFn = function (newAdminName, newAdminEmail, newAdminPassword) {
        if (newAdminName === undefined || newAdminEmail === undefined || newAdminPassword === undefined) {
            alert("Please enter all details")
        }
        else {
            var data = {
                "name": newAdminName,
                "email": newAdminEmail,
                "password": newAdminPassword
            }
            $http.post("http://localhost:8000/addNewAdmin", {
                data
            }).then(function (response) {
                if (response.status == 200) {
                    $location.path('/auth_dasboard');
                }
            }).catch(function (error) {
                console.log(error);
            })
        }
    }

    $scope.viewAllRegisterSchool = function () {
        $location.path('/registered-school')
    }


    $scope.deleteSchoolDetailsFromDb = function (id) {
        var data = {
            id: id
        }
        myFact.DeleteDetails("http://localhost:8000/deleteSchool", data, '/registered-school', 'regSchool')

    }

    $scope.FetchAllSchoolAccToArea = function (areaName) {

        $http.post('/fetchallAreaSchool', {
            area: areaName
        }).then(function (data) {
            $scope.SchoolAllDetailsArr = data;
            $scope.SchoolAllDetailsArr = $scope.SchoolAllDetailsArr.data
            $location.path('/registered-school')


        }).catch(function (err) {
            console.log(err);
        })
    }


$scope.isCollapsed=true;
$scope.isCollapsedHorizontal = false;

    $scope.FetchAllareaName = function (city) {

        $scope.areaNameArr = [];
        var data = {
            city: city
        }
        $http.post('/getareaList', { data }).then(function (data) {

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

    // $scope.totalItems = 12;
    // $scope.currentPage = 1;
  
   
  
    // $scope.pageChanged = function() {
    //   $log.log('Page changed to: ' + $scope.currentPage);
    // };

    

    $rootScope.FetchAllregionName = function () {
        $scope.regionNameList = [];
        var data = {
            my: "my"
        }
        $http.post('/getRegionList', { data }).then(function (data) {
            for (let i = 0; i < data.data.length; i++) {
                $scope.regionNameList.push(data.data[i].region)
            }
            $scope.regionNameList = $scope.removeDuplicate($scope.regionNameList)
            console.log($scope.regionNameList )
        }).catch(function (err) {
            console.log(err)
        })

    }


    $scope.FetchAllCityName = function (region) {

        $scope.cityNameArr = [];
        var data = {
            region: region
        }
        $http.post('/getcityList', { data }).then(function (data) {

            for (let i = 0; i < data.data.length; i++) {
                $scope.cityNameArr.push(data.data[i].city)
            }
            $scope.cityNameArr = $scope.removeDuplicate($scope.cityNameArr)
        }).catch(function (err) {
            console.log(err)
        })
    }

    $scope.today = function () {
        $scope.dt = new Date();
    };
    $scope.today();

    $scope.clear = function () {
        $scope.dt = null;
    };

    $scope.inlineOptions = {
        customClass: getDayClass,
        minDate: new Date(),
        showWeeks: true
    };

    $scope.dateOptions = {
        dateDisabled: disabled,
        formatYear: 'yy',
        startingDay: 1
    };

    // Disable weekend selection
    function disabled(data) {
        var date = data.date,
            mode = data.mode;
        return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
    }

    $scope.toggleMin = function () {
        $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
        $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
    };

    $scope.toggleMin();

    $scope.open1 = function () {
        $scope.popup1.opened = true;
    };


    $scope.date = new Date().getDate();
    $scope.month = new Date().getMonth();
    $scope.year = new Date().getUTCFullYear();
    $scope.dt = new Date($scope.year, $scope.month, $scope.date);
    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];
    $scope.altInputFormats = ['M!/d!/yyyy'];

    $scope.popup1 = {
        opened: false
    };


    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    var afterTomorrow = new Date();
    afterTomorrow.setDate(tomorrow.getDate() + 1);
    $scope.events = [
        {
            date: tomorrow,
            status: 'full'
        },
        {
            date: afterTomorrow,
            status: 'partially'
        }
    ];

    function getDayClass(data) {
        var date = data.date,
            mode = data.mode;
        if (mode === 'day') {
            var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

            for (var i = 0; i < $scope.events.length; i++) {
                var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

                if (dayToCheck === currentDay) {
                    return $scope.events[i].status;
                }
            }
        }

        return '';
    }


    $scope.oneAtATime = true;

  $scope.groups = [
    {
      title: 'Dynamic Group Header - 1',
      content: 'Dynamic Group Body - 1'
    },
    {
      title: 'Dynamic Group Header - 2',
      content: 'Dynamic Group Body - 2'
    }
  ];

  $scope.items = ['Item 1', 'Item 2', 'Item 3'];

  $scope.addItem = function() {
    var newItemNo = $scope.items.length + 1;
    $scope.items.push('Item ' + newItemNo);
  };

  $scope.status = {
    isCustomHeaderOpen: false,
    isFirstOpen: true,
    isFirstDisabled: false
  };
});


// create the controller and inject Angular's $scope
app.controller('mainController', function ($scope, $http, $routeParams, $uibModal) {

    $scope.showPopup = function () {

        user = { 'region': '', 'city': "" };
        $scope.modalInstance = $uibModal.open({
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'view.html',
            controller: 'ModelHandlerController',
            controllerAs: '$ctrl',
            size: 'lg',
            resolve: {
                user: function () {
                    return user;
                }
            }
        });

    }


});

app.controller("ModelHandlerController", function ($scope, $uibModalInstance, $http, $rootScope, $location) {


    $scope.cancelModal = function () {
        console.log("cancelmodal");
        $uibModalInstance.result.catch(function () { $uibModalInstance.close(); });
        $uibModalInstance.dismiss('close');
    }

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

            var promise1 = $http.post('http://localhost:8000/addcity', { data })
            var promise2 = $http.post('http://localhost:8000/addArea', { data2 })

            Promise.all([promise1, promise2]).then(function (data) {
                $rootScope.FetchAllregionName()
            }).catch(function (err) {
                console.log(err)
            })
            $uibModalInstance.close('save');
        }
        else{
            alert("Please enter all details")
        }
    }


});

