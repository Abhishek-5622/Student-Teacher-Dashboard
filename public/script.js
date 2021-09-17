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

    function Login(url, data, uemail, key, Fn,role) {
        $http.post(url, {
            data
        }).then(function (response) {
            if (response.status == 200) {
                console.log(role)
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
                    if (document.cookie == '' || localStorage.getItem('roles')!=='student') {
                        $location.path('/error')
                    }
                }
            },
            templateUrl: "studentDashboard.html"
        })

        .when("/analytic", {
            resolve: {
                function($location) {
                    if (document.cookie == '' || localStorage.getItem('roles')!=='admin') {
                        $location.path('/error')
                    }
                }
            },
            templateUrl: "analytic.html"
        })
        .when("/teacher-dashboard", {
            resolve: {
                function($location) {
                    if (document.cookie == '' || localStorage.getItem('roles')!=='teacher') {
                        $location.path('/error')
                    }
                }
            },
            templateUrl: "teacherDashboard.html"
        })
        .when("/auth_dasboard", {
            resolve: {
                function($location) {
                    if (document.cookie == '' || localStorage.getItem('roles')!=='admin') {
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
                    if (document.cookie == '' || localStorage.getItem('roles')!=='teacher') {
                        $location.path('/error')
                    }
                }
            },
            templateUrl: "detailForm.html"
        })

        .when("/view-student-details", {
            resolve: {
                function($location) {
                    if (document.cookie == '' || (localStorage.getItem('roles')!=='admin' &&localStorage.getItem('roles')!=='teacher') ) {
                        $location.path('/error')
                    }
                }
            },
            templateUrl: "viewStudentDetails.html"
        })
        .when("/registered-school", {
            resolve: {
                function($location) {
                    if (document.cookie == '' || localStorage.getItem('roles')!=='admin') {
                        $location.path('/error')
                    }
                }
            },
            templateUrl: "viewRegisteredSchool.html"
        })
        .when("/addNewAdmin", {
            resolve: {
                function($location) {
                    if (document.cookie == '' || localStorage.getItem('roles')!=='admin') {
                        $location.path('/error')
                    }
                }
            },
            templateUrl: "addNewAdmin.html"
        })
        .otherwise({ redirectTo: '/' });
})

// controller
app.controller('mainCtrl', function ($scope, $http, $rootScope, $location, myFact) {
    // function call when page load
    $scope.init = function () {
        var email = localStorage.getItem('C_Email');
        $scope.getStudentDetails(email)
        var Temail = localStorage.getItem('T_Email');
        $rootScope.TeacherDetails2(Temail, 1)
        $scope.techEmail = Temail
        $rootScope.SchoolNameArrFn();
        $rootScope.areaNameArrFn();
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
        myFact.Login("http://localhost:8000/getuser", data, uemail, 'C_Email', $scope.myData,'student')
    }

    // add data => To Get API
    $scope.myData = function (myemail) {
        $http.get("http://localhost:8000/student-dashboard?email=" + myemail).then(function (response) {
            if(response.status==200){
            $scope.getStudentDetails(myemail)
            $location.path('/student-dashboard')
            }
            else if(response.status==402){
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

    // get Teacher data=>teacher login
    $scope.getTeacherData = function (uname, uemail, upassword) {
        var data = {
            "name": uname,
            "email": uemail,
            "password": upassword
        }
        myFact.Login("http://localhost:8000/getTeacher", data, uemail, 'T_Email', $rootScope.TeacherData,'teacher')
    }

    // get Api call
    $rootScope.TeacherData = function (myemail) {

        $http.get("http://localhost:8000/teacher-dashboard?email=" + myemail).then(function (response) {
            console.log(response)
            if (response.status == 200) {
                $location.path('/teacher-dashboard')
                $rootScope.TeacherDetails2(myemail, 1)
            }
            else {
                console.log("jap")
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
        console.log('myteacherEmail', email)
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
        if(localStorage.getItem('roles')=='admin'){
            $location.path('/auth_dasboard')
        }
        else if(localStorage.getItem('roles')=='teacher'){

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

            $scope.removeDuplicate($scope.areaNameList)

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
        console.log(crteria)
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
            console.log(data)
            localStorage.setItem('roles', 'admin');
            $location.path('/auth_dasboard')
        }).catch(function (err) {
            console.log(err)
        })
    }



    $scope.ok = function (school_name, school_email, city, region, area) {
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
            console.log(response.status)
            if (response.status == 200) {
                console.log("school Add")
                $location.path('/registered-school')
                $scope.init()
                $rootScope.SchoolNameArrFn();
            }


        }).catch(function (error) {
            console.log("Myerr", error);
        })
    }

    $scope.addNewAdmin = function () {
        $location.path("/addNewAdmin")
    }

    $scope.addAdminFn = function (newAdminName, newAdminEmail, newAdminPassword) {
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
            // console.log('mydata',data)

        }).catch(function (err) {
            console.log(err);
        })
    }
});
