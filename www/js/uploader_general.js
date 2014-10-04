
document.addEventListener("DOMContentLoaded", function () {
    "use strict";
    // call initialization file
    if (window.File && window.FileList && window.FileReader) {
        Init();
    }
});

//
// initialize
function Init() {

    var /*fileselect = $id("fileselect"),*/
        filedrag = $id("filedrag"),
        submitbutton = $id("submitbutton"),
        maindiv = $id("uploadercontainer");

    // file select
    //fileselect.addEventListener("change", FileSelectHandler, false);

    // is XHR2 available?
    var xhr = new XMLHttpRequest();
    if (xhr.upload) {
    
        // file drop
        filedrag.addEventListener("dragover", FileDragHover, false);
        filedrag.addEventListener("dragleave", FileDragHover, false);
        filedrag.addEventListener("drop", FileSelectHandler, false);
        filedrag.style.display = "block";
        
        // remove submit button
        submitbutton.style.display = "none";
    }

    //maindiv.addEventListener("drop", PreventFileRender, false);
    maindiv.addEventListener("dragover", PreventFileRender, false);
    maindiv.addEventListener("dragleave", PreventFileRender, false);
    maindiv.addEventListener("drop", PreventFileRender, false);

}

// getElementById
function $id(id) {
    var el =  document.getElementById(id);
    return el;
}

//
// output information
function Output(msg) {
    var m = $id("messages");
    m.innerHTML = msg + m.innerHTML;
}            

function PreventFileRender(e) { 
    e.stopPropagation();
    e.preventDefault();
}

// file selection
function FileSelectHandler(e) {

    // cancel event and hover styling
    FileDragHover(e);

    
    /*
    // fetch FileList object
    var files = e.target.files || e.dataTransfer.files;

    // process all File objects
    for (var i = 0, f; f = files[i]; i++) {
        ParseFile(f);
        dj.addFile(f);
    }
    */

}

function VFileName(fname) {
    //return fname.replace(" ", "").split(".").join("\\.");
    return fname.replace(" ", "").replace(".", "");
}

function ParseFile(file) {
	Output(
		"<li> " +
			"<div style='height:20px; padding-top:10px;'>" +
				"<div style='width:65%; height:20px; float:left; overflow: hidden; text-overflow:ellipsis;'>" + file.file.name 	+ "</div>" + 
				"<div style='width:5%; height:20px; float:right;'>" 		 								  + 'X' 		+ "</div>" + 
				//"<div id='p" + VFileName(file.name) + "' style='width:12%; height:20px; float:right;'>"  + "0%" + "</div>" + 
                "<div id='p" + file.uniqueIdentifier + "' style='width:12%; height:20px; float:right;'>"  + "0%" + "</div>" + 
				"<div style='width:18%; height:20px; float:right;'>"   		 				  				  + Number(file.file.size/1000/1000).toFixed(2) + "MB </div>" + 
				
			"</div>" +
		"</li>" 
	);
}

function updateProgress(file) {
    //var sel = ("#p" + file.file.name).split('.').join('\\.');
    //var sel = "#p" + VFileName(file.file.name);
    var sel = "#p" + file.uniqueIdentifier;
    var el  = $( sel );
    var txt = Math.floor( file.progress()*100) + '%' 
    el.text( txt );

}

// file drag hover
function FileDragHover(e) {
    e.stopPropagation();
    e.preventDefault();
    e.target.className = (e.type == "dragover" ? "hover" : "");
}