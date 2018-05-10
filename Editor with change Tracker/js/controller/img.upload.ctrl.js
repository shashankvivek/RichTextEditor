(function() {
	angular.module('leaf').controller('FileUploadController',
			function($uibModalInstance,$window,dirty,util) {
				util.saveCursorPosition($window);
				var $ctrl = this;
				$ctrl.local = '',
				$ctrl.url  = '';

				$ctrl.attach = function() {
					var path = ($ctrl.local !== '')? $ctrl.local : $ctrl.url
					var imgHtml = (dirty) ? '<img class="new" style="max-height: 200px;max-width:200px" src="'+ path +'">' : '<img style="max-height: 200px;max-width:200px" src="'+ path +'">';
					return $uibModalInstance.close(imgHtml);
				}
				$ctrl.cancel = function() {
					return $uibModalInstance.close(false);
				};

			})
})()