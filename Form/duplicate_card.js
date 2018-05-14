function initialize_duplicate_card() {
	var card = document.createElement("div");
	card.id = "duplicate_card";
	card.innerHTML = "Duplicate!";
	card.style = "position: fixed; display: none; right: 0; top: 0; margin-right: 40px; margin-top: 30px; z-index: 900; background-color: lightgrey; width: 80px; border: 10px solid red; padding: 10px;";
	document.body.appendChild(card);
}
initialize_duplicate_card();

function show_duplicate_card(){
	$("#duplicate_card").show();
	$("#duplicate_card").fadeTo(800, 200).slideUp(200, function(){
		$("#duplicate_card").slideUp(200); 
	});
}