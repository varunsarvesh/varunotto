/*
This file contains all required javascript functions for Express form.
*/

rowId = {};
table_index = {};
new_qrcode = {};
total_field = {};
restored_from_local = {};
consolidated_data = {};
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

function calculate_size_count(table_id, count_percent, field_id){
	var total_value_field = total_field[table_id];
	var total_value = +document.getElementById(total_value_field).value;
	var z = 0;
	if(+count_percent > 0){
		if(+count_percent < 5 ){
			z = +count_percent * total_value;
		}
		else if(+count_percent < 5001){
			z = (+count_percent/100) * total_value;
		}
	}
	document.getElementById(field_id + "_C").value = Math.round(z);
	var total = 0;
	for(i in data.sizes){
		var x = +document.getElementById(table_id + data.sizes[i].id + "_C").value;
		total += x;
	}
	document.getElementById(total_value_field + "_C").value = Math.round(total);

	var grand_total = 0;
	for(i in data.tables){
		var x = +document.getElementById(data.tables[i].total_value_field + "_C").value;
		grand_total += x;
	}
	document.getElementById(data.total_value_field).value = grand_total;

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
	var table = document.getElementById("count_table");
	var row = table.rows[0];
	var field, element, cellCount = 0;
	if(data.description !== false){
		field = row.insertCell(cellCount++);
		field.innerHTML = "Descrip";
	}
	for(i in data.sizes){
		field = row.insertCell(cellCount++);
		field.innerHTML = data.sizes[i].name;
	}
	field = row.insertCell(cellCount++);
	field.innerHTML = "Total";
	var row_count = 1;
	for(i in data.tables){
		cellCount = 0;
		row = table.insertRow(row_count++);
		field = row.insertCell(cellCount++);
		field.innerHTML = data.tables[i].description_value;
		for (j in data.sizes){
			field = row.insertCell(cellCount++);
			element = document.createElement("input");
			element.type = "number";
			element.id = data.tables[i].table_id + data.sizes[j].id;
			element.name = data.tables[i].table_id;
			element.className += " small-input-long ";
			element.addEventListener("keyup", function(event) {
				event.preventDefault();
				var count_percent = this.value;
				var field_id = this.id;
				var table_id = this.name;
				calculate_size_count(table_id, count_percent, field_id);
			});
			field.appendChild(element);
		}
		cellCount = 0;
		row = table.insertRow(row_count++);
		field = row.insertCell(cellCount++);
		element = document.createElement("input");
		element.type = "number";
		element.readOnly = true;
		element.id = data.tables[i].total_value_field;
		element.name = data.tables[i].total_value_field;
		element.className += " small-input-long ";
		field.appendChild(element);
		for (j in data.sizes){
			field = row.insertCell(cellCount++);
			element = document.createElement("input");
			element.type = "number";
			element.readOnly = true;
			element.id = data.tables[i].table_id + data.sizes[j].id + "_C";
			element.name = data.tables[i].table_id + data.sizes[j].id + "_C";
			element.className += " small-input-long ";
			field.appendChild(element);
		}
		field = row.insertCell(cellCount++);
		element = document.createElement("input");
		element.type = "number";
		element.id = data.tables[i].total_value_field + "_C";
		element.name = data.tables[i].total_value_field+ "_C";
		element.readOnly = true;
		element.className += " small-input-long ";
		field.appendChild(element);
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
	for(var i=2; i<rowCount; i++) {
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

function delete_all(){
	for(i in data.tables){
		deleteRows(data.tables[i].table_id);
	}
}

function restore_form_local(){
	document.getElementById("restore").style.display = "none";
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
			document.getElementById(total_field[table_id]).value = table.rows.length - 2;
		}
	}
}

function consolidate(){
	var row_num = 0;
	consolidated_data["id"] = data.consolidated_table_id;
	for (j in data.tables){
		var size_values = {};
		var table_id = data.tables[j].table_id;
		var table = document.getElementById(table_id);
		var rowCount = table.rows.length;
		var description = data.tables[j].description_value;
		var opt_count = +document.getElementById(total_field[table_id]).value;
		if(opt_count > 0){
			for(k in data.sizes){
				var size_id = data.sizes[k].id;
				var temp = +document.getElementById(table_id + size_id + "_C").value;
				size_values["x"+size_id] = Math.floor(temp/opt_count);
				size_values["y"+size_id] = temp % opt_count;
				size_values["z"+size_id] = opt_count - size_values["y"+size_id];
			}
		}
		console.log(size_values);
		for(var i=1; i<rowCount; i++) {
			var row = table.rows[i];
			var qrcode = row.cells[1].childNodes[0];
			if(qrcode.value !== ""){
				var new_row = {};
				var row_total = 0;
				new_row["qrcode[]"] =  qrcode.value;
				if(description !== false){
					new_row["description[]"] = description;
				}
				var sizes_length = data.sizes.length;
				sizes_length = Math.round(sizes_length / 2);
				for (k in data.sizes){
					var size_id = data.sizes[k].id;
					var val = size_values["x"+size_id];
					if(sizes_length > 0){
						if(size_values["y"+size_id] > 0){
							val ++;
							size_values["y"+size_id] --;
						}
						sizes_length --;
					}
					else{
						if(size_values["z"+size_id] > 0){
							size_values["z"+size_id] --;
						}
						else{
							val ++;
						}
					}
					row_total += val;
					new_row[data.sizes[k].id + "[]"] = val;
				}
				new_row["count[]"] = row_total;
				consolidated_data["row" + row_num.toString()] = new_row;
				row_num ++;
			}
		}
	}
	local_store(consolidated_data);
	window.location.href = "./normalform.html?run=restore";
}
