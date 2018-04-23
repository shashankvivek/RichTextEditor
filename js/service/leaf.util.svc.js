(function() {

	angular.module('leaf').factory('util', function($uibModal) {

		var window;
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
			insertOrderedList : {
				title : 'Numeric Points',
				command : 'insertOrderedList',
				styleClass : 'insertOrderedList'
			},
			insertUnorderedList : {
				title : 'Bullet Points',
				command : 'insertUnorderedList',
				styleClass : 'insertUnorderedList'
			},
			insertImage : {
				title : 'Insert Image',
				command : 'insertImage',
				styleClass : 'insertImage'
			},
			insertTable : {
				title : 'Insert Table',
				command : 'insertTable',
				styleClass : 'insertTable'
			}
		};

		var isButtonActive = function isButtonActive() {
			return !!this.command && document.queryCommandState(this.command);
		};

		return {
			getToolbarButtons : getToolbarButtons,
			imgUploaderModal : imgUploaderModal,
			tableGeneratorModal : tableGeneratorModal,
			restoreCursorAndExecuteCmd : restoreCursorAndExecuteCmd,
			saveCursorPosition : saveCursorPosition,
			restoreCusor : restoreCusor
		};
		
		function getToolbarButtons() {
			var toolbarButtons = [];
			for ( var key in buttonLibrary) {
				var button = angular.copy(buttonLibrary[key]);
				button.isActive = isButtonActive;
				toolbarButtons.push(button);
			}
			return toolbarButtons;
		}
		function imgUploaderModal($window) {
			return $uibModal.open({
				templateUrl : './template/image-uploader.html',
				animation : true,
				size : 'sm',
				ariaLabelledBy : 'modal-title',
				ariaDescribedBy : 'modal-body',
				controller : 'FileUploadController',
				controllerAs : "$ctrl",
				resolve : {
					$window : $window
				}
			});

		}
		function tableGeneratorModal($window) {
			return $uibModal.open({
				templateUrl : './template/table-generator.html',
				animation : true,
				size : 'sm',
				ariaLabelledBy : 'modal-title',
				ariaDescribedBy : 'modal-body',
				controller : 'TableGeneratorController',
				controllerAs : "$ctrl",
				resolve : {
					$window : $window
				}
			});
		}
		function restoreCursorAndExecuteCmd(cmd,response) {
			restoreCusor();
			if(!response){return;}
			window.document.execCommand(cmd, false,response);
		}
		function saveCursorPosition($window) {
			window = $window;
			var range = window.getSelection().getRangeAt(0);
			var sC = range.startContainer, eC = range.endContainer;

			var A = [];
			while (sC !== board) {
				A.push(getNodeIndex(sC));
				sC = sC.parentNode
			}
			var B = [];
			while (eC !== board) {
				B.push(getNodeIndex(eC));
				eC = eC.parentNode
			}

			$window.rp = {
				"sC" : A,
				"sO" : range.startOffset,
				"eC" : B,
				"eO" : range.endOffset
			};

			function getNodeIndex(n) {
				var i = 0;
				while (n = n.previousSibling)
					i++;
				return i
			}
		}
		function restoreCusor() {
			board.focus();
			var sel = window.getSelection(), range = sel.getRangeAt(0);
			var x, C, sC = board, eC = board;

			C = rp.sC;
			x = C.length;
			while (x--)
				sC = sC.childNodes[C[x]];
			C = rp.eC;
			x = C.length;
			while (x--)
				eC = eC.childNodes[C[x]];

			range.setStart(sC, rp.sO);
			range.setEnd(eC, rp.eO);
			sel.removeAllRanges();
			sel.addRange(range);
		}

	});
})()