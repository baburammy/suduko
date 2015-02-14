function SudukoGameLauncher_Ramesh(){
			
			function getSavedData(){
				if( localStorage ){
					return {
						'level': localStorage.getItem('level'),
						'sudukoData':JSON.parse(localStorage.getItem('sudukoData'))
					}
				}
				return null;		
			}			
			
			function updateLocalData(row,col,val){
				if( localStorage ){					
					var suduData = JSON.parse(localStorage.getItem('sudukoData'));
					if( suduData ){
						if(val){
						//update as negative value, Indication for template this value is entered by the user
							suduData[row]["row"][col]=val*-1;
						}else{
							suduData[row]["row"][col]=0;
						}
						localStorage.setItem('sudukoData', JSON.stringify(suduData));
					}
				}
			}
			
			function getInputByLevel(level){
			//Ideally, this method should generate the board date based on the user selected level
			if(level == 1){
				return [{"row":[5,3,0,0,7,0,0,0,0]} ,{"row":[6,0,0,1,9,5,0,0,0]} ,{"row":[0,9,8,0,0,0,0,6,0]},{"row":[8,0,0,0,6,0,0,0,3]},{"row":[4,0,0,8,0,3,0,0,1]},{"row":[7,0,0,0,2,0,0,0,6]},{"row":[0,6,0,0,0,0,2,8,0]},{"row":[0,0,0,4,1,9,0,0,5]},{"row":[0,0,0,0,8,0,0,7,9]} ];
			}else if(level == 2){
				return [{"row":[0,2,0,6,0,8,0,0,0]} ,{"row":[5,8,0,0,0,9,7,0,0]} ,{"row":[0,0,0,0,4,0,0,0,0]},{"row":[3,7,0,0,0,0,5,0,0]},{"row":[6,0,0,0,0,0,0,0,4]},{"row":[0,0,8,0,0,0,0,1,3]},{"row":[0,0,0,0,2,0,0,0,0]},{"row":[0,0,9,8,0,0,0,3,6]},{"row":[0,0,0,3,0,6,0,9,0]} ];
			}else if(level == 3){
				return [{"row":[0,0,0,6,0,0,4,0,0]} ,{"row":[7,0,0,0,0,3,6,0,0]} ,{"row":[0,0,0,0,9,1,0,8,0]},{"row":[0,0,0,0,0,0,0,0,0]},{"row":[0,5,0,1,8,0,0,0,3]},{"row":[0,0,0,3,0,6,0,4,5]},{"row":[0,4,0,2,0,0,0,6,0]},{"row":[9,0,3,0,0,0,0,0,0]},{"row":[0,2,0,0,0,0,1,0,0]} ];
			}			
		}		
		
		function createBoardTemplate(data){
			 Handlebars.registerHelper('isGTZ', function(elem,options) {				  			
					if( elem && parseFloat(elem) > 0){
						return options.fn(this);
					}				  
				  return options.inverse(this);
			});
			
			Handlebars.registerHelper('showValue', function(val,options) {
				  if(val) {		
					val = parseFloat(val);
					if( val == 0){
						return '';
					}else if(val < 0){
						return (val * -1);
					}else if(val > 0 ){
						return val;
					}
				  }
				  return '';
			});
			
			 var theTemplateScript = $("#board-template").html();			 
             var theTemplate = Handlebars.compile (theTemplateScript);			 
			 $(".boardWrap").html ($.trim(theTemplate(data))); 
		}
		function createGame(){
			var board =null;
			//check whether already data available in local storage
			var oldData = getSavedData();
			if( oldData && oldData.level && oldData.sudukoData){
				selectButton(oldData.level);
				board = oldData.sudukoData;				
			}else{
				//by default load easy level
				board = getInputByLevel(1);				
				saveGame(1,board);							
			}		
			createBoardTemplate(board);
			attachEvents();
		}
		
		function selectButton(level){
			if(localStorage){
				localStorage.setItem('level', level);
			}			
			$('.headWrap > div').each(function(index){
					if(parseFloat($(this).data('level')) != level ){
						$(this).removeClass('selected');
					}else{
						if(!$(this).hasClass('selected')){
							$(this).addClass('selected');
						}
					}
			});
		}
		
		function attachEvents(){
			var handler= function(e){
				$('.result').hide();
				if(checkReadOnly(this)){
					return;
				}			
				var val =$(this).val();
				if( validateInput(val)){
					var row = parseFloat($(this).data('row'));
					var col = parseFloat($(this).data('col'));
					if(val){
						val = parseFloat(val);
					}else{
						val = 0;
					}					
					var err = isError(row,col,val,this);
					if(!err){
						updateLocalData(row,col,val);
					}					
					$(this).removeClass('inpErr');
				}else{
					if(!$(this).hasClass('inpErr')){
						$(this).addClass('inpErr');
					}
					//updateLocalData(row,col,val);
				}
			};
			
			var loadGameByLevel=function(){
				$('.result').hide();
				var level = parseFloat( $(this).data('level') );				
				selectButton(level);				
				createBoardTemplate(getInputByLevel(level));
			}			
			
			function showOrHideMsg(isSuc){
				if(isSuc){
					$('.result .errMsg').hide();
					$('.result .sucMsg').show();		
				}else{
					$('.result .sucMsg').hide();
					$('.result .errMsg').show();				
				}				
				$('.result').show();				
			}
			
			var checkBoard = function(){
				for(var i =0;i<9;i++){
					for(var j=0;j<9;j++){
						var elem = getElementByIdx(i,j);
						var val = $(elem).val();
						if(val){
							val = parseFloat(val);
						}else{
							val = -1;
						}
						if( val > 0 ){
							if(isError(i,j,val,elem[0])){
								showOrHideMsg(false);
								return;
							}
						}else{
							showOrHideMsg(false);
							return;
						}					
					}
				}
				showOrHideMsg(true);
			}
			
			$( ".boardWrap" ).on('keyup.suduko','.board input',handler);
			$('.mainCnt').on('click.suduko',' .headWrap > div',loadGameByLevel);
			$('.mainCnt').on('click.suduko',' .validate',checkBoard);
			//$(window).on('beforeunload.suduko',saveGame);			
		}
		function getCurrentLevel(){
			return $('.headWrap > div.selected').data('level');			
		}
		function getCurrentState(){
			var rows = new Array();
			$('.board > div').each(function(index){
			  var parent = this;
			  var row = new Array();
			  $(parent).find('div').each(function(idx){
					row.push($(this).find('input').val());
			  });
			  rows.push({'row':row});
			});	
			return rows;	
		}
		function saveGame(level,board){
			if( localStorage ){
				localStorage.setItem('level', level);
				localStorage.setItem('sudukoData', JSON.stringify(board));
			}		
		}
		function checkReadOnly(elem){
			var roAttr = $(elem).attr('disabled');
			if(roAttr){
				return true;
			}
			return false;
		}
		function validateInput(val){			
			if( val == ""){
				return true;
			}
			
			var val = parseFloat(val);
			
			if (isNaN(val) )
			{
				return false;
			}
			
			if( val == 0 ){
				return false;
			}
			
			return true;
		}					
		
		function isError(rowIdx,colIdx,num,elem){
		   var rowErr = checkRow(rowIdx,colIdx,num,elem) ,
		    colErr = checkColumn(rowIdx,colIdx,num,elem),
			boxErr = checkBox(rowIdx,colIdx,num,elem);
			return rowErr || colErr || boxErr;
		}
		
		function checkBox(rowIdx,colIdx,value){
		    var boxRowIdx = getCurrentBoxRowStartIdx(rowIdx);
			var boxColIdx = getCurrentBoxColStartIdx(colIdx);
			return checkBoxValues(rowIdx,colIdx,boxRowIdx,boxColIdx,value);
		}
		
		function checkBoxValues(rowIdx,colIdx,boxRowIdx,boxColIdx,value){
		  for(var i=boxRowIdx;i<=boxRowIdx+2;i++){
			for(var j=boxColIdx;j<=boxColIdx+2;j++){
				if( i != rowIdx || j != colIdx ){
					if(getValueByIdx(i,j) == value ){
						showOrHideBoxError(boxRowIdx,boxColIdx,true);
						return true;
					}
				}
			}
		
		}
		  showOrHideBoxError(boxRowIdx,boxColIdx,false);
		  return false;
		}	
		
		function getValueByIdx(rowIdx,colIdx){
			var rowElem = $('.board > div');
			var newColIdx = colIdx+1;
			var elem =$(rowElem[rowIdx]).find('div:nth-child('+newColIdx+')');
			var val = $(elem).find('input').val();
			if(val){
				val = parseFloat(val);
			}else{
				val = -1;
			}
			return val;
		}
		
		function getElementByIdx(rowIdx,colIdx){
			var rowElem = $('.board > div');
			var newColIdx = colIdx+1;
			return $(rowElem[rowIdx]).find('div:nth-child('+newColIdx+') > input');
		}
		
		function showOrHideBoxError(boxRowIdx,boxColIdx,show){
			var rowElem = $('.board > div');
			for(var i=boxRowIdx;i<=boxRowIdx+2;i++){
				var rows = $(rowElem[i]).find('div');
				for(var j=boxColIdx;j<=boxColIdx+2;j++){
					 var elem =rows[j];
					if(show){						
						if(!$(elem).hasClass('boxErr')){
							$(elem).addClass('boxErr');
						}
					}else{
						$(elem).removeClass('boxErr');
					}
				}
			}			
    	  }
		
		function getCurrentBoxRowStartIdx(colIdx){
			return Math.floor(colIdx/3)*3;
		}
		
		function getCurrentBoxColStartIdx(rowIdx){
			return Math.floor(rowIdx/3)*3;
		}
		
		function checkColumn(rowIdx,colIdx,value,elem){
			for(var i=0;i<9;i++){
					if( i != rowIdx){
						if( getValueByIdx(i,colIdx) == value){
							showOrHideColError(elem,true);
							return true;
						}
					}									
			}
			showOrHideColError(elem,false);
			return false;
		}	
		
		function checkRow(rowIdx,colIdx,value,elem){
			for(var i=0;i<9;i++){
					if( colIdx != i ){
						if( getValueByIdx(rowIdx,i) == value){
							showOrHideRowError(elem,true);
							return true;
						}
					}									
			}
			showOrHideRowError(elem,false);
			return false;
		}
		
		function getRowObj(inp){
			if(inp){
				return $(inp).parent().parent();
			}
			return null;
		}
		
		function showOrHideColError(elem,show){
			if(elem){
				var colIdx = parseFloat($(elem).data('col'));
				var errColIdx = colIdx+1;
				var cols = $('.board > div div:nth-child('+errColIdx+')');				
				if(cols){
					if(show){			    
						if(!cols.hasClass('colErr')){
								cols.addClass('colErr');
						}
					}else{
						cols.removeClass('colErr');					
					}
				}
			}			
		}
		
		function showOrHideRowError(elem,show){
			if(elem){
				var row = getRowObj(elem);
				if(row){
					if(show){			    
						if(!$(row).hasClass('err')){
								$(row).addClass('err');
							}
						}else{
							$(row).removeClass('err');
						}
					}
				}			
		}		
			
		return{
			launchGame : function(){					
				//check whether already data available in local storage
				var oldData = getSavedData();
				if( oldData && oldData.level && oldData.sudukoData){
					selectButton(oldData.level);
					board = oldData.sudukoData;				
				}else{
					//by default load easy level
					board = getInputByLevel(1);
				}		
				createBoardTemplate(board);
				attachEvents();
			}
		}
	}