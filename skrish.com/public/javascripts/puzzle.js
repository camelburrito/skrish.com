
if(!FB_PUZZLE){
	var FB_PUZZLE= {};	
}

FB_PUZZLE.CONSTANTS={
	BOARD_DIMENSION:4,
	IMAGE_DIMENSION:540 /*in PIXELS*/
};

FB_PUZZLE.UTIL={
	getRandomInteger: function(max,min){
		if(!min){
			min=0;
		}
		return Math.floor(((max - min) * Math.random()) + min);
	},
	addListener:((function(){
		if(window.addEventListener){
			return (function(element,action,callback){
				element.addEventListener(action,callback,false);
			});
		}else if(window.attachEvent){
			return (function(element,action,callback){
				element.attachEvent("on"+action,callback);
			});
		}else{
			return (function(element,action,callback){
				if(!element["on"+action]){
					element["on"+action]=callback;
				}else{
					element["on"+action]= function(){element["on"+action]();callback();};
				}
			});
		}
	})())
};



FB_PUZZLE.Board = function(config){
	this.dimension= (config.dimension)?config.dimension:0;/*no of rows and cols*/
	this.boardDimension= config.image_dimension;/*width and height of the board*/
	this.image = config.image;
	this._tiles=[];
	this._DOMElement= this.generateDOMElement();
	(function(board){
		board.init();
	})(this);
};
FB_PUZZLE.Board.prototype.generateDOMElement=function(){
	var ul = document.createElement("ul");
	ul.className="puzzle-board";
	ul.style.position="relative";
	ul.style.width=this.boardDimension+"px";
	ul.style.height=this.boardDimension+"px";
	/*Add Event Listeners Here*/
	return ul;
};

FB_PUZZLE.Board.prototype.renderPuzzle=function(){
	/*Assumes Init has been Called atleast once before*/
	var i,total_no_of_tiles,UTIL=FB_PUZZLE.UTIL,action_tile;
	total_no_of_tiles= this.dimension*this.dimension;
	for(i=0;i<total_no_of_tiles;i++){
		/*Add Event Listeners Here*/
		(function(board,tile){
			var offset = {"x":0,"y":0};
			UTIL.addListener(tile._DOMElement,"click",function(){
				board.moveTile(tile);
			});		
			UTIL.addListener(tile._DOMElement,"touchstart",function(e){		    
		    offset = {
		      x: e.changedTouches[0].pageX - parseInt(this.style.left,10),
		      y: e.changedTouches[0].pageY - parseInt(this.style.top,10)
		    };
			});
			UTIL.addListener(tile._DOMElement,"touchmove",function(e){
				e.preventDefault();
				var move=	board.getPossibleTileMove(tile);
				if(!move){
					return;
				}	    
		    if(move=="left" || move=="right"){
					this.style.left=(e.changedTouches[0].pageX - offset.x)+"px";
				}
				if(move=="top" || move=="bottom"){
					this.style.top=(e.changedTouches[0].pageY - offset.y)+"px";
				}
				
			});		
			
		})(this,this._tiles[i]);
		this._DOMElement.appendChild(this._tiles[i]._DOMElement);
	}
	document.getElementsByTagName("body")[0].appendChild(this._DOMElement);
};

FB_PUZZLE.Board.prototype.redrawPuzzle=function(){
	var i,total_no_of_tiles;
	this._DOMElement.innerHTML="";
	for(i=0;i<total_no_of_tiles;i++){
		this._DOMElement.appendChild(this._tiles[i]._DOMElement);
	}
	document.getElementsByTagName("body")[0].appendChild(this._DOMElement);
};


FB_PUZZLE.Board.prototype.decodeTileCoordinates=function(position){
	var row,col;
	if(typeof(position)=="number"){
		row= Math.floor(position/this.dimension);
		col= position%this.dimension;
		return {"row":row,"col":col};
	}else{
		throw "FB_PUZZLE_INVALID_TILE_POSITION";
	}
};


