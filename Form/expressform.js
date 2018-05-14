/*
This file contains all required javascript functions for Express form.
*/

rowId = {};
table_index = {};
new_qrcode = {};
total_field = {};
restored_from_local = {};
input_data = {
	id: data.general_id
};

function addRow(table_id){
	if(new_qrcode[table_id]){
		return;
	}

	if(rowId[table_id] !== 0  && restored_from_local[table_id] === false){
		var previous_row = rowId[table_id] - 1;
		create_input_data(table_id, previous_row.toString());
	}
	else{
		restored_from_local[table_id] = false;
	}
	var current_row = rowId[table_id];
	var table = document.getElementById(table_id);
	var row = table.insertRow(1);
	row.id = table_id + current_row.toString();
	var field, element, cellCount = 0;
	new_qrcode[table_id] = true;

	if (data.checkbox === true) {
		field = row.insertCell(cellCount++);
		element = document.createElement("input");
		element.type = "checkbox";
		element.className += data.class;
		element.name = "chkbox[]";
		field.appendChild(element);
		element = null;
	}

	field = row.insertCell(cellCount++);
	element = document.createElement("input");
	element.type = "number";
	element.name = table_id + "qrcode[]";
	element.className += data.class;
	element.placeholder = "QR Code";
	element.id = table_id + "qrcode" + current_row;
	element.addEventListener("keyup", function(event) {
		event.preventDefault();
		var thisrow = this.id.substring(12);
		var qrcode = this.value;
		var result;
		if (event.keyCode == 13) {
			if(result = validate_qrcode(qrcode, table_id)){
				this.readOnly = true;
				document.getElementById(table_id+"qr_error_indicator"+thisrow).style.display = "none";
				document.getElementById(table_id+"qr_result"+thisrow).innerHTML = result;
				document.getElementById(total_field[table_id]).value = table.rows.length - 1;
				addRow(table_id);
			}
			else{
				this.value = "";
				document.getElementById(table_id+"qr_error_indicator"+thisrow).style.display = "block";
			}
		}
	});
	field.appendChild(element);
	element.focus();
	element = null;

	div = document.createElement("div");
	div.id = table_id+"qr_error_indicator" + current_row;
	div.innerHTML = "Invaid QR Code!";
	div.style = "color: red; display:none;";
	field.appendChild(div);

	//QR Result
	div = document.createElement("div");
	div.id = table_id+"qr_result" + current_row;
	field.appendChild(div);

	rowId[table_id] ++;
}

function initialize_express_mode(){
	for (i in data.tables) {
		rowId[data.tables[i].table_id] = 0;
		table_index[data.tables[i].table_id] = i;
		new_qrcode[data.tables[i].table_id] = false;
		restored_from_local[data.tables[i].table_id] = false;
		total_field[data.tables[i].table_id] = data.tables[i].total_value_field;
		input_data[data.tables[i].table_id] = {};
		addRow(data.tables[i].table_id);
	}

}
initialize_express_mode();

function create_input_data(table_id, row_id){
	var qrcode = document.getElementById(table_id + "qrcode" + row_id).value;
	input_data[table_id][row_id] = qrcode;
	//console.log(input_data);
	local_store(input_data);
}

function validate_qrcode(qrcode, table_id){
	if(check_for_duplicate(qrcode, table_id) === false){
		return false;
	}
	for (i in data.tables) {
		if(data.tables[i].table_id === table_id){
			if( data.tables[i].qrcode_values[qrcode] !== undefined){
				new_qrcode[table_id] = false;
				return data.tables[i].qrcode_values[qrcode].result;
			}
		}
	}
	
	return false;
}

function check_for_duplicate(qrcode, table_id){
	var table = document.getElementById(table_id);
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

function deleteRows(table_id){
	var table = document.getElementById(table_id);
	var rowCount = table.rows.length;
	for(var i=0; i<rowCount; i++) {
		var row = table.rows[i];
		//var current_rowid = row.id;
		var chkbox = row.cells[0].childNodes[0];
		if(null != chkbox && true == chkbox.checked) {
          table.deleteRow(i);
          //delete input_data[current_rowid];
          rowCount--;
          i--;
        }
	}
	document.getElementById(total_field[table_id]).value = table.rows.length - 2;
	//local_store(input_data);
}

function restore_form_local(){
	var local_data;
	if(local_data = local_retrive(data.general_id)){
		for (i in data.tables) {
			var table_id = data.tables[i].table_id;
			var table_data = local_data[table_id];
			var table = document.getElementById(table_id);
			table.deleteRow(1);
			rowId[table_id] --;
			new_qrcode[table_id] = false;
			restored_from_local[table_id] = true;
			for (var row_index in table_data) {
				if (table_data.hasOwnProperty(row_index)) {
					var current_row = rowId[table_id];
					var row = table.insertRow(1);
					row.id = table_id + current_row.toString();
					var field, element, cellCount = 0;
					if (data.checkbox === true) {
						field = row.insertCell(cellCount++);
						element = document.createElement("input");
						element.type = "checkbox";
						element.className += data.class;
						element.name = "chkbox[]";
						field.appendChild(element);
						element = null;
					}
					field = row.insertCell(cellCount++);
					element = document.createElement("input");
					element.type = "number";
					element.name = table_id + "qrcode[]";
					element.className += data.class;
					element.placeholder = "QR Code";
					element.readOnly = true;
					element.value = table_data[row_index];
					element.id = table_id + "qrcode" + current_row;
					field.appendChild(element);
					element = null;

					rowId[table_id] ++;
				}
			}
			addRow(table_id);
			input_data[table_id] = local_data[table_id];
		}
	}
}