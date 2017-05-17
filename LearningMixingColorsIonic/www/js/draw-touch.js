var colores = [255, 0, 0, 1];
var lastX = 0;
var lastY = 0;
var mixval = 0.8;
var Pincel;
var radio = 13;
var drawingCanvas;
var context;
var dist;
var cubo = false;
var deseleccionar = false;
var goma = false;
var lapiz = true;
var marginTop = 44;
var colorMix1 = [255,255,255,1];
var colorMix2 = [255,255,255,1];
var colorMixRes = [255,255,255];
var contador = 0;
var contadores =[{cont:0,color:"",porcentaje:0},{cont:0,color:"",porcentaje:0},{cont:0,color:"",porcentaje:0},{cont:0,color:"",porcentaje:0}];
var mode = 0;
$(document).ready(function (e) {

  initialiseUI();
  $("#color-seleccionado").css("background",rgbToHex(colores[0],colores[1],colores[2]));
  window.addEventListener('orientationchange', lockOrientation, true);
  //$('#canvasFondo').attr('width', $(window).width());
  $('#canvas').attr('width', $(window).width());

  var height = parseInt($('#Cabecera').css('padding-top')) + parseInt($('#Cabecera').css('padding-bottom'));
  var height2 = parseInt($('#Tabs').css('padding-top')) + parseInt($('#Tabs').css('padding-bottom'));

  $('#container').attr('height', $(window).height());
  $('#container').attr('width', $(window).width());
  $('#canvas').attr('height', $(window).height() - $('ion-header-bar').height() - height - $('#Tabs').height() - height2);
  $('#canvas').css('top', marginTop + 'px');
  $('#ventana-paleta').attr('bottom', '34px');
  $('ion-content').removeClass();
  $('#ventana-mezcla').addClass('Hidden');
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
}
function matchStartColor(pixelPos)
	{
	  var r = colorLayer.data[pixelPos];	
	  var g = colorLayer.data[pixelPos+1];	
	  var b = colorLayer.data[pixelPos+2];

	  return (r == startR && g == startG && b == startB);
	}

	function colorPixel(pixelPos)
	{
	  colorLayer.data[pixelPos] = fillColorR;
	  colorLayer.data[pixelPos+1] = fillColorG;
	  colorLayer.data[pixelPos+2] = fillColorB;
	  colorLayer.data[pixelPos+3] = 255;
	}
function onMove(e) {
  //Evitamos que haga el comportamiento por defecto
  e.preventDefault();
  //Guardamos la Y y la X de donde ha tocado el usuario
  var xp = e.touches[0].pageX;
  var yp = e.touches[0].pageY - marginTop;
  //A la distancia actual le sumamos la distancia que debería recorrer con respecto al ángulo que debería aparecer
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
    Pincel.colour[0] = colores[0];
    Pincel.colour[1] = colores[1];
    Pincel.colour[2]= colores[2];
    Pincel.colour[3] = colores[3];
  }
  //Mezclamos el color de la cerda con el color del pixel con un factor mixval
    r = Pincel.colour[0];
    g = Pincel.colour[1]; 
    b = Pincel.colour[2];
    a = Pincel.colour[3];

  Pincel.colour[0] = r;
  Pincel.colour[1] = g;
  Pincel.colour[2] = b;
  Pincel.colour[3] = a;

  tmpPixel[0] = r;
  tmpPixel[1] = g;
  tmpPixel[2] = b;
  tmpPixel[3] = a;
  
  if(!cubo)
  {
	  if (goma) {
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
	  }
	  
  }else{
	  var pixelStack = [[xp, yp]];
	  var canvas = document.getElementById('canvas');
		var canvasWidth = canvas.width;
		var canvasHeight = canvas.height;

	while(pixelStack.length)
	{
	  var newPos, x, y, pixelPos, reachLeft, reachRight;
	  newPos = pixelStack.pop();
	  x = newPos[0];
	  y = newPos[1];
	  
	  pixelPos = (y*canvasWidth + x) * 4;
	  while(y-- >= drawingBoundTop && matchStartColor(pixelPos))
	  {
		pixelPos -= canvasWidth * 4;
	  }
	  pixelPos += canvasWidth * 4;
	  ++y;
	  reachLeft = false;
	  reachRight = false;
	  while(y++ < canvasHeight-1 && matchStartColor(pixelPos))
	  {
		colorPixel(pixelPos);

		if(x > 0)
		{
		  if(matchStartColor(pixelPos - 4))
		  {
			if(!reachLeft){
			  pixelStack.push([x - 1, y]);
			  reachLeft = true;
			}
		  }
		  else if(reachLeft)
		  {
			reachLeft = false;
		  }
		}
		
		if(x < canvasWidth-1)
		{
		  if(matchStartColor(pixelPos + 4))
		  {
			if(!reachRight)
			{
			  pixelStack.push([x + 1, y]);
			  reachRight = true;
			}
		  }
		  else if(reachRight)
		  {
			reachRight = false;
		  }
		}
				
		pixelPos += canvasWidth * 4;
	  }
	}
	context.putImageData(colores, 0, 0);
	  
	
	  }

  //Creamos un path con el color del pixel temporal con tamaño de línea de 1 desde la posición inicial
  context.beginPath();
  context.strokeStyle = 'rgba( ' + tmpPixel[0] + ', ' + tmpPixel[1] + ', ' + tmpPixel[2] + ', ' + tmpPixel[3] + ')';
  context.lineWidth = 1;
  context.moveTo(lastX, lastY);
  
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

function mix() {
  var val = 0;
  var c=[0,0,0];
  var resColor = [0,0,0,0];

  var flag=true;
  var arrayPorcentajes = [];
  for(j=0;j<4;j++)
    if(contadores[j].porcentaje!=0)
      arrayPorcentajes.push(contadores[j].porcentaje);

  for(t=0;t<arrayPorcentajes.length && flag;t++)
    if(t+1<arrayPorcentajes.length)
      flag = arrayPorcentajes[t]==arrayPorcentajes[t+1];

  for(i=0;i<4;i++){
    if(contadores[i].porcentaje>0){
      c[0]=HexToR(contadores[i].color);
      c[1]=HexToG(contadores[i].color);
      c[2]=HexToB(contadores[i].color);

      var co = rgbToCmyk(c[0],c[1],c[2]);

      if(!flag) {
        resColor[0] += co[0] * (contadores[i].porcentaje / 100);
        resColor[1] += co[1] * (contadores[i].porcentaje / 100);
        resColor[2] += co[2] * (contadores[i].porcentaje / 100);
        resColor[3] += co[3] * (contadores[i].porcentaje / 100);
      }else{
        resColor[0] += co[0];
        resColor[1] += co[1];
        resColor[2] += co[2];
        resColor[3] += co[3];
      }
    }
  }
 /* var color1 = rgbToCmyk(colour1[0],colour1[1],colour1[2]);
  var color2 = rgbToCmyk(colour2[0],colour2[1],colour2[2]);
  */
/*
  resColor[0] = color1[0]+color2[0];
  resColor[1] = color1[1]+color2[1];
  resColor[2] = color1[2]+color2[2];
  resColor[3] = color1[3]+color2[3];
*/
  val = cmykToRgb(resColor[0],resColor[1],resColor[2],resColor[3]);
	//val = (colour1 + colour2) / 2;
  return val;
}

function putImage()
{
  var canvas1 = document.getElementById("canvas");        
  if (canvas1.getContext) {
     var ctx = canvas1.getContext("2d");                
     var myImage = canvas1.toDataURL("image/png");      
  }                          

}

function saveBase64AsFile(base64, fileName) {

    var link = document.createElement("a");

    link.setAttribute("href", base64);
    link.setAttribute("download", fileName);
    link.click();
}  

/**
 * Convert a base64 string in a Blob according to the data and contentType.
 * 
 * @param b64Data {String} Pure base64 string without contentType
 * @param contentType {String} the content type of the file i.e (image/jpeg - image/png - text/plain)
 * @param sliceSize {Int} SliceSize to process the byteCharacters
 * @see http://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
 * @return Blob
 */
function b64toBlob(b64Data, contentType, sliceSize) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;

        var byteCharacters = atob(b64Data);
        var byteArrays = [];

        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);

            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            var byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

      var blob = new Blob(byteArrays, {type: contentType});
      return blob;
}

