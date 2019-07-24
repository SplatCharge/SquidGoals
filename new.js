


//__________DRAWING_______________________________
	var el = document.getElementById('draw-container');
	var pad = new Sketchpad(el);

	$('.undo').on('click', function() {  pad.undo(); });
	$('.redo').on('click', function() {  pad.redo(); });
	$('.clear').on('click', function() { pad.clear(); });

	function setSize(height, width) {
		$('.draw-container').height(height).width(width);
    	pad.responsiveResize(width, height);
	}

//__________STORED VARS___________________________
	var PageData = {};
	var DesignData = {};

//__________ANIMATE CSS___________________________
	$.fn.extend({
    	animateCss: function (animationName) {
        	var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        	this.addClass('animated ' + animationName).one(animationEnd, function() {
            	$(this).removeClass('animated ' + animationName);
        	});
        	return this;
    	}
	});

	$.fn.extend({
    	animateHideCss: function (animationName) {
        	var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        	this.addClass('animated ' + animationName).one(animationEnd, function() {
            	$(this).removeClass('animated ' + animationName);
            	$(this).hide();
        	});
        	return this;
    	}
	});

//__________EXTEND FUNCTIONS______________________
	$.fn.extend({
    	activate: function () {

			DesignData.object_borderColor = $(this).css( 'border-color');
			DesignData.object_backgroundColor = $(this).css( 'background-color');
			DesignData.object_textColor = $(this).css( 'color');

       		$('.color-border').css('box-shadow', 'inset 0 5px 0px 0px  '+ DesignData.object_borderColor);
			$('.color-background').css('box-shadow', 'inset 0 5px 0px 0px  '+  DesignData.object_backgroundColor);
			$('.color-text').css('box-shadow', 'inset 0 5px 0px 0px  '+ DesignData.object_textColor);
		    
			$(this).css( 'box-shadow' , '0 0 1em white').addClass("active-object");
		
			if( $(this).hasClass('text-object')) {
				$('#text-style-holder').show();
			}
			else {
				$('#style-holder').show();
			}
        	return this;
   		}
	});

	$.fn.extend({
    	deactivate: function () {
       		$(this).removeClass("active-object").css( 'box-shadow' , 'unset');
			$('#style-holder').hide();
			$('#text-style-holder').hide();
        	return this;
    	}
	});

//__________MAIN MENU_____________________________
	$('.nav-toggle-group1').on('click', function(){
		$('.nav-toggle-group1').removeClass('active');
		$('#download').removeClass('active');
		$('#discord').removeClass('active');
		$('.active-object').deactivate();
		$('.nav-holder-group1').hide();
		$('.objects-table').hide();
		$('.' + this.id + '-holder').show().animateCss('fadeInUp');
		$('.cp-control').colorpicker('hide');
		$(this).addClass('active');

		if(this.id == 'draw'){
			pad.turnOn();
		}
		else{
			pad.turnOff();
		}
	});

//__________MENU RESIZING FOR MOBILE______________
	var overlay = document.getElementById('nav-main');

	window.addEventListener('scroll', function(e){
        overlay.style.position = 'absolute';
        overlay.style.left = window.pageXOffset + 'px';
        overlay.style.bottom =  document.documentElement.clientHeight - (window.pageYOffset + window.innerHeight) + 'px';
        overlay.style["-webkit-transform"] = "scale(" + window.innerWidth/document.documentElement.clientWidth + ")";
	});

//__________MAPS AND MODES CONTROL________________
	function maps() {
		$('#map-img').attr('src', 
		"img/maps/s2/" + PageData.map_id +"/"+ PageData.mode_id + PageData.orientation +  ".jpg").on('load', 
		function () {
    			calcDimensions();
    	});
    	$("#export-text").val(PageData.map + " : "+PageData.mode);
	}		
	
	$('.stages').on('touchstart click', function () {
		PageData.map_id = this.id; 
		PageData.map = $(this).text();
		$('.stage-holder').text(PageData.map);
   		pad.clear();
    	maps();
	});
	
	$('.modes').on('touchstart click', function () {
		PageData.mode_id = this.id; 
		PageData.mode = $(this).text();
		$('.mode-holder').text( PageData.mode );
		pad.clear();
    	maps();
	});

	$('#orientation').on('touchstart click', function () {
		if(PageData.orientation == '_h'){
			PageData.orientation = '_v'
			$('#orientation-icon').removeClass('fa-arrows-v').addClass('fa-arrows-h');;
		}
		else if(PageData.orientation == '_v'){
			PageData.orientation = '_h'
			$('#orientation-icon').removeClass('fa-arrows-h').addClass('fa-arrows-v');
		}
		pad.clear();
    	maps();
	});
	
