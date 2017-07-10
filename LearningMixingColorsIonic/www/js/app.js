// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var myapp = angular.module('starter', ['ionic'])
var cont = 1;

myapp.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
	//$('#titulo').css('left', '43%');
	$('#titulo').removeAttr('style');
	$('#titulo').css('textAlign','center');
	//$('#titulo').removeClass('title-left');
	
	
	$ionicPlatform.registerBackButtonAction(function (event) {
  if(cont == 2){
    
		var confirmPopup = $ionicPopup.confirm({
            title: 'Exit',
            template: 'Confirm Exit'
          });
 
          confirmPopup.then(function (res) {
            if (res) {
              navigator.app.exitApp();
            }
		});
 
         
	}
	else {
		cont++;
    navigator.app.backHistory();
  }
}, 100);
  });
});

myapp.controller("FileController", function($scope) {
	alert("Yuhu1");
	var canvas = document.getElementById("canvas"); 
	var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");  // here is the most important part because if you dont replace you will get a DOM 18 exception.

 
    $scope.download = function(imagen) {
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs) {
        fs.root.getDirectory(
            "MixingColors",
            {
                create: true
            },
            function(dirEntry) {
                dirEntry.getFile(
                    "imagen.png", 
                    {
                        create: true, 
                        exclusive: false
                    }, 
                    function gotFileEntry(fe) {
                        var p = fe.toURL();
                        fe.remove();
                        ft = new FileTransfer();
                        ft.download(
                            imagen,
                            p,
                            function(entry) {
                               alert("Yuhu");
                                //$scope.imgFile = entry.toURL();
                            },
                            function(error) {
                               
                                alert("Download Error Source -> " + error.source);
                            },
                            false,
                            null
                        );
                    }, 
                    function() {
                        console.log("Get file failed");
                    }
                );
            }
        );
    },
    function() {
       
        console.log("Request for filesystem failed");
    });
    }
 
});
/*
myapp.controller("FileController",function($scope,$ionicLoading){
	
	$scope.download = function() {
		$ionicLoading.show({
			template: "loading..."
		});
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0n function(fs){
			fs.root.getDirectory("MixingColors",
			{
				create: true
			},
			function(dirEntry){
				dirEntry.getFile(
				"test.png",
				{
					create: true,
					exclusive: false
				},
				function goFileEntry(fe) {
					var p = fe.toURL();
					fe.remove();
					ft = new FileTransfer();
					ft.download(
					encondeURL("http://irgamers.cl/index/wp-content/uploads/2016/02/5Pikachu.png"),
					p,
					function(entry){
						$scope.imgFile = entry.toURL();
					},
					function(error){
						alert("error");
					},
					false,
					null
					);
				},
				function(){
					$ionicLoading.hide();
					alert("Error leyendo");
				}
				);
			});
		});
	}
	$scope.load = function(){
		
	}
	
});*/