/**
 * Create a Image file according to its database64 content only.
 * 
 * @param folderpath {String} The folder where the file will be created
 * @param filename {String} The name of the file that will be created
 * @param content {Base64 String} Important : The content can't contain the following string (data:image/png[or any other format];base64,). Only the base64 string is expected.
 */
function savebase64AsImageFile(folderpath,filename,content,contentType){
    // Convert the base64 string in a Blob
    var DataBlob = b64toBlob(content,contentType);
    alert("Starting to write the file :3");
	alert(filename);
    console.log("Starting to write the file :3");
    
    window.resolveLocalFileSystemURL(folderpath, function(dir) {
        console.log("Access to the directory granted succesfully");
		dir.getFile(filename, {create:true}, function(file) {
            console.log("File created succesfully.");
            file.createWriter(function(fileWriter) {
                console.log("Writing content to file");
                fileWriter.write(DataBlob);
            }, function(){
                alert('Unable to save file in path '+ folderpath);
            });
		});
    });
}



function to_image() {
  /*var canvas = document.getElementById("canvas");
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
   /*var image = canvas.toDataURL();
   var canvas = document.createElement( 'canvas' );
            var ctx = canvas.getContext( '2d' );
            void ctx.drawImage( this, 0, 0, img.width, img.height);
            var dataURI = canvas.toDataURL().replace( /data:image\/png;base64,/, '' );
            function successCallback( result ) {
                q.resolve( 'file:///' + result );
            }
            function failureCallback( err ) {
                console.error( err );
                q.reject( err );
            }
            cordova.exec( successCallback, failureCallback, "Canvas2ImagePlugin", "saveImageDataToLibrary", [dataURI] );
			*/
		/*	
		var ctx = canvas1.getContext("2d");                
		var myImage = canvas1.toDataURL("image/png");
		 var params = {data: myImage, prefix: 'myPrefix_', format: 'JPG', quality: 80, mediaScanner: true};
		window.imageSaver.saveBase64Image(params,
        function (filePath) {
          alert('File saved on ' + filePath);
        },
        function (msg) {
          alert(msg);
        }
      );*//*
		window.canvas2ImagePlugin.saveImageDataToLibrary(
        function(msg){
            console.log(msg);
        },
        function(err){
            console.log(err);
        },
        document.getElementById('canvas')
    );
	
	var canvas = document.getElementById("canvas"); 
	var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");  // here is the most important part because if you dont replace you will get a DOM 18 exception.

	//download(image);
	//saveBase64AsFile(image,"imagen.png");
	
//window.location.href=image; // it will save locally*/

	cordova.plugins.photoLibrary.requestAuthorization(
		  function () {
			// Retry
			
			 var canvas = document.getElementById("canvas"); 
			var image = canvas.toDataURL("image/png");//.replace("image/png", "image/octet-stream");  // here is the most important part because if you dont replace you will get a DOM 18 exception.

			
			alert(image);
			
				/** Process the type1 base64 string **/
			var myBaseString = image;

			// Split the base64 string in data and contentType
			var block = myBaseString.split(";");
			// Get the content type
			var dataType = block[0].split(":")[1];// In this case "image/png"
			// get the real base64 content of the file
			var realData = block[1].split(",")[1];// In this case "iVBORw0KGg...."
			
			alert(realData);
			// The path where the file will be created
			var folderpath = "file:///storage/emulated/0/";
			// The name of your file, note that you need to know if is .png,.jpeg etc
			var filename = "myimage.png";

			savebase64AsImageFile(folderpath,filename,realData,dataType);
			
			alert("Se ha guardado la imagen");
			
			
		  },
		  function (err) {
			console.log('Error in requestAuthorization: ' + err);

			// TODO: explain to user why you need the permission, and continue when he agrees
			//alert("Necesito los permisooos");

			// Ask user again
			self.requestAuthorization();

		  }, {
			read: true,
			write: true
		  }
		);
		
		
		
		
	
		
		
		

}

