/**
 * Created by jhgraves on 11/17/16.
 */
interact('.draggable')
    .draggable({
        // enable inertial throwing
        inertia: true,
        // keep the element within the area of it's parent
        restrict: {
            restriction: "parent",
            endOnly: true,
            elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
        },
        // enable autoScroll
        autoScroll: true,
        // call this function on every dragmove event
        onmove: dragMoveListener,
        // call this function on every dragend event
        onend: function (event) {}
});


function longer(champ, contender) {
    return (contender.length > champ.length) ? contender: champ;
}

function longestWord(str) {
    var words = str.split(' ');
    return words.reduce(longer);
}
/*
interact('.tap-target')
    .on('click', function (event) {
        event.currentTarget.remove();
        event.preventDefault();
    });
*/

function reSize(height, width){
    var values = $('.draggable');

    for (i=0; i < values.length; i++){

        x = (parseFloat(values[i].getAttribute('data-x')) || 0) * height;
        y = (parseFloat(values[i].getAttribute('data-y')) || 0) * width;

        values[i].style.webkitTransform =
            values[i].style.transform =
                'translate(' + x + 'px, ' + y + 'px)';

        values[i].setAttribute('data-x', x);
        values[i].setAttribute('data-y', y);
    }
}

function dragMoveListener (event) {
    var target = event.target,
        // keep the dragged position in the data-x/data-y attributes
        x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
        y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    // translate the element
    target.style.webkitTransform =
        target.style.transform =
            'translate(' + x + 'px, ' + y + 'px)';

    // update the posiion attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
}




Obj = new Object();

function saveObjects(){
    var values = $('.draggable');

    for (i=0; i < values.length; i++) {
        alert($(values[i]).height());
        Obj.x = (parseFloat(values[i].getAttribute('data-x')) || 0);
        Obj.y = (parseFloat(values[i].getAttribute('data-y')) || 0);
        Obj.width = $(values[i]).outerWidth(true);
        Obj.height = $(values[i]).outerHeight(true);
        Obj.border_color = $(values[i]).css("border-color");
        Obj.border_style = $(values[i]).css("border-style");
        Obj.background = $(values[i]).css("background-color");
        Obj.src = $(values[i]).find('img').attr('src') ;

        $("div").data(Obj);
    }
}

function restorePosition(){
    var values = $('.draggable');

    for (i=0; i < values.length; i++){

        x = (parseFloat(values[i].getAttribute('data-x')) || 0);
        y = (parseFloat(values[i].getAttribute('data-y')) || 0);

        values[i].style.webkitTransform =
            values[i].style.transform =
                'translate(' + x + 'px, ' + y + 'px)';

        values[i].setAttribute('data-x', x);
        values[i].setAttribute('data-y', y);
    }
}

function restoreObject(){
    $("div").data(Obj);

    $('#spawn-point').append($('<div/>')
        .addClass("draggable drag-gear-object tap-target")
        .attr('data-x', $("div").data('x'))
        .attr('data-y', $("div").data('y'))
        .width(  $("div").data('width')  )
        .height(  $("div").data('height')  )
        .css( 'border-color' , $("div").data('border_color'))
        .css( 'border-style' , $("div").data('border_style'))
        .css( 'border-width' , $("div").data('border_width'))
        .append($('<img/>')
            .attr('src', $("div").data('src'))
            .addClass('img-responsive img-center')));

    restorePosition();

}


// this is used later in the resizing and gesture demos
window.dragMoveListener = dragMoveListener;