//__________OBJECT BUTTON_________________________
	$('.object-btn').on('touchstart click', function(){
		$('.objects-table').hide();
		$('.' + this.id + '-table').show();
		$('.cp').colorpicker('hide');
		$(".active-object").deactivate();

	});

//__________TEXT OBJECTS__________________________
	$('.spawn').click(function () {
	
		$('#spawn-point').append($('<div/>')
    		.addClass("draggable drag-object tap-target text-object text-center")
        	.addClass($('#font-style').val())
        	.css( 'border-color' , DesignData.object_borderColor )
			.css( 'background-color' , DesignData.object_backgroundColor)
        	.css( 'border-style' , 'solid')
        	.css( 'border-width' , '2pt')
        	.css('white-space', 'pre-wrap')
        	.css( 'font-size' , DesignData.object_textSize)
        	.append($('<span/>')
        	.text($('#div-text').val())));

    });

//__________WEAPONS OBJECT CREATION_______________
    
    $(document).on('click', '.object', function(event){
        $('#spawn-point').append($('<div/>')
                .addClass("draggable drag-gear-object tap-target animated fadeIn")
                .css( 'border-color' , DesignData.object_borderColor)
				.css( 'background-color' , DesignData.object_backgroundColor)
                .css( 'border-style' , 'solid')
                .css( 'border-width' , '2pt')
				.append($('<img/>')
                        .attr('src', $(this).find('img').attr('src'))
						.css( 'width' , DesignData.object_Size)
						.css( 'height' , DesignData.object_Size)
				        .addClass('img-center shadowed animated jello')));
    });

//__________OBJECT/DRAW STYLE CONTROLS____________
	
	DesignData.object_borderColor = '';
	DesignData.object_backgroundColor = 'rgb(192,192,192)';
	DesignData.object_textColor = 'rgb(0,0,0)';
	DesignData.object_Size = '25px';
	DesignData.object_textSize = '10pt';
	DesignData.draw_pointSize = 5;
    DesignData.draw_Color = '#0000FF';


	$(document).on('touchstart click', '.tap-target', function() { 
		
		if($('#object-holder').is(":hidden")){
			$('#object').click();
		} 
		if(!$('#object-toggle').hasClass('active')){
			$('#object-toggle').click();
		}
		
		$(".active-object").deactivate();
		$(".objects-table").hide();
		$(this).activate()

		
		// SCALING_________

		// GEAR OBJECT SIZE CONTROL ______________
		$('#size-up').on('click', function(e) {
			var img = $('.active-object').find( "img" );
			DesignData.object_Size = parseInt(img.css('width'))+1;
			img.width(DesignData.object_Size);
			img.height(DesignData.object_Size);
    	});
		
		$('#size-down').on('click', function(e) {
			var img = $('.active-object').find( "img" );

			DesignData.object_Size = parseInt(img.css('width'))-1;
			img.width(DesignData.object_Size);
			img.height(DesignData.object_Size);
    	});
		
		// TEXT OBJECT SIZE CONTROL ______________
		$('#text-size-up').on('click', function(e) {
			DesignData.object_textSize = parseInt($('.active-object').css('font-size'))+1;
			$('.active-object').css('font-size', DesignData.object_textSize);
            //$('.active-object').css('font-size', parseInt($('.active-object').css('font-size'))+1);
    	});
		
		$('#text-size-down').on('click', function(e) {
			DesignData.object_textSize = parseInt($('.active-object').css('font-size'))-1;
			$('.active-object').css('font-size', DesignData.object_textSize);
            //$('.active-object').css('font-size',parseInt($('.active-object').css('font-size'))-1);
    	});
	});

	// DELETE__________
	$(document).on('click', '#delete-object', function() { 
		$('.active-object').remove();
		$('#style-holder').hide();
	});
    
    /*
	$(document).on('click', '#clear-objects', function() { 
		$('.draggable').animateHideCss('fadeOutDown');
		$('#style-holder').hide();
	});
    */
	$(document).on('click', '.clear-objects', function() { 
		$(this).removeClass('clear-objects');
		$(this).addClass('clear-check');
		$(this).html('<span class=" wendy animated pulse">Delete All?</span')
	});

	$(document).on('click', '.clear-check', function() { 
		$('.draggable').animateHideCss('fadeOutDown');
		$('#style-holder').hide();
		$(this).removeClass('clear-check');
		$(this).addClass('clear-objects');
		$(this).html('<i class="fa fa-trash animated fadeIn" aria-hidden="true"></i>')
	});


	$('#map-container').on('mouseenter', function(){
		$('.cp').colorpicker('hide');
		$('.objects-table').hide();
	});
	$('#map-container').on('click', function(){
		$('.cp').colorpicker('hide');
		$('.objects-table').hide();
	});
	
