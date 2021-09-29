// *************************Student Controller*******************

app.controller('studentController', function ($scope, $http, $location, myFact) {

// Student Signup
$scope.Studentsignup = function (name, email, password, confirmPassword) {
    myFact.Signup(name, email, password, confirmPassword, "http://localhost:8000/student/add", '/student-login')
}

// Student login
$scope.studentLogin = function (uname, uemail, upassword) {
    // empty 
    if(uname === undefined || uemail === undefined || upassword === undefined){
        myFact.Message('danger','Enter All Details')
    }
    else{
    var data = {
        "name": uname,
        "email": uemail,
        "password": upassword,
    }
    myFact.Login("http://localhost:8000/student/getuser", data, uemail, 'C_Email', $scope.myData, 'student')
}
}

// Route to student dasboard and call function that get all data of student dashboard
$scope.myData = function (myemail) {
    $http.get("http://localhost:8000/student-dashboard?email=" + myemail).then(function (response) {
        if (response.status == 200) {
            $scope.getStudentDetails(myemail);
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
    if(email === localStorage.getItem('C_Email')){
    var data = {
        email: email
    }
    $http.post("http://localhost:8000/seeStudentData", {
        data
    }).then(function (response) {
        if (response.status == 200) {
            $scope.name = response.data.name;
            $scope.email = response.data.email;
            $scope.mobileNo = response.data.mobileNo;
            $scope.address = response.data.address;
            $scope.city = response.data.city;
            $scope.area = response.data.area;
            $scope.motherName = response.data.motherName;
            $scope.fatherName = response.data.fatherName;
            $scope.rollNo = response.data.rollNo;
            $scope.classCoordinator = response.data.classCoordinator;
            $scope.marks = response.data.marks;
            $scope.sclass = response.data.sclass;
            $scope.school = response.data.school;
        }
    }).catch(function (error) {
        console.log('myerror',error);
    })
}
}

// Student logout
$scope.logout =function(){
    myFact.Logout('/student/logout')
} 

// get data of dashboard on refresh
$scope.getStudentDetails(localStorage.getItem('C_Email'))

})