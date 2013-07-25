
/************************************ BIND EVENT *******************************************************/

$(document).bind('pageinit', function(){
    $( "#panel_menu" ).panel({
        beforeopen: function( event, ui ) {}
    });
    $( "#panel_menu" ).panel({
        close: function( event, ui ) {}
    });
	$("#panel_menu").on("panelbeforeopen", function (event, ui) {
	    $(this).find(".close_menu").css("top", "-20px");
        $(".footer_menu").find("a.icon_menu").hide();
    });
	$("#panel_menu").on("panelclose", function (event, ui) {
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
        var user = COOKIE;
        getEntradasByCarrousel();
    }else{
        redirectLogin();
    }
});

//INFO GENERAL CUANDO SE MUESTRA LA PAGINA
$(document).on('pageshow', "#info_general", function(){
    jQuery('.m-carousel').carousel();
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
            html_data+='    <span class="coments_count">Comentarios <b>(100)</b></span>';
            html_data+='    <span class="like_count">Me gusta <b>(100)</b></span>';
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
       
       if(item.comentario.img!=null || item.comentario.img!="")
        jQuery("#detail_post .image").html('<img src="'+BASE_URL_APP+'img/comentarios/800/'+item.comentario.img+'" alt="blog"/>');
    });
}

/*OBTENEMOS LOS DATOS PARA COMENTAR UNA ENTRADA ESPECÍFICA DEL BLOG DE LA HOME*/
function getInfoBlogComment(id_blog){
    $.getJSON(BASE_URL_APP+'comentarios/mobileGetComment/'+id_blog, function(data) {
        var item = data.item;
       jQuery("#detail_post .day_month").text(item.comentario.dia);
       jQuery("#detail_post .month").text(item.comentario.mes);
       jQuery("#detail_post .day_week").text(item.comentario.dia_semana);
       jQuery("#detail_post .title_post").text(item.usuario.title);
       
    });
}

/* OBTENEMOS LA ENTRADAS PARA LA HOME */
function getEntradasByCarrousel(){
    $.getJSON(BASE_URL_APP+'entradas/mobileGetEntradas', function(data) {
        if(data){
            //mostramos loading
            $.mobile.loading('show');
            
            var entradas = data.items;
           	$.each(entradas, function(index, item) {
           	    console.log(item.Entrada.id);
            });            
            
            //ocultamos loading
            $.mobile.loading( 'hide' );
        } 
    });
}