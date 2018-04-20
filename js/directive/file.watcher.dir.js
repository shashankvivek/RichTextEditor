(function() {
	angular.module('leaf').directive('fileWatcher', function() {
	    return {
	        require:"ngModel",
	        restrict: 'A',
	        link: function($scope, el, attrs, ngModel){
	            el.bind('change', function(event){
	                var files = event.target.files;
	                var reader = new FileReader();
	                reader.onload = function (e) {
	                	ngModel.$setViewValue(e.target.result)
					}
	                reader.readAsDataURL(files[0]);
	            });
	        }
	    };
	});
})()