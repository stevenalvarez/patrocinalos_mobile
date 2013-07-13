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

function showLoadingCustom(msg){
    $.mobile.loading( 'show', {
    	text: msg,
    	textVisible: true,
    	theme: 'c',
    	html: ""
    });
}


/* FACEBOOK FUNCTION */
function login() {
	FB.login(function(response) {
		if (response.authResponse) {
			//console.log('logged in');
            llenarDatosSocial("facebook");
            show_registro_social("facebook");
		} else {
			alert('no esta logeado');
		}
	}, {
		scope : "email,offline_access,publish_stream,user_birthday,user_location,user_work_history,user_about_me,user_hometown"
	});
}

function getLoginStatus() {
    alert("getLoginStatus");
    FB.getLoginStatus(function(response) {
        if (response.status == 'connected') {
            return true;
        } else {
            return false;
        }
    });
}

function getMeInfo(){
    alert("getMeInfo");
    var data = "";
    FB.api('/me', {
        fields: 'id, name, email, picture'
    },function(response) {
        if (response.error) { 
           alert('get user datas failed ' + JSON.stringify(response.error));
        }else{
            data = response;
        }
    });
    
    return data;
}

function getMePicture(size){
    alert("getMePicture");
    var data = "";
    FB.api("/me/picture?width="+size,  function(response) {
        if (response.error) { 
           alert('get picture failed ' + JSON.stringify(response.error));
        }else{
            data = response;
        }
    });
    
    return data;
}