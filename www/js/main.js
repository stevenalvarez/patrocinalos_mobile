/************************************ VARIABLES DE CONFIGURACION *******************************************************/

/************************************ server *******************************************************/
//var serviceURL = "http://patrocinalos.com/services/";
//var BASE_URL = "http://patrocinalos.com/";

/************************************ localhost *******************************************************/
var serviceURL = "http://localhost/patrocinalos_mobile/services/";
var BASE_URL = "http://localhost/patrocinalos_mobile/";

/************************************ EVENTOS *******************************************************/

//Las Terrazas
$('#view').live('pagebeforeshow', function(event, ui) {
   getUsuariosRandom();
});


/************************************ FUNCTIONS *******************************************************/

function getUsuariosRandom() {
    parent = $("#view .list");
	$.getJSON(serviceURL + 'get_usuarios_random.php', function(data) {
		var usuarios = data.items;
        parent.find("li").remove();
    	$.each(usuarios, function(index, usuario) {
    		parent.append('<li><div class="recuadro_img"><img src="'+BASE_URL+'img/Usuario/169/'+usuario.imagen+'"/><div></li>');
    	});        
	});
}	