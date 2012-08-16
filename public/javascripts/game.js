(function()
{
	started = false;
	environmentCount = 0;
	generatedEnvironments = {};

	$(document).ready(function(){

		//stop the form from submitting on enter
		$("form").submit(function(event){
		event.preventDefault();
		});

		//get input and pass it to the game, then clear input area
		$("#inputarea").change(function(event){
	
		//an important variable!!
		input = $("#inputarea").val();
	
		game(input);
	
		$(this).val('');
	
		});
	

	});

	//this will hold the general parts of the game
	function game(input){
		var input = this.input
		console.log("from game function: "+input);
		inputParse(input);
	}


	//this will interpret commands from the input line
	function inputParse(input){
		var input = this.input;
	
		//start game, initialize player, create first room
		if (input.match(/start/i) != null && started == false){
			console.log("start detected");
			generateOutput("Starting game! Enter your players name.");
			player = new player(prompt("Enter Your player's name"));
			generateOutput(player.getStatus());
			makeEnvironment();
			return started = true;
		};
	
		
		if (started == true){
	
			//if game already started
			if (input.match(/start/i) != null ){
			generateOutput("Game has begun.");
			};
	
	
	
			if (input.match(/move/i) != null){
			
				if (input.match(/north/i)){
					move("north");
					return;
				}
		
				if (input.match(/south/i)){
					move("south");
					return;
				}
			
				if (input.match(/east/i)){
					move("east");
					return;
				}
			
				if (input.match(/west/i)){
					move("west");
					return;
				}
				else{
					generateOutput("Please specify a valid cardinal direction.");
				}
				console.log("move detected");
			
			}
			
			if (input.match(/status/i) != null){
				generateOutput(player.getStatus());
			}
			
			if (input.match(/view/i) != null){
				generateOutput("You are currently in a "+player.location.biome.name+" area. "+"The wildlife in this area includes a "+player.location.biome.wildlife[3]+".");
			}
	
		} //started
		
		else generateOutput("please enter valid command   :\)")
	}


	//a function to generate output for the output area and delete the last element if there is overflow
	function generateOutput(output)
	{
		$("#outputarea").append("<span>"+output+"</span>"+"<BR>");
		//deletes first element of output to prevent overflow - change number in if statement. It counts number of spans, so divide by 2 for line numbers.
		if ($("#outputarea").children().length > 8){
			$("#outputarea").children("span:first").remove();
			$("#outputarea").children("br:first").remove();
		}
}


	//describes player
	function player(name){

		this.health = 100;
		this.name = name;
		this.location = null;
		
		this.getStatus = function(){
			return name +" currently has " + this.health + " health."	
		}
	}



	//this will describe rooms / environments
	function environment(){
		this.id;
		this.size;
		this.biome;
		this.connections = {};
	
	}

	function move(direction){
		
		opposite = {};
		opposite.north = "south";
		opposite.south = "north";
		opposite.east = "west";
		opposite.west = "east";
		
	
		if (player.location.connections[direction] != undefined){
		
			player.location = player.location.connections[direction];
			generateOutput("player moving " + direction + " to previously visited room");
			console.log("player location, already visited = " + player.location.id);
			return;
		}
		
		if (player.location.connections[direction] == undefined){
		
			makeEnvironment(direction);
			generateOutput("New environment discovered to the " + direction +"!"+" It's a " +newEnvironment.biome.name +".");
			console.log("environment generated to the " + direction);
			player.location.connections[direction] = newEnvironment;
			previousEnvironment = player.location;
			console.log(previousEnvironment);
			player.location = newEnvironment; //newEnvironment object is returned by makeRoom()
			player.location.connections[opposite[direction]] = previousEnvironment;	
			console.log(player.location.connections[opposite[direction]]);
			console.log(player.location.id + " = player location. Environment was generated to the: " + direction + " of Environment" + previousEnvironment.id);
			return;
		}
	}


	function makeEnvironment(direction){
	
		generatedEnvironments["environment" + environmentCount] = new environment();
		
		//when the game is initializing, set the player's location to the new room.
		if (player.location == null){
		
			player.location = generatedEnvironments["environment"+ environmentCount];
			console.log("initial player location registered");
		};
		
		generatedEnvironments["environment" + environmentCount].id = environmentCount;
		generatedEnvironments["environment" + environmentCount].biome = randomEnvironment();
		newEnvironment = generatedEnvironments["environment" + environmentCount];
		console.log("environment"+environmentCount+ " generated in makeEnvironment function");
		
		environmentCount++;
		return newEnvironment; 
		
	}
	
})();