//__________COLOR PICKER FOR DRAW AND OBJECTS_____

	$(function() {

		//SET AND UPDATE COLORS______
		$('.cp').on('click', function(){
			$('.cp').colorpicker('hide');
			$(this).colorpicker('show');
		});

		// DRAW POINT SIZE CONTROL ______________
    	$('#point-size-up').on('click', function(e) {
    		DesignData.draw_pointSize += 1;
    		pad.setLineSize(DesignData.draw_pointSize);
    		$('.color-button').css('box-shadow', 'inset 0 '+ DesignData.draw_pointSize +'px 0px 0px '+ DesignData.draw_Color);
            
    	});
		
		$('#point-size-down').on('click', function(e) {
            DesignData.draw_pointSize -= 1;
            DesignData.draw_pointSize = Math.max(1, DesignData.draw_pointSize);
            pad.setLineSize(DesignData.draw_pointSize);
            $('.color-button').css('box-shadow', 'inset 0 '+ DesignData.draw_pointSize +'px 0px 0px '+ DesignData.draw_Color);
    	});

		$('.color-border').on('touchstart click', function(){
			$('.color-border').colorpicker('setValue', DesignData.object_borderColor)
		});

		$('.color-background').on('touchstart click', function(){
			$('.color-background').colorpicker('setValue', DesignData.object_backgroundColor)
		});
		$('#cp-text').on('touchstart click', function(){
			$('#cp-text').colorpicker('setValue', DesignData.object_textColor)
		});

		$('#draw').on('touchstart click', function(){
			$('#cp-draw').colorpicker('setValue', DesignData.draw_Color)
		});


		// BORDER____________
		$('.color-border').colorpicker({
			container: "#cp-holder",
			inline: true
		}).on('changeColor', function(e) {
			DesignData.object_borderColor = e.color.toString('rgba');
			$('.color-border').css('box-shadow', 'inset 0 5px 0px 0px  '+ DesignData.object_borderColor);
			$('.active-object').css( 'border-color' , DesignData.object_borderColor)
    	});
		
		// BACKGROUND________
		$('.color-background').colorpicker({
			container: "#cp-holder",
			inline: true
		}).on('changeColor', function(e) {
			DesignData.object_backgroundColor = e.color.toString('rgba');
			$('.color-background').css('box-shadow', 'inset 0 5px 0px 0px  '+  DesignData.object_backgroundColor);
			$('.active-object').css( 'background-color' , DesignData.object_backgroundColor)
    	});

    	// TEXT_____________
		$('#cp-text').colorpicker({
			container: "#cp-holder",
			inline: true
		}).on('changeColor', function(e) {
			DesignData.object_textColor = e.color.toString('rgba');
			$('.color-text').css('box-shadow', 'inset 0 5px 0px 0px  '+  DesignData.object_textColor);
			$('.active-object').css( 'color' , $('#cp-text').data('colorpicker').color)
    	});
		
		// DRAW______________
    	$('#cp-draw').colorpicker({
			container: "#cp-holder",
			inline: true
		}).on('changeColor', function(e) {
			DesignData.draw_Color = e.color.toHex();
			$('.color-button').css('box-shadow', 'inset 0 5px 0px 0px '+ DesignData.draw_Color);
			setColor(DesignData.draw_Color);
    	});

		$('.cp').colorpicker('hide');
	});

	function setColor(color){
        pad.setLineColor(color);
    } 

//__________SIZE HANDLER__________________________
    var start_height = 0;
    var start_width = 0;

    function sizeHandler(height, width){
        if(!height) {
            start_height = $('.map-img').outerHeight();
            start_width = $('.map-img').innerWidth();
        }
        else{
            reSize((height/start_height), (width/start_width));
            start_height = $('.map-img').outerHeight();
            start_width = $('.map-img').innerWidth();
        }
    }

