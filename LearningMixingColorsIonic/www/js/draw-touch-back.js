var colores = [255,0,0,1];
var lastX = 0;
var lastY = 0;
var smoothness = 0;
var numCerdasPincel = 80;
var mixval = 0.8;
var cerdasPincel;
var radio = 10;
var drawingCanvas;
var context;
var dist;
var angulo;
var i;
var colorAnterior = [255,0,0,1];
var radioAnterior;
var goma = false;
var lapiz = false;
var marginTop=44;
// 0 = normal, 1 = straw
var mode = 0;
var myLayeredCanvas;

$(document).ready(function(e) {

	initialiseUI();

	window.addEventListener('orientationchange', lockOrientation,true);
  $('#canvasFondo').attr('width',$(window).width());
	$('#canvas').attr('width',$(window).width());

	var height =  parseInt($('#Cabecera').css('padding-top')) + parseInt($('#Cabecera').css('padding-bottom'));
	var height2 =  parseInt($('#Tabs').css('padding-top')) + parseInt($('#Tabs').css('padding-bottom') );

  $('#canvasFondo').attr('height',$(window).height() - $('ion-header-bar').height() - height - $('#Tabs').height() - height2);
  $('#canvasFondo').css('top',marginTop+'px');
	$('#canvas').attr('height',$(window).height() - $('ion-header-bar').height() - height - $('#Tabs').height() - height2);
	$('#canvas').css('top',marginTop+'px');

	$('#ventana-paleta').attr('bottom','34px');
  $('ion-content').removeClass();

  drawingCanvas = document.getElementById('canvas');
  var c=document.getElementById("canvasFondo");
  var contextL=c.getContext("2d");
  contextL.rect(20,20,150,100);
  contextL.stroke();

	if(drawingCanvas.getContext)
	{
		context = drawingCanvas.getContext('2d');
		context.lineJoin = 'round';
		context.lineCap = 'round';
    cerdasPincel = [];
    drawingCanvas.addEventListener("touchstart",onDown,false);
	}

});

function lockOrientation(e)
{
	if(window.orientation == -90)
	{
		document.getElementById('orient').className = 'orientright';
	}
	if(window.orientation == 90)
	{
		document.getElementById('orient').className = 'orientleft';
	}
	if(window.orientation == 0)
	{
		document.getElementById('orient').className = '';
	}
}

function initialiseUI()
{
	$("#but1").click(function(e) {

    });
	$("#but1").mousedown(function(e){
			$(this).css("backgroundColor", '#999');
	});
	$("#but1").mouseup(function(e){
		$(this).css("backgroundColor", '#666');
		 context.clearRect(0,0,$(window).width(),$(window).height());
	});
}


function HexToR(h) { return parseInt((cutHex(h)).substring(0,2),16) };
function HexToG(h) { return parseInt((cutHex(h)).substring(2,4),16) };
function HexToB(h) { return parseInt((cutHex(h)).substring(4,6),16) };
function cutHex(h) { return (h.charAt(0)=="#") ? h.substring(1,7) : h}

function onDown(e)
{
  //Evitamos que haga el comportamiento por defecto
	e.preventDefault();
  //Guardamos la Y y la X de donde ha tocado el usuario
	lastX = e.touches[0].pageX;
	lastY = e.touches[0].pageY-marginTop;
  //Añadimos los eventos para cuando mueva el pincel y termine de moverlo
	document.addEventListener("touchmove",onMove,false);
	document.addEventListener("touchend",onUp,false);
  //Establecemos el numero de cercas con respecto al radio del pincel por una constante
	numCerdasPincel = radio*5;
	cerdasPincel = [];
  //Guardo los colores en variables auxiliares
	var rt = colores[0];
	var gt = colores[1];
	var bt = colores[2];
  var at = colores[3];

	for (i = 0; i < numCerdasPincel; ++i)
	{
	  //Calculamos la distancia entre cerdas aleatoriamente con respecto al radio
		dist = Math.random() * radio;
		//Calculamos el angulo de la cerda con el que se va a usar para pintarla aleatoriamente
		angulo = Math.random() * 2 * Math.PI;
    //Añadimos las cerdas al array
		cerdasPincel.push({
			ang: angulo,
			ang2: 0,
			dist: dist,
			rand: Math.random()*(radio*2)-radio,
			dx: Math.sin(angulo)*dist,
			dy: Math.cos(angulo)*dist,
			oldX: Math.sin(angulo)*dist + e.clientX,
			oldY: Math.cos(angulo)*dist + e.clientY,
			colour:[rt,gt,bt,at]
		});
	}

}

