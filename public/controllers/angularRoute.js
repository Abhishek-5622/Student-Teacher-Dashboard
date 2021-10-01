// routing
angular.module('myroute', ['ngRoute']).config(function ($routeProvider) {

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