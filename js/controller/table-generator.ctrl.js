(function() {
	angular.module('leaf').controller('TableGeneratorController',
			function($uibModalInstance,$window,util) {
				util.saveCursorPosition($window);
				var template_body = '</tr></thead><tbody>';
				var template_footer = '</tbody></table>';
				
				var $ctrl = this;
				$ctrl.data = {
					row : 1,
					column : 1,
					width : 100
				};

				$ctrl.generateTable = function() {
					var template_head =  '<style>td img {max-width:100%;height:auto;}</style><table '+ 'style="table-layout: fixed; word-wrap: break-word;text-align: center;width:'+$ctrl.data.width+'%"' +' class="table table-bordered"><thead><tr style="background-color: #e9ecef">';
					var table_template = template_head+ createColumns($ctrl.data.column)+template_body+createRows($ctrl.data.row,$ctrl.data.column)+template_footer;
					return $uibModalInstance.close(table_template);
				}

				$ctrl.cancel = function() {
					return $uibModalInstance.close(false);
				}

			})
		
			// TODO -move to sevice
		function createColumns(count) {
			var str = '';
			for(var i=0; i< count;i++){
				str = str + '<th style="table-layout: fixed; word-wrap: break-word;text-align: center;"></th>';
			}
			return str;
		}
		function createRows(row_count,column_count) {
			var row = '';
			for(var r = 0 ; r < row_count; r++){
				row = row+'<tr>';
				var column = '';
				for(var c = 0;c < column_count;c++){
					column = column +'<td></td>';
				}
				row = row+column+'<tr>';
			}
			return row;
		}
})()