function seleccionaPaleta() {
  if ($('#ventana-paleta').hasClass("Hidden")) {
    $('#ventana-paleta').removeClass('Hidden').css("z-index",1);
    if (!$('#ventana-mezcla').hasClass("Hidden"))
      $('#ventana-mezcla').addClass('Hidden');
  }
  else {
    $('#ventana-paleta').addClass('Hidden').css("z-index", -1);
    $('#canvas').css("z-index", 1);
  }
}

function setColor(color) {
  colores[0] = HexToR(color);
  colores[1] = HexToG(color);
  colores[2] = HexToB(color);
  colores[3] = 1;

  lapiz = true;
  goma = false;
  $("#color-seleccionado").css("background",rgbToHex(colores[0],colores[1],colores[2]));
  $('#ventana-paleta').addClass('Hidden');


}

function setRadius(radioPincel) {
  lapiz = false;
  radio = radioPincel;
  $('#ventana-mezcla').addClass('Hidden');
}

function seleccionaMezcla() {
  if ($('#ventana-mezcla').hasClass("Hidden")) {
    $('#ventana-mezcla').removeClass('Hidden').css("z-index",1);
    $('#canvas').css("z-index",-1);
    if (!$('#ventana-paleta').hasClass("Hidden"))
      $('#ventana-paleta').addClass('Hidden');
  }
  else {
    $('#ventana-mezcla').addClass('Hidden').attr('height', 0).css("z-index",-1);
    $('#canvas').css("z-index", 1);
  }
}

