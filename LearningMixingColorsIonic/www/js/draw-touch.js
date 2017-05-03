var colores = [255, 0, 0, 1];
var lastX = 0;
var lastY = 0;
var mixval = 0.8;
var Pincel;
var radio = 13;
var drawingCanvas;
var context;
var dist;
var goma = false;
var lapiz = false;
var marginTop = 44;
var colorMix1 = [255,255,255,1];
var colorMix2 = [255,255,255,1];
var colorMixRes = [255,255,255];
var contador = 0;
// 0 = normal, 1 = straw
var mode = 0;
var colorAnterior = [255, 0, 0, 1];
$(document).ready(function (e) {

  initialiseUI();

  window.addEventListener('orientationchange', lockOrientation, true);
  //$('#canvasFondo').attr('width', $(window).width());
  $('#canvas').attr('width', $(window).width());

  var height = parseInt($('#Cabecera').css('padding-top')) + parseInt($('#Cabecera').css('padding-bottom'));
  var height2 = parseInt($('#Tabs').css('padding-top')) + parseInt($('#Tabs').css('padding-bottom'));

  /* $('#canvasFondo').attr('height', $(window).height() - $('ion-header-bar').height() - height - $('#Tabs').height() - height2);
  $('#canvasFondo').css('top', marginTop + 'px'); */
  $('#canvas').attr('height', $(window).height() - $('ion-header-bar').height() - height - $('#Tabs').height() - height2);
  $('#canvas').css('top', marginTop + 'px');

  $('#ventana-paleta').attr('bottom', '34px');
  $('ion-content').removeClass();

  drawingCanvas = document.getElementById('canvas');
  var c = document.getElementById("canvasFondo");
  //var contextL = c.getContext("2d");
  /* contextL.rect(20, 20, 150, 100);
  contextL.stroke(); */
  if (drawingCanvas.getContext) {
    context = drawingCanvas.getContext('2d');
    context.lineJoin = 'round';
    context.lineCap = 'round';
    Pincel = [];
    drawingCanvas.addEventListener("touchstart", onDown, false);
  }

});

function lockOrientation(e) {
  if (window.orientation == -90) {
    document.getElementById('orient').className = 'orientright';
  }
  if (window.orientation == 90) {
    document.getElementById('orient').className = 'orientleft';
  }
  if (window.orientation == 0) {
    document.getElementById('orient').className = '';
  }
}

function initialiseUI() {
  $("#but1").click(function (e) {

  });
  $("#but1").mousedown(function (e) {
    $(this).css("backgroundColor", '#999');
  });
  $("#but1").mouseup(function (e) {
    $(this).css("backgroundColor", '#666');
    context.clearRect(0, 0, $(window).width(), $(window).height());
  });
}


function HexToR(h) {
  return parseInt((cutHex(h)).substring(0, 2), 16)
};
function HexToG(h) {
  return parseInt((cutHex(h)).substring(2, 4), 16)
};
function HexToB(h) {
  return parseInt((cutHex(h)).substring(4, 6), 16)
};
function cutHex(h) {
  return (h.charAt(0) == "#") ? h.substring(1, 7) : h
}

function onDown(e) {
  //Evitamos que haga el comportamiento por defecto
  e.preventDefault();
  //Guardamos la Y y la X de donde ha tocado el usuario
  lastX = e.touches[0].pageX;
  lastY = e.touches[0].pageY - marginTop;
  //Añadimos los eventos para cuando mueva el pincel y termine de moverlo
  document.addEventListener("touchmove", onMove, false);
  document.addEventListener("touchend", onUp, false);
  //Guardo los colores en variables auxiliares
  var rt = colores[0];
  var gt = colores[1];
  var bt = colores[2];
  var at = colores[3];

  dist = radio;
  //Añadimos las cerdas al array
  Pincel = {
    dx: dist,
    dy: dist,
    colour: [rt, gt, bt, at]
  };
  console.log("Me he pulsado");
}

