
/************************************ BIND EVENT *******************************************************/

$(document).bind('pageinit', function(){
});

$(document).bind('pageshow', function() {
    var page_id = $("#" + $.mobile.activePage.attr('id'));
    //cargamos el panel de opciones en donde se encuentre #contenedor_panel
    //solo cargamos en el caso que no este cargado aun el panel, en otro caso no.
    if(page_id.find("#contenedor_panel").html() == ""){
        page_id.find("#contenedor_panel").load("panel.html", function(){
            page_id.find("#contenedor_panel").find("#panel_menu").panel();
            page_id.find("#contenedor_panel").find("#panel_menu").find("#content_options").trigger("create");
            setTimeout(function(){
                page_id.find( "#panel_menu" ).panel({
                    beforeopen: function( event, ui ) {}
                });
                page_id.find( "#panel_menu" ).panel({
                    close: function( event, ui ) {}
                });
            	page_id.find("#panel_menu").on("panelbeforeopen", function (event, ui) {
            	    $(this).find(".close_menu").css("top", "-20px");
                    page_id.find(".footer_menu").find("a.icon_menu").hide();
                });
            	page_id.find("#panel_menu").on("panelclose", function (event, ui) {
            	    $(this).find(".close_menu").css("top", "0px");
                    page_id.find(".footer_menu").find("a.icon_menu").show();
                });
            },0);
        });
    }
});

/************************************ EVENTOS *******************************************************/

//INICIO
$('#view').live('pagebeforeshow', function(event, ui) {
    getUsuariosRandom();
});

//REGISTRO
$(document).on('pageinit', "#register_user", function(){
    form_registro();
    key_press("form_registro");
    $(this).find('a.registrarme').on("click", function(){
        var form_parent = document.getElementById("form_registro");
        $(form_parent).submit();
    });
    $(this).find('a.borrar_form').on("click", function(){
        clear_form("form_registro");
    });
});

//RECUPERAR PASSWORD
$(document).on('pageinit', "#recuperar_password", function(){
    form_codigovalidacion("form_codigovalidacion");
    key_press("form_codigovalidacion");
    form_cambiar_password("form_cambiar_password");
    key_press("form_cambiar_password");
    popup_form_cambiar_password("popup_form_cambiar_password");
    key_press("popup_form_cambiar_password");    
    
    $(this).find('a.enviar_codigovalidacion').on("click", function(){
        var form_parent = document.getElementById("form_codigovalidacion");
        $(form_parent).submit();
    });
    
    $(this).find('a.cambiar_password').on("click", function(){
        var form_parent = document.getElementById("form_cambiar_password");
        $(form_parent).submit();
    });
    
    $(this).find('a.cambiar_nuevo_password').on("click", function(){
        var form_parent = document.getElementById("popup_form_cambiar_password");
        $(form_parent).submit();
    });
    
});

//REGISTRO FINALIZADO
$(document).on('pageinit', "#register_finalizado", function(){
    //controlamos si completar perfil pertenece a deportista(individual o equipo), patrocinador o empresa
    if(isUserRegistered()){
        var userRegistered = COOKIE_NEW_REGISTER;
        if(userRegistered.tipo == "empresa"){
            $(this).find('a.btn_completar_perfil').attr("href","#completar_perfil_empresa");
        }else if(userRegistered.tipo == "patrocinador"){
            //$(this).find('a.btn_completar_perfil').find("span.ui-btn-text").text("PATROCINAR A DEPORTISTA");
            $(this).find('a.btn_completar_perfil').attr("href","#completar_perfil_patrocinador");
        }
    }
})

//COMPLETAR PERFIL
$(document).on('pageinit', "#completar_perfil", function(){
    llenarDeportes();
    form_completar_perfil("form_completar_perfil");
    key_press("form_completar_perfil");
    $(this).find('a.guardar_form').on("click", function(){
        var form_parent = document.getElementById("form_completar_perfil");
        $(form_parent).submit();
    });
});

//COMPLETAR PERFIL PATROCINADOR
$(document).on('pageinit', "#completar_perfil_patrocinador", function(){
    llenarDeportesPatrocinador($(this).attr("id"));
    form_completar_perfil_patrocinador("form_completar_perfil_patrocinador");
    key_press("form_completar_perfil_patrocinador");
    $(this).find('a.guardar_form').on("click", function(){
        var form_parent = document.getElementById("form_completar_perfil_patrocinador");
        $(form_parent).submit();
    });
});

//COMPLETAR PERFIL EMPRESA
$(document).on('pageinit', "#completar_perfil_empresa", function(){
    llenarDeportesPatrocinador($(this).attr("id"));
    form_completar_perfil_empresa("form_completar_perfil_empresa");
    key_press("form_completar_perfil_empresa");
    $(this).find(".close_text").on("click", function(){
        $(this).parent().parent().fadeOut("slow");
    });
    $(this).find('a.guardar_form').on("click", function(){
        var form_parent = document.getElementById("form_completar_perfil_empresa");
        $(form_parent).submit();
    });
    $(this).find('a.borrar_form').on("click", function(){
        clear_form("form_completar_perfil_empresa");
    });
});

//SOLICITAR PATROCINIO
$(document).on('pageinit', "#solicitar_patrocinio", function(){
    form_solicitar_patrocinio("form_solicitar_patrocinio");
    key_press("form_solicitar_patrocinio");
    $(this).find('a.guardar_form').on("click", function(){
        var form_parent = document.getElementById("form_solicitar_patrocinio");
        $(form_parent).submit();
    });
    $(this).find('a.borrar_form').on("click", function(){
        clear_form("form_solicitar_patrocinio");
    });
});

//LOGIN
$(document).on('pageinit', "#login", function(){
    form_login();
    key_press("form_login");
    $(".close_msg_error").on("click", function(){
        $(this).parent().fadeOut("slow");
    });
    $(this).find('a.logearme').on("click", function(){
        var form_parent = document.getElementById("form_login");
        $(form_parent).submit();
    });
});

//HOME
$('#home').live('pagebeforeshow', function(event, ui) {
    if(isLogin()){
        var hash = window.location.hash;
        getEntradasByCarrousel($(this).attr('id'), hash);
    }else{
        redirectLogin();
    }
});

