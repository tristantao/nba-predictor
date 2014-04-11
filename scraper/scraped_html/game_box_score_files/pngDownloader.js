/*
 ** pngDownloader.js
 ** NR
 */

//Browser and PNG options
//Safari: Open in a same window.
//Chrome,FF: Open image a seperate window or download as a png file image.
//IE10: Download as a png file image.
//1300px max width It can take to make PNG.

jQuery.extend({
	//Get the IE version number
	isIEVersion : function(){
	  var myNav = navigator.userAgent.toLowerCase();
	  return (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : false;
	},

	//Get browser name
	getBrowserName : function () {
		var name = "Unknown";
		if(navigator.userAgent.indexOf("MSIE")!=-1){
			name = "MSIE";
		}
		else if(navigator.userAgent.indexOf("Firefox")!=-1){
			name = "Firefox";
		}
		else if(navigator.userAgent.indexOf("Opera")!=-1){
			name = "Opera";
		}
		else if(navigator.userAgent.indexOf("Chrome") != -1){
			name = "Chrome";
		}
		else if(navigator.userAgent.indexOf("Safari")!=-1){
			name = "Safari";
		}
		return name;   
	},
	
	//Download PNG file From CANVAS
	canvasToPNG: function(){
		var currentCanvas = document.getElementById('currentCanvas');
		currentCanvas.toBlob(function(blob) {
			saveAs(
				  blob
				, ("NBAStats") + ".png"
			);
		}, "image/png");
	},
	
	//Merge Canvas and footer Text
	mergeCanvasFooterText: function(gridTable,canvas){
		var canvasToDownload = document.getElementById("currentCanvas");
		var ctx =  canvasToDownload.getContext("2d");

		//Darw text NBA.com/Stats as a footer	
		var textHeight = 20;
		var textWidth = 180;
		var extraHeight = 5;
		
		var textX = 0;
		var textY = 0;
		
		//Calculate the height of Canvas Height of grid content + Footer Image Content
		canvasToDownload.height = canvas.height + textHeight + extraHeight;
		//canvasToDownload.height = canvas.height + extraHeight;
		if(canvas.width > textWidth){
			canvasToDownload.width = canvas.width;
			textX = canvas.width - textWidth;
		}
		else{
			canvasToDownload.width = textWidth;
			textX = 0;
		}
		textY = canvas.height + textHeight;
		//textY = canvas.height;

		//Clear the old content of Canvas if exist any
		ctx.fillStyle="#A8A8A8";
		ctx.fillRect(0, 0, canvasToDownload.width, canvasToDownload.height);
		
		//Draw grid content	
		ctx.drawImage(canvas,0,0);
		
		//Add Text on Image
		ctx.fillStyle = "black";
		ctx.font = "italic bold 20px Georgia";
		//ctx.globalAlpha = 0.3;
		ctx.fillText("NBA.com/Stats", textX,textY);

		//Timestamp inforamtion
		var timeStamp = new Date();
		ctx.fillText(timeStamp.toUTCString(), 0,textY);
		
		var browserType = $.getBrowserName();
		//Safari Open an image in Window
		if(browserType == "Safari"){
			var data = canvasToDownload.toDataURL("image/png");
			window.location.href = data;	
		}
		//IE10,Chrome,FF
		//Download Canvas as a PNG file
		else{
			//Open in new window.
			//Chrome,FF, Safari
			//var data = canvasToDownload.toDataURL("image/png");
			//window.open(data);
			//Download
			$.canvasToPNG();
		}

		$(gridTable).parent().css("overflow-x","auto");
		//Stop Loading Animation
		$("body").removeClass("loading");
	},

	//Print Canvas from HTML content
	downloadPNG: function(gridID){
		//check for IE version
		var ieVersion = $.isIEVersion();
		if(ieVersion == 8 || ieVersion == 9){
			//console.info("Can not work in IE 8 and 9...");
			return;
		}

		//Get the Table
		var gridTable = $("#"+gridID);
		//Start Loading Animation
		$("body").addClass("loading");

		if(!($(".pngDownloadModal .spinner").length) ){
			var target = document.getElementById('pngDownloadModal');
			var spinner = new Spinner().spin();		
			target.appendChild(spinner.el);		
		}

		$(gridTable).parent().css("overflow-x","visible");
		html2canvas( gridTable, {
		  	onrendered: function(canvas) {
				$.mergeCanvasFooterText(gridTable,canvas);
		 	}
		});
	}
});


	
		