function onMove(e) {
  //Evitamos que haga el comportamiento por defecto
  e.preventDefault();
  //Guardamos la Y y la X de donde ha tocado el usuario
  var xp = e.touches[0].pageX;
  var yp = e.touches[0].pageY - marginTop;
  //A la distancia actual le sumamos la distancia que debería recorrer con respecto al ángulo que debería aparecer
  /*//Y obtenemos la localización a pintar
  console.log("LastX: " + lastX + " LastY: " + lastY);
  console.log("xp: " + xp + " yp: " + yp);*/
  // var xp2 = xp+((xp-lastX)/**5*/);
  //var yp2 = yp+((yp-lastY)/**5*/);
  //var xp2=xp+Pincel.dx;
  // var yp2=yp+Pincel.dy;
  //Obtenemos el pixel situado en xp2 y yp2 de la imágen que está actualmente pintada
  var xp2 = xp;
  var yp2 = yp;

  if (xp > lastX)
    xp2 += Pincel.dx;
  else if (xp < lastX)
    xp2 -= Pincel.dx;

  if (yp > lastY)
    yp2 += Pincel.dy;
  else if (yp < lastY)
    yp2 -= Pincel.dy;

  var imageData = context.getImageData(xp2, yp2, 1, 1);
  var pixel = imageData.data;


  //Creamos una imágen temporal y un pixel
  var tmpData = context.createImageData(1, 1);
  var tmpPixel = tmpData.data;
  //Comprobamos el alpha del pixel si es 0 es que no se ha pintado nada y establezo el valor al pixel con el color
  if (pixel[0] === 0 && pixel[1] === 0 && pixel[2] === 0) {
    /*pixel[0] = Pincel.colour[0];
     pixel[1] = Pincel.colour[1];
     pixel[2] = Pincel.colour[2];
     pixel[3] = Pincel.colour[3];*/
    /*pixel[0] = colores[0];
    pixel[1] = colores[1];
    pixel[2] = colores[2];
    pixel[3] = colores[3];*/
    Pincel.colour[0] = colores[0];
    Pincel.colour[1] = colores[1];
    Pincel.colour[2]= colores[2];
    Pincel.colour[3] = colores[3];
  }
  // console.log('R: ' + pixel[0] + ' G: ' + pixel[1] + ' B: ' + pixel[2]);
  // console.log('RA: ' + colorAnterior[0] + ' GA: ' + pixel[1] + ' BA: ' + pixel[2]);
  //Mezclamos el color de la cerda con el color del pixel con un factor mixval


 /* if (colorAnterior[0] != pixel[0])
    var r = mix(Pincel.colour[0], pixel[0], mixval);
  else*/
    r = Pincel.colour[0];

  /*if (colorAnterior[1] != pixel[1])
    var g = mix(Pincel.colour[1], pixel[1], mixval);
  else*/
    g = Pincel.colour[1];

 /* if (colorAnterior[2] != pixel[2])
    var b = mix(Pincel.colour[2], pixel[2], mixval);
  else*/
    b = Pincel.colour[2];

  /*if (colorAnterior[3] != pixel[3])
    var a = mix(Pincel.colour[3], pixel[3], mixval);
  else*/
    a = Pincel.colour[3];
/*
  colorAnterior[0] = pixel[0];
  colorAnterior[1] = pixel[1];
  colorAnterior[2] = pixel[2];
  colorAnterior[3] = pixel[3];*/
  //El color que se obtiene lo guardamos en la cerda actual y en el pixel temporal

  //console.log('R: ' + pixel[0] + ' G: ' + pixel[1] + ' B: ' + pixel[2]);
  /*console.log('MIXR: ' + r + ' MIXG: ' + g + ' MIXB: ' + b);
  console.log('PR: ' + Pincel.colour[0] + ' PG: ' + Pincel.colour[1] + ' PB: ' + Pincel.colour[2]);*/
  //  HAY QUE ARREGLARLO PORQUE SIN ESTO LO CONSIGUE PERO SE VE MAL PORQUE NO MANTIENE EL COLOR
  Pincel.colour[0] = r;
  Pincel.colour[1] = g;
  Pincel.colour[2] = b;
  Pincel.colour[3] = a;

  tmpPixel[0] = r;
  tmpPixel[1] = g;
  tmpPixel[2] = b;
  tmpPixel[3] = a;
  //Creamos un path con el color del pixel temporal con tamaño de línea de 1 desde la posición inicial
  context.beginPath();
  context.strokeStyle = 'rgba( ' + tmpPixel[0] + ', ' + tmpPixel[1] + ', ' + tmpPixel[2] + ', ' + tmpPixel[3] + ')';
  context.lineWidth = 1;
  context.moveTo(lastX, lastY);
  if (goma) {
    //context.clearRect(xp, yp, radio, radio);
	/*
	context.arc(xp, yp, radio, 0, 2 * Math.PI, false);
    //context.clip();
    context.clearRect(xp - radio - 1, yp - radio - 1, radio * 2 + 2, radio * 2 + 2);*/
	
	context.globalCompositeOperation = 'destination-out';
    context.beginPath();
    context.arc(xp, yp, radio, 0, 2 * Math.PI, false);
    context.fill();
    context.restore();
	
  } else if (lapiz) {
	context.globalCompositeOperation = 'source-over';
	//context.globalCompositeOperation = 'lighter';
    context.lineWidth = radio;
    context.lineTo(xp, yp);
    context.stroke();
  } else {

  }
  //Guardamos la posición por la que nos habíamos quedado para empezar desde ahí
  lastX = xp;
  lastY = yp;
}
//Terminamos de pintar y quitamos los listener y las posiciones por donde continuar
function onUp(e) {
  lastX = 0;
  lastY = 0;

  document.removeEventListener("touchmove", onMove, false);
  document.removeEventListener("touchend", onUp, false);
}

