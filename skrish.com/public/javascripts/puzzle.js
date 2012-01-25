
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
	}
};



FB_PUZZLE.Board = function(config){
	this.dimension= (config.dimension)?config.dimension:0;/*no of rows and cols*/
	this.boardDimension= config.image_dimension;/*width and height of the board*/
	this.image = config.image;
	this._tiles=[];
	this._actual_tile_positions=[];
	this._current_tile_positions=[];
	this._DOMElement= this.generateDOMElement();
	(function(board){
		board.init();
	})(this);
};
FB_PUZZLE.Board.prototype.generateDOMElement=function(){
	var ul = document.createElement("ul");
	ul.className="puzzle-board";
	ul.style.width=this.boardDimension+"px";
	//ul.style.height=this.boardDimension+"px";
	/*Add Event Listeners Here*/
	return ul;
};

FB_PUZZLE.Board.prototype.renderPuzzle=function(){
	/*Assumes Init has been Called*/
	var i,total_no_of_tiles;
	
	/*Always Render by current_tile_positions- so sort the tile array*/
	this._tiles.sort(function(tile1,tile2){
		return tile1.current_position-tile2.current_position;
	});
	total_no_of_tiles= this.dimension*this.dimension;
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

FB_PUZZLE.Board.prototype.init = function(){
	var i=0,total_no_of_tiles,tile_dimension;
	if(this.dimension>2){
		tile_dimension= Math.floor(this.boardDimension/this.dimension)-4;
		total_no_of_tiles=this.dimension*this.dimension;
		/*Init actual Positions*/
		while(this._actual_tile_positions.length<total_no_of_tiles){
			this._actual_tile_positions[i]=i;
			i++;
		}
		/*Randomize Atual Positions -- Actuals Array should never be modified after this*/
		this.randomizePositions(this._actual_tile_positions);
		
		/*Generate Randomize Positions*/
		this._current_tile_positions=this._actual_tile_positions.slice(0);
		this.randomizePositions(this._current_tile_positions);
		for(i=0;i<total_no_of_tiles;i++){
			this._tiles[i]= new FB_PUZZLE.Tile({"dimension":tile_dimension,"current_position":this._current_tile_positions[i],"actual_position":this._actual_tile_positions[i],"tile_coordinates":this.decodeTileCoordinates(this._actual_tile_positions[i]),"image":this.image});
		}
		
		this.renderPuzzle();
	}else{
		throw FB_PUZZLE_INVALID_DIMENSION_ERROR;
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
	this.coordinates= (config.tile_coordinates)?config.tile_coordinates:{"row":0,"col":0};
	this.dimension= config.dimension; /*actual width and height*/
	this.image=config.image;
	this.isBlank=(typeof(config.actual_position)=="number" && config.actual_position==0)?true:false;
	this._DOMElement=this.generateDOMElement();
};

FB_PUZZLE.Tile.prototype.generateDOMElement = function(){
	var li,pos;
	li=document.createElement("li");
	li.className="tile";
	li.style.height=this.dimension+"px";
	li.style.width=this.dimension+"px";
	if(!this.isBlank){
		li.style.backgroundImage="url("+this.image+")";
	}else{
		li.className+=" blank";
	}
	li.style.backgroundPosition=(-1*this.coordinates["row"]*this.dimension)+"px "+ (-1*this.coordinates["col"]*this.dimension)+"px";
	/*Add Event Listeners Here*/
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

FB_PUZZLE.Game.prototype.renderBoard=function(){
	
};

(function(){
	var CONSTANTS = FB_PUZZLE.CONSTANTS;
	var game = new FB_PUZZLE.Game({"image":"/images/globe.jpg","dimension":CONSTANTS.BOARD_DIMENSION,"image_dimension":CONSTANTS.IMAGE_DIMENSION});
	game.init();
})();

