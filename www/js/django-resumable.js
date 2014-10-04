var DjangoResumable = function (options) {
    "use strict";
    var defaults, els;
    options = options || { chunkSize : 2*1024*1024 } ;
    defaults = {
        csrfInputName: 'csrfmiddlewaretoken',
        urlAttribute: 'data-upload-url',
        progressDisplay: 'inline',
        errorListClass: 'errorlist',
        onFileError: this.onFileError,
        onFileAdded: this.onFileAdded,
        onFileSuccess: this.onFileSuccess,
        onProgress: this.onProgress,
        resumableOptions: { chunkSize:2*1024*1024, }
    };
    this.options = this.extend(defaults, options);
    this.csrfToken = document.querySelector('input[name=' + this.options.csrfInputName + ']').value;
    els = document.querySelectorAll('input[' + this.options.urlAttribute + ']');
    this.each(els, function (el) {
        this.initField(el);
    });

    //var elements = Array.prototype.slice.call(arguments),
    //self = this,
    var el = document.querySelectorAll('input[' + this.options.urlAttribute + ']');
    var tr = el[0].getAttribute(this.options.urlAttribute);
    var opts = {
            
        target: tr,
        query: {
            'csrfmiddlewaretoken': this.csrfToken
        }
    };

    opts = this.extend(this.options.resumableOptions, opts);
    //this.r = new Resumable(opts);
    //r.assignBrowse(el);
    //this.r.assignDrop($('#filedrag'));


};



DjangoResumable.prototype.each = function (elements, fn) {
    "use strict";
    var i, l;
    for (i = 0, l = elements.length; i < l; i += 1) {
        fn.apply(this, [elements[i]]);
    }
};


DjangoResumable.prototype.extend = function (target, source) {
    "use strict";
    var property;
    for (property in source) {
        if (source.hasOwnProperty(property)) {
            target[property] = source[property];
        }
    }
    return target;
};

DjangoResumable.prototype.getErrorList = function (el, create) {
    "use strict";
    var parent = el.srcElement.parentNode;
    var errorList = parent.previousSibling;

    //var errorList = el.parentNode.previousSibling;
    while (errorList && errorList.tagName === undefined) {
        errorList = errorList.previousSibling;
    }
    if (errorList && !errorList.classList.contains(this.options.errorListClass)) {
        if (create === true) {
            errorList = document.createElement('ul');
            errorList.classList.add(this.options.errorListClass);
            el.parentNode.parentNode.insertBefore(errorList, el.parentNode);
        } else {
            errorList = null;
        }
    }
    return errorList;
};


DjangoResumable.prototype.getForm = function (el) {
    "use strict";
    var parent = el;
    while (parent.tagName !== 'FORM') {
        parent = parent.parentNode;
    }
    return parent;
};


DjangoResumable.prototype.initField = function (el) {
    "use strict";
    var progress, fileName, filePath, filePathName;

    //progress = this.initProgressBar();
    //el.parentNode.insertBefore(progress, el.nextSibling);

    filePathName = el.getAttribute('name') + '-path';
    filePath = el.parentNode.querySelector('[name=' + filePathName + ']');
    fileName = el.parentNode.querySelector('label[for=id_' + filePathName + ']');

    this.initResumable(el, progress, filePath, fileName);

    this.getForm(el).addEventListener('submit', function () {
        el.parentNode.removeChild(el);
    });
};


DjangoResumable.prototype.initProgressBar = function () {
    "use strict";
    var progress = document.createElement('progress');
    progress.setAttribute('value', '0');
    progress.setAttribute('max', '1');
    progress.style.display = 'none';
    return progress;
};

DjangoResumable.prototype.addFile = function(file) {
    this.r.addFile(file)    
}

DjangoResumable.prototype.initResumable = function (el, progress, filePath, fileName) {
    "use strict";
    var elements = Array.prototype.slice.call(arguments),
        self = this,
        opts = {
            
	    target: el.getAttribute(this.options.urlAttribute),
            query: {
                'csrfmiddlewaretoken': this.csrfToken
            }
        };

    opts = this.extend(this.options.resumableOptions, opts);
    this.r = new Resumable(opts);
    this.r.assignDrop($('#filedrag'));
    //r.assignBrowse(el);
    //r.assignDrop($('#filedrag'));
    /*
    this.each(['fileAdded', 'progress', 'fileSuccess', 'fileError'], function (eventType) {
        var callback = this.options['on' + eventType.substring(0, 1).toUpperCase() + eventType.substring(1)];
        this.r.on(eventType, function () {
            var args = arguments.length > 0 ? Array.prototype.slice.call(arguments) : [];
            callback.apply(self, [this.r].concat(args).concat(elements));
        });
    });
    */

    this.r.on('fileAdded', function(file, event){
        ParseFile(file);
        //this.upload();
    });
    this.r.on('fileProgress', function(file){
        console.log('fileProgress')
        var uploaded = file.progress();
        console.log('fileProgress %d% of %d', uploaded*100, file.size);
        updateProgress(file);
    });
    this.r.on('fileSuccess', function(file, message){
        console.log('fileSuccess')
    });
    this.r.on('fileError', function(file, message){
        console.log('fileError')
    });

    return this.r;
};

DjangoResumable.prototype.start_upload = function() {
    this.r.upload();
}

DjangoResumable.prototype.onFileError = function (r, file, message, el) {
    "use strict";
    console.log(message);
    var errorList = this.getErrorList(el, true),
        error = document.createElement('li');
    error.innerHTML = message;
    errorList.appendChild(error);
};


DjangoResumable.prototype.onFileAdded = function (r, file, el, progress, filePath, fileName) {
    "use strict";
    var errorList = this.getErrorList(el);
    //if (errorList) {
    //    errorList.parentNode.removeChild(errorList);
    //}
    this.r.upload();
    //progress.style.display = this.options.progressDisplay;
};


DjangoResumable.prototype.onFileSuccess = function (r, file, message, el, progress, filePath, fileName) {
    "use strict";
    filePath.setAttribute('value', file.size + '_' + file.fileName);
    fileName.innerHTML = file.fileName;
    progress.style.display = 'none';
};


DjangoResumable.prototype.onProgress = function (r, el, progress, filePath, fileName) {
    "use strict";
    progress.setAttribute('value', r.progress());
};