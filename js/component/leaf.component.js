(function() {
	angular.module('leaf').component('leafEditor', {
		  require: {
		    ngModelController: 'ngModel'
		  },  
		  templateUrl: './template/editor.html',
		  controller: function ($element,$window, util) {
		    var vm = this;
		    var $container = angular.element($element[0].querySelector('#board'));

		    vm.execCommand = function (command) {
		    	if (command === 'insertImage') {
		    		util.imgUploaderModal($window).result.then(function(response) {
		    			util.restoreCursorAndExecuteCmd('insertHTML',response);
					})
			    }else if(command === 'insertTable'){
		    		util.tableGeneratorModal($window).result.then(function(response) {
		    			util.restoreCursorAndExecuteCmd('insertHTML',response);
		    		})
			    }else{
			    	$window.document.execCommand(command, false);
			    }
			    
			    if ($container.length) {$container[0].focus();}
			   
		    };
		    this.$onInit = function () {
		    	
		      vm.toolbarButtons = util.getToolbarButtons();
		      
		      vm.ngModelController.$render = function () {
		    	  return $container.html(vm.ngModelController.$viewValue);
		      };
		      
		      $container.bind('blur keyup change focus click', function () {
		    	  vm.ngModelController.$setViewValue($container.html());
		      });
		    };

		  }
		});
})()