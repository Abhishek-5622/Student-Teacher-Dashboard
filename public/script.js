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
        .when("/student-dashboard", {
            resolve: {
                function($location) {
                    if (document.cookie === '') {
                        $location.path('/')
                    }
                }
            },
            templateUrl: "studentDashboard.html"
        })

        .when("/analytic", {
            resolve: {
                function($location) {
                    if (document.cookie === '') {
                        $location.path('/')
                    }
                }
            },
            templateUrl: "analytic.html"
        })
        .when("/teacher-dashboard", {
            resolve: {
                function($location) {
                    if (document.cookie === '') {
                        $location.path('/')
                    }
                }
            },
            templateUrl: "teacherDashboard.html"
        })
        .when("/student-details", {
            resolve: {
                function($location) {
                    if (document.cookie === '') {
                        $location.path('/')
                    }
                }
            },
            templateUrl: "detailForm.html"
        })

        .when("/view-student-details", {
            resolve: {
                function($location) {
                    if (document.cookie === '') {
                        $location.path('/')
                    }
                }
            },
            templateUrl: "viewStudentDetails.html"
        })
        .otherwise({ redirectTo: '/' });
})

// controller
app.controller('mainCtrl', function ($scope, $http, $rootScope, $location) {
    // function call when page load
    $scope.init = function () {
        var email = localStorage.getItem('C_Email');
        $scope.getStudentDetails(email)
        var Temail = localStorage.getItem('T_Email');
        $scope.TeacherDetails2(Temail, 1)
        $scope.techEmail = Temail
        $rootScope.SchoolNameArrFn();
        $rootScope.areaNameArrFn();
    };

    // go to student details page
    $scope.FillStudentDetails = function () {
        $location.path('/student-details')
    }

    // student signup
    $scope.Studentsignup = function (name, email, password, confirmPassword) {
        if (name !== "" && email !== '' && password !== "" && confirmPassword !== "") {
            $scope.flag = 0;
            if (password !== confirmPassword) {
                alert("Password and confirm Password must be same")
                $scope.flag = 1;
            }
            if ($scope.flag == 0) {
                var data = {
                    "name": name,
                    "email": email,
                    "password": password
                }
                $http.post("http://localhost:8000/add", {
                    data
                }).then(function (response) {
                    if (response.status == 200) {
                        $location.path('/student-login');
                    }
                }).catch(function (error) {
                    console.log(error);
                })
            }
        }
        else {
            alert("Please fill all details")
        }

    }

    // getData => Student login
    $scope.getData = function (uname, uemail, upassword) {
        var data = {
            "name": uname,
            "email": uemail,
            "password": upassword
        }
        $http.post("http://localhost:8000/getuser", {
            data
        }).then(function (response) {

            if (response.status == 200) {
                // $window.location.href ='/student-dashboard?email='+uemail;  
                localStorage.setItem('C_Email', uemail);
                $scope.myData(uemail);
            }
            else {
                console.log("Please Enter valid details");
            }
        }).catch(function (error) {
            console.log(error);
        })
    }

    // add data => To Get API
    $scope.myData = function (myemail) {
        $http.get("http://localhost:8000/student-dashboard?email=" + myemail).then(function (response) {
            $scope.getStudentDetails(myemail)
            $location.path('/student-dashboard')
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
                $scope.TeacherDetails2(temail, 3)
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
        $http.post("http://localhost:8000/getTeacher", {
            data
        }).then(function (response) {

            if (response.status == 200) {
                localStorage.setItem('T_Email', uemail);
                $scope.TeacherData(uemail);
                // $window.location.href ='/teacher-dashboard';  
            }
        }).catch(function (error) {
            console.log(error);
        })
    }

    // get Api call
    $scope.TeacherData = function (myemail) {
        $http.get("http://localhost:8000/teacher-dashboard?email=" + myemail).then(function (response) {
            $location.path('/teacher-dashboard')
            $scope.TeacherDetails2(myemail, 1)
        }).catch(function (error) {
            console.log(error);
        })
    }

    // Teacher signup
    $scope.Teachhersignup = function (name, email, password, confirmPassword) {
        if (name !== "" && email !== '' && password !== "" && confirmPassword !== "") {
            $scope.flag = 0;
            if (password !== confirmPassword) {
                alert("Password and confirm Password must be same")
                $scope.flag = 1;
            }
            if ($scope.flag == 0) {
                var data = {
                    "name": name,
                    "email": email,
                    "password": password
                }
                $http.post("http://localhost:8000/addTeacher", {
                    data
                }).then(function (response) {
                    if (response.status == 200) {
                        $location.path('/teacher-login');
                    }
                }).catch(function (error) {
                    console.log(error);
                })
            }
        }

    }

    // teacher details
    $scope.TeacherDetails2 = function (email, p) {
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
        $scope.TeacherDetails2(email, p)
    }

    // open 
    $scope.openDetails = function (email) {
        $scope.getStudentDetails(email)
        $location.path('/view-student-details')
    }

    // Go to teacher Dashboard
    $scope.goToTeacherDashBoard = function () {
        $location.path('/teacher-dashboard')
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
        $http.post("http://localhost:8000/deleteStudent", {
            data
        }).then(function (response) {
            $location.path('/teacher-dashboard')
            $scope.TeacherDetails2($scope.techEmail, 1)
        }).catch(function (error) {
            console.log(error);
        })
    }

    // go to analytic page
    $scope.analticFn = function () {
        $location.path("/analytic")
    }

    // get all school name present (Db) in array
    $rootScope.SchoolNameArrFn = function () {
        $scope.SchoolNameList = [];
        $http.get("http://localhost:8000/schoolName").then(function (response) {
            // console.log("respone",response.data.schoolname)
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
        $scope.uniqueNames = [arr[0]];
        for (let i = 1; i < arr.length; i++) {
            for (let j = 0; j < arr.length; j++) {
                if (i != j && arr[i] == arr[j]) {
                    $flg = 1;
                    break;
                }
                else {
                    $flg = 0;
                }
            }
            if ($flg == 0) {
                $scope.uniqueNames.push(arr[i])
            }
        }
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
});


// create the controller 
app.controller('mainController', function ($scope, $http, $routeParams, $uibModal) {
    $scope.showPopup = function () {
        user = { 'school_name': '', 'school_email': '', 'area': '', 'city': '' };
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

// Model controller
app.controller("ModelHandlerController", function ($scope, $uibModalInstance, $http, $rootScope) {
    $scope.school_name = user.school_name;
    $scope.school_email = user.school_email;
    $scope.area = user.area;
    $scope.city = user.city;

    $scope.cancelModal = function () {
        console.log("cancelmodal");
        $uibModalInstance.dismiss('close');
    }

    $scope.ok = function () {
        $uibModalInstance.close('save');

        var myObj = {
            school_name: $scope.school_name,
            school_email: $scope.school_email,
            area: $scope.area,
            city: $scope.city
        }

        $http.post("http://localhost:8000/addSchoolDetails", {

            myObj
        }).then(function (response) {

            $rootScope.SchoolNameArrFn();
        }).catch(function (error) {
            console.log("Myerr", error);
        })
    }
});






