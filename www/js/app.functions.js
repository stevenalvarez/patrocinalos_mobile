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
function uploadPhoto(id_usuario, folder) {
    //Asignamos el id del usuario para realizar otras operaciones
    ID_USUARIO = id_usuario;
    
    var options = new FileUploadOptions();
    options.fileKey = "file";
    options.fileName = IMAGEURI.substr(IMAGEURI.lastIndexOf('/')+1);
    options.mimeType = "image/jpeg";
    
    var params = new Object();
    params.folder = folder;
    
    options.params = params;
    options.chunkedMode = false;
    
    var ft = new FileTransfer();
    ft.upload(IMAGEURI, serviceURL + "upload_photo.php", function(r){
        // Callback success upload photo
        //
        //console.log("Code = " + r.responseCode);
        //console.log("Response = " + r.response);
        //console.log("Sent = " + r.bytesSent);
        
        //Mutiples opciones, la foto puede cargarse y despues realizar otras operaciones
        switch (folder)
        {
        case 'perfil':
          //Actuializamos su foto de perfil
          update_row('usuarios', 'imagen', r.response, 'id', ID_USUARIO);
          break;
        
        case 'galeria_foto':
          break;
        
        case 'galeria_video':
          break;
        }
        
    }, function(error){
        //Callback error upload photo
        //
        //console.log("An error has occurred: Code = " + error.code);
        showAlert("Se ha producido un error", "Aviso", "Aceptar");
        
    }, options);
}

/************************************ FUNCTIONS APP *******************************************************/

//LLENAR DEPORTES PARA EL FORMULARIO DE REGISTRO
function llenarDeportes(){
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
                //mostramos loading
                showLoadingCustom('Guardando datos...');
                                
                //$("#u_nombre").val($("#u_nombre").escape());
                //$("#u_apellido").val($("#u_apellido").escape());
                $("#u_title").val($("#u_title").escape());
                $.ajax({
                    data: $("#form_registro").serialize(),
                    type: "POST",
                    url: serviceURL + 'set_create_registro.php',
                    dataType: "html",
                    success: function(data){
                        data = $.parseJSON(data);
                        var id_usuario = parseInt(data.item);
                        if(id_usuario){
                            //Si selecciono un imagen mandamos a guardar en la base de datos
                            var pictureImage = document.getElementById("pictureImage");
                            var img_url = document.getElementById("u_img_url_social");
                            if($(pictureImage).attr("src") != "" && $(img_url).val() == ""){
                                uploadPhoto(id_usuario, 'perfil');
                            }else{
                                success_registro();
                            }
                        }else{
                            error_registro('Ha ocurrido un error al momento de registrarse!, por favor intente de nuevo');
                        }
                    }
                });
            }
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
        url: serviceURL + "get_validar_email.php",
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

// ACTUALIZAR UN CAMPO DE UNA TABLA
//
function update_row(tabla, campo, valor, condicion_campo, condicion_valor){
    jQuery.ajax({
        type: "POST",
        url: serviceURL + "set_update_data.php",
        data: { 'tabla': tabla, 'campo': campo, 'valor': valor, 'condicion_campo': condicion_campo, 'condicion_valor' : condicion_valor},
        dataType:"html",
        async : false,
        cache: false,
        success: function(data){
            data = $.parseJSON(data);
            $.mobile.loading( 'hide' );
            var success = data.item;
            if(success){
                success_registro();
            }else{
                error_registro('Ha ocurrido un error al momento de actualizar los datos del deportista!, por favor intente de nuevo');
            }
        }
    });
}

function key_press(){
    var element = $("#form_registro").find("input[type='text'], input[type='password']");
    element.bind('keyup blur', function(){
        if($(this).hasClass("valid")){
            $(this).parent().find("span.success").remove();
            if($(this).attr("id") == "u_email_register"){
                $(this).parent().removeClass("error_field_email").addClass("valid_field");
            }else{
                $(this).parent().removeClass("error_field").addClass("valid_field");
            }
            $(this).after("<span class='success'><i></i></span>");
        
        }else if($(this).hasClass("error")){
            $(this).parent().find("span.success").remove();
            if($(this).attr("id") == "u_email_register"){
                if(($(this).val()).length > 12){
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

function show_registro_social(social){
    
    if(social == "facebook"){
        $("#register_user").find(".page span").html("REGISTRO CON FACEBOOK");
    }else if(social == "twitter"){
        $("#register_user").find(".page span").html("REGISTRO CON TWITTER");
    }
    
    $.mobile.changePage('#register_user', {transition: "slide"});
}

function llenarDatosSocial(social){
    console.log("inicio");
    getLoginStatus();
    console.log("fin");
    
    console.log("inicio amigos");
    getMeFriends();
    console.log("fin amigos");
        
    if(social == "facebook"){
        console.log("facebook");
        if(FB_LOGIN_SUCCESS){
            console.log("esperamos");
            setTimeout(function(){
                show_registro_social(social);
                console.log("pasamos a registro");
            }, 1500);
        }else{
            erroLogin();
        }
    }else if(social == "twitter"){
        
    }
}

function erroLogin(){
    showAlert("User cancelled login or did not fully authorize.", 'Error', 'Aceptar');    
}