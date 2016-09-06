'use strict';

angular.module('myApp.patients', ['ngResource', 'ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/patients', {
    templateUrl: 'views/patients.html',
    controller: 'Patients'
  });
}])
.factory('Patients', ['$resource', function($resource) {
  return $resource( '/patients/:_id', null,
    {
        'update': { method:'PUT' }
    });
}])
.factory('PatientService', ['$rootScope', '$location', function($rootScope, $location){
    return {
        removePatient: function(patientIndex, scope){
			scope.patient.$delete({action:"delete", _id:scope.patient._id}, function() {
				scope.patientsList.splice(patientIndex, 1);
			});
            scope.$apply();
        },
		editPatient: function(patientIndex, scope, $location){
			$location.path('/patients/edit/' + scope.patient._id);
			$rootScope.$apply();
        }
    };
}])
.directive('ngRemovePatient', ['PatientService', function(patientService){
    return function(scope, element, attrs){
        angular.element(element.bind('click', function(){
            patientService.removePatient(scope.$eval(attrs.ngRemovePatient), scope);  
        }));       
    };
}])
.directive('ngEditPatient', ['PatientService', '$location', function(patientService, $location){
    return function(scope, element, attrs){
        angular.element(element.bind('click', function(){
            patientService.editPatient(scope.$eval(attrs.ngEditPatient), scope, $location);  
        }));       
    };
}])
.controller('Patients', ['$scope', 'Patients', function($scope, patients) {
	$scope.patientsList = patients.query();
}]);