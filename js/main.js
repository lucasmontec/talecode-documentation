var taleCodeAPI;
var apiids = [];

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

$( document ).ready(function() {
	//GET TALE API
	$.getJSON( "talecodeapi.json", function( data ) {
	  var items = [];
	  taleCodeAPI = data.TaleCodeDoc;
	  
	  //Make a info object
	  var APIIDS = {};
	  
	  $.each( data.TaleCodeDoc, function( key, val ) {
	  	//If there is no list for that APIID type
	  	//Make the list
	  	if(!(val.icon in APIIDS)){
	  		APIIDS[val.icon] = [];
	  	}
	  	
	  	//Add the apiid to its type list
	  	APIIDS[val.icon].push(val.apiid);
	  });
	  
	  //Go through each list and add all values
	  $.each(APIIDS, function(key, val){
	  	//Add the type
	  	items.push( "<h3>" + capitalizeFirstLetter(key) + "</h3>" );
	  	
	  	//Add all elements of that type
	  	val.forEach(
	  		function(element, index){
	  			items.push( "<li>" + element + "</li>" );
	  		}
	  	);
	  });
	 
	  $( "#APIIDList" ).append( items );
	  $( "#title" ).text("TaleCode Documentation : "+data.AlienTextEngine);
	}).fail(function() {
	    console.log( "error: couldn't load tale code api." );
	}).success(function() {
	    listReady();
	    enableSearch();
	});
	
});

function enableSearch(){
	$.each( taleCodeAPI, function( key, val ) {
		/*General information*/
		$('#apiid').text(val.apiid);
		apiids.push(val.apiid);
    });
	//ENABLE SEARCH
	$( "#searchtext" ).autocomplete({
      source: apiids,
      delay: 10,
      position: { my : "right top", at: "right bottom" }
    });
    console.log(apiids.toString());
    
	$(document).keypress(function(e) {
	    if(e.which == 13) {
	        populateContent( $( "#searchtext" ).val() );
	    }
	});
	
	$( ".ui-autocomplete" ).click(function(e){
		populateContent( $( "#searchtext" ).val() );
	});
}

function listReady(){
	//CLICK GETS ME DATA
	$('#APIIDList li').click(function(e){
		var id = $(this).text();
		$("html, body").animate({ scrollTop: 0 }, "slow");
		populateContent(id);
	});
}

function populateContent(apiid){
	$.each( taleCodeAPI, function( key, val ) {
    	if(val.apiid == apiid){
    		/*General information*/
    		$('#apiid').text(val.apiid);
    		$('#superclass').text("super: "+val.superclass);
    		$('#apiIcon').attr('src',"img/"+val.icon+".png");
    		$('#description').text(val.description);
    		
    		/*Constructor information*/
    		var constructors = [];
    		$.each( val.constructors, function( key, val ) {
    			constructors.push( "<li>" + val.parameters + "</li>" );
    		});
    		$("#constructors").empty();
    		$( "#constructors" ).append( constructors );
    		
    		/*Constructor information*/
    		var methods = [];
    		$.each( val.methods, function( key, val ) {
    			methods.push( "<li>" + val.name+" : ("+ val.parameters + ")</li>" );
    		});
    		$("#methods").empty();
    		$( "#methods" ).append( methods );
    		var numitems =  $("#methods").length;
    		$("#methods").css("column-count",Math.round(numitems/2));
    	}
  	});
}