function onMove(e)
{
  //Evitamos que haga el comportamiento por defecto
	e.preventDefault();
  //Guardamos la Y y la X de donde ha tocado el usuario
	var xp = e.touches[0].pageX;
	var yp = e.touches[0].pageY-marginTop;
	//Con esto calculamos la distancia que ha recorrido desde la última posición en X en Y hasta la actual xp,yp
  //Le quitamos la última posición de donde se encontraba y lo elevamos al cuadrado
	var x2 = Math.pow(xp - lastX, 2);
	var y2 = Math.pow(yp - lastY, 2);
  //Calculamos la velocidad de movimiento haciendo la raiz a la X^2 y la Y^2
	var speed = Math.round(  Math.sqrt(x2 + y2 )) ;
	//Una vez calculada la distancia que la cogemos como velocidad de movimiento
  //Por cada una de las Cerdas del pincel
    for (i = 0; i < numCerdasPincel; i++) {
      //Guardamos la distancia que calculamos con la distancia que tienen que van a tener cada cerda
      //menos la distancia calculada anteriormente por un factor de 0.06 y si diese un número negativo ponemos 0
      var distancia = cerdasPincel[i].dist - (speed * 0.06) < 0 ? 0 : cerdasPincel[i].dist - (speed * 0.06);
      //A la distancia actual le sumamos la distancia que debería recorrer con respecto al ángulo que debería aparecer
      //Y obtenemos la localización a pintar
      var xp2 = xp + cerdasPincel[i].dx;
      var yp2 = yp + cerdasPincel[i].dy;
      //Obtenemos el pixel situado en xp2 y yp2 de la imágen que está actualmente pintada
      var imageData = context.getImageData(xp2, yp2, 1, 1);
      var pixel = imageData.data;

      //Creamos una imágen temporal y un pixel
      var tmpData = context.createImageData(1, 1);
      var tmpPixel = tmpData.data;
      //Comprobamos el alpha del pixel si es 0 es que no se ha pintado nada y establezo el valor al pixel con el color
      if (pixel[3] === 0) {
        pixel[0] = cerdasPincel[i].colour[0];
        pixel[1] = cerdasPincel[i].colour[1];
        pixel[2] = cerdasPincel[i].colour[2];
        //pixel[3] = 0.05;
      }
      //Mezclamos el color de la cerda con el color del pixel con un factor mixval
      var r = mix(cerdasPincel[i].colour[0], pixel[0], mixval);
      var g = mix(cerdasPincel[i].colour[1], pixel[1], mixval);
      var b = mix(cerdasPincel[i].colour[2], pixel[2], mixval);
      var a = cerdasPincel[i].colour[3];

      //El color que se obtiene lo guardamos en la cerda actual y en el pixel temporal
      cerdasPincel[i].colour[0] = r;
      cerdasPincel[i].colour[1] = g;
      cerdasPincel[i].colour[2] = b;
      cerdasPincel[i].colour[3] = a;

      tmpPixel[0] = r;
      tmpPixel[1] = g;
      tmpPixel[2] = b;
      //tmpPixel[3] = a;
      //Creamos un path con el color del pixel temporal con tamaño de línea de 1 desde la posición inicial
      context.beginPath();
      context.strokeStyle = 'rgba( ' + tmpPixel[0] + ', ' + tmpPixel[1] + ', ' + tmpPixel[2] + ', ' + a + ')';
      context.lineWidth = 1;
      //Nos movemos en la imágen a la posición inicial de la cerda donde debería pintarse la línea
      context.moveTo(cerdasPincel[i].oldX, cerdasPincel[i].oldY);
      if (goma) {
        context.clearRect(xp, yp, radio, radio);
      } else if (lapiz) {
        //Cogemos la primera cerda del bucle y nos salimos del bucle para optimizar
        if (i == 0) {
          context.moveTo(lastX, lastY);
          context.lineWidth = radio;

          context.lineTo(xp, yp);
          context.stroke();

          cerdasPincel[i].oldX = xp2;
          cerdasPincel[i].oldY = yp2;

          //Guardamos la posición por la que nos habíamos quedado para empezar desde ahí
          lastX = xp;
          lastY = yp;
          return;
        }
      } else {
        cerdasPincel[i].dx = Math.sin(cerdasPincel[i].ang) * distancia;
        cerdasPincel[i].dy = Math.cos(cerdasPincel[i].ang) * distancia;
        //Creamos la línea hasta el destino
        context.lineTo(xp2, yp2);
        context.stroke();
        //Asignamos el destino como la posición inicial siguiente de la cerda actual
        cerdasPincel[i].oldX = xp2;
        cerdasPincel[i].oldY = yp2;
      }
    }

  //Guardamos la posición por la que nos habíamos quedado para empezar desde ahí
	lastX = xp;
	lastY = yp;
}
//Terminamos de pintar y quitamos los listener y las posiciones por donde continuar
function onUp(e)
{
	lastX = 0;
	lastY = 0;

	document.removeEventListener("touchmove",onMove,false);
	document.removeEventListener("touchend",onUp,false);
}

function mix(colour1, colour2, mv)
{
  var val=0;
	if(goma)
		val = 255;
	else if(lapiz)
		val = colour1;
	else
    val = colour1 * mv + colour2 * (1 - mv);

	return val;
}

function dif(pos1, pos2)
{
	if (pos1 > pos2)
		return pos1 - pos2;

	return pos2 - pos1;
}
function to_image(){
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

function seleccionaPaleta()
{
	if($('#ventana-paleta').hasClass( "Paleta-Hidden" ))
		$('#ventana-paleta').removeClass('Paleta-Hidden');
	else
		$('#ventana-paleta').addClass('Paleta-Hidden');
}

function setColor(color){
	colores[0] = HexToR(color);
	colores[1] = HexToG(color);
	colores[2] = HexToB(color);
  colores[3] = 1;

	$('#ventana-paleta').addClass('Paleta-Hidden');


}

function setRadius(radioPincel){
	//if(!lapiz){
    lapiz=false;
		radio = radioPincel;
    numCerdasPincel=80;
		$('#ventana-pincel').addClass('Paleta-Hidden');
	//}
}

function seleccionaPincel()
{
	if($('#ventana-pincel').hasClass( "Paleta-Hidden" ))
		$('#ventana-pincel').removeClass('Paleta-Hidden');
	else
		$('#ventana-pincel').addClass('Paleta-Hidden');
}

function seleccionaLapiz(){
  lapiz=!lapiz;
  numCerdasPincel=1;
}

function seleccionaGoma(){

  goma=!goma;
}



