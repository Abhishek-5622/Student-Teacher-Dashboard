// ************************Teacher Controller*********************

app.controller('teacherController', function ($scope, $http, $rootScope, $location, myFact) {

    // Teacher signup
    $scope.Teachhersignup = function (name, email, password, confirmPassword) {
        myFact.Signup(name, email, password, confirmPassword, "http://localhost:8000/teacher/addTeacher", '/teacher-login')
    }

    // get Teacher data=>teacher login
    $scope.getTeacherData = function (uname, uemail, upassword) {
        if (uname === undefined || uemail === undefined || upassword === undefined) {
            myFact.Message('danger','Enter All details')
        }
        else {
            var data = {
                "name": uname,
                "email": uemail,
                "password": upassword
            }
            myFact.Login("http://localhost:8000/teacher/getTeacher", data, uemail, 'T_Email', $rootScope.TeacherData, 'teacher')
        }
    }

    // get Api call
    $rootScope.TeacherData = function (myemail) {
        $http.get("http://localhost:8000/teacher-dashboard?email=" + myemail).then(function (response) {
            if (response.status == 200) {
                $location.path('/teacher-dashboard')
                $rootScope.pageChanged()
            }
            else {

            }
        }).catch(function (error) {
            console.log(error);

        })
    }

    // get length of all student document
    $scope.getLengthOfModel = function () {
        $http.get('/teacher/getLength').then(function (data) {
            $scope.totalitems = data.data
        }).catch(function (err) {
            console.log(err)
        })
    }
    $scope.getLengthOfModel()

    // go to student details page
    $scope.FillStudentDetails = myFact.FillStudentDetails;
    
    //  teacher logout
    $scope.Teacherlogout = function () {
        myFact.Logout('/teacher/Teachlogout')
    }

    // pagination section
    let data = {};
    data.page = 0;
    data.limit = 15;
    $scope.itemsPerPage = 15;
    $scope.currentPage = 1;

    $scope.pagination = {
        currentPage: 1
    };

    $scope.arr = []
    $rootScope.pageChanged = function () {
        // console.log("Page changed to: " + $scope.pagination.currentPage);
        data.page = $scope.pagination.currentPage - 1;
        $http.post("http://localhost:8000/teacher/seeAllStudentData", data).then(function (response) {
            $scope.arr = response.data
        });
    };
    $rootScope.pageChanged()


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

    // open any student details
    $scope.openDetails = function (email) {
        $scope.getStudentDetails(email)
        $location.path('/view-student-details')
    }

    // delete student details
    $scope.deleteDetails = function (email) {
        var data = {
            email: email
        }
        myFact.DeleteDetails("http://localhost:8000/teacher/deleteStudent", data, '/teacher-dashboard', $scope.techEmail)
    }

    // sort 
    $scope.sort = function (keyname) {
        $scope.sortKey = keyname;
        $scope.reverse = !$scope.reverse;
    }

    // fill student details
    $scope.getstudentdetailsFn = function (rollNo, Name, dt, email, mobileNo, address, city, area, motherName, fatherName, classCoordinator, temail, sclass, school, maths, science, english, hindi, sst) {
        if (rollNo === undefined || Name === undefined || dt === undefined || email === undefined || mobileNo === undefined || address === undefined || city === undefined || area === undefined || motherName === undefined || fatherName === undefined || classCoordinator === undefined || temail === undefined || sclass === undefined || school === undefined || maths === undefined || science === undefined || english === undefined || hindi === undefined || sst === undefined) {
            myFact.Message('danger','Enter All details')
        }
        else {
            var data = {
                rollNo: rollNo,
                name: Name,
                date:dt,
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
            $http.post("http://localhost:8000/teacher/addStudentDetails", {
                data
            }).then(function (response) {
                if (response.status == 200) {
                    $rootScope.pageChanged()
                    myFact.Message('success','Student Added')
                    $location.path('/teacher-dashboard');
                }
                else if(response.status==400){       
                    myFact.Message('danger','Please Enter Valid Data')
                }
               
            }).catch(function (error) {
                console.log(error);
            })
        }
    }

    // *********Date Picker function****************
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
})