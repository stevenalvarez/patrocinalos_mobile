/************************************ GLOBAL VARIABLES *******************************************************/
var pictureSource;   // picture source
var destinationType; // sets the format of returned value
var friendIDs = [];
var IMAGEURI = ''; //Ruta URI al fichero de imagen desde dispositivo
var FB_LOGIN_SUCCESS = false;
var TW_LOGIN_SUCCESS = false;
var COOKIE = '';
var COOKIE_NEW_REGISTER = ''; //Almacenamos todos los datos necesario del nuevo registro(id,urlamigable,etc).
var REDIREC_TO = '';

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
		} catch (e) {
		      console.log("Error al inicializar con facebook");
			//alert(e);
		}
    }
};