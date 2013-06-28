/************************************ VARIABLES DE CONFIGURACION *******************************************************/

/************************************ server *******************************************************/
var serviceURL = "http://patrocinalos.com/services/";
var BASE_URL = "http://patrocinalos.com/";

/************************************ localhost *******************************************************/
//var serviceURL = "http://localhost/patrocinalos_mobile/services/";
//var BASE_URL = "http://localhost/patrocinalos_mobile/";

/************************************ BIND EVENT *******************************************************/

$(document).bind('pageinit', function(){
    form_registro();
});

/************************************ EVENTOS *******************************************************/

//INICIO
$('#view').live('pagebeforeshow', function(event, ui) {
   getUsuariosRandom();
});

//REGISTRO
$(document).on('pageinit', "#register_user", function(){
    listarDeportes();
    $(this).find('a.registrarme').on("click", function(){
        saveRegister();
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

//REGISTRAMOS LOS DATOS DEL FORMULARIO REGISTRO
function saveRegister() {
    var form_parent = document.getElementById("form_registro");
    $(form_parent).submit(); 
}

function listarDeportes(){
	$.getJSON(serviceURL + 'get_deportes.php', function(data) {
		var deportes = data.items;
        var categoria = "";
        var html = "";
        $.each(deportes, function(index, deporte) {
            if(categoria != deporte.id_categoria){
                if(categoria != ""){
                    html+= "</optgroup>";
                }
                html+= "<optgroup label='"+htmlspecialchars_decode(deporte.nombre_categoria)+"'>";
                categoria = deporte.id_categoria;
            }
            html+= "<option value="+deporte.id+">"+htmlspecialchars_decode(deporte.nombre)+"</option>";
        });
        html+= "</optgroup>";
        
        //empty selector
        jQuery("#select_deporte").find("optgroup").remove();
        jQuery("#select_deporte").find("option").after(html);
	});
}