//PROYECTO DEPORTIVO, PAGINA DEL PROYECTO
$('#proyecto_deportivo').live('pagebeforeshow', function(event, ui) {
    if(isLogin()){
        var user = COOKIE;
        var me = user.id;
        loadPerfilDeportista($(this).attr('id'), me, getUrlVars()["usuario_id"], getUrlVars()["patrocina"]);
    }else{
        redirectLogin();
    }
});

//DESTACADOS - HOME
$(document).on('pageinit', "#home_destacados", function(){
    if(isLogin()){
        getDestacados();
    }else{
        redirectLogin();
    }
});

//MAS PROYECTOS - HOME
$(document).on('pageinit', "#home_mas_proyectos", function(){
    if(isLogin()){
        getMasProyectos();
    }else{
        redirectLogin();
    }
});

//BUSCAN PATROCINIO - HOME
$('#home_buscan_patrocinio').live('pagebeforeshow', function(event, ui) {
    if(isLogin()){
        getBuscanPatrocinio($(this).attr('id'));
    }else{
        redirectLogin();
    }
});

//RECOMPENSAS - HOME
$('#home_recompensas').live('pagebeforeshow', function(event, ui) {
    if(isLogin()){
        getRecompensasMazzel($(this).attr('id'));
    }else{
        redirectLogin();
    }
});

//RONDA ACTIVA - HOME
$(document).on('pageinit', "#home_ronda_activa", function(){
    if(isLogin()){
        getRondaActiva($(this).attr("id"), COOKIE.id);
    }else{
        redirectLogin();
    }
});

//BLOG - HOME
$(document).on('pageinit', "#home_blog", function(){
    if(isLogin()){
        getBlog($(this).attr('id'));
    }else{
        redirectLogin();
    }
});

//CUANDO CARGUE LA PAGE DE EDICIÓN DE DATOS DE PERFIL
$("#edicion_datos_personales").live('pagebeforeshow', function(event, ui) {
    if(isLogin()){
        getDatosPersonales(COOKIE.id);
    }else{
        redirectLogin();
    }
});

//CUANDO CARGUE LA PAGE DE EDICIÓN DE DATOS DE DEPORTIVOS EN EL PERFIL
$("#edicion_datos_deportivos").live('pagebeforeshow', function(event, ui) {
    if(isLogin()){
        getDatosDeportivos(COOKIE.id);
    }else{
        redirectLogin();
    }
});

//CUANDO CARGUE LA PAGE DE LA LISTA DE ALBUMS DE FOTOS
$("#page_list_albums").live('pagebeforeshow', function(event, ui) {
    if(isLogin()){
        getAlbums(COOKIE.id);
    }else{
        redirectLogin();
    }
});

//CUANDO CARGUE LA PAGE DE LA LISTA DE FOTOS DE UN ALBUM
$("#page_list_fotos").live('pagebeforeshow', function(event, ui) {
    if(isLogin()){
        getPhotosAlbum(getUrlVars()["album"]);
    }else{
        redirectLogin();
    }
});

//CUANDO CARGUE LA PAGE DE EDICIÓN DE PATROCINIO
$("#edicion_datos_patrocinio").live('pagebeforeshow', function(event, ui) {
    if(isLogin()){
        getPatrocinioDeportivo();
    }else{
        redirectLogin();
    }
});

//CUANDO CARGUE LA PAGE DE RECOMPENSAS DE PATROCINIO
$("#edicion_recompensas_patrocinio").live('pagebeforeshow', function(event, ui) {
    if(isLogin()){
        getRecompensasPatrocinio(getUrlVars()['crowd_id']);
    }else{
        redirectLogin();
    }
});

/************************************ FUNCTIONS *******************************************************/

//OBTENEMOS 10 USUARIOS DE FORMA RANDOMICA 
function getUsuariosRandom() {
    parent = $("#view .list");
    parent.find("li").remove();
	
    $.getJSON(BASE_URL_APP + 'usuarios/mobileGetDeportistasRandom', function(data) {
	    //mostramos loading
        $.mobile.loading( 'show' );
		var usuarios = data.items;
    	$.each(usuarios, function(index, item) {
    		parent.append('<li><div class="recuadro_img"><img src="'+BASE_URL_APP+'img/Usuario/169/'+item.Usuario.imagen+'"/><div></li>');
    	});
        
        parent.promise().done(function() {
            $(this).find("li:last img").load(function(){
                //ocultamos loading
                $.mobile.loading( 'hide' );
            });
        });
	});
}

