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

//REGISTRO
$('#register_user').live('pageshow', function(event, ui) {
    var parent = $(this);
    
    parent.find('a.registrarme').off('click').on("click", function(){
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

//REGISTRAMOS LOS DATOS DEL USUARIO CUANDO SE REGISTRA
function saveRegister() {
    
    var form_parent = $("form_registro");
    
    var nombre = $.trim(form_parent.find("input#").val());
        
    if(nombre !="" && email !="" && comentario !=""){
        if(valEmail(email)){
            $(".ui-loader").show();
            $.post(serviceURL + 'enviar_contacto.php', $("#form_contact").serialize()).done(function(data) {
                $(".ui-loader").hide();
                document.getElementById("form_contact").reset();
                alert(data);
            });
        }else{
            alert("El email: " + email + ", no es correcto!!!!, por favor ingrese un email valido.");
        }
    }else{
        alert("Por favor ingrese todos los campos obligatorios!.");
    }
}