FB_PUZZLE.Board.prototype.moveTile=function(tile){
	var tmp_position=tile.current_position;
	if(tile.isBlank){
		return;
	}
	var move_direction= this.getPossibleTileMove(tile);
	console.log("This Tile Can move to it's "+move_direction);
	//alert(move_direction);
	if(move_direction){
		if(move_direction=="left"){
			this.swapTiles(tile.current_position,tile.current_position-1);
		}else if(move_direction=="right"){
			this.swapTiles(tile.current_position,tile.current_position+1);
		}else if(move_direction=="top"){
			this.swapTiles(tile.current_position,tile.current_position-this.dimension);
		}else if(move_direction=="bottom"){
			this.swapTiles(tile.current_position,tile.current_position+this.dimension);
		}else if(move_direction=="rowleft"){
			while(this._tiles[tmp_position].isBlank!=true){
				if(this._tiles[tile.current_position-1].isBlank){
					this.moveTile(tile);
				}else{
					this.moveTile(this._tiles[tile.current_position-1]);
				}
			}			
		}else if(move_direction=="rowright"){
			while(this._tiles[tmp_position].isBlank!=true){
				if(this._tiles[tile.current_position+1].isBlank){
					this.moveTile(tile);
				}else{
					this.moveTile(this._tiles[tile.current_position+1]);
				}
			}			
		}else if(move_direction=="coltop"){
			while(this._tiles[tmp_position].isBlank!=true){
				if(this._tiles[tile.current_position-this.dimension].isBlank){
					this.moveTile(tile);
				}else{
					this.moveTile(this._tiles[tile.current_position-this.dimension]);
				}
			}			
		}else if(move_direction=="colbottom"){
			while(this._tiles[tmp_position].isBlank!=true){
				if(this._tiles[tile.current_position+this.dimension].isBlank){
					this.moveTile(tile);
				}else{
					this.moveTile(this._tiles[tile.current_position+this.dimension]);
				}
			}			
		}
	}
};


FB_PUZZLE.Board.prototype.swapTiles=function(tile1_pos,tile2_pos){
	var tmp,i;
	/*Update Current Positions*/
	this._tiles[tile1_pos].current_position=tile2_pos;
	this._tiles[tile2_pos].current_position=tile1_pos;
	
	// tmp=this._current_tile_positions[tile1_pos];
	// this._current_tile_positions[tile1_pos]=this._current_tile_positions[tile2_pos];
	// this._current_tile_positions[tile2_pos]=tmp;
	
	/*swap current_coordinates*/
	tmp=this._tiles[tile1_pos].current_coordinates;
	this._tiles[tile1_pos].current_coordinates=this._tiles[tile2_pos].current_coordinates;
	this._tiles[tile2_pos].current_coordinates=tmp;
	
	/*Swap Tile Objects*/
	tmp=this._tiles[tile1_pos];
	this._tiles[tile1_pos]=this._tiles[tile2_pos];
	this._tiles[tile2_pos]=tmp;
	
	/*Physically move tiles by updating background positions*/
	tmp=this._tiles[tile1_pos]._DOMElement.style.left;
	this._tiles[tile1_pos]._DOMElement.style.left=this._tiles[tile2_pos]._DOMElement.style.left;
	this._tiles[tile2_pos]._DOMElement.style.left=tmp;
	
	tmp=this._tiles[tile1_pos]._DOMElement.style.top;
	this._tiles[tile1_pos]._DOMElement.style.top=this._tiles[tile2_pos]._DOMElement.style.top;
	this._tiles[tile2_pos]._DOMElement.style.top=tmp;

	if(this.isBoardSolved()){
		alert("game ends");
	}
	
	// console.log("Current Positions :"+this._current_tile_positions.toString());
	// console.log("Actual Positions :"+this._actual_tile_positions.toString());
};