function seleccionaLapiz() {
  lapiz = true;
  goma = false;
  cubo = false;
  if (!$('#ventana-mezcla').hasClass("Hidden"))
    $('#ventana-mezcla').addClass('Hidden').css("z-index", -1);

  if (!$('#ventana-paleta').hasClass("Hidden"))
    $('#ventana-paleta').addClass('Hidden').css("z-index",-1);
  $('#canvas').css("z-index", 1);
}

function seleccionaGoma() {
  goma = true;
  lapiz = false;
  cubo = false;
  if (!$('#ventana-mezcla').hasClass("Hidden"))
    $('#ventana-mezcla').addClass('Hidden');
  if (!$('#ventana-paleta').hasClass("Hidden"))
    $('#ventana-paleta').addClass('Hidden');
}

function chooseColor(elem,color){
  deseleccionar = false;
  contadores[elem-1].cont++;
  contador++;
  switch (elem){
    case 1:
      if ($('#btMenos1').hasClass("Hidden"))
        $('#btMenos1').removeClass('Hidden');
      $("#color1").text(contadores[elem-1].cont);
      break;
    case 2:
      if ($('#btMenos2').hasClass("Hidden"))
        $('#btMenos2').removeClass('Hidden');
      $("#color2").text(contadores[elem-1].cont);
      break;
    case 3:
      if ($('#btMenos3').hasClass("Hidden"))
        $('#btMenos3').removeClass('Hidden');
      $("#color3").text(contadores[elem-1].cont);
      break;
    case 4:
      if ($('#btMenos4').hasClass("Hidden"))
        $('#btMenos4').removeClass('Hidden');
      $("#color-Mezcla").text(contadores[elem-1].cont);
      break;
  }
  actualizarMix(elem,color);
}
function actualizarMix(elem,color) {
  var porcentaje=0;
  var colorFinal;
  
  var arrayCont = [];
  if(!deseleccionar)
  {
	  $("#mix").empty();

	  for(i=0;i<4;++i) {
		if (contadores[i].cont !== 0) {
		  porcentaje = Math.floor((contadores[i].cont / contador) * 100);
		  contadores[i].porcentaje = porcentaje;
		  if (i === elem - 1) {
			colorFinal = color;
			contadores[i].color = color;
		  }
		  else
			colorFinal = contadores[i].color;

		  arrayCont.push({cont:contadores[i].cont,porcentaje:contadores[i].porcentaje, color: contadores[i].color});
		}
	  }

	  for(j=0;j<arrayCont.length;j++) {
		var html = "<div style=\"width: " + arrayCont[j].porcentaje + "%; text-align: center;float: left;height: 100%;position: relative;\">" +
		  "<div style=\"background-color: " + arrayCont[j].color + ";height: 85%;\"></div>" +
		  "<div class=\"color_percent\" style=\"color: rgb(0, 0, 0);height: 15%;\">" +  arrayCont[j].porcentaje + "%</div> ";

		if(arrayCont.length>1 && j<arrayCont.length-1)
		  html += "<i class='fa fa-plus-circle' aria-hidden='true' style='font-size: 10vw;z-index: 1;float: right;margin-right: -5px;position:absolute;right:-12px;top:25%;color:black;'></i></div>";

		$("#mix").append(html);
	  }
  }


}
function minusColor(elem) {
  var colorSeleccionado;
  if(contadores[elem-1].cont>0)
    contadores[elem-1].cont--;
  switch (elem){
    case 1:
      if(contadores[elem-1].cont===0)
        $('#btMenos1').addClass('Hidden');
      $("#color1").text(contadores[elem-1].cont);
      colorSeleccionado=rgbtohex($("#color1").css("background-color"));
      break;
    case 2:
      if(contadores[elem-1].cont===0)
        $('#btMenos2').addClass('Hidden');
      $("#color2").text(contadores[elem-1].cont);
      colorSeleccionado=rgbtohex($("#color2").css("background-color"));
      break;
    case 3:
      if(contadores[elem-1].cont===0)
        $('#btMenos3').addClass('Hidden');
      $("#color3").text(contadores[elem-1].cont);
      colorSeleccionado=rgbtohex($("#color3").css("background-color"));
      break;
    case 4:
      if(contadores[elem-1].cont===0)
        $('#btMenos4').addClass('Hidden');
      $("#color-Mezcla").text(contadores[elem-1].cont);
      colorSeleccionado=rgbtohex($("#color-Mezcla").css("background-color"));
      break;
  }
  contador--;
  actualizarMix(elem,colorSeleccionado);
}
function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r,g,b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
function auxiliar(){
	chooseColor(4,rgbToHex(Math.floor(colorMixRes[0]),Math.floor(colorMixRes[1]),Math.floor(colorMixRes[2])));

}
function mixColors(){

  deseleccionar = true;
	colorMixRes = mix(colorMix1,colorMix2);
  var colorResultante = rgbToHex(Math.floor(colorMixRes[0]),Math.floor(colorMixRes[1]),Math.floor(colorMixRes[2]));
	$('#resultado').css("background-color",colorResultante);
	
	if(colorResultante == "#000000")
	{
		$("#color-Mezcla").css("color","white!important");
	}
	$('#color-Mezcla').css("background-color",colorResultante);
  $('#resultado').click(function (e) {
    setColor(colorResultante);
    if (!$('#ventana-mezcla').hasClass("Hidden"))
      $('#ventana-mezcla').addClass('Hidden');
    $('#canvas').css("z-index", 1);
  });
  setColor(colorResultante);
	var colorMezcla = document.getElementById('color-Mezcla');
	colorMezcla.addEventListener("touchend",auxiliar, false);
	
	for(var elem = 1; elem < 5; elem++)
	{
		var contDelete = contadores[elem-1].cont
		for(var j = 0; j < contDelete; j++)
		{
			minusColor(elem);
		}
		
	}
  

}
function seleccionaCubo(){
	cubo = true;
	goma = false;
	lapiz = false;
	

}
function rgbToCmyk(r, g, b) {
  var c, m, y, k;
  r = r / 255;
  g = g / 255;
  b = b / 255;
  max = Math.max(r, g, b);
  k = 1 - max;
  if (k == 1) {
    c = 0;
    m = 0;
    y = 0;
  } else {
    c = (1 - r - k) / (1 - k);
    m = (1 - g - k) / (1 - k);
    y = (1 - b - k) / (1 - k);
  }
  return [ c, m, y, k];
}
function cmykToRgb(c, m, y, k) {
  var r, g, b;
  r = 255 - ((Math.min(1, c * (1 - k) + k)) * 255);
  g = 255 - ((Math.min(1, m * (1 - k) + k)) * 255);
  b = 255 - ((Math.min(1, y * (1 - k) + k)) * 255);
  return [ r, g,  b];
}
//Function to convert hex format to a rgb color
function rgbtohex(rgb){
  rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
  return (rgb && rgb.length === 4) ? "#" +
    ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
    ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
    ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
}



