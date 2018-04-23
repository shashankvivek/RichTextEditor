(function() {
	angular.module('leaf').controller('FileUploadController',
			function($uibModalInstance,$window,util) {
				util.saveCursorPosition($window);
				var $ctrl = this;
				$ctrl.local = '',
				$ctrl.url  = '';

				$ctrl.attach = function() {
					var path = ($ctrl.local !== '')? $ctrl.local : $ctrl.url
					var imgHtml = '<img src="'+ path +'">';
					return $uibModalInstance.close(imgHtml);
				}
				$ctrl.cancel = function() {
					return $uibModalInstance.close(false);
				};

			})
})()