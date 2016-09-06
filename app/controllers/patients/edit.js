'use strict';

angular.module('myApp.EditPatients', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/patients/edit/:id', {
    templateUrl: 'views/patients/edit.html',
    controller: 'EditPatients'
  });
}])

.controller('EditPatients', ['$scope', 'Patients', '$location', '$routeParams', '$http', function($scope, Patients, $location, $routeParams, $http) {
	
    $scope.activePath = null;    

    $http.get('/patients/'+ $routeParams.id).success(function(data) { 
        $scope.patient = data;  
		$scope.oriPatient = angular.copy($scope.patient);
    }); 

$scope.checkDates = function() {
	var d1 = moment($scope.patient.refrecieved);
	var d2 = moment($scope.patient.scanundertaken);
	$scope.patient.numdaystaken = Math.floor(moment.duration(d2.diff(d1)).asDays());
	if($scope.patient.numdaystaken < 0 && !isNaN($scope.patient.scanundertaken)) {
		delete $scope.patient.scanundertaken;
		alert('Scan undertaken date must be after the referral recieved date.');
		return;
	}
	var d2 = moment($scope.patient.refrecieved);
	var d1 = moment($scope.patient.scanundertaken);
	$scope.patient.numdaystaken = Math.floor(moment.duration(d2.diff(d1)).asDays());
	if($scope.patient.numdaystaken > 0 && !isNaN($scope.patient.scanundertaken)) {
		delete $scope.patient.refrecieved;
		alert('Referral recieved date must be before the scan undertaken date.');
	}
};

$scope.resetForm = function () {
    $scope.patient = angular.copy($scope.oriPatient);
};
	
$scope.editPatient = function() {
	if($scope.patient.abnormaloutcome) {
		$scope.patient.abnormaloutcome = 'Y';
	} else {
		$scope.patient.abnormaloutcome = 'N';
	}
	var d1 = moment($scope.patient.refrecieved);
	var d2 = moment($scope.patient.scanundertaken);
	$scope.patient.numdaystaken = Math.floor(moment.duration(d2.diff(d1)).asDays());
	if($scope.patient.numdaystaken <= 3) {
		$scope.patient.withinnationaltarget = 'Y';
	} else {
		$scope.patient.withinnationaltarget = 'N';
	}

	if(typeof($scope.patient.refrecieved) != Date) {
		$scope.patient.refrecieved = new Date($scope.patient.refrecieved);
	}
	$scope.patient.anonid = $scope.patient.whereseen[0] + $scope.patient.refrecieved.getFullYear() + 
		$scope.patient.refrecieved.getDate() + $scope.patient.refrecieved.getMonth() + 
		$scope.patient.whereseen[$scope.patient.whereseen.length - 1];
		
	var editData = {
            anonid : $scope.patient.anonid, 
            refrecieved: $scope.patient.refrecieved,
			scanundertaken: $scope.patient.scanundertaken,
			numdaystaken: $scope.patient.numdaystaken,
			withinnationaltarget: $scope.patient.withinnationaltarget,
			reasonfordelay: $scope.patient.reasonfordelay,
			abnormaloutcome: $scope.patient.abnormaloutcome,
			chdtype: $scope.patient.chdtype,
			whereseen: $scope.patient.whereseen,
			dateseen: $scope.patient.dateseen    
        };

    $http.put('/patients/' + $scope.patient._id, JSON.stringify(editData));
	$location.path('/patients');
};

$scope.cancelEditPatient = function() {
    $location.path('/patients');
};

}]);