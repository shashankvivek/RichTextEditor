(function() {
	var dirty = false; // flag to check whether tracking is required or its pristine.
	var BLUE = 'rgb(125, 170, 242)';
	var BLUE_HEX = "#7daaf2";
	var BLACK = 'rgb(51, 51, 51)';
	var deactivateBkpSpc = true;
	var ctrlPressed = false; // flag to check and allow shortcuts like ctrl+b , ctrl+i
	
	angular.module('leaf').component('leafEditor', {
		  require: {
		    ngModelController: 'ngModel'
		  },  
		  templateUrl: './template/editor.html',
		  controller: function ($element,$window,$document, util,$timeout) {
		    var vm = this;
		    var $container = angular.element($element[0].querySelector('#board'));
		    		    
		    vm.execCommand = function (command) {
		    	if (command === 'insertImage') {
		    		util.imgUploaderModal($window,dirty).result.then(function(response) {
		    			util.restoreCursorAndExecuteCmd('insertHTML',response);
					})
			    }else if(command === 'insertTable'){
		    		util.tableGeneratorModal($window,dirty).result.then(function(response) {
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
		    	  if(vm.ngModelController.$viewValue.length>0){dirty = true;} // set whether the editor is in dirty mode or not
		    	  return $container.html(vm.ngModelController.$viewValue);
		      };
		      
		      $container.bind('blur change focus', function () {
		    	  renderHtml();
		      });
		     
		      $container.bind('click', function (e) {	
		    	  // to set color as blue for any click 
	    		  if(dirty && $window.getSelection().toString() === ''){
	    			  $window.document.execCommand('foreColor', false,BLUE);
	    			  deactivateBkpSpc = true; // Bug : 28 
	    		  }
		    	  renderHtml();
		      });
		      		     
	          $container.bind('keydown', function (e) {
	        	  if(dirty){
	        		  var skipFontColorCmd = false;
	        		  if(e.keyCode===17){
	        			  ctrlPressed = true;
	        		  }
	        		  // user input any character/number
			    	  if((e.keyCode===32 || (e.keyCode >=48 && e.keyCode <=57) || (e.keyCode >=65 && e.keyCode <=90))){
			    		  // if nothing is selected
			    		  if($window.getSelection().toString() === ''){
			    			  if(document.queryCommandState('strikeThrough')){
				    			  // cancel strike effect before writing new changes
				    			  $window.document.execCommand('strikeThrough', false);
				    		  }		    		
				    		  
			    		  }
			    		  if($window.getSelection().toString() !== ''){
			    			  if(!ctrlPressed){
			    				  alert('Action not supported. Please deselect texts and type again!');
					    		  e.preventDefault();
			    			  }
			    			 skipFontColorCmd = true;
			    		  }
			    		  if(!skipFontColorCmd){
			    			  $window.document.execCommand('foreColor', false, BLUE);
			    		  }
			    	  }
	        		  if(e.keyCode===8){
	        			  console.log(deactivateBkpSpc);
	        			  console.log(document.queryCommandValue('ForeColor'));
	        			  if(document.queryCommandValue('ForeColor')===BLACK){
	        				 e.preventDefault();
	        			  }
	        			  if(document.queryCommandValue('ForeColor')===BLUE){
	        				  if(deactivateBkpSpc){
	        					  e.preventDefault();
		        				  moveCaret($window, -1);
		        				  moveCaret($window, 1);
		        				  deactivateBkpSpc = false;
		        				  //TODO - trigger bkpspc feature to have it one key press - bug: 15
	        				  }else{
	        					  deactivateBkpSpc = true;
	        				  }
	        			  }
		              }
	        		  if(e.keyCode===46){
	        			  e.preventDefault();
	        		  }
	        		  if(e.keyCode===13){
	        			  e.preventDefault();
	        		  }
	        	  }
	        	  renderHtml();
	          });
	          $container.bind('keyup', function (e) {
	        	  if(dirty){
	        		  if(e.keyCode===17){
	        			  ctrlPressed = false;
	        		  }
	        		  var selectedDOM = ($window.getSelection().getRangeAt(0).cloneContents());
//	        		  selectedDOM.children.length doesn't work when trying to delete chars with no children (i.e. black fonts)
	        		  if((e.keyCode===8 || e.keyCode===46)  && (selectedDOM.children.length > 0 || $window.getSelection().toString() !== '')){ 
//	        		      //if table is has partial selection of "rows" and "columns" cancel operation
	        			  if(!validDelOperation($window)){
	        				  alert('Multiple deletion of rows/columns not allowed. Either select entire table or each grid');
	        			  }else{
	        				  $window.document.execCommand('strikeThrough', false);
		        			  modifyDOMForChanges($window); 
	        			  }
	        			     			  
	        		  }	  
		              if(dirty && e.keyCode===32){
		            	  $window.document.execCommand('removeFormat', false);
		              }
		              
		              if(e.keyCode===13){
		            	  //add new line break with a class to distinguish from existing ones.
		            	  $window.document.execCommand('insertHTML',true,'<br class="new">&nbsp;'); //&nbsp; is a fix : bug 12
		              }
	        	  }
	        	  renderHtml();
	          });
		    };
		    
		    function renderHtml(){
		    	vm.ngModelController.$setViewValue($container.html());
		    }
		  }
		});
	
	function validDelOperation($window){
		var selectionContents = $window.getSelection().getRangeAt(0).cloneContents();
		var tableEls = selectionContents.querySelectorAll('table');
		var tableTREls = selectionContents.querySelectorAll('tr');
		var tableTHEls = selectionContents.querySelectorAll('th');
		var tableTDEls = selectionContents.querySelectorAll('td');
		// if table is not selected but has "tr" || "td" || "th" , then return false;
		return !((tableEls.length === 0) && (tableTREls.length > 0 || tableTHEls.length > 0 ||tableTDEls.length > 0))
	}
	
	function modifyDOMForChanges($window){
		var span;
	  	var range = $window.getSelection().getRangeAt(0);
	  	console.log(range.cloneContents())	  	
	  	var selectionContents = range.extractContents();
	  	var fontEls = selectionContents.querySelectorAll('font');
		fontEls.forEach(function(fontEl) {
			// remove all blue fonts	    		    	  
			if (fontEl.color === BLUE_HEX){
				// check if there are nested child that shouldnt be removed // Bug : 29
				fontEl.remove();
//				console.log(fontEl)
//				var ImgInsideBlueFonts = fontEl.getElementsByTagName('img')[0];
//				fontEl.remove();
//				span = document.createElement("span");
//				ImgInsideBlueFonts.forEach(function(imgEl) {
//					// remove all "new" line breaks	    		    
//					if (imgEl.className  === 'new old'){ // TODO : Change it to 'old'
//						// append at the same position
//					}
//				});
			}
		});
		var brEls = selectionContents.querySelectorAll('br');
		brEls.forEach(function(brEl) {
			// remove all "new" line breaks	    		    
			if (brEl.className  === 'new'){brEl.remove();}
		});
		var imgEls = selectionContents.querySelectorAll('img');
		imgEls.forEach(function(imgEl) {
			if (imgEl.className  === ''){
				// add class for opacity for server img
				imgEl.className = 'old' ;
			}else if(imgEl.className === 'old'){
				// undo opacity effect
				imgEl.className = '';
			}else{
				// remove any other image
				imgEl.remove();
			}
		});
		var tableEls = selectionContents.querySelectorAll('table');
		tableEls.forEach(function(tableEl) {
			// remove all new line breaks	    		    
			if (tableEl.className  === 'table table-bordered new'){tableEl.remove();}
			// else append some class with some style to mark it as del and append
		});
		
		span = document.createElement("span");
		console.log(selectionContents)
		span.appendChild(selectionContents);
		//remove all &nbsp; so that strike effect wont come over whitespaces Bug: 19
		span.innerHTML = span.innerHTML.replace(/&nbsp;/g, "");
		range.insertNode(span);
	}
	
	function moveCaret(win, charCount) {
	    var sel, range;
	    if (win.getSelection) {
	        sel = win.getSelection();
	        if (sel.rangeCount > 0) {
	            var textNode = sel.focusNode;
	            var newOffset = sel.focusOffset + charCount;
	            sel.collapse(textNode, Math.min(textNode.length, newOffset));
	        }
	    } else if ( (sel = win.document.selection) ) {
	        if (sel.type != "Control") {
	            range = sel.createRange();
	            range.move("character", charCount);
	            range.select();
	        }
	    }
	}
})()