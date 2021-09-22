app.controller('addStudentController', function ($scope, $http, $rootScope, $location) {
    
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