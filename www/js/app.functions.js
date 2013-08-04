/************************************ FUNCTION PHONEGAP *******************************************************/

// A button will call this function
//
function getPhoto(source) {
  // Retrieve image file location from specified source
    navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 50, 
    destinationType: destinationType.FILE_URI,
    sourceType: source });
}

// Called when a photo is successfully retrieved
//
function onPhotoURISuccess(imageURI) {
  // Uncomment to view the image file URI 
  // console.log(imageURI);
  IMAGEURI = imageURI;

  // Get image handle
  //
  var pictureImage = document.getElementById('pictureImage');
  var img_url = document.getElementById("u_img_url_social");

  // Unhide image elements
  //
  pictureImage.style.display = 'inline-block';

  // Show the captured photo
  // The inline CSS rules are used to resize the image
  //
  pictureImage.src = imageURI;
  img_url.value = "";
}

// Called if something bad happens.
// 
function onFail(message) {
    mensaje = message == "no image selected" ? "no se selecciono ninguna imagen" : message;
    showAlert(mensaje, 'Aviso', 'Aceptar');
}

// UploadPhoto
//
function uploadPhoto(usuario_id, folder) {
    
    var options = new FileUploadOptions();
    options.fileKey = "file";
    options.fileName = IMAGEURI.substr(IMAGEURI.lastIndexOf('/')+1);
    options.mimeType = "image/jpeg";
    
    var params = new Object();
    params.folder = folder;
    params.usuario_id = usuario_id;
    
    options.params = params;
    options.chunkedMode = false;
    
    var ft = new FileTransfer();
    ft.upload(IMAGEURI, BASE_URL_APP + "usuarios/mobileUploadImagenDevice", function(r){
        // Callback success upload photo
        //
        //console.log("Code = " + r.responseCode);
        //console.log("Response = " + r.response);
        //console.log("Sent = " + r.bytesSent);
        
        var success = r.response;
        if(success){
            $.mobile.loading( 'hide' );
            success_registro();
        }else{
            error_registro('Ha ocurrido un error al momento de actualizar los datos del deportista!, por favor intente de nuevo');
        }
        
    }, function(error){
        //Callback error upload photo
        //
        //console.log("An error has occurred: Code = " + error.code);
        showAlert("Se ha producido un error al momento de subir la imagen desde el dispositivo", "Aviso", "Aceptar");
        
    }, options);
}

/************************************ FUNCTIONS APP *******************************************************/

//LLENAR DEPORTES PARA EL FORMULARIO DE REGISTRO
function llenarDeportes(){
	$.getJSON(BASE_URL_APP + 'deportes/mobileGetDeportes', function(data) {
		var deportes = data.items;
        var categoria = "";
        var html = "";
        $.each(deportes, function(index, deporte) {
            if(categoria != deporte.Deportecategoria.id_categoria){
                if(categoria != ""){
                    html+= "</optgroup>";
                }
                html+= "<optgroup label='"+htmlspecialchars_decode(deporte.Deportecategoria.nombre_categoria)+"'>";
                categoria = deporte.Deportecategoria.id_categoria;
            }
            html+= "<option value="+deporte.Deporte.id+">"+htmlspecialchars_decode(deporte.Deporte.nombre)+"</option>";
        });
        html+= "</optgroup>";
        
        //empty selector
        jQuery("#select_deporte").find("optgroup").remove();
        jQuery("#select_deporte").find("option").after(html);
	});
}