//CARROUSEL,ACTIVIDAD EN PATROCINALOS Y ACTIVIDAD EN LA RONDA, PARA LA PAGINA HOME 
function getEntradasByCarrousel(parent_id, hash){
    var parent = $("#"+parent_id);
    parent.find("#tabs_opciones a").bind("touchstart click",function(){
        $(this).parent().find("a").removeClass("active");
        $(this).addClass("active");
        if($(this).attr("id") == "tab_actividad_rondas"){
            parent.find('#lista_actividades').hide();
            parent.find('#lista_actividades_ronda').show();            
        }else{
            parent.find('#lista_actividades_ronda').hide();
            parent.find('#lista_actividades').show();            
        }
    });
    
    //obtenemos los proyectos, actividad en patrocinalos y actividad en ronda
    $.getJSON(BASE_URL_APP+'rondas/mobileHome', function(data) {
        if(data){
            
            //mostramos loading
            $.mobile.loading('show');
            
            //actividad en patrocinalos
            parent.find('#lista_actividades').find("li").remove();
            var notificaciones_patrocinalos =  data.notificaciones_sistema;
            $.each(notificaciones_patrocinalos, function(index, item) {
                html='<li>';
                html+='<div class="recorte">';
                html+='<img src="'+BASE_URL_APP+'img/Usuario/169/'+item.Notificacion.usuario_imagen+'"/>';
                html+='</div>';
                html+='<div class="content_descripcion left">';
                html+='<time class="age" date="'+item.Notificacion.date+'" datetime="'+item.Notificacion.datetime+'">&nbsp;</time>';
                html+='<h4 class="ui-li-heading">';
                if(item.Notificacion.tipo == "like"){
                    html+='A <b>'+item.Notificacion.usuario_title+'</b>';
                }else{
                    html+='<b>'+item.Notificacion.usuario_title+'</b>';
                }
                html+='</h4>';
                html+='<p class="ui-li-desc">'+item.Notificacion.texto_descripcion+'</p>';
                html+='</div>';
                html+='</li>';
                
                parent.find('#lista_actividades').append(html);
             });
             
            parent.find('#lista_actividades').listview('refresh');
            
            //mostralos la lista de actividad de patrocinalos
            parent.find("#lista_actividades").promise().done(function() {
                //ocultamos loading
                $.mobile.loading( 'hide' );
                $(".age").age();
            });
            
            //sacamos la actividad en las rondas
            var notificaciones_ronda =  data.notificaciones_ronda;
            showNotificacionesRonda(parent,notificaciones_ronda);
            
            //mostramos el tab que se selecciono
            if(hash == "#actividad_ronda"){
                parent.find('#tab_actividad_patrocinalos').removeClass("active");
                parent.find('#tab_actividad_rondas').addClass("active");
                parent.find('#lista_actividades_ronda').show();
            }else{
                parent.find('#tab_actividad_rondas').removeClass("active");
                parent.find('#tab_actividad_patrocinalos').addClass("active");
                parent.find('#lista_actividades').show();
            }
                     
            //cargamos los proyectos si es mayor a lo que actulamente se muestra, esto se da por si se vuelve a la page
            var items_proyectos = parent.find("#carrousel_proyectos").find(".m-item").length;
            if(data.entradas.length > items_proyectos){
                parent.find("#carrousel_proyectos").find(".m-item").remove();
                parent.find("#carrousel_proyectos").find(".m-carousel-controls").find("a").remove();
                
                //entradas de los deportista que tienen proyectos
                var entradas = data.entradas;
               	$.each(entradas, function(index, item) {
               	    var mclass = ""; 
               	    if(index == 0) mclass = "m-active";
                    var html='<div class="m-item '+mclass+'">'+
                        '<div class="info_deportista">'+
                            '<div class="info_content">'+
                                '<h2 class="usuario_title">'+item.Entrada.title+'</h2>'+
                                '<div class="left">'+
                                    '<div class="recuadro">'+
                                        '<img class="entrada_imagen" src="'+BASE_URL_APP+'img/home/crop.php?w=150&i='+item.Entrada.imagen+'" />'+
                                    '</div>'+
                                '</div>'+
                                '<div class="right">'+
                                    '<p class="descripcion">'+item.Entrada.texto+'</p>'+
                                    '<div class="like_cash">'+
                                        '<span class="like">'+item.seguidores+'</span>'+
                                        '<span class="cash">1</span>'+
                                    '</div>'+
                                '</div>'+
                                '<div class="buttom_ir_perfil">'+
                                    '<a class="ui-btn-submit celeste ui-btn ui-btn-corner-all" href="proyecto_deportivo.html?usuario_id='+item.Entrada.usuario_id+'">'+
                                        '<span class="ui-btn-inner">'+
                                        '<span class="ui-btn-text">VISITA SU PROYECTO</span>'+
                                        '</span>'+
                                    '</a>'+
                                '</div>'+
                            '</div>'+
                        '</div>'+
                    '</div>';
                    
               	    parent.find("#carrousel_proyectos").find(".m-carousel-inner").append(html);
                    parent.find("#carrousel_proyectos").find(".m-carousel-controls").append('<a href="#" data-slide="'+(index+1)+'">'+(index+1)+'</a>');
                });
                
                //iniciamos el carousel
                parent.find("#carrousel_proyectos").find(".m-carousel-inner").promise().done(function() {
                    //volvemos a recargar el plugin unicamente si es que los datos son mas de 1, porque inicialmente el html es uno y eso cuenta
                    if(items_proyectos > 1){
                        parent.find('#carrousel_proyectos').carousel("reload");
                    }else{
                        parent.find('#carrousel_proyectos').carousel();
                    }
                    //ocultamos loading
                    $.mobile.loading( 'hide' );
                });
            }
        } 
    });
}

//OBTENEMOS LOS DATOS DEL PERFIL DE UN DEPORTISTA EN ESPECIFICO
function loadPerfilDeportista(parent_id, me, usuario_id, show_popup_patrocinar){
    var parent = $("#"+parent_id);
    $.getJSON(BASE_URL_APP + 'usuarios/mobileGetProyectoDeportista?me=' + me + '&usuario_id='+usuario_id, function(data){
        if(data.item){
            
            //mostramos loading
            $.mobile.loading( 'show' );
            
            var item = data.item;
            
            //verifica si el deportista logeado ya es seguidor del deportista x
            if(item.Usuario.soy_su_seguidor){
                parent.find("#seguir_deportista").find(".ui-btn-text").text("Dejar de Apoyar");
                parent.find("#seguir_deportista").removeClass("seguir");
                parent.find("#seguir_deportista").addClass("dejar_seguir");
            }
            
            parent.find(".imagen_user").attr("src", BASE_URL_APP+'img/Usuario/169/crop.php?w=150&i='+item.Usuario.imagen);
            parent.find(".nombre_user").html(item.Usuario.title);
            
            if(item.Usuario.urlfacebook){
                var element = parent.find(".link_red_social a.facebook");
                element.attr("href", item.Usuario.urlfacebook);
                element.attr("onclick", "window.open(this.href,'_system'); return false;");
            }
            if(item.Usuario.twitter){
                var element = parent.find(".link_red_social a.twitter");
                element.attr("href", item.Usuario.twitter);
                element.attr("onclick", "window.open(this.href,'_system'); return false;");
            }
            
            if(item.Proyecto !=""){
                parent.find(".expira").find("span").attr("date",item.Proyecto.date);
                parent.find(".expira").find("span").attr("datetime",item.Proyecto.fecha_fin);
                parent.find(".expira").show();
                parent.find(".patrociname span").html(item.Proyecto.title).parent().show();
                parent.find(".necesito_para span").html(item.Proyecto.paraque_necesito).parent().show();
                parent.find(".cuanto_necesito").find(".monto").html(item.Proyecto.monto);
                parent.find(".cuanto_necesito").show();
                parent.find(".recaudado").find(".monto").html(item.Proyecto.total_recaudado);
                parent.find(".recaudado").show();
                parent.find(".progress").find(".porcentaje").css("width", item.Proyecto.porcentaje_recaudado+"%").parent().show();
                parent.find(".numero_porcentaje span").html(item.Proyecto.porcentaje_recaudado).parent().show();
                
                $(".age").age();
            }
            
            if(item.Publicaciones != ""){
                var publicaciones = item.Publicaciones;
                $.each(publicaciones, function(index, item) {
                    parent.find("#publicaciones").append(item.Publicacion);
                });
                parent.find("#publicaciones").promise().done(function() {
                    $(".age").age();
                });
            }
            
            parent.promise().done(function() {
                $(this).find(".imagen_user").load(function(){
                    //ocultamos loading
                    $.mobile.loading( 'hide' );
                    
                    //mostrarlos el popup para patrocinar si solo si viene la variable patrocinar=show
                    if(show_popup_patrocinar !== undefined && show_popup_patrocinar == "show"){
                        //comprobamos que toda la page se haiga cargado y recien mostramos el popup
                        //mostramos loading
                        $.mobile.loading( 'show' );
                        setTimeout(function(){
                            $("#popupPatrocinar").popup("open");
                            $.mobile.loading( 'hide' );
                        },400);
                    }
                });
            });
            
            //Actualizamos los datos para realizar la aportacion
            var form_pago = parent.find("#formulario_pago_individual"); 
            form_pago.find("#imagen_deportista").attr("src", BASE_URL_APP+'img/Usuario/169/crop.php?w=60&i='+item.Usuario.imagen);
            form_pago.find(".nombre_deportista").text(item.Usuario.title);
            form_pago.find("#proyecto_id").val(item.Proyecto.id);
            
            //llamamos a la funcion que inicia los eventos de la pagina proyecto
            loadEventPerfilDeportista(parent, me, usuario_id);
        }
    });
}

