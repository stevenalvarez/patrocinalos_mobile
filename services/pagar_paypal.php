<?php
include 'config.php';
include 'functions.php';
require('paypal/paypal.php');

error_reporting(E_ALL);
ini_set("display_errors", 0);

$precio = $_POST['precio'];
$cantidad = $_POST['cantidad'];

    $paypal = new paypal();

    //$nvpstr = "&L_NAME0=aportacion+a+Jhonny+Esteban+Alvarez+Villazante&L_AMT0=150&L_QTY0=1&MAXAMT=150&AMT=150&ITEMAMT=150&TAXAMT=0&ReturnUrl=http%3A%2F%2Flocalhost%3A80%2Fpatrocinalos_red_social%2Faplicacion%2Faportaciones%2Fadd%2F%3FcurrencyCodeType%3DEUR%26paymentType%3DSale&CANCELURL=http%3A%2F%2Flocalhost%3A80%2Fpatrocinalos_red_social%2Faplicacion%2Faportaciones%2Fadd%2F%3FpaymentType%3DSale&CURRENCYCODE=EUR&PAYMENTACTION=Sale";
    //$nvpstr = "&L_NAME0=aportacion+a+Angel+S%C3%A1nchez+Flores&L_AMT0=$precio&L_QTY0=1&MAXAMT=$precio&AMT=$precio&ITEMAMT=$precio&TAXAMT=0&ReturnUrl=http%3A%2F%2Flocalhost%3A80%2Fpatrocinalos_red_social%2Faplicacion%2Faportaciones%2Fadd%2F%3FcurrencyCodeType%3DEUR%26paymentType%3DSale&CANCELURL=http%3A%2F%2Flocalhost%3A80%2Fpatrocinalos_red_social%2Faplicacion%2Faportaciones%2Fadd%2F%3FpaymentType%3DSale&CURRENCYCODE=EUR&PAYMENTACTION=Sale";
    //$nvpstr = "&L_NAME0=aportacion+a+David+Prada&L_AMT0=2&L_QTY0=1&MAXAMT=2&AMT=2&ITEMAMT=2&TAXAMT=0&ReturnUrl=http%3A%2F%2Flocalhost%3A80%2Fpatrocinalos_red_social%2Faplicacion%2Faportaciones%2Fadd%2F%3FcurrencyCodeType%3DEUR%26paymentType%3DSale&CANCELURL=http%3A%2F%2Flocalhost%3A80%2Fpatrocinalos_red_social%2Faplicacion%2Faportaciones%2Fadd%2F%3FpaymentType%3DSale&CURRENCYCODE=EUR&PAYMENTACTION=Sale";
    
    //$nvpstr = "&L_NAME0=aportacion+a+David+Prada&L_AMT0=1&L_QTY0=1&MAXAMT=1&AMT=1&ITEMAMT=1&TAXAMT=0&ReturnUrl=http%3A%2F%2Fwww.patrocinalos.com%3A80%2Fpago_realizado%2F%3FcurrencyCodeType%3DEUR%26paymentType%3DSale&CANCELURL=http%3A%2F%2Fwww.patrocinalos.com%3A80%2Faportaciones%2Fadd%2F%3FpaymentType%3DSale&CURRENCYCODE=EUR&PAYMENTACTION=Sale";
    $nvpstr = "&L_NAME0=aportacion+a+David+Prada&L_AMT0=$precio&L_QTY0=1&MAXAMT=$precio&AMT=$precio&ITEMAMT=$precio&TAXAMT=0&ReturnUrl=http%3A%2F%2Fwww.patrocinalos.com%3A80%2Fpago_realizado%2F%3FcurrencyCodeType%3DEUR%26paymentType%3DSale&CANCELURL=http%3A%2F%2Fwww.patrocinalos.com%3A80%2Faportaciones%2Fadd%2F%3FpaymentType%3DSale&CURRENCYCODE=EUR&PAYMENTACTION=Sale";
    $resArray = $paypal->hash_call("SetExpressCheckout",$nvpstr);
    $ack = strtoupper($resArray["ACK"]);
	$token = urldecode($resArray["TOKEN"]);
	$payPalURL = PAYPAL_URL.$token;
    echo $payPalURL;

?>