//INICIA LAS VALIDACIONES PARA EL FORMULARIO DE REGISTRO
function form_registro(){
    jQuery("#form_registro").validate({
        errorElement:'span',
    	rules: {
            "u_title": {
    			required: true,
    			minlength: 2
    		},
    		/*
            "u_nombre": {
    			required: true,
    			minlength: 2
    		},
    		"u_apellido": {
    			required: true,
    			minlength: 2
    		},
            */
    		"u_email_register": {
    			required: true,
    			email: true
    		},
    		"u_password_register": {
    			required: true,
    			minlength: 5
    		},
    		/*
                "u_repetir_password": {
        			required: true,
        			minlength: 5,
        			equalTo: "#u_password_register"
        		},
        		"u_deporte": {
        			seleccionarDeporte: true
        		},
        		"u_terminos": "required"
            */
    	},
    	messages: {
    		"u_title": {
    			required: "Por favor, introduzca su nombre y apellido <i></i>",
    			minlength: "M&iacute;nimo de 2 caracteres <i></i>"
    		},
    		/*"u_nombre": {
    			required: "Por favor, introduzca su nombre <i></i>",
    			minlength: "M&iacute;nimo de 2 caracteres <i></i>"
    		},
    		"u_apellido": {
    			required: "Por favor, introduzca su apellido <i></i>",
    			minlength: "M&iacute;nimo de 2 caracteres <i></i>"
    		},
            */
            "u_email_register": {
    			required: "Por favor, introduzca su email <i></i>",
    			email: "Direcci&oacute;n de email no v&aacute;lida <i></i>"
    		},
    		"u_password_register": {
    			required: "Por favor, ingrese su contrase&ntilde;a <i></i>",
    			minlength: "M&iacute;nimo de 5 caracteres <i></i>"
    		},
    		/*
                "u_repetir_password": {
        			required: "Por favor, ingrese su contrase&ntilde;a",
        			minlength: "M&iacute;nimo de 5 caracteres",
        			equalTo: "Repita contrase&ntilde;a"
        		},
                "u_terminos": "Por favor, acepte nuestros t&eacute;rminos"
            */
    	}
    });
    
    //Submit form registro
    jQuery('#form_registro').submit(function() {
        /* start Fixed seleccionar deporte */
        var selector_deporte = jQuery('#form_registro').find("#select_deporte");
        var opcion_selected = selector_deporte.find("option:selected").html();
        var element = selector_deporte.prev(".ui-btn-inner").find(".ui-btn-text").find("span");
        element.removeClass()
        element.addClass("valid")
        element.text(opcion_selected);
        element.show();
        /* end Fixed seleccionar deporte */
        
        /* start Fixed seleccionar tipo usuario (individual, seguidor, empresa)*/
        var selector_tipo_u = jQuery('#form_registro').find("#select_tipo_u");
        var opcion_selected = selector_tipo_u.find("option:selected").html();
        var element = selector_tipo_u.prev(".ui-btn-inner").find(".ui-btn-text").find("span");
        element.removeClass()
        element.addClass("valid")
        element.text(opcion_selected);
        element.show();
        /* end Fixed seleccionar tipo usuario */
        
        $("#u_email_register").parent().removeClass("error_field_email");
        
        //Si todo el form es valido mandamos a registrar los datos
        if (jQuery(this).valid()) {
            //Mandamos a validar el mail
            var email = $.trim(document.getElementById("u_email_register").value);
            email = email + "\n\t";
            var success = validar_email(email);
            //Unicamente si el email no esta registrado mandamos a guardar
            if(success == false){
                
                $.ajax({
                    data: $("#form_registro").serialize(),
                    type: "POST",
                    url: BASE_URL_APP + 'usuarios/mobileNewRegistro',
                    dataType: "html",
                    success: function(data){
                        data = $.parseJSON(data);
                        var usuario_id = parseInt(data.item);
                        if(usuario_id){
                            //Si selecciono un imagen mandamos a guardar en la base de datos
                            var pictureImage = document.getElementById("pictureImage");
                            var img_url = document.getElementById("u_img_url_social");
                            if($(pictureImage).attr("src") != "" && $(img_url).val() == ""){
                                uploadPhoto(usuario_id, 'perfil');
                            }else{
                                success_registro();
                            }
                        }else{
                            error_registro('Ha ocurrido un error al momento de registrarse!, por favor intente de nuevo');
                        }
                    },
                    beforeSend : function(){
                        //mostramos loading
                        showLoadingCustom('Guardando datos...');
                    }                    
                });
            }
        }
      return false;
    });
}

//INICIA LAS VALIDACIONES PARA EL FORMULARIO DE ENVIO DE CODIGO DE VALIDACION - RECUPERAR PASSWORD
function form_codigovalidacion(element){
    var formulario = jQuery("#"+element); 
    formulario.validate({
        errorElement:'span',
    	rules: {
    		"u_email": {
    			required: true,
    			email: true
    		}
    	},
    	messages: {
            "u_email": {
    			required: "Por favor, introduzca su email <i></i>",
    			email: "Direcci&oacute;n de email no v&aacute;lida <i></i>"
    		}
    	}
    });
    
    //Submit form
    formulario.submit(function() {
        
        formulario.find("input[type='email']").parent().removeClass("error_field_email");
        
        //Si todo el form es valido mandamos
        if (jQuery(this).valid()) {
            $.ajax({
                data: formulario.serialize(),
                type: "POST",
                url: BASE_URL_APP + 'usuarios/mobileEnviarCodigoValidacion',
                dataType: "html",
                success: function(data){
                    $.mobile.loading( 'hide' );
                    
                    data = $.parseJSON(data);
                    if(data.success){
                        clear_form(element);
                        showAlert(data.mensaje, "Aviso", "Aceptar");
                    }else{
                        showAlert(data.mensaje, "Error", "Aceptar");
                    }
                },
                beforeSend : function(){
                    //mostramos loading
                    showLoadingCustom('Enviando codigo...');
                }
            });
        }
      return false;
    });
}

