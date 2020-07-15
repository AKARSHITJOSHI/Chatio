var socket = io();

//if scroll top + client height =scroll height then scroll to bottom
function scroll() {
    // Selectors
    var messages = jQuery('#messages');
    var newMessage = messages.children('li:last-child')
        // Heights
    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        messages.scrollTop(scrollHeight);
    }
}



socket.on('connect', function() {
    console.log('Connected to server');
    //sending user name and room name by converting them to object to server.js via emit
    var param = jQuery.deparam(window.location.search);
    socket.emit('join', param, function(err) {
        if (err) {
            //if error back on front page
            alert(err);
            window.location.href = '/';

        } else {
            console.log('validation works');

        }
    });
});

socket.on('disconnect', function() {
    console.log('Disconnected from server');
});
//updating user list on the side bar
socket.on('updateUserList', (users) => {
    console.log('Users list', users);
    var ol = jQuery('<ol></ol>');
    users.forEach(function(user) {
        ol.append(jQuery('<li></li>').text(user));
    });
    jQuery('#users').html(ol);
});

//on recieving the new message we broadcast it by appending list messages
socket.on('newMessage', function(message) {
    var tm = moment(message.createdAt).format('h:mm a');
    //____________RENDERING USING MUSTACHE
    //returns the html element from index.html
    var template = jQuery('#message-template').html();
    //.render(template,<object>) creates dynamic value provided by us
    var html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt: tm
    });
    jQuery('#messages').append(html);
    scroll();
    /* _____________SIMPLE METHOD WITHOUT RENDERING (MUSTACHE)______________________
    console.log('newMessage', message);
    
    var li = jQuery('<li></li>');
    li.text(`${tm} ${message.from}: ${message.text}`);

    jQuery('#messages').append(li);*/
});
var textbox = jQuery('[name=message]');

//on clicking the submit we emit 
jQuery('#message-form').on('submit', function(e) {
    e.preventDefault();

    socket.emit('createMessage', {
        text: textbox.val()
    }, function() {
        //clearing value 
        textbox.val('')
    });
});