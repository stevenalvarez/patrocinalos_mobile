/************************************ GLOBAL VARIABLES *******************************************************/
var pictureSource;   // picture source
var destinationType; // sets the format of returned value
var friendIDs = [];
var IMAGEURI;
var ID_USUARIO;
var FB_INITEXECUTED = false;

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        pictureSource=navigator.camera.PictureSourceType;
        destinationType=navigator.camera.DestinationType;
        
        //Inicializamos el api de facebook
        try {
			//console.log('Device is ready!	Make sure you set your app_id below this alert.');
			FB.init({
				appId : "378569528879624",
				nativeInterface : CDV.FB,
				useCachedDialogs : false
			});
			document.getElementById('data_loading_fb').innerHTML = "FB inicializado...";
            FB_INITEXECUTED = true;
		} catch (e) {
			alert(e);
		}
    },
    // Obtemos los datos del usuario
    getInfoFB : function(){
        return {
        FB.api('/me', {
            fields: 'id, name, email, picture'
        },function(response) {
            if (response.error) { 
               alert('get user datas failed ' + JSON.stringify(response.error));
            }else{
                    alert("puta!")
                    FB_USER_INFO = response; 
                return response;
            }
        });
    }
    }
};               