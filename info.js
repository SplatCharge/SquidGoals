$(document).ready(function () {

	$('#register').on('click', function() {
		
		var url = $('#discord-url').val();
		
		

		if(url == ''){
			$('#register-response').text('Please paste your URL first')
		}
		else  {
			$.ajax({
       		url : url, // my php file
       		type : 'GET', // type of the HTTP request
       		success : function(result){   		
          		//console.log(result);
          		checkDB(result);
				//const hook = new Discord.WebhookClient(obj.id, obj.token);

				// Send a message using the webhook
				//hook.send('Im doing it');
				//hook.sendFile('http://squidgoals.com/img/icon.png' );
       		}
    	});
		}
	});


});


function checkDB(result){
	$.ajax({
       		url : 'register.php', // my php file
       		type : 'POST', // type of the HTTP request
       		data: { token: result.token, id: result.id, name: result.name},
       		success : function(result){   		
          		console.log(result);
          		var obj = jQuery.parseJSON(result);

          		if(obj.status == 'success'){
          		$('#register-response').html(obj.name + " was successfully registered! You should have recieved a message in your discord channel");
          		$('#register-response').css("color", "#00FFFF");
          		const hook = new Discord.WebhookClient(obj.id, obj.token);
				// Send a message using the webhook
				hook.send('Squid Goals was registered with this channel, photos can be uploaded directly to this channel using the passcode: ' +obj.name);
				}

				if(obj.status == 'found'){
          		$('#register-response').html(obj.name + " is not available. Please change the name of your webhook and try again.");
          		$('#register-response').css("color", "red");
				}
       		}
    	});

}