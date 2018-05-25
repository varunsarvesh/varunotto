/*
This file contains all required javascript functions for Normal form.
*/

window.onload = function(){
	var queryParams = simpleQueryString.parse(window.location.href)
	if (
		queryParams !== undefined && queryParams.run !== null && queryParams.run !== undefined
		) {
		if (queryParams.run === 'restore') {
			restore_from_local();
		}
	}
}

rowId = 0;
new_qrcode = false;
new_description = false;
restored_from_local = false;
addRow();
input_data = {
	id: data.table_id
};

function initialize_type(type_table_id){
	var table = document.getElementById(type_table_id);
	var row = table.rows[0];
	var field, cellCount = 0;
	field = row.insertCell(cellCount++);
	for (i in data.sizes) {
		field = row.insertCell(cellCount++);
		field.innerHTML = data.sizes[i].name;
	}
}

function add_type_row(type_table_id, row_name){
	var table = document.getElementById(type_table_id);
	var rowCount = table.rows.length;
	var row = table.insertRow(rowCount);
	var field, element, cellCount = 0;
	field = row.insertCell(cellCount++);
	field.innerHTML = row_name;
	for (i in data.sizes) {
		field = row.insertCell(cellCount++);
		element = document.createElement("input");
		element.type = "number";
		element.className += "small-input";
		element.id = row_name + data.sizes[i].name;
		field.appendChild(element);
	}
}

function initialize(){
	var table = document.getElementById(data.table_id);
	var row = table.rows[0];
	var field, cellCount = 0;
	if (data.checkbox === true) {
		field = row.insertCell(cellCount++);
		field.innerHTML = "Chk";
	}
	field = row.insertCell(cellCount++);
	field.innerHTML = "QR Code";
	if (data.description !== false) {
		field = row.insertCell(cellCount++);
		field.innerHTML = "Description";
	}
	field = row.insertCell(cellCount++);
	field.innerHTML = "Type";
	for (i in data.sizes) {
		field = row.insertCell(cellCount++);
		field.innerHTML = data.sizes[i].name;
	}
	field = row.insertCell(cellCount++);
	field.innerHTML = "Count";
	initialize_type("TypeTable1");
	add_type_row("TypeTable1","A");
	add_type_row("TypeTable1","B");
	add_type_row("TypeTable1","C");
	initialize_type("TypeTable2");
	add_type_row("TypeTable2","D");
	add_type_row("TypeTable2","E");
	add_type_row("TypeTable2","F");
	if (data.description !== false) {
		table = document.getElementById("summary");
		row = table.rows[0];
		cellCount = 0;
		field = row.insertCell(cellCount++);
		field.innerHTML = "Description";
		field = row.insertCell(cellCount++);
		field.innerHTML = "Option";
		field = row.insertCell(cellCount++);
		field.innerHTML = "Qty";
		for (i in data.description_values) {
			cellCount = 0;
			var rowCount = table.rows.length;
			row = table.insertRow(rowCount);
			field = row.insertCell(cellCount++);
			field.innerHTML = data.description_values[i];
			field = row.insertCell(cellCount++);
			field.id = "summary" + data.description_values[i] + "option";
			field.innerHTML = "0";
			field = row.insertCell(cellCount++);
			field.id = "summary" + data.description_values[i] + "qty";
			field.innerHTML = "0";
		}
	}
}

initialize();

