(function() {
	angular.module('leaf').component('leafEditor', {
		  require: {
		    ngModelController: 'ngModel'
		  },  
		  templateUrl: './template/editor.html',
		  controller: function ( $element, $document,$window, util) {
		    var vm = this;
		    var $container = angular.element($element[0].querySelector('#board'));

		    vm.execCommand = function (command) {
		    	
		    	if (command === 'insertImage') {
		    		var extUrl = '';
		    		util.imgUploaderModal().result.then(function(response) {
		    			if(!response){
		    				return;
		    			}
		    			if(response === 'url'){
		    				extUrl = $window.prompt('Please enter the URL', 'http://');
		    				if (!extUrl) {return;}
		    				response = extUrl;
		    			}
		    			$window.document.execCommand(command, false, response);
					})
			    }else{
			    	$window.document.execCommand(command, false);
			    }
			    
			   if ($container.length) {
				   $container[0].focus();
			   }
			   
		    };
		    this.$onInit = function () {
		      vm.toolbarButtons = util.getToolbarButtons();
		      
		      vm.ngModelController.$render = function () {
		    	  return $container.html(vm.ngModelController.$viewValue);
		      };
		      
		      $container.bind('blur keyup change focus click', function () {
//		    	  console.log($container.html())
		    	  vm.ngModelController.$setViewValue($container.html());
		      });
		    };

		  }
		});
})()