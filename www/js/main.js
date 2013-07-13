/************************************ VARIABLES DE CONFIGURACION *******************************************************/

/************************************ server *******************************************************/
var serviceURL = "http://patrocinalos.com/services/";
var BASE_URL = "http://patrocinalos.com/";

/************************************ localhost *******************************************************/
//var serviceURL = "http://localhost/patrocinalos_mobile/services/";
//var BASE_URL = "http://localhost/patrocinalos_mobile/";

/************************************ BIND EVENT *******************************************************/

$(document).bind('pageinit', function(){
});

/************************************ EVENTOS *******************************************************/

//INICIO
$('#view').live('pagebeforeshow', function(event, ui) {
   getUsuariosRandom();
});

//REGISTRO
$(document).on('pageinit', "#register_user", function(){
    llenarDeportes();
    form_registro();
    key_press();
    $(this).find('a.registrarme').on("click", function(){
        saveRegister();
    });
    $(this).find('a.borrar_form').on("click", function(){
        clear_form("form_registro");
    });
});

$(document).on('pageinit', "#info_general, #info_ronda", function(){
    $( "#panel_menu" ).panel({
        beforeopen: function( event, ui ) {}
    });
    $( "#panel_menu" ).panel({
        close: function( event, ui ) {}
    });
	$("#panel_menu").on("panelbeforeopen", function (event, ui) {
        $(".footer_menu").find("a.icon_menu").hide();
    });
	$("#panel_menu").on("panelclose", function (event, ui) {
        $(".footer_menu").find("a.icon_menu").show();
    });
});

/************************************ FUNCTIONS *******************************************************/

//OBTENEMOS 10 USUARIOS DE FORMA RANDOMICA 
function getUsuariosRandom() {
    parent = $("#view .list");
    parent.find("li").remove();
	
    $.getJSON(serviceURL + 'get_usuarios_random.php', function(data) {
	    //mostramos loading
        $.mobile.loading( 'show' );
		var usuarios = data.items;
    	$.each(usuarios, function(index, usuario) {
    		parent.append('<li><div class="recuadro_img"><img src="'+BASE_URL+'img/Usuario/169/'+usuario.imagen+'"/><div></li>');
    	});
        
        parent.promise().done(function() {
            $(this).find("li:last img").load(function(){
                //ocultamos loading
                $.mobile.loading( 'hide' );
            });
        });
	});
}

//GUARDAR REGISTRO
function saveRegister() {
    var form_parent = document.getElementById("form_registro");
    $(form_parent).submit(); 
}