//INICIA LAS VALIDACIONES PARA EL FORMULARIO DE LOGIN
function form_login(){
    jQuery("#form_login").validate({
        errorElement:'span',
    	rules: {
    		"u_email": {
    			required: true,
    			email: true
    		},
    		"u_password": {
    			required: true,
    			minlength: 5
    		}
    	},
    	messages: {
            "u_email": {
    			required: "Por favor, introduzca su email <i></i>",
    			email: "Direcci&oacute;n de email no v&aacute;lida <i></i>"
    		},
    		"u_password": {
    			required: "Por favor, ingrese su contrase&ntilde;a <i></i>",
    			minlength: "M&iacute;nimo de 5 caracteres <i></i>"
    		},
    	}
    });
    
    //Submit form login
    jQuery('#form_login').submit(function() {
        
        //Si todo el form es valido mandamos a verificar los datos de acceso
        if (jQuery(this).valid()) {
            
            $.ajax({
                data: $("#form_login").serialize(),
                type: "POST",
                url: BASE_URL_APP + 'usuarios/mobileLogin',
                dataType: "html",
                success: function(msg){
                    $.mobile.loading( 'hide' );
                    msg = $.parseJSON(msg);
                    var success = msg.success;
                    var datas = msg.item;
                    if(success){
                        //verificamos si el usuario esta validado, 
                        //sino es un usuario registrado pero aun no validado
                        //entonces mostramos el campo para que meta su codigo de activacion
                        var validado = msg.validado;
                        if(validado){
                            var usuario = datas.Usuario;
                            var days = $("#u_remember_me").is(":checked") ? 365 : 1;
                            
                            //una vez logeado guardamos en cookies su datos importantes y lo llevamos a otra vista
                            createCookie("user", JSON.stringify(usuario), days);
                            
                            var goToPage =  "info_general.html";
                            if(REDIREC_TO != ''){
                                goToPage = REDIREC_TO;
                            }
                            $.mobile.changePage(goToPage, {transition: "fade"});
                        }else{
                            //mostramos el mensaje de que debe colocar el codigo de activacion para quedar activo en el sistema
                            $("#login_user").find(".msg_error").find("label").html("Usted no activo su cuenta, por favor coloque el c&oacute;digo de validaci&oacute;n");
                            $("#login_user").find(".msg_error").fadeIn("slow");
                            $("#login_user").find(".campo_codigo_validacion").show();
                        }
                    }else{
                        //mostramos el mensaje de login fallido
                        $("#login_user").find(".msg_error").fadeIn("slow");
                    }
                },
                beforeSend : function(){
            	    //mostramos loading
                    showLoadingCustom('Validando datos...');
                }
            });
        }
      return false;
    });
}

// REGISTRO SUCCESS
//
function success_registro(){
    $.mobile.loading( 'hide' );
    document.getElementById("form_registro").reset();
    $.mobile.changePage('#register_finalizado', {transition: "slide"});
}

// REGISTRO ERROR
//
function error_registro(msg){
    $.mobile.loading( 'hide' );
    showAlert(msg, 'Aviso', 'Aceptar');
}

// VALIDAR SI EL MAIL SE ENCUESTRA REGISTRADO
function validar_email(value){
    var response = false;
    jQuery.ajax({
        type: "POST",
        url: BASE_URL_APP + "usuarios/mobileValidarEmail",
        data: "email="+value,
        dataType:"html",
        async : false,
        cache: false,
        success: function(msg){
            $.mobile.loading( 'hide' );
            msg = $.parseJSON(msg);
            var result = msg.success;
            //response = ( result == true ) ? false : true;
            if(result){
                var input = jQuery("#u_email_register");
                input.parent().find("span.error").remove();
                input.parent().find("span.success").remove();
                input.after("<span class='error'>Este email ya est&aacute; registrado <i></i></span>");
                input.parent().find("span.error").css("color", "#671717");
                input.parent().find("span.error").css("font-weight", "bold");
                input.parent().find("span.error").fadeOut(8000);
                input.focus();
                response = true;
            }
        },
        beforeSend : function(){
    	    //mostramos loading
            showLoadingCustom('Validando Email...');
        }
    });
    
    return response;
}

