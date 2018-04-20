(function() {

	angular.module('leaf').factory('util', function($uibModal) {

		var buttonLibrary = {
			bold : {
				title : 'Bold',
				command : 'bold',
				styleClass : 'bold'
			},
			italic : {
				title : 'Italic',
				command : 'italic',
				styleClass : 'italic'
			},
			underline : {
				title : 'Underline',
				command : 'underline',
				styleClass : 'underline'
			},
			createlink : {
				title : 'Insert Image',
				command : 'insertImage',
				styleClass : 'insertImage'
			}
		};

		var isButtonActive = function isButtonActive() {
			return !!this.command && document.queryCommandState(this.command);
		};
		
		return {
			getToolbarButtons : function getToolbarButtons() {
				var toolbarButtons = [];
				for ( var key in buttonLibrary) {
					var button = angular.copy(buttonLibrary[key]);
					button.isActive = isButtonActive;
					toolbarButtons.push(button);
				}
				return toolbarButtons;
			},
			imgUploaderModal : function() {
				return $uibModal.open({
					templateUrl : './template/imageUploader.html',
					animation : true,
					size : 'sm',
					ariaLabelledBy : 'modal-title',
					ariaDescribedBy : 'modal-body',
					controller : 'FileUploadController',
					controllerAs : "$ctrl"
				});

			}
		};
	});
})()