var clr = [255,0,0,1];
var lastX = 0;
var lastY = 0;
var smoothness = 0;
var numBristles = 80;
var mixval = 0.92;
var bristles;
var radius = 10;
var colour;
var drawingCanvas;
var context;
var colourPicker;
var cpcontext;
var dist;
var angle;
var i;

var modeButtons = [];

// 0 = normal, 1 = straw
var mode = 0;

$(document).ready(function(e) {
	
	initialiseUI();
	
	window.addEventListener('orientationchange', lockOrientation,true);
	
	$('#canvas').attr('width',$(window).width());
	//$('#canvas').attr('height',$(window).height());
	
	//- $('#Tabs').height()
	var height =  parseInt($('#Cabecera').css('padding-top')) + parseInt($('#Cabecera').css('padding-bottom'));
	var height2 =  parseInt($('#Tabs').css('padding-top')) + parseInt($('#Tabs').css('padding-bottom') );
	
	$('#canvas').attr('height',$(window).height() - $('ion-header-bar').height() - height - $('#Tabs').height() - height2);
	$('#canvas').css('top','44px');
	
	$('#ventana-paleta').attr('bottom','34px');
	
	//document.getElementById('canvas').setAttribute("width", window.innerWidth);
	//document.getElementById('canvas').setAttribute("height", window.innerHeight-220);
	
	
	
	drawingCanvas = document.getElementById('canvas');
	
	$('ion-content').removeClass();
	
	if(drawingCanvas.getContext)
	{
		context = drawingCanvas.getContext('2d');
		context.lineJoin = 'round';
		context.lineCap = 'round';
		
        bristles = [];
		//drawingCanvas.addEventListener("mousedown",onDown,false);
		
		//try {
			drawingCanvas.addEventListener("touchstart",onDown,false);
		//} catch (e){};
		
	}
	
	/*clr[0] = 255;
	clr[1] = 0;
	clr[2] = 0;
	clr[3] = 1;*/
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
	$('#control').css('width',$(window).width());
	
	//alert($(window).width());
	
	$('#mode0').css("backgroundColor", '#888');
	
	$('.modeButton').each(function(index) {
		modeButtons.push(this);
		$(this).css('cursor','default');
		//$(this).click(function(e){
				
		//});
		
		$(this).mousedown(function(e){
			$(this).css("backgroundColor", '#999');
		});
		$(this).mouseup(function(e){
			$(this).css("backgroundColor", '#FFF');
			
			for (i = 0;i<modeButtons.length;i++)
			{
				$(modeButtons[i]).css("backgroundColor", '#888');
				
				if ($(modeButtons[i]).attr('id') != $(this).attr('id'))
				{
					$(modeButtons[i]).css("backgroundColor", '#666');
				}
			}
			var m = $(this).attr('id');
			mode = Number(m.substr(m.length-1));
		});
	});
	//alert(modeButtons.length);
	$('#but1').click(function(e) {
       
    });
	$('#but1').mousedown(function(e){
			$(this).css("backgroundColor", '#999');
	});
	$('#but1').mouseup(function(e){
		$(this).css("backgroundColor", '#666');
		 context.clearRect(0,0,$(window).width(),$(window).height());
	});
	
	$('#modes').css("width", ((Math.ceil(modeButtons.length/2)) * 85));
	
	 $('#cpicker').farbtastic(function callback(color)
	 {
		clr[0] = HexToR(color);
		clr[1] = HexToG(color);
		clr[2] = HexToB(color);
		clr[3] = 1;
	});
	
	clr[0] = HexToR('#0066CC');
	clr[1] = HexToG('#0066CC');
	clr[2] = HexToB('#0066CC');
	clr[3] = 1;
	
	$( "#sizeslider" ).slider({range:'min',min:5,max:30,value:10,orientation: "horizontal",
		slide: function(event, ui)
		{
			radius = ui.value;
		}
	});
	
	$( "#mixslider" ).slider({range:'min',min:0.7,max:1,value:0.92,step:0.01,orientation: "horizontal",
		slide: function(event, ui)
		{
			mixval = ui.value;
		}
	});
	 //$("#mode1").styledButton({  
	 
	// });
}


function HexToR(h) { return parseInt((cutHex(h)).substring(0,2),16) };
function HexToG(h) { return parseInt((cutHex(h)).substring(2,4),16) };
function HexToB(h) { return parseInt((cutHex(h)).substring(4,6),16) };
function cutHex(h) { return (h.charAt(0)=="#") ? h.substring(1,7) : h}

function onDown(e)
{
	e.preventDefault();
	//alert('sdfsd');
	//e.target.style.cursor = 'crosshair';
	
	lastX = e.touches[0].pageX;
	lastY = e.touches[0].pageY;
	
	
	
	//window.addEventListener("mousemove",onMove,false);
	//window.addEventListener("mouseup",onUp,false);
	
	document.addEventListener("touchmove",onMove,false);
	document.addEventListener("touchend",onUp,false);
	
	numBristles = radius*5;
	bristles = [];
	
	var rt = clr[0];
	var gt = clr[1];
	var bt = clr[2];
	var at = clr[3];
	
	for (i = 0; i < numBristles;++i)
	{
		dist = Math.random() * radius;
		angle = Math.random() * 2 * Math.PI;
		
		bristles.push({
			ang: angle,
			ang2: 0,
			dist: dist,
			rand: Math.random()*(radius*2)-radius,
			dx: Math.sin(angle)*dist,
			dy: Math.cos(angle)*dist,
			dxo: Math.sin(angle)*dist,
			dyo: Math.cos(angle)*dist,
			oldX: Math.sin(angle)*dist + e.clientX,
			oldY: Math.cos(angle)*dist + e.clientY,
			colour:[rt,gt,bt,at]
		});
	}
	
}

function onMove(e)
{
	e.preventDefault();
	
	var xp = e.touches[0].pageX;
	var yp = e.touches[0].pageY;
	
	var x2 = Math.pow(xp - lastX, 2);
	var y2 = Math.pow(yp - lastY, 2);
	
	var speed = Math.round(  Math.sqrt(x2 + y2 )) ;
	
	for (i = 0; i < numBristles;i++)
	{
		var d = bristles[i].dist-(speed*0.06) < 0 ? 0 : bristles[i].dist - (speed*0.06);
		var xp2 = xp + bristles[i].dx;
		var yp2 = yp + bristles[i].dy;
		
		var imageData = context.getImageData(xp2,yp2,1,1);
		var pixel = imageData.data;
		
		var tmpData = context.createImageData(1,1);
		
		
		var tmpPixel = tmpData.data;
		
		if (pixel[3] == 0)
		{
			pixel[0] = bristles[i].colour[0];
			pixel[1] = bristles[i].colour[1];
			pixel[2] = bristles[i].colour[2];
			//pixel[3] = 0.05;
		}
		
		var r = mix(bristles[i].colour[0],pixel[0],mixval);
		var g = mix(bristles[i].colour[1],pixel[1],mixval);
		var b = mix(bristles[i].colour[2],pixel[2],mixval);
		var a = mix(bristles[i].colour[3],pixel[3],mixval);
		
		bristles[i].colour[0] = r;
		bristles[i].colour[1] = g;
		bristles[i].colour[2] = b;
		bristles[i].colour[3] = a;
		
		tmpPixel[0] = r;
		tmpPixel[1] = g;
		tmpPixel[2] = b;
		tmpPixel[3] = a;
		
		context.beginPath();
		context.strokeStyle = 'rgba( '+tmpPixel[0]+', '+tmpPixel[1]+', '+tmpPixel[2]+', '+tmpPixel[3]+')';
		context.lineWidth = 1;
		context.moveTo(bristles[i].oldX, bristles[i].oldY);
		
		switch (mode)
		{
			case 0 :
				bristles[i].dx = Math.sin(bristles[i].ang)*d;
				bristles[i].dy = Math.cos(bristles[i].ang)*d;
				context.lineTo(xp2, yp2);
				context.stroke();
				break;
			case 1 :
				bristles[i].dx = Math.sin(bristles[i].ang)*(bristles[i].dist - (speed*0.5));
				bristles[i].dy = Math.cos(bristles[i].ang)*(bristles[i].dist -( speed*0.5));
				context.lineTo(xp2, yp2);
				context.stroke();
				break;	
			case 2 :
				bristles[i].ang2++;
				bristles[i].dx += (bristles[i].rand + speed*0.5) * Math.sin(bristles[i].ang2);
				bristles[i].dy += (bristles[i].rand + speed*0.5) * Math.cos(bristles[i].ang2);
				
				var cX = xp2 + (bristles[i].oldX-xp2)*0.5;
				var cY = yp2 + (bristles[i].oldY-yp2)*0.5;
				
				context.quadraticCurveTo(cX, cY, xp2, yp2);
				context.stroke();
				
				break;
			case 3 :
				if (i == numBristles-1)
				{
					context.moveTo(lastX,lastY);
					context.lineWidth = radius;
					context.lineTo(xp, yp);
					context.stroke();
					
					bristles[i].oldX = xp2;
					bristles[i].oldY = yp2;
					
					lastX = xp;
					lastY = yp;
					
					return;
					
					
				}
				break;	
			default:
				bristles[i].dx = Math.sin(bristles[i].ang)*d;
				bristles[i].dy = Math.cos(bristles[i].ang)*d;
				context.lineTo(xp2, yp2);
				context.stroke();
		}
		
		
		
		
		bristles[i].oldX = xp2;
		bristles[i].oldY = yp2;
	}
	
	lastX = xp;
	lastY = yp;
}
	
function onUp(e)
{
	
	lastX = 0;
	lastY = 0;
	//window.removeEventListener("mousemove",onMove,false);
	//window.removeEventListener("mouseup",onUp,false);
	
	document.removeEventListener("touchmove",onMove,false);
	document.removeEventListener("touchend",onUp,false);
}

function mix(colour1, colour2, mv)
{
	var val = colour1 * mv + colour2 * (1 - mv);
		
	return val;
}
	
function dif(pos1, pos2)
{
	if (pos1 > pos2)
	{
		return pos1 - pos2;
	}
	return pos2 - pos1;
}


function paleta()
{
	if($('#ventana-paleta').hasClass( "Paleta-Hidden" ))
		$('#ventana-paleta').removeClass('Paleta-Hidden');
	else
		$('#ventana-paleta').addClass('Paleta-Hidden');
}

function setColor(color){
	clr[0] = HexToR(color);
	clr[1] = HexToG(color);
	clr[2] = HexToB(color);
	clr[3] = 1;
	
	$('#ventana-paleta').addClass('Paleta-Hidden');
	
	
}

/*
$("#paleta").on("tap",function(){
  alert("Hola");
});*/