FB_PUZZLE.Board.prototype.isBoardSolved=function(){
	var i=0;
	for(;i<this._tiles.length;i++){
		if(this._tiles[i].current_position!=this._tiles[i].actual_position){
			return false;
		}
	}
	return true;
};


FB_PUZZLE.Board.prototype.moveTileRowLeft=function(tile){
	
};

FB_PUZZLE.Board.prototype.getPossibleTileMove=function(tile,travesal_direction){
	var current_position= tile.current_position,temp,coordinates,left=true,top=true,bottom=true,right=true,tiles=this._tiles;
	if(!travesal_direction){
		travesal_direction="";
	}
	
	coordinates= this.decodeTileCoordinates(current_position);
	console.log("("+coordinates.row+","+coordinates.col+")-->");
	if(coordinates.col==0){
		left=false;
	}
	
	if(coordinates.col==this.dimension-1){
		right=false;
	}
	
	if(coordinates.row==0){
		top=false;
	}
	
	if(coordinates.row==this.dimension-1){
		bottom=false;
	}
	if(travesal_direction=="left"){
		if(!left){
			return false;
		}else{
			right=false;top=false;bottom=false;
		}
	}
	
	if(travesal_direction=="right"){
		if(!right){
			return false;
		}else{
			left=false;top=false;bottom=false;
		}
	}
	
	if(travesal_direction=="top"){
		if(!top){
			return false;
		}else{
			right=false;left=false;bottom=false;
		}
	}
	
	if(travesal_direction=="bottom"){
		if(!bottom){
			return false;
		}else{
			right=false;top=false;left=false;
		}
	}
	
	if(left && tiles[current_position-1] && tiles[current_position-1].isBlank){
		return "left";
	}
	if(right && tiles[current_position+1] && tiles[current_position+1].isBlank){
		return "right";
	}
	if(top && tiles[current_position-this.dimension] && tiles[current_position-this.dimension].isBlank){
		return "top";
	}
	if(bottom && tiles[current_position+this.dimension] && tiles[current_position+this.dimension].isBlank){
		return "bottom";
	}
	if(left){
		temp_move=this.getPossibleTileMove(tiles[current_position-1],"left");
		if(temp_move=="left" || temp_move=="rowleft"){
			return "rowleft";
		}
	}
	if(right){
		temp_move=this.getPossibleTileMove(tiles[current_position+1],"right");
		if(temp_move=="right" || temp_move=="rowright"){
			return "rowright";
		}
	}
	if(top){
		temp_move=this.getPossibleTileMove(tiles[current_position-this.dimension],"top");
		if(temp_move=="top" || temp_move=="coltop"){
			return "coltop";
		}
	}
	if(bottom){
		temp_move=this.getPossibleTileMove(tiles[current_position+this.dimension],"bottom");
		if(temp_move=="bottom" || temp_move=="colbottom"){
			return "colbottom";
		}
	}
	return false;
};


FB_PUZZLE.Board.prototype.init = function(){
	var i=0,total_no_of_tiles,tile_dimension,_actual_tile_positions=[],_current_tile_positions=[];
	if(this.dimension>=2){
		tile_dimension= Math.floor(this.boardDimension/this.dimension)-4;
		total_no_of_tiles=this.dimension*this.dimension;
		/*Init actual Positions*/
		while(_actual_tile_positions.length<total_no_of_tiles){
			_actual_tile_positions[i]=i;
			i++;
		}
		/*Randomize Atual Positions -- Actuals Array should never be modified after this*/
		this.randomizePositions(_actual_tile_positions);
		
		/*Generate Randomize Positions*/
		_current_tile_positions=_actual_tile_positions.slice(0);
		this.randomizePositions(_current_tile_positions);
		for(i=0;i<total_no_of_tiles;i++){
			this._tiles[i]= new FB_PUZZLE.Tile({"dimension":tile_dimension,"current_position":_current_tile_positions[i],"actual_position":_actual_tile_positions[i],"actual_tile_coordinates":this.decodeTileCoordinates(_actual_tile_positions[i]),"current_tile_coordinates":this.decodeTileCoordinates(_current_tile_positions[i]),"image":this.image});
		}
		/*Always Render by current_tile_positions- so sort the tile array*/
		this._tiles.sort(function(tile1,tile2){
			return tile1.current_position-tile2.current_position;
		});
		this.renderPuzzle();
	}else{
		throw "FB_PUZZLE_INVALID_DIMENSION_ERROR";
	}
};


