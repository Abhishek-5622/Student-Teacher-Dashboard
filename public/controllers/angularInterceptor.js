// interceptor 
angular.module('myInterceptor', []).config(function ($httpProvider) {
    $httpProvider.interceptors.push(["$rootScope", function ($rootScope, $q) {
        return {
            request: function (config) {
                console.log('request started...');
                //Validating the requests and assign the csrf token to each requests   
                var token = document.cookie
                config.headers['x-csrf-token'] = token;
                return config;
            },
            requestError: function (rejection) {
                console.log(rejection);
                // Contains the data about the error on the request and return the promise rejection.    
                return $q.reject(rejection);
            },
            response: function (result) {
                console.log('request completed');
                return result;
            },
            // handle request response
            responseError: function (response) {
                console.log('response error started...');
                //Check different response status.   
                if (response.status === 400) {
                    $rootScope.ErrorMsg = "Bad Request";
                    $rootScope.showFeedBack($rootScope.ErrorMsg)
                }
                if (response.status === 401) {
                    $rootScope.ErrorMsg = "Unauthorized User";
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