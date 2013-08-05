/* FUNCTIONS */

(function($) {
    $.fn.escape = function() {
        return escape(this.val());};
    }
)(jQuery);

function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

function getUrl(href) {
    var vars = [], hash;
    var hashes = href.slice(href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

function htmlspecialchars_decode (string, quote_style) {
  // http://kevin.vanzonneveld.net
  // +   original by: Mirek Slugen
  // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   bugfixed by: Mateusz "loonquawl" Zalega
  // +      input by: ReverseSyntax
  // +      input by: Slawomir Kaniecki
  // +      input by: Scott Cariss
  // +      input by: Francois
  // +   bugfixed by: Onno Marsman
  // +    revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
  // +      input by: Ratheous
  // +      input by: Mailfaker (http://www.weedem.fr/)
  // +      reimplemented by: Brett Zamir (http://brett-zamir.me)
  // +    bugfixed by: Brett Zamir (http://brett-zamir.me)
  // *     example 1: htmlspecialchars_decode("<p>this -&gt; &quot;</p>", 'ENT_NOQUOTES');
  // *     returns 1: '<p>this -> &quot;</p>'
  // *     example 2: htmlspecialchars_decode("&amp;quot;");
  // *     returns 2: '&quot;'
  var optTemp = 0,
    i = 0,
    noquotes = false;
  if (typeof quote_style === 'undefined') {
    quote_style = 2;
  }
  string = string.toString().replace(/&lt;/g, '<').replace(/&gt;/g, '>');
  var OPTS = {
    'ENT_NOQUOTES': 0,
    'ENT_HTML_QUOTE_SINGLE': 1,
    'ENT_HTML_QUOTE_DOUBLE': 2,
    'ENT_COMPAT': 2,
    'ENT_QUOTES': 3,
    'ENT_IGNORE': 4
  };
  if (quote_style === 0) {
    noquotes = true;
  }
  if (typeof quote_style !== 'number') { // Allow for a single string or an array of string flags
    quote_style = [].concat(quote_style);
    for (i = 0; i < quote_style.length; i++) {
      // Resolve string input to bitwise e.g. 'PATHINFO_EXTENSION' becomes 4
      if (OPTS[quote_style[i]] === 0) {
        noquotes = true;
      } else if (OPTS[quote_style[i]]) {
        optTemp = optTemp | OPTS[quote_style[i]];
      }
    }
    quote_style = optTemp;
  }
  if (quote_style & OPTS.ENT_HTML_QUOTE_SINGLE) {
    string = string.replace(/&#0*39;/g, "'"); // PHP doesn't currently escape if more than one 0, but it should
    // string = string.replace(/&apos;|&#x0*27;/g, "'"); // This would also be useful here, but not a part of PHP
  }
  if (!noquotes) {
    string = string.replace(/&quot;/g, '"');
  }
  // Put this in last place to avoid escape being double-decoded
  string = string.replace(/&amp;/g, '&');

  return string;
}

// Validate email
function valEmail(valor){
    if(!/^[_a-z0-9-]+(.[_a-z0-9-]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,3})$/.exec(valor)) {
        return false; 
    }else{
        return true; 
    } 
}

// Show a custom alertDismissed
function showAlert(message, title, buttom) {
    navigator.notification.alert(
        message,  // message
        alertDismissed,         // callback
        title,            // title
        buttom                  // buttonName
    );
}

// alert dialog dismissed
function alertDismissed() {
    // do something
}

function check_network() {
    var networkState = navigator.network.connection.type;

    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.NONE]     = 'No network connection';

    confirm('Connection type:\n ' + states[networkState]);
}

function showLoadingCustom(msg){
    $.mobile.loading( 'show', {
    	text: msg,
    	textVisible: true,
    	theme: 'c',
    	html: ""
    });
}

//funcion getImage, que obtiene una imagen de la libreria de fotos del dispostivo, 
//como parametros se le mandan 2 posibles elementos donde se van a mostrar antes las fotos antes de subirlas 
//param : elem_preview, id del elemento donde va ha mostrar el preview de la imagen seleccionada
//return: void
function getImage(elem_preview) {
    navigator.camera.getPicture(function (imageURI){
        
        var pictureImage = document.getElementById(elem_preview);
        pictureImage.style.display = 'block';
        pictureImage.src = imageURI;
        
        //guardamos la imagen seleccionada para luego enviar al servidor
        IMAGEURI = imageURI;
    },
    function(message) {
        showAlert('Failed because: ' + message, 'Error', 'Aceptar');
    },
    {
        quality: 50,
        destinationType: navigator.camera.DestinationType.FILE_URI,
        sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY //(PHOTOLIBRARY|SAVEDPHOTOALBUM)
    });
}

//funcion capturePhoto, que obtiene una imagen de la libreria de fotos del dispostivo, 
//como parametros se le mandan 2 posibles elementos donde se van a mostrar antes las fotos antes de subirlas 
//param : elem_preview, id del elemento donde va ha mostrar el preview de la imagen seleccionada
//return: void
function capturePhoto(elem_preview) {
    
    navigator.camera.getPicture(function(imageURI){
        var pictureImage = document.getElementById(elem_preview);
        pictureImage.style.display = 'block';
        pictureImage.src = imageURI;
          
        //guardamos la imagen capturada para luego enviar al servidor
        IMAGEURI = imageURI;
    }, 
    function(message) {
        showAlert('Failed because: ' + message, 'Error', 'Aceptar');
    }, 
    { 
        quality: 50, 
        destinationType: navigator.camera.DestinationType.FILE_URI,
        sourceType : navigator.camera.PictureSourceType.CAMERA,
        allowEdit: true,
        encodingType: navigator.camera.EncodingType.JPEG
    });
}

//function uploadImagen, envia la imagen al servidor
//param : folder, carpeta donde se va a subir la foto
//return: retorna el nombre con el cual se guardo la imagen
function uploadImagen(folder) {
    
    var options = new FileUploadOptions();
    options.fileKey = "file";
    options.fileName = IMAGEURI.substr(IMAGEURI.lastIndexOf('/')+1);
    options.mimeType = "image/jpeg";
    
    var params = new Object();
    params.folder = folder;
    
    options.params = params;
    options.chunkedMode = false;
    
    var ft = new FileTransfer();
    ft.upload(IMAGEURI, BASE_URL_APP + "fotos/mobileUploadImagen", 
    function(r){
        return r.response;
        
    }, function(error){
        showAlert('Failed because: ' + error, "Error", "Aceptar");
        return '';
        
    }, options);
}

function createCookie(name,value,days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}