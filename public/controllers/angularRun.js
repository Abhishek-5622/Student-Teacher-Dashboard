// run app
angular.module('myAppRun', []).run(["$rootScope", "$timeout", function ($rootScope, $timeout) {
    $rootScope.showFeedBack = function (message) {
        $rootScope.isVisible = true;
        $rootScope.flashMessage = message;
        $timeout(function () { $rootScope.isVisible = false }, 10000)
    }
}]);
