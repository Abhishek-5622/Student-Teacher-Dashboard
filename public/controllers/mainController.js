// ********************mainController*****************

app.controller('mainController', function ($scope, $http, $routeParams, $uibModal) {

    $scope.showPopup = function () {
        user = { 'region': '', 'city': "" };
        $scope.modalInstance = $uibModal.open({
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'templates/admin_templates/view.html',
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