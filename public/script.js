// *************************Script file *********************************


var app = angular.module('portfolio', ['ngRoute', 'ui.bootstrap', 'ngTouch', 'ngAnimate'])

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
    $scope.init = function () {
        var email = localStorage.getItem('C_Email');
        $scope.getStudentDetails(email)
        var Temail = localStorage.getItem('T_Email');
        $scope.TeacherDetails2(Temail, 1)
        $scope.techEmail = Temail
    };

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
            // console.log(response)
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
            marks: {
                maths: maths,
                science: science,
                english: english,
                hindi: hindi,
                sst: sst
            }

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

    // // teacher details
    // $scope.TeacherDetails = function (email) {
    //     $rootScope.arr = []
    //     var data = {
    //         email: email
    //     }

    //     $http.post("http://localhost:8000/seeAllStudentData", {
    //         data
    //     }).then(function (response) {
    //         console.log(response.data.result);
    //         $rootScope.teacherArr = response.data.result;
    //         for (let i = 0; i < $rootScope.teacherArr.length; i++) {
    //             if ($rootScope.teacherArr[i].temail === email) {
    //                 $rootScope.arr.push($rootScope.teacherArr[i]);
    //             }
    //         }
    //     }).catch(function (error) {
    //         console.log(error);
    //     })
    // }

    $scope.TeacherDetails2 = function (email, p) {
        console.log('myteacherEmail', email)
        $rootScope.arr = []
        var data = {
            email: email
        }

        $http.post("http://localhost:8000/seeAllStudentData?page=" + p, {
            data
        }).then(function (response) {
            console.log("2nd page", response.data.result);
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

    $scope.paginationFn = function (p) {
        $scope.pagination($scope.techEmail, p)
    }

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

    $scope.sort = function (keyname) {
        $scope.sortKey = keyname;
        $scope.reverse = !$scope.reverse;
    }

    $scope.deleteDetails = function (email) {

        var data = {
            email: email
        }
        $http.post("http://localhost:8000/deleteStudent", {
            data
        }).then(function (response) {
            console.log("2nd page", response);
            $location.path('/teacher-dashboard')
            $scope.TeacherDetails2($scope.techEmail, 1)
        }).catch(function (error) {
            console.log(error);
        })

    }


    $scope.analticFn = function () {
        $location.path("/analytic")
    }



});



// create the controller and inject Angular's $scope
app.controller('mainController', function ($scope, $http, $routeParams, $uibModal) {
    $scope.showPopup = function () {
        user = { 'school_name': '', 'school_email': '', 'area': '' ,'city':''};
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

app.controller("ModelHandlerController", function ($scope, $uibModalInstance, $http) {
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
        console.log($scope.school_name)
        var myObj = {
            school_name:$scope.school_name,
            school_email:$scope.school_email ,
            area:$scope.area ,
            city:$scope.city
        }
        console.log('bye',myObj)

        $http.post("http://localhost:8000/addSchoolDetails",  {

            myObj
        }).then(function (response) {
            console.log("2nd page", response);
            // $location.path('/teacher-dashboard')
            // $scope.TeacherDetails2($scope.techEmail, 1)
        }).catch(function (error) {
            console.log("Myerr",error);
        })
    }
});