function addRow() {
	if(new_qrcode || new_description){
		return;
	}

	if(rowId !== 0 && restored_from_local === false){
		var previous_row = rowId - 1;
		create_input_data("row" + previous_row.toString());
	}
	else{
		restored_from_local = false;
	}

	var table = document.getElementById(data.table_id);
	var row = table.insertRow(1);
	row.id = "row" + rowId.toString();
	var field, element, div, cellCount = 0;
	new_qrcode = true;
	new_description = true;
	is_description = data.description;
	is_userdefined_description = data.userdefined_description;
	if(is_description === false){
		new_description = false;
	}

	//Check Box for deleting rows
	if (data.checkbox === true) {
		field = row.insertCell(cellCount++);
		element = document.createElement("input");
		element.type = "checkbox";
		element.className += data.class;
		element.name = "chkbox[]";
		field.appendChild(element);
		element = null;
	}
	//Qr Code
	field = row.insertCell(cellCount++);
	element = document.createElement("input");
	element.type = "number";
	element.name = "qrcode[]";
	element.className += data.class;
	element.placeholder = "QR Code";
	element.id = "qrcode" + rowId;
	element.addEventListener("keyup", function(event) {
		event.preventDefault();
		var qrcode = this.value;
		var currentrow = this.id.substring(6);
		if (event.keyCode == 13) {
			if(validate_qrcode(qrcode, currentrow)){
				this.readOnly = true;
				document.getElementById("qr_error_indicator"+currentrow).style.display = "none";
			}
			else{
				this.value = "";
				document.getElementById("qr_error_indicator"+currentrow).style.display = "block";
			}
		}
	});
	field.appendChild(element);
	element = null;

	//QR error indicator
	div = document.createElement("div");
	div.id = "qr_error_indicator" + rowId;
	div.innerHTML = "Invaid QR Code!";
	div.style = "color: red; display:none;";
	field.appendChild(div);

	//QR Result
	div = document.createElement("div");
	div.id = "qr_result" + rowId;
	field.appendChild(div);

	//Description
	if (data.description !== false) {
		field = row.insertCell(cellCount++);
		element = document.createElement("input");
		element.type = "text";
		element.name = "description[]";
		element.className += data.class;
		element.readOnly = true;
		element.placeholder = data.description;
		element.id = "description" + rowId;
		element.addEventListener("keyup", function(event) {
			event.preventDefault();
			var description = this.value;
			var currentrow = this.id.substring(11);
			if (event.keyCode == 13) {
				if(validate_description(description, currentrow) && new_qrcode === false){
					document.getElementById("description_error_indicator"+currentrow).style.display = "none";
					this.readOnly = true;
					new_description = false;
					var type = document.getElementById("type"+currentrow);
					type.readOnly = false;
					type.focus();
				}
				else{
					this.value = "";
					document.getElementById("description_error_indicator"+currentrow).style.display = "block";
				}
			}
		});
		field.appendChild(element);
		element = null;
		
		//Description error indicator
		div = document.createElement("div");
		div.id = "description_error_indicator" + rowId;
		div.innerHTML = "Invaid " + data.description + "!";
		div.style = "color: red; display:none;";
		field.appendChild(div);

	}
	//Type
	field = row.insertCell(cellCount++);
	element = document.createElement("input");
	element.type = "text";
	element.name = "type[]";
	element.readOnly = true;
	element.placeholder = "Type";
	element.id = "type" + rowId;
	element.className += data.class;
	element.addEventListener("keyup", function(event) {
		event.preventDefault();
		var option = this.value;
		var currentrow = this.id.substring(4);
		if (event.keyCode == 13) {
			this.readOnly = true;
			work_for_type(option, currentrow);
		}
	});
	field.appendChild(element);
	element = null;


	//Sizes
	for (i in data.sizes) {
		field = row.insertCell(cellCount++);
		element = document.createElement("input");
		element.type = data.sizes[i].type;
		element.name = data.sizes[i].name + "[]";
		element.id = data.sizes[i].id + rowId;
		element.readOnly = true;
		element.style.width = "75px";
		element.className += data.class;
		field.appendChild(element);
		element = null;
	}

	//Count in that row
	field = row.insertCell(cellCount++);
	element = document.createElement("input");
	element.type = "number";
	element.name = "count[]";
	element.className += data.class;
	element.className += " count ";
	element.style.width = "75px";
	element.readOnly = true;
	element.id = "count" + rowId;
	field.appendChild(element);
	element = null;

	document.getElementById("qrcode"+rowId).focus();
	rowId ++;
}

function deleteRows() {
	var table = document.getElementById(data.table_id);
	var rowCount = table.rows.length;
	for(var i=2; i<rowCount; i++) {
		var row = table.rows[i];
		var current_rowid = row.id;
		var chkbox = row.cells[0].childNodes[0];
		if(null != chkbox && true == chkbox.checked) {
			table.deleteRow(i);
			delete input_data[current_rowid];
			rowCount--;
			i--;
		}
	}
	local_store(input_data);
	retotal();
}

function retotal(){
	var total = 0;
	for (var i = 0; i <= rowId; i++) {
		if (document.getElementById("count"+i) != null){
			var x = document.getElementById("count"+i).value;
			total += +x;
		}
	}
	document.getElementById(data.total_value_field).value = total;
	if (data.description !== false) {
		for (j in data.description_values) {
			var option = 0;
			var qty = 0;
			for (var i = 0; i <= rowId; i++) {
				if (document.getElementById("description"+i) != null){
					if(document.getElementById("description"+i).value === data.description_values[j]){
						option++;
						var x = document.getElementById("count"+i).value;
						total += +x;
						qty += +x;
					}
				}
			}
			document.getElementById("summary"+data.description_values[j]+"option").innerHTML = option;
			document.getElementById("summary"+data.description_values[j]+"qty").innerHTML = qty;
		}
	}
	return total;
}

function check_for_duplicate1(qrcode){ //without description
	var table = document.getElementById(data.table_id);
	var rowCount = table.rows.length;
	for(var i=2; i<rowCount; i++) {
		var row = table.rows[i];
		var old_qrcode = row.cells[1].childNodes[0].value;
		if(null !== old_qrcode && old_qrcode === qrcode){
			show_duplicate_card();
			return false;
		}
	}
	return true;
}

function check_for_duplicate2(description, currentrow){ //with description
	var table = document.getElementById(data.table_id);
	var rowCount = table.rows.length;
	var qrcode = document.getElementById("qrcode" + currentrow).value;
	for(var i=2; i<rowCount; i++) {
		var row = table.rows[i];
		var old_qrcode = row.cells[1].childNodes[0].value;
		var old_description = row.cells[2].childNodes[0].value;
		if(null !== old_qrcode && old_qrcode === qrcode && old_description === description){
			show_duplicate_card();
			return false;
		}
	}
	return true;
}

