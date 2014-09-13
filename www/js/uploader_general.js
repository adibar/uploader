
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

    // fetch FileList object
    var files = e.target.files || e.dataTransfer.files;

    // process all File objects
    for (var i = 0, f; f = files[i]; i++) {
        ParseFile(f);
    }

}

function ParseFile(file) {
	Output(
		"<li> " +
			"<div style='height:20px; padding-top:10px;'>" +
				"<div style='width:65%; height:20px; float:left; overflow: hidden; text-overflow:ellipsis;'>" + file.name 	+ "</div>" + 
				"<div style='width:5%; height:20px; float:right;'>" 		 								  + 'X' 		+ "</div>" + 
				"<div style='width:12%; height:20px; float:right;'>"  		 				  				  + "100%" 		+ "</div>" + 
				"<div style='width:18%; height:20px; float:right;'>"   		 				  				  + Number(file.size/1000/1000).toFixed(2) + "MB </div>" + 
				
			"</div>" +
		"</li>" 

		/*
		"<div id='progress_bar' class='ui-progress-bar ui-container' style='width:50%; display:inline-block; '>" +
         	 "<div class='ui-progress' style='width: 0%;'>" +
            	"<span class='ui-label' style='xxxdisplay:none;'>" +
                	"<b> 0% </b>" +
                "</span>" +
             "</div>" +
        "</div>"
        */
	);
	/*
    Output(
        "<p>File information: <strong>" + file.name +
        "</strong> type: <strong>" + file.type +
        "</strong> size: <strong>" + file.size +
        "</strong> bytes</p>"
    );
	*/
    
}

// file drag hover
function FileDragHover(e) {
    e.stopPropagation();
    e.preventDefault();
    e.target.className = (e.type == "dragover" ? "hover" : "");
}