function key_press(id){
    var element = $("#" + id).find("input[type='text'], input[type='email'], input[type='password']");
    element.bind('keyup blur', function(){
        if($(this).hasClass("valid")){
            $(this).parent().find("span.success").remove();
            if(($(this).attr("name") == "u_email_register") || $(this).attr("name") == "u_email"){
                $(this).parent().removeClass("error_field_email").addClass("valid_field");
            }else{
                $(this).parent().removeClass("error_field").addClass("valid_field");
            }
            $(this).after("<span class='success'><i></i></span>");
        
        }else if($(this).hasClass("error")){
            $(this).parent().find("span.success").remove();
            var chart = ($(this).attr("name") == "u_email_register") ? 12 : 10;
            if(($(this).attr("name") == "u_email_register") || ($(this).attr("name") == "u_email")){
                if(($(this).val()).length > chart){
                    $(this).parent().removeClass("valid_field").addClass("error_field_email");
                }else{
                    $(this).parent().removeClass("error_field_email");
                }
            }else{
                $(this).parent().removeClass("valid_field").addClass("error_field");
            }
        }
    });
}

function clear_form(form){
    $("#"+form).find("span.success").remove();
    document.getElementById(form).reset();
}

/* REGISTRO FACEBOOK FUNCTION */
//getLoginStatus
function getLoginStatus() {
    var connected = false;
    FB.getLoginStatus(function(response) {
        if (response.status == 'connected') {
            connected = true;
        }
    });
    
    return connected;
}

//loginFacebookConnect
function loginFacebookConnect() {
    if(FB_LOGIN_SUCCESS){
        showRegistroSocial("facebook");
    }else{
    	FB.login(function(response) {
    		if (response.authResponse) {
    		  
                FB_LOGIN_SUCCESS = true;
                
                //llenamos los datos name, email
                FB.api('/me', {
                    fields: 'id, name, email, picture'
                },function(response) {
                    if (response.error) { 
                       alert('get user datas failed ' + JSON.stringify(response.error));
                    }else{
                        var user = response;
                        $("#form_registro").find("#u_title").val(user.name);
                        $("#form_registro").find("#u_email_register").val(user.email);
                        
                        //ocultamos el loading...
                        $.mobile.loading( 'hide' );
                    }
                });
                
                //imagen del usuario
                FB.api("/me/picture?width=960",  function(response) {
                    if (response.error) { 
                       alert('get picture failed ' + JSON.stringify(response.error));
                    }else{
                        var picture = response;
                        $("#form_registro").find("#pictureImage").attr("src", picture.data.url).show();
                        $("#form_registro").find("#u_img_url_social").val(picture.data.url);
                    }
                });
                
                //mandamos al registro
                setTimeout(function(){
                    showRegistroSocial('facebook');
                    showLoadingCustom('Cargando datos...');
                }, 10);
                
    		} else {
                showAlert("User cancelled login or did not fully authorize.", 'Error Login', 'Aceptar');
    		}
    	}, {
    		scope : "email,offline_access,publish_stream,user_birthday,user_location,user_work_history,user_about_me,user_hometown"
    	});
    }
}

//loginTwitter
function loginTwitter() {
    if(TW_LOGIN_SUCCESS){
        showRegistroSocial("twitter");
    }else{
        Twitter.init();
    }
}

function showRegistroSocial(social){
    
    if(social == "facebook"){
        $("#register_user").find(".page span").html("REGISTRO CON FACEBOOK");
    }else if(social == "twitter"){
        $("#register_user").find(".page span").html("REGISTRO CON TWITTER");
    }
    
    $.mobile.changePage('#register_user', {transition: "slide"});
}

function isLogin(){
    var res = false;
    var cookie_user = $.parseJSON(readCookie("user"));
    if(cookie_user !== null){
        res = true;
        COOKIE = cookie_user;
    }else{
        REDIREC_TO = window.location.href;
    }
    return res;
}

function redirectLogin(){
    $.mobile.changePage('login_user.html', {transition: "fade", changeHash: false});
}

//Abrimos el enlace en un navegador del sistema (IOS|ANDROID)
//target: the target to load the URL in (String) (Optional, Default: "_self")
//_self - opens in the Cordova WebView if url is in the white-list, else it opens in the InAppBrowser 
//_blank - always open in the InAppBrowser 
//_system - always open in the system web browser/
function openOnWindow(element, target){
	element.find('a').click( function() {
	   window.open($(this).attr('href') , target );
	   return false;
	});
}

/*FUNCION PARA CAPTURAR UNA FOTO MEDIANTE LA CAMARA DEL DISPOSITIVO*/
//preview:elemento html donde se carga la foto de preview, 
//name:input hidden para guardar el nombre y enviarlo para guardarlo en la DB
//destination:path en el servidor donde se guarda el archivo
function capturePhoto(preview,name,destination){
    
}

/*funccion para cerrar un modal*/
//thiss:link que cierra el modal
//status:para cerrar o mostrar un modal
function modalOpenHide(thiss,status){
    if(status=="hide")
        jQuery("#"+jQuery(thiss).attr("rel")).fadeOut("fast");
    else if(status=="show")
            jQuery("#"+jQuery(thiss).attr("rel")).fadeIn("fast");
}