function validate_qrcode(qrcode, currentrow){

	if(data.qrcode_values[qrcode] === undefined){
		return false;
	}
	else{
		if(is_description === false){ // no description
			if(check_for_duplicate1(qrcode) === false){
				return false;
			}
			new_description = false;
			var type = document.getElementById("type"+currentrow);
			type.readOnly = false;
			type.focus();
		}
		else if(is_description !== false && is_userdefined_description === false){ //Description is not userdefined
			if(check_for_duplicate1(qrcode) === false){
				return false;
			}
			new_description = false;
			document.getElementById("description" + currentrow).value = data.qrcode_values[qrcode].description;
			var type = document.getElementById("type"+currentrow);
			type.readOnly = false;
			type.focus();
		}
		else{
			var des = document.getElementById("description"+currentrow);
			des.readOnly = false;
			des.focus();
		}
		document.getElementById("qr_result" + currentrow).innerHTML = data.qrcode_values[qrcode].result;
		new_qrcode = false;
	}
	return true;
}

function validate_description(description, currentrow){
	if(check_for_duplicate2(description, currentrow) === false){
		var qrcode_field = document.getElementById("qrcode" + currentrow);
		qrcode_field.value = "";
		qrcode_field.readOnly = false;
		qrcode_field.focus();
		return false;
	}
	else{
		var i = data.description_values.length;
		while (i--) {
			if(data.description_values[i] === description){
				return true;
			}
		}
		return false;
	}
}

function create_input_data(current_rowid){
	var fields = {};
	console.log(current_rowid);
	$("#"+current_rowid).find(":input").each(function() {
		if(this.type !== "checkbox" && this.name !== "type[]" && this.name !== ""){
			fields[this.name] = $(this).val();
		}
	});
	input_data[current_rowid] = fields;
	local_store(input_data);
}


function work_for_type(option, currentrow){
	var total = 0;
	if(option === "A" || option === "B" || option === "C" || option === "D" || option === "E" || option === "F"){
		for(i in data.sizes){
			var value = document.getElementById(option + data.sizes[i].id).value;
			document.getElementById(data.sizes[i].id + currentrow).value = value;
			total = total + +value;
		}
		document.getElementById("count" + currentrow).value = total;
	}
	else{
		document.getElementById("type" + currentrow).value = "";
		document.getElementById("type" + currentrow).readOnly = false;
		return;
	}
	retotal();
	addRow();
}

function restore_from_local(){
	var local_data;
	var field, element, div, cellCount = 0;
	var table = document.getElementById(data.table_id);
	if(local_data = local_retrive(data.table_id)){
		restored_from_local = true;
		table.deleteRow(1);
		rowId --;
		for (var property in local_data) {
			if (local_data.hasOwnProperty(property)) {
				if(property !== "id"){
					cellCount = 0;
					var row_data = local_data[property];
					var row = table.insertRow(1);
					row.id = property;
					if (data.checkbox === true) {
						field = row.insertCell(cellCount++);
						element = document.createElement("input");
						element.type = "checkbox";
						element.className += data.class;
						element.name = "chkbox[]";
						field.appendChild(element);
						element = null;
					}
					//Qr Code
					field = row.insertCell(cellCount++);
					element = document.createElement("input");
					element.type = "number";
					element.name = "qrcode[]";
					element.value = row_data["qrcode[]"];
					element.className += data.class;
					element.placeholder = "QR Code";
					element.id = "qrcode" + rowId;
					element.readOnly = true;
					field.appendChild(element);
					element = null;

					if (data.description !== false) {
						field = row.insertCell(cellCount++);
						element = document.createElement("input");
						element.type = "text";
						element.name = "description[]";
						element.className += data.class;
						element.readOnly = true;
						element.placeholder = data.description;
						element.id = "description" + rowId;
						element.value = row_data["description[]"];
						field.appendChild(element);
						element = null;
					}

					field = row.insertCell(cellCount++); //Type Field

					for (i in data.sizes) {
						field = row.insertCell(cellCount++);
						element = document.createElement("input");
						element.type = data.sizes[i].type;
						element.name = data.sizes[i].name + "[]";
						element.id = data.sizes[i].id + rowId;
						element.value = row_data[data.sizes[i].name + "[]"];
						element.readOnly = true;
						element.style.width = "75px";
						element.className += data.class;
						field.appendChild(element);
						element = null;
					}

					field = row.insertCell(cellCount++);
					element = document.createElement("input");
					element.type = "number";
					element.name = "count[]";
					element.className += data.class;
					element.className += " count ";
					element.style.width = "75px";
					element.readOnly = true;
					element.value = row_data["count[]"];
					element.id = "count" + rowId;
					field.appendChild(element);
					element = null;

					rowId ++;
					input_data[property] = row_data;
				}
			}
		}
		retotal();
		document.getElementById("restore").style.display = "none";
		new_qrcode = false;
		new_description = false;
		addRow();
	}
}