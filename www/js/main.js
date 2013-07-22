/************************************ VARIABLES DE CONFIGURACION *******************************************************/

/************************************ server *******************************************************/
var serviceURL = "http://patrocinalos.com/services/";
var BASE_URL = "http://patrocinalos.com/";
var BASE_URL_APP = "http://patrocinalos.com/";

/************************************ localhost *******************************************************/
//var serviceURL = "http://localhost/MOBILE_PATROCINALOS/patrocinalos_mobile/services/";
//var BASE_URL = "http://localhost/MOBILE_PATROCINALOS/patrocinalos_mobile/";
//var BASE_URL_APP="http://localhost/BITBUCKET_RED_SOCIAL/aplicacion/";

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

$(document).on('pageinit', "#info_general, #info_ronda,#home_destacados", function(){
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

//CUANDO CARGUE LA PAGE DE PUBLICACIONES DESTACADAS DE LA HOME
$(document).on('pageinit', "#home_destacados", function(){
   getDestacados();
});

//CUANDO CARGUE LA PAGE DE PUBLICACIONES DESTACADAS DE LA HOME
$(document).on('pageinit', "#home_elites", function(){
  getElites();
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

/*OBTENEMOS LOS DATOS DE PUBLICACIONES DESTACADOS DE LA HOME*/
function getDestacados(){
    
    $.getJSON(BASE_URL_APP+'rondas/mobileGetHomeDestacados', function(data) {
        //mostramos loading
        jQuery(".list_destacados").html("");
        $.mobile.loading( 'show' );
       	var destacados = data.items;
       	$.each(destacados, function(index, destacado) {
    	    html_data=' <li>';
            html_data+=' <a href="#">';
            html_data+='    <div class="recorte">';
            html_data+='      <img src="'+BASE_URL_APP+"img/home/"+destacado.Entrada.imagen+'"/>';
            html_data+='    </div>';
            html_data+='    <div class="content_descripcion">'
            html_data+='         <p>';
            html_data+='            '+destacado.Entrada.texto;
            html_data+='         </p>';
            html_data+='    </div>';
            html_data+='  </a>';
            html_data+='</li>';
                    
            jQuery(".list_destacados").append(html_data);
    	});
        
        jQuery(".list_destacados").promise().done(function() {
            $(this).find("li:last img").load(function(){
                //ocultamos loading
                $.mobile.loading( 'hide' );
            });
        });
	});
   
    
    
}

/*OBTENEMOS LOS DATOS DE DEPORTISTAS ÉLITES DE LA HOME*/
function getElites(){
    
    $.getJSON(BASE_URL_APP+'rondas/mobileGetHomeElites', function(data) {
        //mostramos loading
        jQuery(".elite_list").html("");
        $.mobile.loading( 'show' );
       	var destacados = data.items;
       	$.each(destacados, function(index, destacado) {
    	    html_data=' <li class="ui-btn ui-btn-up-c ui-btn-icon-right ui-li-has-arrow ui-li">';
            html_data+=' <div class="ui-btn-inner ui-li"><div class="ui-btn-text"><a class="ui-link-inherit" href="#">';
            html_data+='    <div class="recorte">';
            html_data+='      <img src="'+BASE_URL_APP+'img/home/'+destacado.Entrada.imagen+'"/>';
            html_data+='    </div>';
            html_data+='    <div class="content_descripcion left">'
            html_data+='         <p class="ui-li-desc">';
            html_data+='            '+destacado.Entrada.title+'';
            html_data+='         </p>';
            
            if(destacado.Entrada.usuario_id!=null){
                html_data+='         <span class="button_blue">visita su perf&iacute;l</span>';
            }
            html_data+='    </div>';
            html_data+='  </a></div></div>';
            html_data+='</li>';
                    
            jQuery(".elite_list").append(html_data);
        });
        
        jQuery(".elite_list").promise().done(function() {
            $(this).find("li:last img").load(function(){
                //ocultamos loading
                $.mobile.loading( 'hide' );
            });
        });
	});
   
    
    
}