//__________PRINT FUNCTIONALITY___________________
	
	var hook;
	function fetchWebhook(name){
		//alert(name);
		$.ajax({
       		url : 'fetch.php', // my php file
       		type : 'POST', // type of the HTTP request
       		data: { hook: name},
       		success : function(result){ 
          		var obj = jQuery.parseJSON(result);

          		if(obj.status=="not found"){
          			$('#discord-hook-input').animateCss('pulse');
          			$('#discord-hook-input').css( "border-color", "red" );
          		}
          		else{
          			hook = new Discord.WebhookClient(obj.id, obj.token);
          			$('#discord-hook-input').val(obj.name);
          			$('#discord-holder').hide();
          			$('#hook-name').html(obj.name + ' <i class="fa fa-send"> </i>');
          			$('#name-holder').show();
          			$("#export-text").val(PageData.map + " : "+PageData.mode);
          			$('#export-send').addClass('launch-discord');
          			$('#export-send').removeClass('launch-download');
          		}		
       		}
    	});
	};

	$('.info-launch').on('click', function() {
		window.open('info2.html', '_blank'); 
	});


	$('#discord').on('click', function() {
		$('#discord-holder').show();
		$('#discord').addClass('active');
		$('#download').removeClass('active');
		$('#name-holder').hide();
	});

	$('#discord-hook-submit').on('click', function() {
		fetchWebhook($('#discord-hook-input').val());
	});


	$('#download').on('click', function() {
		$('#hook-name').html('.png <i class="fa fa-download "> </i>');
		$('#discord-holder').hide();
        $('#name-holder').show();
        $("#export-text").val(PageData.map + " : "+PageData.mode);
        $('#download').addClass('active');
		$('#discord').removeClass('active');
		$('#export-send').addClass('launch-download');
		$('#export-send').removeClass('launch-discord');
	});


    $('#export-send').on('click', function() {
    	if( $(this).hasClass('launch-download') ){
			$('#spawn-point').height($('#draw-container').height()).width($('#draw-container').width());
        	html2canvas([document.getElementById('spawn-point')], {
            	onrendered: function(canvas) {
                	var a = document.createElement('a');
                	a.href = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
                	a.download = $('#export-text').val()+'.png';
                	a.click();
            	}
        	});     
			$('#spawn-point').height('100%').width('100%');
		}
		 else if( $(this).hasClass('launch-discord')){
		 	$('#spawn-point').height($('#draw-container').height()).width($('#draw-container').width());
		    html2canvas([document.getElementById('spawn-point')], {
            	onrendered: function(canvas) {
            		var link = canvas.toDataURL("image/png"); 
                    var value = $('#export-text').val();
                    var spaceless = value.replace(/ /g, '');
                    console.log(spaceless);
               		$.post("img-handler.php", {
        				img: link,
        				fname:spaceless

    				},
    				function(data, status){
    					var urlx = "http://www.squidgoals.com/img/"+spaceless+".png";					
    					console.log(urlx);
    					const embed = new Discord.RichEmbed()
    					.setDescription(value)
  						.setTitle('SquidGoals.com')
  						.setColor(0xFF69B4 )
  						.setURL("http://www.squidgoals.com")
  						.setFooter(PageData.map + '~' + PageData.mode)
  						.setTimestamp()
  						.attachFile('http://squidgoals.com/img/'+spaceless+'.png')
  						.setImage('attachment://squidgoals.com/img/'+spaceless+'.png')
    				    console.log(embed);
						//console.log(embed.setImage('attachment://squidgoals.com/img/TheReef:TurfWar.png'));
						//hook.sendFile('http://squidgoals.com/img/'+spaceless+'.png').then($('#hook-name').html(' <i class="fa fa-check "> </i>'));
						hook.send(embed);

    				});
            }
        });
		 }
    });


// _________HANDLE WINDOW RESIZE__________________
    $(window).resize(function () {
        calcDimensions(setSize);
        sizeHandler($('.map-img').outerHeight(), $('.map-img').innerWidth());
    });

//__________CALCDIMENSIONS________________________
    function calcDimensions(){
        var height = $('.map-img').outerHeight();
        var width = $('.map-img').innerWidth();
        setSize(height, width);
    }
	
// _________ON READY COMMANDS_____________________

    $(document).ready(function () {
		
		PageData.orientation = '_h';
		PageData.map = 'The Reef';
		PageData.mode = 'Turf War';
		PageData.map_id = 'TR';
		PageData.mode_id = 'A';
		
		if ( $( window ).width() < 800 ) {
			PageData.orientation = '_v';
		}
		
		maps();
		$('.mode-holder').text(PageData.mode);
		$('.stage-holder').text(PageData.map);

		$('.object-holder').hide();
		$('.draw-holder').hide();
		$('.color-holder').hide();
		
		
		
		$('.weapons-table').hide();
		$('.text-table').hide();
		$('.subs-table').hide();
		$('.specials-table').hide();
		$('#text-style-holder').hide();
		$('#style-holder').hide();

		//HIDE EXPORT
		$('.export-holder').hide();
		$('.submit-export-holder').hide();
		$('.discord-holder').hide();

        calcDimensions();
        sizeHandler($('.map-img').outerHeight(), $('.map-img').innerWidth());
		pad.turnOff();
    });

	$(window).on('load', function() {
   		$("#cover").animateHideCss('fadeOutUp');
	});



//__________DATA SETS_____________________________

angular.module('myApp', []).controller('namesCtrl',function($scope) {
    $scope.maps = [
        {id:'HP',name:'Humpback Pump Track'},
        {id:'MF',name:'Musselforge Fitness'},
        {id:'SM',name:'Starfish Mainstage '},
        {id:'SS',name:'Sturgeon Shipyard'},
        {id:'TR',name:'The Reef'},
        {id:'PM',name:'Port Mackeral'},
        {id:'MT',name:'Moray Towers'},
        {id:'MM',name:'Manta Maria'},
        {id:'KD',name:'Kelp Dome'}
        ];
});

