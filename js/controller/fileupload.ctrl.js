(function() {
	angular.module('leaf').controller('FileUploadController',
			function($uibModalInstance) {
				var $ctrl = this;
				$ctrl.local = '';
				
				$ctrl.attachUrl = function() {
					return $uibModalInstance.close('url');
				}
				$ctrl.attach = function() {
					return $uibModalInstance.close($ctrl.local);
				}
				$ctrl.cancel = function() {
					return $uibModalInstance.close(false);
				};
				
				
			})
})()