/*OBTENEMOS LOS DATOS DE LOS PROYECTOS DESTACADOS*/
function getDestacados(){
    $.getJSON(BASE_URL_APP+'rondas/mobileGetHomeDestacados', function(data) {
        //mostramos loading
        jQuery(".list_destacados").html("");
        $.mobile.loading( 'show' );
       	var destacados = data.items;
       	$.each(destacados, function(index, destacado) {
    	    html_data=' <li>';
            html_data+='    <div class="recorte">';
            html_data+='        <a href="'+destacado.Entrada.url+'">';
            html_data+='            <img src="'+BASE_URL_APP+"img/home/"+destacado.Entrada.imagen+'"/>';
            html_data+='        </a>';
            html_data+='    </div>';
            html_data+='    <div class="content_descripcion">'
            html_data+='         <p>';
            html_data+='            '+destacado.Entrada.texto;
            html_data+='         </p>';
            html_data+='    </div>';
            html_data+='</li>';
                    
            jQuery(".list_destacados").append(html_data);
            openOnWindow(jQuery(".list_destacados"), '_blank');
    	});
        
        jQuery(".list_destacados").promise().done(function() {
            $(this).find("li:last img").load(function(){
                //ocultamos loading
                $.mobile.loading( 'hide' );
            });
        });
	});
}

