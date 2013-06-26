/************************************ VARIABLES DE CONFIGURACION *******************************************************/

/************************************ server *******************************************************/
var serviceURL = "http://patrocinalos.com/services/";
var BASE_URL = "http://patrocinalos.com/";

/************************************ localhost *******************************************************/
//var serviceURL = "http://localhost/patrocinalos_mobile/services/";
//var BASE_URL = "http://localhost/patrocinalos_mobile/";

/************************************ EVENTOS *******************************************************/

//INICIO
$('#view').live('pagebeforeshow', function(event, ui) {
   getUsuariosRandom();
});


/************************************ FUNCTIONS *******************************************************/

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