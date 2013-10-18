
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
$(document).on('pageinit', "#view", function(){
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
$('#registro_finalizado').live('pagebeforeshow', function(event, ui) {
    //controlamos si completar perfil pertenece a deportista(individual o equipo), patrocinador o empresa
    if(isUserRegistered()){
        var userRegistered = COOKIE_NEW_REGISTER;
        if(userRegistered.tipo == "empresa"){
            $(this).find('a.btn_completar_perfil').attr("href","#completar_perfil_empresa");
        }else if(userRegistered.tipo == "patrocinador"){
            $(this).find('a.btn_completar_perfil').attr("href","#completar_perfil_patrocinador");
        }
    }
});

//COMPLETAR PERFIL
$(document).on('pageinit', "#completar_perfil", function(){
    llenarDeportes('form_completar_perfil');
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

//SOLICITAR / EDITAR PATROCINIO - PERFIL
$("#solicitar_editar_patrocinio").live('pagebeforeshow', function(event, ui) {
    if(isLogin()){
        var user = COOKIE;
        form_solicitar_editar_patrocinio($(this).attr("id"), "form_solicitar_editar_patrocinio",user);
        key_press("form_solicitar_editar_patrocinio");
        $(this).find('a.guardar_form').bind("click", function(){
            var form_parent = document.getElementById("form_solicitar_editar_patrocinio");
            $(form_parent).submit();
        });
        $(this).find('a.borrar_form').bind("click", function(){
            clear_form("form_solicitar_editar_patrocinio");
        });
    }else{
        redirectLogin();
    }
});

//EDITAR - PERFIL
$("#editar_perfil").live('pagebeforeshow', function(event, ui) {
    if(isLogin()){
        var user = COOKIE;
        form_editar_perfil($(this).attr("id"), "form_editar_perfil",user);
        key_press("form_editar_perfil");
        form_perfil_cambiar_password("form_perfil_cambiar_password",user);
        key_press("form_perfil_cambiar_password");
        $(this).find('a.guardar_form').bind("click", function(){
            var form_parent = document.getElementById("form_editar_perfil");
            $(form_parent).submit();
        });
	    $(this).find('a.cambiar_nuevo_password').on("click", function(){
            var form_parent = document.getElementById("form_perfil_cambiar_password");
            $(form_parent).submit();
        });
    }else{
        redirectLogin();
    }
});

//MIS IMAGENES O FOTOS - PERFIL
$("#mis_fotos").live('pagebeforeshow', function(event, ui) {
    if(isLogin()){
        var user = COOKIE;
        getFotos($(this).attr("id"),user);
    }else{
        redirectLogin();
    }
});

//MIS VIDEOS - PERFIL
$("#mis_videos").live('pagebeforeshow', function(event, ui) {
    if(isLogin()){
        var user = COOKIE;
        form_subir_video($(this).attr("id"),"form_subir_video",user);
        key_press("form_subir_video");
	    $(this).find('a.publicar').on("click", function(){
            var form_parent = document.getElementById("form_subir_video");
            $(form_parent).submit();
        });
        getVideos($(this).attr("id"),user);
    }else{
        redirectLogin();
    }
});

//CONFIGURAR ALERTAS - PERFIL
$(document).on('pageinit', "#mis_alertas", function(){
    if(isLogin()){
        var user = COOKIE;
        form_configurar_alertas("form_configurar_alertas",user);
        $(this).find('a.guardar_form').bind("click", function(){
            var form_parent = document.getElementById("form_configurar_alertas");
            $(form_parent).submit();
        });
    }else{
        redirectLogin();
    }
});

//MI WIDGET - MI PATROCINIO
$(document).on('pageinit', "#mi_widget", function(){
    if(isLogin()){
        var user = COOKIE;
        showMiWidget($(this).attr("id"), user)
    }else{
        redirectLogin();
    }
});

//MIS RECAUDACIONES - MI PATROCINIO
$("#mis_recaudaciones").live('pagebeforeshow', function(event, ui) {
    if(isLogin()){
        var user = COOKIE;
        getMisRecaudaciones($(this).attr("id"),user);
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
    parent.find(".ui-content").hide();
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
            showNotificacionesRonda(parent,notificaciones_ronda,false);
            
            //mostramos el tab que se selecciono
            if(hash !== undefined && hash == "#actividad_ronda"){
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
                
                    //ocultamos loading
                    $.mobile.loading( 'hide' );
                    parent.find(".ui-content").fadeIn("slow");
                
                setTimeout(function(){
                    parent.find('#carrousel_proyectos').carousel();
                    alert("hkasfd");
                },5000);
        } 
    });
}

//OBTENEMOS LOS DATOS DEL PERFIL DE UN DEPORTISTA EN ESPECIFICO
function loadPerfilDeportista(parent_id, me, usuario_id, show_popup_patrocinar){
    var parent = $("#"+parent_id);
    parent.find(".ui-content").hide();
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
            
            //compartir proyecto en facebook
            var element = parent.find(".link_red_social a.facebook");
            element.attr("onclick", "compartiFacebookWallPost('"+item.Usuario.title+"','"+item.Proyecto.title+"','"+item.Proyecto.paraque_necesito+"','"+BASE_URL_APP+'img/Usuario/169/'+item.Usuario.imagen+"','"+BASE_URL_APP+'proyecto/'+item.Usuario.urlamigable+'/'+item.Proyecto.nombre_url+"')");
            
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
                parent.find(".numero_porcentaje span").html(parseFloat(item.Proyecto.porcentaje_recaudado).toFixed(2)).parent().show();
                
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
                    
                    parent.find(".ui-content").fadeIn("slow");
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
            showNotificacionesRonda(parent,notificaciones_ronda,true);
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
                    //ocultamos loading
                    $.mobile.loading( 'hide' );                    
                    if(data.success){
                        showAlert(data.mensaje, "Aviso", "Aceptar");
                        //ocultamos los elmentos
                        parent.find(".profile, .content_bottom").fadeOut("slow");
                        var notificaciones_ronda =  data.notificaciones_ronda;
                        showNotificacionesRonda(parent,notificaciones_ronda,true);
                    }else{
                        showAlert(data.mensaje, "Error", "Aceptar");
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

/*OBTENEMOS LOS DATOS DEL BLOG DE WP*/
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

/*OBTENEMOS LAS FOTOS DEL DEPORTISTA */
function getFotos(parent_id,user){
    var parent = $("#"+parent_id);
    //colocamos en vacio la variable que tiene la imagen seleccionada desde el dispositivo
    IMAGEURI = "";
    $.mobile.loading('show');
    parent.find("ul.list_media_fotos").hide();
    parent.find("ul.list_media_fotos").css("opacity",0.5);
    
    $.getJSON(BASE_URL_APP+'usuarios/mobileGetMisImagenes/'+user.id, function(data){
        parent.find("ul.list_media_fotos").find(".preview").remove();
        
        if(data.lista_izquierda.length > 0 || data.lista_derecha.length > 0){
            if(data.lista_izquierda){
                lista_izquierda = data.lista_izquierda;
                $.each(lista_izquierda, function(index,photo){
                    html_data='<div class="preview">';
                    html_data+='    <a href="javascript:void(0)" onclick="zoomPhoto(this)" rel="'+BASE_URL_APP+'/img/Usuario/800/'+photo.imagen+'" class="zoom_media">&nbsp;</a>';
                    html_data+='    <img src="'+BASE_URL_APP+'/img/Usuario/169/'+photo.imagen+'" width="auto" height="auto" />';
                    html_data+='</div>';
                
                    parent.find("ul.list_media_fotos li.list_left").append(html_data);
                });
            }
            
            if(data.lista_derecha){
                lista_derecha = data.lista_derecha;
                $.each(lista_derecha, function(index,photo){
                    html_data='<div class="preview">';
                    html_data+='    <a href="javascript:void(0)" onclick="zoomPhoto(this)" rel="'+BASE_URL_APP+'/img/Usuario/800/'+photo.imagen+'" class="zoom_media">&nbsp;</a>';
                    html_data+='    <img src="'+BASE_URL_APP+'/img/Usuario/169/'+photo.imagen+'" width="auto" height="auto" />';
                    html_data+='</div>';
                    
                    parent.find("ul.list_media_fotos li.list_right").append(html_data);
                });
            }
            
            parent.find("ul.list_media_fotos .preview:last").find("img").load(function(){
                $.mobile.loading( 'hide' );
                parent.find("ul.list_media_fotos").find(".no_imagenes").remove();
                parent.find("ul.list_media_fotos").css("opacity",1);
                parent.find("ul.list_media_fotos").fadeIn("slow");
            });
        
        }else{
            parent.find("ul.list_media_fotos").append("<li class='no_imagenes'>A&uacute;n no tienes imagenes!.</li>");
            $.mobile.loading('hide');
            parent.find("ul.list_media_fotos").show();
            parent.find("ul.list_media_fotos").css("opacity",1);
        }
    });
}

/*OBTENEMOS LOS VIDEOS DEL DEPORTISTA */
function getVideos(parent_id,user){
    var parent = $("#"+parent_id);
    $.mobile.loading('show');
    parent.find("ul.list_media_videos").hide();
    parent.find("ul.list_media_videos").css("opacity",0.5);
    
    $.getJSON(BASE_URL_APP+'usuarios/mobileGetMisVideos/'+user.id, function(data){
        parent.find("ul.list_media_videos").find(".preview").remove();
        
        if(data.lista_izquierda.length > 0 || data.lista_derecha.length > 0){
            if(data.lista_izquierda){
                lista_izquierda = data.lista_izquierda;
                $.each(lista_izquierda, function(index,video){
                    html_data='<div class="preview">';
                    html_data+='    <a href="javascript:void(0)" onclick="playVideo(this)" rel="'+video.src_iframe+'" class="zoom_media">&nbsp;</a>';
                    html_data+='    <img src="'+video.src+'" width="auto" height="auto" />';
                    html_data+='</div>';
                
                    parent.find("ul.list_media_videos li.list_left").append(html_data);
                });
            }
            
            if(data.lista_derecha){
                lista_derecha = data.lista_derecha;
                $.each(lista_derecha, function(index,video){
                    html_data='<div class="preview">';
                    html_data+='    <a href="javascript:void(0)" onclick="playVideo(this)" rel="'+video.src_iframe+'" class="zoom_media">&nbsp;</a>';
                    html_data+='    <img src="'+video.src+'" width="auto" height="auto" />';
                    html_data+='</div>';
                    
                    parent.find("ul.list_media_videos li.list_right").append(html_data);
                });
            }
            
            parent.find("ul.list_media_videos .preview:last").find("img").load(function(){
                $.mobile.loading( 'hide' );
                parent.find("ul.list_media_videos").find(".no_videos").remove();
                parent.find("ul.list_media_videos").css("opacity",1);
                parent.find("ul.list_media_videos").fadeIn("slow");
            });
        }else{
            parent.find("ul.list_media_videos").append("<li class='no_videos'>A&uacute;n no tienes videos!.</li>");
            $.mobile.loading('hide');
            parent.find("ul.list_media_videos").show();
            parent.find("ul.list_media_videos").css("opacity",1);
        }
    });
}

/*MOSTRAMOS EL WIDGET DEL DEPORTISTA*/
function showMiWidget(parent_id,user){
    var parent = $("#"+parent_id);
    if(user.proyecto_id !== undefined && user.proyecto_estado == "activo"){
        var src = BASE_URL_APP + "proyectos/widget/"+user.proyecto_id+"?device=true";
        var url = BASE_URL_APP + "proyectos/widget/"+user.proyecto_id;
        parent.find("#widget").find("iframe").attr("src",src);
        var iframe_compartir = '<iframe width="310px" height="450px" src="'+url+'"></iframe>';
        parent.find("#widget").find("form").find("textarea").text(iframe_compartir);
        parent.find("#widget").fadeIn("slow");
    }else{
        parent.find("#no_compartir").fadeIn("slow");
    }
}

/*MOSTRAMOS LA LISTA DE RECAUDACIONES Y PAGOS QUE SE HIZO AL DEPORTISTA*/
function getMisRecaudaciones(parent_id,user){
    var parent = $("#"+parent_id);
    parent.find("#tabs_opciones a").bind("touchstart click",function(){
        $(this).parent().find("a").removeClass("active2");
        $(this).addClass("active2");
        if($(this).attr("id") == "tab_pagos"){
            parent.find('#lista_recaudaciones').hide();
            parent.find('#lista_pagos').show();
        }else{
            parent.find('#lista_pagos').hide();
            parent.find('#lista_recaudaciones').show();
        }
    });
        
    $.mobile.loading('show');
    parent.find("#lista_recaudaciones").hide();
    parent.find("#lista_recaudaciones").css("opacity",0.5);
        
    if(user.proyecto_id !== undefined && parseInt(user.proyecto_id) > 0){
        $.getJSON(BASE_URL_APP+'aportaciones/mobileGetMisRecaudacionesYPagos/'+user.proyecto_id, function(data){
            var proyecto = data.objetos.proyecto.Proyecto;
            var recaudaciones = data.objetos.respuesta_aportaciones;
            var pagos = data.objetos.respuesta_pagos;
            
            parent.find("#proyecto_title").html(proyecto.title);
            parent.find("#proyecto_title").parent().parent().fadeIn("slow");
            //recaudaciones
            parent.find("#lista_recaudaciones").css("opacity",1);
            parent.find("#lista_recaudaciones").append(recaudaciones).fadeIn("slow");
            //pagos
            parent.find("#lista_pagos").append(pagos);
        });
    }
}