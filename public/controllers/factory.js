// Factory
angular.module('Factory', []).factory('myFact', function ($rootScope, $location, $http) {
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