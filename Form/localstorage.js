function local_store(data_to_store){
    if (typeof(Storage) !== "undefined") {
        localStorage.setItem(data_to_store.id, JSON.stringify(data_to_store));
    }
    else{
        console.log("Restore may not work!");
    }  
}

function local_retrive(id){
    if (typeof(Storage) !== "undefined") {
        var result =  localStorage.getItem(id);
        result = JSON.parse(result);
        return result;
    }
    else{
        console.log("Restore may not work!");
        return false;
    }
}