FB_PUZZLE.Board.prototype.randomizePositions=function(tile_positions_array){
	if(tile_positions_array && tile_positions_array instanceof Array &&tile_positions_array.length>1){
		tile_positions_array.sort(function() {return 0.5 - Math.random();});
	}
};


FB_PUZZLE.Tile= function(config){
	this.current_position= (typeof(config.current_position)=="number")?config.current_position:-1;
	this.actual_position=(typeof(config.actual_position)=="number")?config.actual_position:-1;
	this.actual_coordinates= (config.actual_tile_coordinates)?config.actual_tile_coordinates:{"row":0,"col":0};
	this.current_coordinates= (config.current_tile_coordinates)?config.current_tile_coordinates:{"row":0,"col":0};
	this.dimension= config.dimension; /*actual width and height*/
	this.image=config.image;
	this.isBlank=(typeof(config.actual_position)=="number" && config.actual_position==0)?true:false;
	this._DOMElement=this.generateDOMElement();
};

FB_PUZZLE.Tile.prototype.generateDOMElement = function(){
	var li,pos;
	li=document.createElement("li");
	li.className="tile";
	li.style.position="absolute";
	li.style.left=(this.current_coordinates["col"]*(this.dimension+4))+"px";
	li.style.top=(this.current_coordinates["row"]*(this.dimension+4))+"px";
	li.style.height=this.dimension+"px";
	li.style.width=this.dimension+"px";
	//li.innerHTML="Current-("+this.current_coordinates["row"]+","+this.current_coordinates["col"]+")--- Actual-("+this.actual_coordinates["row"]+","+this.actual_coordinates["col"]+")";
	if(!this.isBlank){
		li.style.backgroundImage="url("+this.image+")";
	}else{
		li.className+=" blank";
	}
	li.style.backgroundPosition=(-1*this.actual_coordinates["col"]*this.dimension)+"px "+ (-1*this.actual_coordinates["row"]*this.dimension)+"px";
	return li;
};




FB_PUZZLE.Game = function(config){
	this.gameImage= config.image;
	this.gameImageDimension = config.image_dimension;
	this.gameDimension= config.dimension;
	this._board;
};

FB_PUZZLE.Game.prototype.init=function(){
	this._board= new FB_PUZZLE.Board({"dimension":this.gameDimension,"image_dimension":this.gameImageDimension,"image":this.gameImage});
};

(function(){
	var UTIL=FB_PUZZLE.UTIL,body=document.getElementsByTagName("body")[0];
	UTIL.addListener(body,'touchmove', function(e) {
		e.preventDefault();
	}, false);

	UTIL.addListener(window,'load', function(e) {
		setTimeout(function() {setTimeout(scrollTo, 0, 0, 1);}, 10);
	});

	// UTIL.addListener(window,'orientationchange', function(e) {
	// 	return false;
	// 	if(window.orientation==90 || window.orientation==-90){
	// 		e.preventDefault();
	// 	}
	// });

	
	
	var CONSTANTS = FB_PUZZLE.CONSTANTS;
	var game = new FB_PUZZLE.Game({"image":"/images/globe.jpg","dimension":CONSTANTS.BOARD_DIMENSION,"image_dimension":CONSTANTS.IMAGE_DIMENSION});
	game.init();
})();

