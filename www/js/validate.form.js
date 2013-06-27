//Validar deporte seleccionado
jQuery.validator.addMethod("seleccionarDeporte", function(value, element) {    
    return jQuery.trim(value) != "";
}, "Debe seleccionar un deporte");

var response;
$.validator.addMethod("validarEmail", function(value, element) {
    $.ajax({
        type: "POST",
        url: serviceURL + "get_validar_email.php",
        data: "email="+value,
        dataType:"html",
     success: function(msg){
         msg = $.parseJSON(msg);
         var result = msg.success;
         response = ( result == true ) ? false : true;
     }
 })
 return response;
}, "Este email ya est&aacute; registrado");

//Formulario de registro
function form_registro(){
    jQuery("#form_registro").validate({
        errorElement:'span',
    	rules: {
    		"usuario[nombre]": {
    			required: true,
    			minlength: 2
    		},
    		"usuario[apellido]": {
    			required: true,
    			minlength: 2
    		},
    		"usuario[email_register]": {
    			required: true,
    			email: true,
                validarEmail: true
    		},
    		"usuario[password_register]": {
    			required: true,
    			minlength: 5
    		},
    		"usuario[repetir_password]": {
    			required: true,
    			minlength: 5,
    			equalTo: "#usuario_email_password_register"
    		},
    		"usuario[deporte]": {
    			seleccionarDeporte: true
    		},
    		"usuario[terminos]": "required"
    	},
    	messages: {
    		"usuario[nombre]": {
    			required: "Por favor, introduzca su nombre",
    			minlength: "M&iacute;nimo de 2 caracteres"
    		},
    		"usuario[apellido]": {
    			required: "Por favor, introduzca su Apellido",
    			minlength: "M&iacute;nimo de 2 caracteres"
    		},
            "usuario[email_register]": {
    			required: "Por favor, introduzca su email",
    			email: "Direcci&oacute;n de email no v&aacute;lida"
    		},
    		"usuario[password_register]": {
    			required: "Por favor, ingrese su contrase&ntilde;a",
    			minlength: "M&iacute;nimo de 5 caracteres"
    		},
    		"usuario[repetir_password]": {
    			required: "Por favor, ingrese su contrase&ntilde;a",
    			minlength: "M&iacute;nimo de 5 caracteres",
    			equalTo: "Repita contrase&ntilde;a"
    		},
            "usuario[terminos]": "Por favor, acepte nuestros t&eacute;rminos"
    	}
    });
    
    //Submit form registro
    jQuery('#form_registro').submit(function() {
        /* start Fixed seleccionar deporte */
        var selector = jQuery('#form_registro').find("#select_deporte");
        var opcion_selected = selector.find("option:selected").html();
        var element = selector.prev(".ui-btn-inner").find(".ui-btn-text").find("span");
        element.removeClass()
        element.addClass("valid")
        element.text(opcion_selected);
        element.show();
        /* end Fixed seleccionar deporte */
        
        //Si todo el form es valido mandamos a registrar los datos
        if (jQuery(this).valid()) {
            saveData();
        }
      return false;
    });
}

function saveData(){
    alert("si");
    /*
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
    */        
}