
/************************************ BIND EVENT *******************************************************/

$(document).bind('pageinit', function(){
});

$(document).bind('pageshow', function() { 
    $("#" + $.mobile.activePage.attr('id')).find( "#panel_menu" ).panel({
        beforeopen: function( event, ui ) {}
    });
    $("#" + $.mobile.activePage.attr('id')).find( "#panel_menu" ).panel({
        close: function( event, ui ) {}
    });
	$("#" + $.mobile.activePage.attr('id')).find("#panel_menu").on("panelbeforeopen", function (event, ui) {
	    $(this).find(".close_menu").css("top", "-20px");
        $(".footer_menu").find("a.icon_menu").hide();
    });
	$("#" + $.mobile.activePage.attr('id')).find("#panel_menu").on("panelclose", function (event, ui) {
	    $(this).find(".close_menu").css("top", "0px");
        $(".footer_menu").find("a.icon_menu").show();
    });
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

//COMPLETAR PERFIL
$(document).on('pageinit', "#completar_perfil", function(){
    form_completar_perfil("form_completar_perfil");
    key_press("form_completar_perfil");
    $(this).find('a.guardar_form').on("click", function(){
        var form_parent = document.getElementById("form_completar_perfil");
        $(form_parent).submit();
    });
});

//SOLICITAR PATROCINIO
$(document).on('pageinit', "#solicitar_patrocinio", function(){
    llenarRecompensasMazzel("solicitar_patrocinio");
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
$(document).on('pageinit', "#login_user", function(){
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

//INFO GENERAL
$('#info_general').live('pagebeforeshow', function(event, ui) {
    if(isLogin()){
        getEntradasByCarrousel();
        getActividades();
    }else{
        redirectLogin();
    }
});

//PERFIL DEPORTIVO
$('#perfil_deportivo').live('pagebeforeshow', function(event, ui) {
    if(isLogin()){
        var user = COOKIE;
        var me = user.id;
        loadPerfilDeportista(me, getUrlVars()["usuario_id"]);
        loadEventPerfilDeportista(this, me, getUrlVars()["usuario_id"]);
    }else{
        redirectLogin();
    }
});

//CUANDO CARGUE LA PAGE DE PUBLICACIONES DESTACADAS DE LA HOME
$(document).on('pageinit', "#home_destacados", function(){
   getDestacados();
});

//CUANDO CARGUE LA PAGE DE PUBLICACIONES DESTACADAS DE LA HOME
$(document).on('pageinit', "#home_elites", function(){
  getElites();
});

//CUANDO CARGUE LA PAGE DE INFO DE LA RONDA
$(document).on('pageinit', "#detail_ronda", function(){
  getRondaActiva();
});

//CUANDO CARGUE LA PAGE DE INFO DE LA RONDA
$(document).on('pageinit', "#home_bloggin", function(){
  getBlogHome();
});

//CUANDO CARGUE LA PAGE DE DETALLE DE ENTRADA DE BLOG
$('#home_detail_blog').live('pagebeforeshow', function(event, ui) {
  getInfoBlog(getUrlVars()["id_blog"]);
});

//CUANDO CARGUE LA PAGE DE COMENTAR LA ENTRADA DE BLOG
$('#home_blog_comment').live('pagebeforeshow', function(event, ui) {
  getInfoBlogComment(getUrlVars()["id_blog"]);
  
});

//CUANDO CARGUE LA PAGE DE LOS PATROCINIOS ACTIVOS DE LA HOME
$('#home_buscan_patrocinio').live('pagebeforeshow', function(event, ui) {
    getBuscanPatrocinio();
});

//CUANDO CARGUE LA PAGE DE LAS RECOMPENSAS DE LA HOME
$('#home_recompensas_ofrecidas').live('pagebeforeshow', function(event, ui) {
    getRecompensas();
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
        getRecompensasPatrocinio();
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

/*OBTENEMOS LA INFO DE RONDA ACTIVA*/
function getRondaActiva(){
    $.getJSON(BASE_URL_APP+'rondas/mobileGetRondaActiva', function(data) {
        //mostramos loading
        $.mobile.loading('show');
       	var ronda = data.ronda;
        jQuery("#name_ronda").text(""+ronda.nombre);    
        jQuery("#patrocinio_ronda").text( ""+ronda.patrocinio_hasta);    
        jQuery("#num_ganadores").text(""+ronda.num_patrocinados);
        jQuery("#puntos_necesarios").text(""+ronda.puntos_necesarios+" puntos");
        jQuery("#fecha_inscripcion").text(""+ronda.fecha_ini);
        jQuery("#fecha_fin").text(""+ronda.fecha_fin);
        jQuery("#fecha_votacion").text(""+ronda.fecha_ini);
        $.mobile.loading( 'hide' );    
        
    });
}

/*OBTENEMOS LOS DATOS DE DEPORTISTAS ÉLITES DE LA HOME*/
function getBlogHome(){
    
    $.getJSON(BASE_URL_APP+'comentarios/mobileGetBlogHome', function(data) {
        //mostramos loading
        jQuery(".list_blog").html("");
        $.mobile.loading( 'show' );
       	var comentarios = data.items;
       	$.each(comentarios, function(index, item) {
    	    html_data='<li>';
            html_data+='<a href="home_info_blog.html?id_blog='+item.comentario.id+'">';
            html_data+='  <div class="cont_top">';
            html_data+='    <div class="content_descripcion">';
            html_data+='      <h2>'+item.usuario.title+'</h2>';
            html_data+='      <p>'+item.comentario.mensaje+'</p>';
            html_data+='    </div>';
            html_data+='    <div class="time">';
            html_data+='        <span class="hour">'+item.comentario.hora+'</span>';
            html_data+='        <span class="day_month">'+item.comentario.dia+'</span>';
            html_data+='        <span class="day_week">'+item.comentario.dia_semana+'</span>';
            html_data+='    </div>';
            html_data+='  </div>';
            html_data+='  <div class="cont_bottom">';
            html_data+='    <span class="coments_count">Comentarios <b>('+item.comentario.respuestas+')</b></span>';
            html_data+='    <span class="like_count">Me gusta <b>('+item.comentario.likes_count+')</b></span>';
            html_data+='  </div>';
            html_data+='</a>';
            html_data+='</li>';
                    
            jQuery(".list_blog").append(html_data);
            $.mobile.loading( 'hide' );
        });
   	});
}

/*OBTENEMOS LOS DATOS DE UNA ENTRADA ESPECÍFICA DEL BLOG DE LA HOME*/
function getInfoBlog(id_blog){
    $.getJSON(BASE_URL_APP+'comentarios/mobileGetComment/'+id_blog, function(data) {
       var item = data.item;
       jQuery("#detail_post .day_month").text(item.comentario.dia);
       jQuery("#detail_post .month").text(item.comentario.mes);
       jQuery("#detail_post .day_week").text(item.comentario.dia_semana);
       jQuery("#detail_post .title_post").text(item.usuario.title);
       jQuery("#detail_post .text").html(item.comentario.mensaje);
       jQuery("#btn_comment").attr("href","home_blog_comentar.html?id_blog="+id_blog);
       jQuery("#number_comment").text("("+item.comentario.respuestas+")");
       if(item.comentario.img!=null && $.trim(item.comentario.img)!=""){
         jQuery("#detail_post .image").html('<img src="'+BASE_URL_APP+'img/comentarios/800/'+item.comentario.img+'" alt="blog"/>');
        }
       else jQuery("#detail_post .image").remove();
    });
}

/*OBTENEMOS LOS DATOS PARA COMENTAR UNA ENTRADA ESPECÍFICA DEL BLOG DE LA HOME*/
function getInfoBlogComment(id_blog){
    $.getJSON(BASE_URL_APP+'comentarios/mobileGetComment/'+id_blog, function(data) {
       var item = data.item;
       var respuestas = data.respuestas;
       jQuery("#detail_post .day_month").text(item.comentario.dia);
       jQuery("#detail_post .month").text(item.comentario.mes);
       jQuery("#detail_post .day_week").text(item.comentario.dia_semana);
       jQuery("#detail_post .title_post").text(item.usuario.title);
       jQuery(".list_comments_blog").html("");
       jQuery("#number_comment_c").text("("+item.comentario.respuestas+")");
       jQuery("#id_coment_form").val(id_blog);
       jQuery("#id_user_login").val(COOKIE.id);
       	$.each(respuestas, function(index, respuesta) {
       	   html_c=" <li>";
           html_c+='      <div class="avatar">';
           html_c+='         <img src="'+BASE_URL_APP+'img/Usuario/169/'+respuesta.usuario.imagen+'" alt="avatar" />';
           html_c+='     </div>';
           html_c+='     <div class="text_comment">';
           html_c+='         <div>';
           html_c+='              <p><span>'+respuesta.usuario.title+' :</span> '+respuesta.comentario.mensaje+'</p>';
           html_c+='         </div>';
           html_c+='     </div>';
           html_c+=' </li>';
           jQuery(".list_comments_blog").append(html_c);
        });
        
    });
    
    jQuery('a#btn_send_comment').on("click", function(){
        if(jQuery("#form_response_comment #comentario").val()!="" &&  jQuery("#form_response_comment #comentario").val()!="Escribe tu comentario..."){
        showLoadingCustom('Enviando datos...');
        $.ajax({
                    data: $("#form_response_comment").serialize(),
                    type: "POST",
                    url: BASE_URL_APP+'comentarios/respadd',
                    dataType: "html",
                    success: function(data){
                       data_j = $.parseJSON(data);
                       if(data_j.respuesta==1)
                       {
                         html_c=" <li>";
                         html_c+='      <div class="avatar">';
                         html_c+='         <img src="'+BASE_URL_APP+'img/Usuario/169/'+COOKIE.imagen+'" alt="avatar" />';
                         html_c+='     </div>';
                         html_c+='     <div class="text_comment">';
                         html_c+='         <div>';
                         html_c+='              <p><span>'+COOKIE.title+' :</span> '+$("#form_response_comment #comentario").val()+'</p>';
                         html_c+='         </div>';
                         html_c+='     </div>';
                         html_c+=' </li>';
                         jQuery(".list_comments_blog").append(html_c);
                        showAlert('Se ha enviado correctamente tu comentario.', "Aviso", "Aceptar");
                       }
                       else{
                        showAlert('Ha ocurrido un error, intente nuevamente.', "Aviso", "Aceptar");
                       }
                       $.mobile.loading( 'hide' );
                    }
                });
        }
        else{
            showAlert("Debes introducir un comentario.", "Aviso", "Aceptar");
        }
    });
}

/*OBTENEMOS LOS DATOS DE LOS DEPORTISTAS CON PATROCINIO ACTIVO DE LA HOME*/
function getBuscanPatrocinio(){
    jQuery(".list_buscan_patro").html("");
    $.getJSON(BASE_URL_APP+'crowfundings/mobileGetBuscanPatrocinio', function(data) {
        $.mobile.loading( 'show' );
        var items = data.items;
       	$.each(items, function(index,item) {
       	    html_data=' <li>';
            html_data+='    <div class="cont_top">';
            html_data+='        <div class="recorte">';
            html_data+='            <img src="'+BASE_URL_APP+'img/Usuario/169/'+item.Usuario.imagen+'"/>';
            html_data+='        </div>';
            html_data+='        <div class="content_descripcion">';
            html_data+='            <p>'+item.Crowfunding.actividad_patrocinio+'</p>';
            html_data+='        </div>';
            html_data+='        <div class="mount">';
            html_data+='            <span>'+item.Crowfunding.monto+' &euro;</span>';
            html_data+='        </div>';
            html_data+='    </div>';
            html_data+='    <div class="cont_bottom">';
            html_data+='        <a href="#" class="link_profile"><h2>'+item.Usuario.title+'</h2></a>';
            html_data+='        <a href="#" class="link_patrocina"><span>PATROCINAR</span></a>';
            html_data+='       <div class="mount">';
            html_data+='            <span>'+item.Crowfunding.monto+' &euro;</span>';
            html_data+='        </div>';
            html_data+='    </div>';
            html_data+='</li>';
            
            if(item.Crowfunding.actividad_patrocinio!=null && item.Crowfunding.actividad_patrocinio!="")        
            jQuery(".list_buscan_patro").append(html_data);
    	});
        
        jQuery(".list_buscan_patro").promise().done(function() {
            $(this).find("li:last img").load(function(){
                //ocultamos loading
                $.mobile.loading( 'hide' );
            });
        });
	});
}

/*OBTENEMOS LOS DATOS DE LAS RECOMPENSAS DE LA HOME*/
function getRecompensas(){
    jQuery("#recompensas_home").html("");
    $.getJSON(BASE_URL_APP+'recompensas/mobileGetRecompensas', function(data) {
        //mostramos loading
        $.mobile.loading( 'show' );
        var items = data.items;
       	$.each(items, function(index,item) {
       	    html_data=' <li>';
            html_data+='    <div class="cont_top">';
            html_data+='      <div class="recorte">';
            html_data+='           <img src="'+BASE_URL_APP+'img/recompensas/'+item.Recompensa.imagen+'"/>';
            html_data+='      </div>';
            html_data+='      <div class="content_descripcion">';
            html_data+='          <p>'+item.Recompensa.descripcion+'</p>';
            html_data+='      </div>';
            html_data+='    </div>';
            html_data+='    <div class="cont_bottom">';
            html_data+='       <a href="#" class="link_profile"><h2>'+item.Recompensa.nombre+'</h2></a>';
            html_data+='       <a href="#" class="link_patrocina"><span>PATROCINAR</span></a>';
            html_data+='    </div>';
            html_data+='</li>';
                    
            jQuery("#recompensas_home").append(html_data);
    	});
        
        jQuery("#recompensas_home").promise().done(function() {
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
         
         $.getJSON(BASE_URL_APP+'usuarios/mobileGetProvincias/'+pais_dep, function(data){
            $.each(data.items,function(index,item){
                if(item.provincias.id==provincia_dep)
                    jQuery("#select-ciudad").append('<option selected="selected" value="'+item.provincias.id+'">'+item.provincias.nombre+'</option>');
                else
                    jQuery("#select-ciudad").append('<option value="'+item.provincias.id+'">'+item.provincias.nombre+'</option>');
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
function saveDatosPatrocinio(form){
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
                        $.mobile.changePage('p_edicion_recompensas_patrocinio.html', {transition: "slide", changeHash: false});
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
function getRecompensasPatrocinio(){
    jQuery("#list_recompensa_patro").html("");
    $.getJSON(BASE_URL_APP+'recompensas/mobileGetRecompensas', function(data) {
        //mostramos loading
        $.mobile.loading('show');
        var items = data.items;
       	$.each(items, function(index,item){
       	    html_data=' <li>';
            html_data+='  <div id="'+item.Recompensa.id+'">';
            html_data+='     <div class="recorte">';
            html_data+='           <img src="'+BASE_URL_APP+'img/recompensas/'+item.Recompensa.imagen+'"/>';
            html_data+='     </div>';
            html_data+='     <h4>'+item.Recompensa.nombre+'</h4>';
            html_data+='  </div>';
            html_data+='</li>';
                    
            jQuery("#list_recompensa_patro").append(html_data);
    	});
        
        jQuery("#list_recompensa_patro").promise().done(function() {
            $(this).find("li:last img").load(function(){
                //ocultamos loading
                $.mobile.loading( 'hide' );
            });
        });
	});
}


function getEntradasByCarrousel(){
    var parent = jQuery("#info_general");
    $.getJSON(BASE_URL_APP+'entradas/mobileGetEntradas', function(data) {
        if(data){
            parent.find(".m-item.clone").remove();
            //mostramos loading
            $.mobile.loading('show');
            
            var entradas = data.items;
           	$.each(entradas, function(index, item) {
                var clone = parent.find(".m-item:first").clone(true);
                
                if(item.Usuario){
                    clone.find(".usuario_title").html(item.Usuario.title);
                    clone.find(".descripcion").html(item.Entrada.title);
                    clone.find(".buttom_ir_perfil").find("a").attr("href", "perfil_deportivo.html?usuario_id="+item.Entrada.usuario_id).show();
                    clone.find(".like_cash").css("display", "block");
                }else{
                    clone.find(".usuario_title").html(item.Entrada.title);
                    clone.find(".descripcion").html(item.Entrada.texto);
                }
                clone.find(".entrada_imagen").attr("src", BASE_URL_APP+'img/home/'+item.Entrada.imagen);
                clone.css("display", "inline-block");
                clone.addClass("clone");
                
           	    parent.find(".m-carousel-inner").append(clone);
                if(index == 0){
                    parent.find(".m-carousel-controls").append('<a href="#" data-slide="'+(index+2)+'" class="m-active">'+(index+2)+'</a>');
                }else{
                    parent.find(".m-carousel-controls").append('<a href="#" data-slide="'+(index+2)+'">'+(index+2)+'</a>');
                }
            });
            
            parent.find(".m-carousel-inner").promise().done(function() {
                parent.find(".m-carousel-controls").show();
                parent.find('.m-carousel').carousel();
                //ocultamos loading
                $.mobile.loading( 'hide' );
            });
        } 
    });
}

//OBTENEMOS LAS ACTIVIDADES EN PATROCINALOS
function getActividades() {
    $.getJSON(BASE_URL_APP+'actividades/mobileGetActividades', function(data) {
        $('#lista_actividades li').remove();
        if(data.items){
             //mostramos loading
             $.mobile.loading( 'show' );
            
             var actividades = data.items;
             $.each(actividades, function(index, actividad) {
                html='<li>';
                html+='<div class="recorte">';
                html+='<img src="'+BASE_URL_APP+'img/Usuario/169/'+actividad.Actividade.usuario_imagen+'"/>';
                html+='</div>';
                html+='<div class="content_descripcion left">';
                html+='<h4 class="ui-li-heading">';
                if(actividad.Actividade.usuario_imagen == "gustafoto"){
                    html+='A <b>'+actividad.Actividade.usuario_title+'</b>';
                }else{
                    html+='<b>'+actividad.Actividade.usuario_title+'</b>';
                }
                html+='</h4>';
                html+='<p class="ui-li-desc">'+actividad.Actividade.texto_descripcion+'</p>';
                html+='</div>';
                html+='</li>';
                                
                $('#lista_actividades').append(html);
             });
             
             $('#lista_actividades').listview('refresh');
            
             $('#lista_actividades').find("li:last img").load(function() {
                //ocultamos loading
                $.mobile.loading( 'hide' );
             });
        }
    });
}

//OBTENEMOS LOS DATOS DEL PERFIL DE UN DEPORTISTA EN ESPECIFICO
function loadPerfilDeportista(me, usuario_id){
    
    var parent = jQuery("#perfil_deportivo");
    $.getJSON(BASE_URL_APP + 'usuarios/mobileGetPerfilDeportista?me=' + me + '&usuario_id='+usuario_id, function(data){
        if(data.item){
            
            //mostramos loading
            $.mobile.loading( 'show' );
            
            var data_item = data.item;
            
            //verifica si el deportista logeado ya es seguidor del deportista x
            if(data_item.Usuario.soy_su_seguidor){
                parent.find("#seguir_deportista").find(".ui-btn-text").text("Dejar de seguir");
                parent.find("#seguir_deportista").removeClass("seguir");
                parent.find("#seguir_deportista").addClass("dejar_seguir");
            }
            
            parent.find(".imagen_user").attr("src", BASE_URL_APP+'img/Usuario/169/'+data_item.Usuario.imagen);
            
            if(data_item.Usuario.urlfacebook){
                var element = parent.find(".link_red_social a.facebook");
                element.attr("href", data_item.Usuario.urlfacebook);
                element.attr("onclick", "window.open(this.href,'_system'); return false;");
            }
            if(data_item.Usuario.twitter){
                var element = parent.find(".link_red_social a.twitter");
                element.attr("href", data_item.Usuario.twitter);
                element.attr("onclick", "window.open(this.href,'_system'); return false;");
            }
            
            parent.find(".nombre_user").text(data_item.Usuario.title);
            parent.find(".deporte span").text(data_item.Usuario.deporte_nombre).parent().show();
            
            if(data_item.Crowfunding !=""){
                parent.find(".dias_finalizar").find("i").text(data_item.Crowfunding.dias_restantes);
                parent.find(".dias_finalizar").show();
                parent.find(".patrociname span").text(data_item.Crowfunding.titulo).parent().show();
                parent.find(".necesito_para span").text(data_item.Crowfunding.paraque_necesito).parent().show();
                parent.find(".cuanto_necesito").find(".monto").text(data_item.Crowfunding.monto);
                parent.find(".cuanto_necesito").show();
                parent.find(".recaudado").find(".monto").text(data_item.Crowfunding.total_recaudado);
                parent.find(".recaudado").show();
                parent.find(".progress").find(".porcentaje").css("width", data_item.Crowfunding.porcentaje_recaudado+"%").parent().show();
                parent.find(".numero_porcentaje span").text(data_item.Crowfunding.porcentaje_recaudado).parent().show();                
            }
            
            parent.promise().done(function() {
                $(this).find(".imagen_user").load(function(){
                    //ocultamos loading
                    $.mobile.loading( 'hide' );
                });
            });
            
            if(data_item.MisComentariosdeMuro != ""){
                
                //borramos todos los items clonados
                parent.find(".list_comentarios > li.cloned").remove();
                
                //mostramos loading
                $.mobile.loading( 'show' );
                var comentarios_muros = data_item.MisComentariosdeMuro;
                $.each(comentarios_muros, function(index, comentario_muro) {
                    if(comentario_muro.mensaje != ""){
                        var clone = parent.find(".list_comentarios").find("li:first").clone(true);
                        clone.find(".img_avatar").attr("src", BASE_URL_APP+'img/Usuario/169/'+comentario_muro.usuario_imagen);
                        clone.find(".nombre_usuario").html(comentario_muro.usuario_title);
                        clone.find(".fecha_publicacion").html(comentario_muro.fecha);
                        
                        var element_comentario = clone.find(".comentario");
                        element_comentario.html(comentario_muro.mensaje);
                        openOnWindow(element_comentario, '_system');
                        
                        clone.addClass("cloned");
                        clone.css("display", "block");
                        
                        parent.find(".list_comentarios").append(clone);
                    }
                });
                
                parent.find(".list_comentarios").listview('refresh');
                parent.find(".list_comentarios").promise().done(function() {
                    $(this).find("li:last").find("img").load(function(){
                        //ocultamos loading
                        $.mobile.loading( 'hide' );
                    });
                });
            }
            
            //Actualizamos los datos para realizar la aportacion
            var form_pago = parent.find("#formulario_pago_individual"); 
            form_pago.find("#imagen_deportista").attr("src", BASE_URL_APP+'img/Usuario/169/'+data_item.Usuario.imagen);
            form_pago.find(".nombre_deportista").text(data_item.Usuario.title);
            form_pago.find("#crowd_id").val(data_item.Crowfunding.id);
        }
    });
}

//INICIAMOS LOS EVENTO SEGUIR, PATROCINAR DEPORTISTA
function loadEventPerfilDeportista(element, me, to_usuario_id){
    $(element).find("#seguir_deportista").click(function(){
        
        if($(this).hasClass("seguir")){
            //mostramos loading
            $.mobile.loading( 'show' );
            $.getJSON(BASE_URL_APP + 'amigos/mobileSeguirDeportista?me=' + me + "&to_usuario_id=" + to_usuario_id, function(data){
                if(data.success){
                    $(element).find("#seguir_deportista").find(".ui-btn-text").text("Dejar de seguir");
                    $(element).find("#seguir_deportista").removeClass("seguir");
                    $(element).find("#seguir_deportista").addClass("dejar_seguir");
                    //ocultamos loading
                    $.mobile.loading( 'hide' );
                }else{
                    showAlert("Ocurrio un error", "Error", "Aceptar");
                }
            });
        }else if($(this).hasClass("dejar_seguir")){
            dejarSeguirDeportista(element, me, to_usuario_id);
        }
        
        return false;
    });
    
    //PAGO MEDIANTE PAYPAL Y TPV
    form_pago = $(element).find("#formulario_pago_individual"); 
    //START PAYPAL
    form_pago.find("a.pago_paypal, a.pago_tpv_4B").off('click').on("click", function(){
        var elem = $(this);
        var pago_monto = form_pago.find("#pago_monto").val();
        var pago_termino = form_pago.find("#pago_termino").is(":checked") ? true : false;
        
        if($.trim(pago_monto) != "" && (parseInt(pago_monto) > 0)){
            if(isLogin()){
                
                //PAGO PAYPAL
                if(elem.attr("lang") == "PAYPAL"){
                    $.ajax({
                        data: $(form_pago).serialize(),
                        type: "POST",
                        url: BASE_URL_APP+'aportaciones/mobileAddAportacion/'+ me + "/PAYPAL",
                        dataType: "html",
                        success: function(data){
                            
                            //ocultamos el loading
                            $.mobile.loading('hide');
                            var result = $.parseJSON(data);
                            
                            if(result.aportacion_realizada){
                                //Cerramos el popup
                                $("#popupPatrocinar").popup("close");
                                
                                var url_pago = result.url_redirect_pago;
                                window.plugins.childBrowser.showWebPage(url_pago, { showLocationBar : false }); 
                                window.plugins.childBrowser.onLocationChange = function(loc){ procesoPago(loc, me); }; // When the ChildBrowser URL changes we need to track that
                            }else{
                                showAlert(result.error_alcanzado, "Error", "Aceptar");
                            }
                        },
                        beforeSend : function(){
                            //mostramos loading
                            showLoadingCustom('Verificando datos...');
                        }
                    });
                
                //PAGO TPV
                }else if(elem.attr("lang") == "TPV"){
                    $.ajax({
                        data: $(form_pago).serialize(),
                        type: "POST",
                        url: BASE_URL_APP+'aportaciones/mobileAddAportacion/'+ me + "/TPV",
                        dataType: "html",
                        success: function(data){
                            
                            //ocultamos el loading
                            $.mobile.loading('hide');
                            var result = $.parseJSON(data);
                            
                            if(result.aportacion_realizada){
                                //Cerramos el popup
                                $("#popupPatrocinar").popup("close");
                                
                                var url_pago = result.url_redirect_pago;
                                var params = result.params;
                                var site_url = BASE_URL_APP+'aportaciones/mobileRedireccionamientoTPV/?url='+url_pago+'&ref='+params.ref+'&store='+params.store+'&idioma='+params.idioma;
                                //window.location = site_url;
                                window.plugins.childBrowser.showWebPage(site_url, { showLocationBar : false });
                                window.plugins.childBrowser.onLocationChange = function(loc){ procesoPagoTPV(loc); }; // When the ChildBrowser URL changes we need to track that
                            }else{
                                showAlert(result.error_alcanzado, "Error", "Aceptar");
                            }
                        },
                        beforeSend : function(){
                            //mostramos loading
                            showLoadingCustom('Verificando datos...');
                        }
                    });
                }
            }else{
                showAlert("Por favor vuelva a logearse he intente de nuevo", "Aviso", "Aceptar");
            }
        }else{
            showAlert("Por favor!, introduzca un monto valido.", "Aviso", "Aceptar");
            form_pago.find("#pago_monto").val("");
        }
    });
    //END PAYPAL
}

//DEJAR DE SEGUIR A UN DEPORTISTA
function dejarSeguirDeportista(element, me, to_usuario_id){
    //mostramos loading
    $.mobile.loading( 'show' );
    $.getJSON(BASE_URL_APP + 'amigos/mobileDejarSeguirDeportista?me=' + me + '&to_usuario_id=' + to_usuario_id, function(data){
        if(data.success){
            $(element).find("#seguir_deportista").find(".ui-btn-text").text("Seguir");
            $(element).find("#seguir_deportista").removeClass("dejar_seguir");
            $(element).find("#seguir_deportista").addClass("seguir");
            //ocultamos loading
            $.mobile.loading( 'hide' );
        }else{
            showAlert("Ocurrio un error", "Error", "Aceptar");
        }
    });
}

//CONTROLAMOS LAS DISTINTAS RESPUESTAS AL MOMENTO DE REALIZAR EL PAGO
function procesoPago(loc, usuario_id){
    
    var url_callback = BASE_URL_APP + 'aportaciones/mobileAddAportacion/' + usuario_id + '/';
    if (loc.indexOf(url_callback + "?") >= 0) {
        
        // Parse the returned URL
        var token, payer_id = '';
        var params = loc.substr(loc.indexOf('?') + 1);
         
        params = params.split('&');
        for (var i = 0; i < params.length; i++) {
            var y = params[i].split('=');
            if(y[0] === 'PayerID') {
                payer_id = y[1];
            }
            //Obtenemos el token generado
            if(y[0] === 'token') {
                token = y[1];
            }
        }
        
        //controlamos si es que se realizo el pago correctamete, porque tambien puede cancelarlo
        if(payer_id != '')
        {
            //Cerramos el childBrowser
            window.plugins.childBrowser.close();
            
            //Actualizamos la aportacion
            $.ajax({
                data: "token="+token,
                type: "POST",
                url: BASE_URL_APP+'aportaciones/mobileUpdateAportacion/PAYPAL',
                dataType: "html",
                success: function(data){
                    
                    //ocultamos el loading
                    $.mobile.loading('hide');
                    var result = $.parseJSON(data);
                    
                    if(result.update_success){
                        //Aqui debemos mostrar un popup con el texto de agradecimiento, por ahora solo un mensaje
                        showAlert("Aportacion realizada con exito", "Aviso", "Aceptar");
                    }else{
                        showAlert(result.error_alcanzado, "Error", "Aceptar");
                    }
                },
                beforeSend : function(){
                    //mostramos loading
                    showLoadingCustom('Guardando aportacion...');
                }
            });
        }else{
            //Cerramos el childBrowser
            window.plugins.childBrowser.close();
            showAlert("Su aportacion fue cancelada", "Error", "Aceptar");
        }
        
    }else {
        // todo
    }
}

//CONTROLAMOS LAS DISTINTAS RESPUESTAS AL MOMENTO DE REALIZAR EL PAGO POR TPV
function procesoPagoTPV(loc){
    //Exiten 3 tipos de estados en el cual se mueve el pago para realizar la transaccion
    //aceptadaconfirmadortodotpvokpasarela -> Coloca el pago si todo esta bine en estado "pagado"
    //denegada -> error al momento de realizar el pago
    //vuelve -> Significa que ser hizo correctamente el pago
    
    //Controlamos 2 casos de estados de transaccion "denegada y vuelve"
    
    var url_callback_denegada = BASE_URL_APP + 'aportaciones/denegada/';
    var url_callback_vuelve = BASE_URL_APP + 'aportaciones/vuelve/';
    
    if (loc.indexOf(url_callback_vuelve + "?") >= 0) {
        
        // Parse the returned URL
        var token = '';
        var params = loc.substr(loc.indexOf('?') + 1);
         
        params = params.split('&');
        for (var i = 0; i < params.length; i++) {
            var y = params[i].split('=');
            if(y[0] === 'pszPurchorderNum') {
                token = y[1];
            }
        }
        
        //controlamos si es que se realizo el pago correctamete, porque tambien puede cancelarlo
        if(token != '')
        {
            //Cerramos el childBrowser
            window.plugins.childBrowser.close();
            
            //Verificamos si la aportacion fue pagada
            $.ajax({
                data: "token="+token,
                type: "POST",
                url: BASE_URL_APP+'aportaciones/mobileVerificarAportacion',
                dataType: "html",
                success: function(data){
                    
                    //ocultamos el loading
                    $.mobile.loading('hide');
                    var result = $.parseJSON(data);
                    
                    if(result.aportacion_pagada){
                        //Aqui debemos mostrar un popup con el texto de agradecimiento, por ahora solo un mensaje
                        showAlert("Aportacion realizada con exito", "Aviso", "Aceptar");
                    }else{
                        showAlert(result.error_alcanzado, "Error", "Aceptar");
                    }
                },
                beforeSend : function(){
                    //mostramos loading
                    showLoadingCustom('Verificando aportacion...');
                }
            });
        }else{
            //Cerramos el childBrowser
            window.plugins.childBrowser.close();
            showAlert("Su aportacion fue denegada", "Error", "Aceptar");
        }
        
    }else if (loc.indexOf(url_callback_denegada + "?") >= 0) {
        //Cerramos el childBrowser
        window.plugins.childBrowser.close();
        showAlert("Su aportacion fue denegada", "Error", "Aceptar");
        
    }else{
        // todo
    }
}