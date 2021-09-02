app.post('/getuser', async (req, res) => {
    console.log("my data")
    console.log(req.body.data);
        
    
        // Get all data
        UserRegister.findOne({
            name:req.body.data.name,
            email:req.body.data.email,
            password:req.body.data.password
        }).then((data) => {
            console.log("My Login result:" +data)
            res.send("Welecome")
        }).catch(function (e) {
            console.log("Error: " + e)
        })
    })





     // getData
     $scope.getData = function (uname, uemail, upassword) {
        // $http.get("http://localhost:8000/getuser").then(function (resp) {
            var data = {
                "name": uname,
                "email": uemail,
                "password": upassword
            }
            $http.post("http://localhost:8000/getuser",{
                data
            }).then(function(response){
                console.log("Res Data" +response.data);
            }).catch(function(error){
                console.log(error);
            })
        

        //     $rootScope.arr = resp.data;
        
        //     $rootScope.login_val = false;
        //     for (let i = 0; i < $rootScope.arr.length; i++) {
        //         if ($rootScope.arr[i].name === uname && $rootScope.arr[i].email === uemail && $rootScope.arr[i].password === upassword) {
        //             $rootScope.login_val = true;
        //             $scope.getemail(uemail)
        //             $location.path('student-dashboard')
        //             console.log("login")
        //             $scope.getStudentDetails(uemail)
        //             $scope.alertVal = false;
        //             break;
        //         }
        //         else {
        //             $rootScope.login_val = false;
        //             $scope.alertVal = true;

        //         }
        //     }
        //     if ($scope.alertVal === true) {
        //         alert("Please Enter valid details");
        //     }
        // })
    }










    app.get('/getuser', async (req, res) => {

        // Get all data
        UserRegister.find().then((data) => {
            res.json(data);
        }).catch(function (e) {
            console.log("Error: " + e)
        })
    
        // try {
        //     const token = await UserRegister.generateAuthToken()
        //     console.log(token)
    
        //     res.cookie('jwt', token, {
        //         expires: new Date(Date.now() + 100000),
        //         httpOnly: true
        //     })
        //     res.send("Cookie Set");
        // }
        // catch (err) {
        //     console.log(err)
        // }
    
    })



// getData
$scope.getData = function (uname, uemail, upassword) {
    $http.get("http://localhost:8000/getuser").then(function (resp) {
        
        $rootScope.arr = resp.data;
    
        $rootScope.login_val = false;
        for (let i = 0; i < $rootScope.arr.length; i++) {
            if ($rootScope.arr[i].name === uname && $rootScope.arr[i].email === uemail && $rootScope.arr[i].password === upassword) {
                $rootScope.login_val = true;
                $scope.getemail(uemail)
                $location.path('student-dashboard')
                console.log("login")
                $scope.getStudentDetails(uemail)
                $scope.alertVal = false;
                break;
            }
            else {
                $rootScope.login_val = false;
                $scope.alertVal = true;
            }
        }
        if ($scope.alertVal === true) {
            alert("Please Enter valid details");
        }
    })
}