/*OBTENEMOS LOS DATOS DE MAS PROYECTOS*/
function getMasProyectos(){
    $.getJSON(BASE_URL_APP+'rondas/mobileGetHomeMasProyectos', function(data) {
        //mostramos loading
        jQuery(".elite_list").html("");
        $.mobile.loading( 'show' );
       	var proyectos = data.items;
       	$.each(proyectos, function(index, proyecto) {
    	    html_data=' <li class="ui-li ui-li-static ui-btn-up-c">';
            html_data+='    <div class="recorte">';
            html_data+='        <a href="proyecto_deportivo.html?usuario_id='+proyecto.Entrada.usuario_id+'" class="ui-link">';
            html_data+='            <img src="'+BASE_URL_APP+'img/home/'+proyecto.Entrada.imagen+'"/>';
            html_data+='        </a>';
            html_data+='    </div>';
            html_data+='    <div class="content_descripcion left">'
            html_data+='        <h2 class="ui-li-heading">'+proyecto.Entrada.title;
            html_data+='        </h2>';
            html_data+='        <p class="ui-li-desc">'+proyecto.Entrada.texto;
            html_data+='        </p>';
            html_data+='        <a class="button_blue" href="proyecto_deportivo.html?usuario_id='+proyecto.Entrada.usuario_id+'" class="ui-link">visita su proyecto';
            html_data+='        </a>';
            html_data+='    </div>';
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

/*OBTENEMOS LOS DATOS DE LOS DEPORTISTAS QUE BUSCAN PATROCINIO*/
function getBuscanPatrocinio(parent_id){
    var parent = $("#"+parent_id);
    $.getJSON(BASE_URL_APP+'proyectos/mobileGetBuscanPatrocinio', function(data) {
        var proyectos = data.items;
        
        //llenamos si solo los datos obtenidos es mayor a los datos que hay
        if(proyectos.length > parent.find(".list_buscan_patro > li").length){
            parent.find(".list_buscan_patro").html("");
            $.mobile.loading( 'show' );        
           	$.each(proyectos, function(index,item) {
           	    html_data=' <li>';
                html_data+='    <div class="cont_top">';
                html_data+='        <div class="recorte">';
                html_data+='            <a href="proyecto_deportivo.html?usuario_id='+item.Usuario.id+'">';
                html_data+='                <img src="'+BASE_URL_APP+'img/Usuario/169/'+item.Usuario.imagen+'"/>';
                html_data+='            </a>';
                html_data+='        </div>';
                html_data+='        <div class="content_descripcion">';
                html_data+='            <p>';
                html_data+='                <span>Necesita patrocinio para:</span>'+item.Proyecto.title+ '<br/>'+item.Proyecto.actividad_patrocinio;
                html_data+='            </p>';
                html_data+='        </div>';
                html_data+='        <div class="mount">';
                html_data+='            <span>'+item.Proyecto.monto+' &euro;</span>';
                html_data+='        </div>';
                html_data+='    </div>';
                html_data+='    <div class="cont_bottom">';
                html_data+='        <a href="proyecto_deportivo.html?usuario_id='+item.Usuario.id+'" class="link_profile"><h2>'+item.Usuario.title+'</h2></a>';
                html_data+='        <a href="proyecto_deportivo.html?usuario_id='+item.Usuario.id+'&patrocina=show" class="link_patrocina"><span>PATROCINAR</span></a>';
                html_data+='       <div class="mount">';
                html_data+='            <span>'+item.Proyecto.monto+' &euro;</span>';
                html_data+='        </div>';
                html_data+='    </div>';
                html_data+='</li>';
                
                if(item.Proyecto.actividad_patrocinio!=null && item.Proyecto.actividad_patrocinio!=""){
                    parent.find(".list_buscan_patro").append(html_data);
                }
        	});
            
            parent.find(".list_buscan_patro").promise().done(function() {
                $(this).find("li:last img").load(function(){
                    //ocultamos loading
                    $.mobile.loading( 'hide' );
                });
            });            
        }
	});
}

/*OBTENEMOS LOS DATOS DE LAS RECOMPENSAS MAZZEL*/
function getRecompensasMazzel(parent_id){
    var parent = $("#"+parent_id);
    $.getJSON(BASE_URL_APP+'rondas/mobileGetRecompensasMazzel', function(data) {
        
        //llenamos si solo los datos obtenidos es mayor a los datos que hay
        var recompensas = data.items;
        if(recompensas.length > parent.find(".list_recompensas > li").length){
            parent.find("#recompensas_home").html("");
            //mostramos loading
            $.mobile.loading( 'show' );
           	$.each(recompensas, function(index,item) {
           	    html_data=' <li>';
                html_data+='    <div class="cont_top">';
                html_data+='      <div class="recorte">';
                html_data+='           <img src="'+BASE_URL_APP+'img/recompensas/crop.php?w=400&i='+item.Recompensa.imagen+'"/>';
                html_data+='      </div>';
                html_data+='      <div class="content_descripcion informacion">';
                html_data+='           <img src="'+BASE_URL_APP+'img/Usuario/800/crop.php?w=30&i='+item.Recompensa.destacado.imagen+'" class="avatar deportista">';
                html_data+='           <p>Cons&iacute;guelo patrocinando el proyecto de <a href="proyecto_deportivo.html?usuario_id='+item.Recompensa.destacado.id+'">'+item.Recompensa.destacado.title+'</a></p>';
                html_data+='           <p class="activo_hasta">Activo hasta <b>'+item.Recompensa.fecha_fin+'</b></p>';
                html_data+='      </div>';
                html_data+='    </div>';
                html_data+='    <div class="cont_bottom">';
                html_data+='       <a id="'+item.Recompensa.id+'" class="link_profile" href="#mas_info_recompensa" data-role="button" data-rel="popup" data-position-to="window" data-transition="pop"><h2>'+item.Recompensa.title+'</h2></a>';
                html_data+='       <a href="proyecto_deportivo.html?usuario_id='+item.Recompensa.destacado.id+'&patrocina=show" class="link_patrocina"><span>PATROCINAR</span></a>';
                html_data+='    </div>';
                html_data+='</li>';
                
                parent.find("#recompensas_home").append(html_data);
                
                //popup mas info
                var parent_contenedor = parent.find("#mas_info_recompensa").find("#lista_recompensas_popup");
                var div_clone = parent_contenedor.find(".recompensa_item").clone();
                div_clone.removeClass("recompensa_item").addClass("recompensa_item_"+item.Recompensa.id);
                div_clone.find("h2").html(item.Recompensa.title);
                div_clone.find("img.imagen_recompensa").attr("src",BASE_URL_APP+'img/recompensas/'+item.Recompensa.imagen);
                div_clone.find(".descripcion").find("p").html(item.Recompensa.descripcion);
                div_clone.find(".fechas_sorteo").find("span").html(item.Recompensa.fecha_participacion);
                parent_contenedor.append(div_clone);
        	});
            
            parent.find("#recompensas_home").promise().done(function() {
                $(this).find("li:last img").load(function(){
                    //ocultamos loading
                    $.mobile.loading( 'hide' );
                    
                    //marcamos selected al item que se hizo click
                    parent.find("#recompensas_home").find("a.link_profile").bind("touchstart click",function(){
                        parent.find("#recompensas_home").find("a.link_profile").removeClass("selected");
                        $(this).addClass("selected"); 
                    });
                    
                    //evento que se lanza entes de mostrar el popup
                    parent.find( "#mas_info_recompensa" ).bind({
                       popupbeforeposition: function(event, ui) {
                            var recompensa_seleccionda = parent.find("#recompensas_home").find("a.link_profile.selected").attr("id");
                            parent.find("#mas_info_recompensa").find("#lista_recompensas_popup").children().hide();
                            parent.find("#mas_info_recompensa").find("#lista_recompensas_popup").find(".recompensa_item_"+recompensa_seleccionda).show();
                       }
                    });
                });
            });
        }
	});
}

/*OBTENEMOS LA INFO DE RONDA ACTIVA*/
function getRondaActiva(parent_id,usuario_id){
    var parent = $("#"+parent_id);
    $.getJSON(BASE_URL_APP+'rondas/mobileGetRondaActiva/'+usuario_id, function(data) {
        //mostramos loading
        $.mobile.loading('show');
       	
        var item = data.item;
        
        //info ronda
        parent.find("#imagen_ronda").attr("src", BASE_URL_APP+'img/rondas/'+item.Ronda.serializado.imagenronda1);
        parent.find("#name_ronda").html(item.Ronda.nombre);
        parent.find("#patrocinio_ronda").html(item.Ronda.serializado.recompensa+"&euro;");
        parent.find("#ganadoresliteral").html(item.Ronda.serializado.ganadoresliteral);
        
        parent.find("#imagen_ronda").load(function(){
            parent.find(".content_info_ronda").fadeIn("slow",function(){
                //ocultamos loading
                $.mobile.loading( 'hide' );
            });
        });
        
        if(item.Ronda.usuario_ya_inscrito_en_ronda){
            var notificaciones_ronda =  data.notificaciones_ronda;
            showNotificacionesRonda(parent,notificaciones_ronda);
        }else{
            //info usuario
            parent.find(".profile").find("img").attr("src",BASE_URL_APP+'img/Usuario/169/crop.php?w=50&i='+COOKIE.imagen);
            parent.find(".profile").find("strong").html(COOKIE.title);
            parent.find(".profile").find(".inscribirme").attr("id",item.Ronda.id);
            parent.find(".profile").show();
            
            parent.find(".profile").find(".inscribirme").click(function(){
                //mostramos loading
                $.mobile.loading( 'show' );
                $.getJSON(BASE_URL_APP + 'rondas/mobileInscribirmeRonda/'+usuario_id+'/'+$(this).attr("id"), function(data){
                    if(data.success){
                        showAlert(data.mensaje, "Aviso", "Aceptar");
                        //ocultamos los elmentos
                        parent.find(".profile, .content_bottom").fadeOut("slow");
                        var notificaciones_ronda =  data.notificaciones_ronda;
                        showNotificacionesRonda(parent,notificaciones_ronda);
                    }else{
                        showAlert("Ocurrio un error", "Error", "Aceptar");
                    }
                });
                
                return false;
            });
            
            //info ronda complementaria
            parent.find(".info_ronda").find("#text_inscripcion").html(item.Ronda.serializado.inscripcion);
            parent.find(".info_ronda").find("#fecha_inscripcion").html(item.Ronda.fecha_ini);
            parent.find(".info_ronda").find("#text_condiciones").html(item.Ronda.serializado.condiciones);
            parent.find(".info_ronda").find("#text_finalizacion").html(item.Ronda.serializado.finalizacion);
            parent.find(".info_ronda").find("#fecha_cierre").html(item.Ronda.fecha_fin);
            parent.find(".info_ronda").show();
        }
    });
}

/*OBTENEMOS LOS DATOS DE DEPORTISTAS ÉLITES DE LA HOME*/
function getBlog(parent_id){
    var parent = $("#"+parent_id);
    $.getJSON(BASE_URL_APP+'rondas/mobileGetBlog', function(data) {
        //mostramos loading
        parent.find(".list_blog").html("");
        $.mobile.loading( 'show' );
       	
        var blogs = data.items;
       	$.each(blogs, function(index, blog) {
    	    html_data='<li>';
            html_data+='    <div class="cont_top">';
            html_data+='        <div class="content_descripcion">';
            html_data+='            <h2>';
            html_data+='                <a href="'+blog.url+'">'+blog.post.post_title+'</a>';
            html_data+='            </h2>';
            html_data+='            <p>'+blog.descripcion+'</p>';
            html_data+='        </div>';
            html_data+='        <div class="time">';
            html_data+='            <span class="hour">'+blog.fecha.dia+'</span>';
            html_data+='            <span class="day_month">'+blog.fecha.anio+'</span>';
            html_data+='            <span class="day_week">'+blog.fecha.mes+'</span>';
            html_data+='        </div>';
            html_data+='    </div>';
            html_data+='</li>';
                    
            parent.find(".list_blog").append(html_data);
        });
        
        openOnWindow(parent.find(".list_blog"), '_blank');
        parent.find(".list_blog").promise().done(function() {
            $(this).find("li:last img").load(function(){
                //ocultamos loading
                $.mobile.loading( 'hide' );
            });
        });
   	});
}

/*OBTENEMOS LOS DATOS PERSONALES DENTRO EL PANEL DE GESTION DEL DEPORTISTA*/
function getDatosPersonales(id_user){
    var pais_dep="";
    var provincia_dep="";
     $.getJSON(BASE_URL_APP+'usuarios/mobileGetDatosPersonales/'+id_user, function(data){
        jQuery("#estado_dep").val(data.item.usuario.estado);
        jQuery("#estado_dep").before("<b class='title_mini'>Estado:</b>");
        jQuery("#title_dep").val(data.item.usuario.title);
        jQuery("#title_dep").before("<b class='title_mini'>Nombre:</b>");
        jQuery("#email_dep").val(data.item.usuario.email);
        jQuery("#email_dep").before("<b class='title_mini'>Email:</b>");
        jQuery("#direccion_dep").val(data.item.usuario.direccion);
        jQuery("#direccion_dep").before("<b class='title_mini'>Direccion:</b>");
        jQuery("#postal_dep").val(data.item.usuario.postal);
        jQuery("#postal_dep").before("<b class='title_mini'>Postal:</b>");
        jQuery("#telefono_dep").val(data.item.usuario.telefono);
        jQuery("#telefono_dep").before("<b class='title_mini'>Tel&eacute;fono:</b>");
        jQuery("#urlamigable_dep").val(data.item.usuario.urlamigable);
        jQuery("#urlamigable_dep").before("<b class='title_mini'>Url:</b>");
        jQuery("#imagen_dep").attr("src",BASE_URL_APP+'img/Usuario/169/'+data.item.usuario.imagen);
        jQuery("#modal_box img.preview").attr("src",BASE_URL_APP+'img/Usuario/169/'+data.item.usuario.imagen);
        
        pais_dep=data.item.pais.id;
        jQuery("#select-pais").siblings("span.ui-btn-inner").find("span.ui-btn-text").html("<span>"+data.item.pais.nombre+"</span>");
        provincia_dep=data.item.provincia.id;
        jQuery("#select-ciudad").siblings("span.ui-btn-inner").find("span.ui-btn-text").html("<span>"+data.item.provincia.nombre+"</span>");
     
    
         $.getJSON(BASE_URL_APP+'usuarios/mobileGetPaises', function(data){
            $.each(data.items,function(index,item){
                if(item.paises.id==pais_dep)
                    jQuery("#select-pais").append('<option selected="selected" value="'+item.paises.id+'">'+item.paises.nombre+'</option>');
                else
                    jQuery("#select-pais").append('<option value="'+item.paises.id+'">'+item.paises.nombre+'</option>');
            });
         });
         
         $.getJSON(BASE_URL_APP+'usuarios/mobileGetCiudades/'+pais_dep, function(data){
            $.each(data.items,function(index,item){
                if(item.ciudades.id==provincia_dep)
                    jQuery("#select-ciudad").append('<option selected="selected" value="'+item.ciudades.id+'">'+item.ciudades.nombre+'</option>');
                else
                    jQuery("#select-ciudad").append('<option value="'+item.ciudades.id+'">'+item.ciudades.nombre+'</option>');
            });
         });
     });
     
}

/*OBTENEMOS LOS DATOS PERSONALES DENTRO EL PANEL DE GESTION DEL DEPORTISTA*/
function getDatosDeportivos(id_user){
     $.getJSON(BASE_URL_APP+'usuarios/mobileGetDatosPersonales/'+id_user, function(data){
        jQuery("#objetivos_dep").val(data.item.usuario.objetivos);
        jQuery("#objetivos_dep").before("<b class='title_mini'>Objetivos:</b>");
        jQuery("#porquepatrocinar_dep").val(data.item.usuario.porque_patrocinar);
        jQuery("#porquepatrocinar_dep").before("<b class='title_mini'>Porqu&eacute; patrocinarme:</b>");    
        
        if(data.item.usuario.tipo=="equipo"){
          jQuery("#competiciones").hide();  
          jQuery("#aniofundacion_dep").val(data.item.usuario.aniofundacion);
          if(data.item.usuario.aniofundacion){
            jQuery("#aniofundacion_dep").before("<b class='title_mini'>A&ntilde;o de fundaci&oacute;:</b>");
          }
          jQuery("#clasificacion_dep").val(data.item.usuario.clasificacion);
          if(data.item.usuario.aniofundacion){
            jQuery("#aniofundacion_dep").before("<b class='title_mini'>A&ntilde;o de fundaci&oacute;:</b>");
          }    
        }
        else{
          jQuery("#competiciones").val(data.item.usuario.competiciones);
          if(data.item.usuario.competiciones){
            jQuery("#competiciones").before("<b class='title_mini'>Competiciones en que he participado:</b>");
          }
          jQuery("#aniofundacion_dep").parent("div.ui-input-text").hide();
          jQuery("#clasificacion_dep").parent("div.ui-input-text").hide(); 
        }
       
        
        
     });
}

/*FUNCION PARA GUARDAR LOS DATOS PERSONALES*/
function saveDatosPersonales(form, upload_image){
    
    jQuery("#"+form).validate({
        errorElement:'span',
    	rules:{ "estado_dep":{minlength:2},
    		    "title_dep":{required: true,minlength:5},
                "email_dep":{required: true,email:true},
                "select-pais":{required: true},
                "select-ciudad":{required: true},
                "urlamigable_dep":{required: true},
        },
    	messages: {
    		"estado_dep":{minlength: "M&iacute;nimo de 2 caracteres<i></i>"},
            "title_dep":{required:"Este campo es obligatorio.<i></i>",minlength:"M&iacute;nimo de 5 caracteres<i></i>"},
            "email_dep":{required:"Este campo es obligatorio.<i></i>",email:"Email no v&aacute;lido<i></i>"},
            "select-pais":{required:"Este campo es obligatorio.<i></i>"},
            "select-ciudad":{required:"Este campo es obligatorio.<i></i>"},
            "urlamigable_dep":{required:"Este campo es obligatorio.<i></i>"},
    	}
    });
    
    if(COOKIE.id && jQuery("#"+form).valid()){
        
        showLoadingCustom('Enviando datos...');
        
        //Existen 2 proceso
        //1.- Subir la imagen
        if(upload_image !== undefined && upload_image == true){
            //controlamos que el valor de la imagen a subir no este vacia, 
            //eso significa que se selecciono un imagen o se capturo una imagen
            if(IMAGEURI != ''){
                
                //creamos un objecto con los parametros que queremos que llegue al servidor
                //para luego ahi hacer otra operaciones con esos parametros.
                var params = new Object();
                params.folder = "Usuario"; // la carpeta donde se va a guardar la imagen
                params.usuario_id = COOKIE.id; // id del usuario para el cual es la nueva imagen.
                
                //Utilizamos la funcion de subir la imagen de forma asincrona, ya que solo
                //va subir la imagen y nada mas, ahi termina el proceso.
                uploadImagenAsynchronous(params);
                
                //Actualizamos la nueva imagen de su perfil
                var pictureImage = document.getElementById('imagen_dep');
                pictureImage.src = IMAGEURI;
            }
        }
        
        //2.- Actualizar los otros datos
        $.ajax({
                    data: $("#"+form).serialize(),
                    type: "POST",
                    url: BASE_URL_APP+'usuarios/mobileSaveDatosPersonales/'+COOKIE.id,
                    dataType: "html",
                    success: function(data){
                       data_j = $.parseJSON(data);
                       if(data_j.respuesta==1)
                       {
                        showAlert(data_j.message, "Aviso", "Aceptar");
                       }
                       else{
                        showAlert(data_j.message, "Aviso", "Aceptar");
                       }
                       $.mobile.loading('hide');
                    }
               });
    }
    
}

/*OBTENEMOS LA LISTA DE GALERIA DE FOTOS*/
function getAlbums(id_user){
     jQuery("ul.list_media").html("");
     $.mobile.loading('show');
     $.getJSON(BASE_URL_APP+'Fotosgalerias/mobileGetAlbums/'+id_user, function(data){
           $.each(data.items, function(index, item){
                html_data='<li><a href="pg_lista_fotos.html?album='+item.album.id+'">';
                html_data+='    <h3>'+item.num_fotos+' fotos</h3>';
                $.each(item.fotos, function(index,item_f){
                    url_foto=BASE_URL_APP+'img/Usuario/169/'+item_f.foto.url;
                    if(item_f.foto.url=="default_photo.jpg") url_foto='img/'+item_f.foto.url;
                    html_data+='    <div class="preview">';
                    html_data+='        <img src="'+url_foto+'" width="auto" height="auto" />';
                    html_data+='    </div>';
                });
                html_data+='    <h4>'+item.album.nombre+'</h4>';
                html_data+='</a></li>';
                jQuery("ul.list_media").append(html_data);
                $.mobile.loading( 'hide' );
           });
     });
}

function getPhotosAlbum(album){
    jQuery("ul.list_media_fotos li").html("");
     $.mobile.loading('show');
     $.getJSON(BASE_URL_APP+'Fotosgalerias/mobileGetPhotos/'+album, function(data){
        list_left=data.items.list_left;
        list_right=data.items.list_right;    
        $.each(list_left, function(index,photo){
            html_data='<div class="preview">';
            html_data+='    <a href="javascript:void()" onclick="zoomPhoto(this)" rel="'+BASE_URL_APP+'/img/Usuario/800/'+photo.url+'" class="zoom_media">&nbsp;</a>';
            html_data+='    <img src="'+BASE_URL_APP+'/img/Usuario/169/'+photo.url+'" width="auto" height="auto" />';
            html_data+='</div>';
            
            jQuery("ul.list_media_fotos li.list_left").append(html_data);
        });
        $.each(list_right, function(index,photo){
            html_data='<div class="preview">';
            html_data+='    <a href="javascript:void()" onclick="zoomPhoto(this)" rel="'+BASE_URL_APP+'/img/Usuario/800/'+photo.url+'" class="zoom_media">&nbsp;</a>';
            html_data+='    <img src="'+BASE_URL_APP+'/img/Usuario/169/'+photo.url+'" width="auto" height="auto" />';
            html_data+='</div>';
            
            jQuery("ul.list_media_fotos li.list_right").append(html_data);
        });
        $.mobile.loading( 'hide' );
     });
     
}

function zoomPhoto(thiss){
    jQuery("#modal_box_media").find(".zoom_image img").attr("src",jQuery(thiss).attr("rel"));
    jQuery("#modal_box_media").fadeIn("fast");
}

/*FUNCION PARA OBTENER LOS DATOS DE PATROCINIO*/
function getPatrocinioDeportivo(){
    $.getJSON(BASE_URL_APP+'crowfundings/mobileGetPatrocinio/'+COOKIE.id, function(data){
        if(data){
          jQuery("#form_edit_data #cantidad_patro").val(data.crowd.monto);
          jQuery("#form_edit_data #cantidad_min_patro").val(data.crowd.monto_min);
          jQuery("#form_edit_data #titulo_patro").val(data.crowd.titulo);
          jQuery("#form_edit_data #descripcion_patro").val(data.crowd.descripcion);       
          jQuery("#form_edit_data #fecha_fin").val(data.crowd.fecha_fin);
          jQuery("#form_edit_data #crowd_id").val(data.crowd.id);
          jQuery("#form_edit_data #save_edit").val("edit");
        }
    });
}

/*FUNCION PARA GUARDAR LOS DATOS DE PATROCINIO*/
function saveDatosPatrocinio(form,seguir){
    jQuery("#"+form).validate({
        errorElement:'span',
    	rules:{ "cantidad_patro":{required:true,number:true},
                 "cantidad_min_patro":{required:true,number:true},
    		    "titulo_patro":{required:true}, 
                "descripcion_patro":{required:true},
                "fecha_fin":{required:true},
        },
    	messages: {
    		"cantidad_patro":{required: "La cantidad es incorrecta.<i></i>",number:"Debe ser un n&uacute;mero.<i></i>"},
            "cantidad_min_patro":{required: "La cantidad es incorrecta.<i></i>",number:"Debe ser un n&uacute;mero.<i></i>"},
            "titulo_patro":{required:"Este campo es obligatorio.<i></i>"},
            "descripcion_patro":{required:"Este campo es obligatorio.<i></i>"},
            "fecha_fin":{required:"Este campo es obligatorio.<i></i>"},
        }
    });
    if(COOKIE.id && jQuery("#"+form).valid()){
        showLoadingCustom('Enviando datos...');
        $.ajax({
                    data: $("#"+form).serialize(),
                    type: "POST",
                    url: BASE_URL_APP+'crowfundings/mobileSavePatrocinio/'+COOKIE.id,
                    dataType: "html",
                    success: function(data){
                       data_p = $.parseJSON(data);
                       if(data_p.respuesta==1)
                       {
                        jQuery("#"+form+" #save_edit").val("edit");
                        jQuery("#"+form+" #crowd_id").val(data_p.crowd.id);
                        if(seguir)
                            $.mobile.changePage('p_edicion_recompensas_patrocinio.html?crowd_id='+data_p.crowd.id,{transition: "slide", changeHash: true});
                        else showAlert(data_p.message, "Aviso", "Aceptar");
                       }
                       else{
                        showAlert(data_p.message, "Aviso", "Aceptar");
                       }
                       $.mobile.loading('hide');
                    }
               });
    }
}

/*FUNCION PARA OPTENER LAS RECOMPENSAS DE PATROCINALOS*/
function getRecompensasPatrocinio(crowd_id){
    jQuery("#form_edit_data #crowd_id").val(crowd_id);
    jQuery("#list_recompensa_patro").html("");
    $.getJSON(BASE_URL_APP+'recompensas/mobileGetRecompensas', function(data) {
        //mostramos loading
        $.mobile.loading('show');
        
        var items = data.items;
       	$.each(items, function(index,item){
       	    html_data=' <li id="'+item.Recompensa.id+'">';
            html_data+='  <div>';
            html_data+='     <div class="recorte">';
            html_data+='           <img src="'+BASE_URL_APP+'img/recompensas/'+item.Recompensa.imagen+'"/>';
            html_data+='     </div>';
            html_data+='     <h4>'+item.Recompensa.nombre+'</h4>';
            html_data+='  </div>';
            html_data+='</li>';
                    
            jQuery("#list_recompensa_patro").append(html_data);
            jQuery("#list_recompensa_patro li#"+item.Recompensa.id).click(function(){
                    if(jQuery(this).hasClass("selected")) jQuery(this).removeClass("selected");
                    else jQuery(this).addClass("selected");
                    jQuery("#form_edit_data input."+jQuery(this).attr("id")).remove();
                    if(jQuery(this).hasClass("selected"))
                       jQuery("#form_edit_data").append('<input class='+jQuery(this).attr("id")+' type="hidden" name="recompensas_select[]" value="'+jQuery(this).attr("id")+'"/>');    
            });
    	});
        
        $.getJSON(BASE_URL_APP+'crowfundings/mobileRecompensasSelect/'+COOKIE.id+'/?crowd_id='+crowd_id, function(data){
            jQuery.each(data.items,function(index,item){
              jQuery("#list_recompensa_patro li#"+item.recompensa.recompensa_id).addClass("selected");
              jQuery("#form_edit_data").append('<input class='+item.recompensa.recompensa_id+' type="hidden" name="recompensas_select[]" value="'+item.recompensa.recompensa_id+'"/>');
            });
        });
        
        jQuery("#list_recompensa_patro").promise().done(function() {
            $(this).find("li:last img").load(function(){
                //ocultamos loading
                $.mobile.loading( 'hide' );
                
            });
        });
	});
}

/*FUNCION PARA GUARDAR LAS RECOMPENSAS SELECCIONADAS EN LA SECCION DE PATROCINIO DEL PG*/
function saveRecompensasPatrocinio(form,seguir){
    if(COOKIE.id && jQuery("#"+form).valid()){
        showLoadingCustom('Enviando datos...');
        $.ajax({
                    data: $("#"+form).serialize(),
                    type: "POST",
                    url: BASE_URL_APP+'crowfundings/mobileSaveRecompensas/'+COOKIE.id,
                    dataType: "html",
                    success: function(data){
                       data_p = $.parseJSON(data);
                       if(seguir) $.mobile.changePage('p_multimedia_patrocinio.html',{transition: "slide", changeHash: true});
                       else{
                        showAlert(data_p.message, "Aviso", "Aceptar");
                        $.mobile.loading( 'hide' );
                       }
                    }
               });
    }
}