function mix(colour1, colour2, mv) {
  var val = 0;
  /*if (goma)
    val = 255;
  else if (lapiz)
    val = (colour1 + colour2) / 2;
  else
    val = colour1 * mv + colour2 * (1 - mv);
*/

	//val = colour1 * mv + colour2 * (1 - mv);
	val = (colour1 + colour2) / 2;
  return val;
}

function dif(pos1, pos2) {
  if (pos1 > pos2)
    return pos1 - pos2;

  return pos2 - pos1;
}
function to_image() {
  var canvas = document.getElementById("canvas");
  var image = canvas.toDataURL();

  var aLink = document.createElement('a');
  var evt = document.createEvent("HTMLEvents");
  evt.initEvent("click");
  aLink.download = 'image.png';
  aLink.href = image;
  aLink.dispatchEvent(evt);
  /*var canvas = $("#canvas");
   //document.getElementById("theimage").src = canvas.toDataURL();
   Canvas2Image.saveAsPNG(canvas);*/
}

function seleccionaPaleta() {
  if ($('#ventana-paleta').hasClass("Paleta-Hidden"))
    $('#ventana-paleta').removeClass('Paleta-Hidden');
  else
    $('#ventana-paleta').addClass('Paleta-Hidden');
}

function setColor(color) {
  colores[0] = HexToR(color);
  colores[1] = HexToG(color);
  colores[2] = HexToB(color);
  colores[3] = 1;

  lapiz = true;
  goma = false;
  
  $('#ventana-paleta').addClass('Paleta-Hidden');


}

function setRadius(radioPincel) {
  lapiz = false;
  radio = radioPincel;
  $('#ventana-pincel').addClass('Paleta-Hidden');
}

function seleccionaPincel() {
  if ($('#ventana-pincel').hasClass("Paleta-Hidden"))
    $('#ventana-pincel').removeClass('Paleta-Hidden');
  else
    $('#ventana-pincel').addClass('Paleta-Hidden');
}

function seleccionaLapiz() {
  lapiz = !lapiz;
  goma = false;
}

function seleccionaGoma() {
  goma = !goma;
  lapiz = false;
}

function chooseColor(color){
	if(contador%2 == 0)
	{
		colorMix1[0] = HexToR(color);
		colorMix1[1] = HexToG(color);
		colorMix1[2] = HexToB(color);
		colorMix1[3] = 1;
		
		$('#mix1').css("background-color", color);
		  
	}else{
		colorMix2[0] = HexToR(color);
		colorMix2[1] = HexToG(color);
		colorMix2[2] = HexToB(color);
		colorMix2[3] = 1;
		
		$('#mix2').css("background-color", color);
	}
	
	contador++;
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r,g,b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
function auxiliar(){
	chooseColor(rgbToHex(Math.floor(colorMixRes[0]),Math.floor(colorMixRes[1]),Math.floor(colorMixRes[2])));
}
function mixColors(){
	
	var mixValue = 0.8;
	colorMixRes[0] = mix(colorMix1[0], colorMix2[0], mixValue);
	colorMixRes[1] = mix(colorMix1[1], colorMix2[1], mixValue);
	colorMixRes[2] = mix(colorMix1[2], colorMix2[2], mixValue);
	
	
	$('#resultado').css("background-color",rgbToHex(Math.floor(colorMixRes[0]),Math.floor(colorMixRes[1]),Math.floor(colorMixRes[2])));
	$('#color-Mezcla').css("background-color",rgbToHex(Math.floor(colorMixRes[0]),Math.floor(colorMixRes[1]),Math.floor(colorMixRes[2])));
	//$('#color-Mezcla').prop('onclick',null).off('click');
	//$('#color-Mezcla').click(chooseColor("'" + rgbToHex(Math.floor(colorMixRes[0]),Math.floor(colorMixRes[1]),Math.floor(colorMixRes[2])) + "'"));
	//$('#color-Mezcla').attr("onclick","caca('" + rgbToHex(Math.floor(colorMixRes[0]),Math.floor(colorMixRes[1]),Math.floor(colorMixRes[2])) + "')");
	//$('#color-Mezcla').setAttribute('onclick',"caca('" + rgbToHex(Math.floor(colorMixRes[0]),Math.floor(colorMixRes[1]),Math.floor(colorMixRes[2])) + "')");
	//$("#foo > div").length
	var colorMezcla = document.getElementById('color-Mezcla');
	colorMezcla.addEventListener("touchend",auxiliar, false);
	//colorMezcla.attr("onclick",chooseColor("'" + rgbToHex(Math.floor(colorMixRes[0]),Math.floor(colorMixRes[1]),Math.floor(colorMixRes[2])) + "'"));
	
	//$('#color-Mezcla').unbind('click');
	
	//$('#color-Mezcla').click(chooseColor(rgbToHex(Math.floor(colorMixRes[0]),Math.floor(colorMixRes[1]),Math.floor(colorMixRes[2]))));
	
	//$('#resultado').css("background-color",rgbToHex(colorMix1[0],colorMix1[1],colorMix1[2]));
	//$('#resultado').css("background-color",colorMix1);
}



