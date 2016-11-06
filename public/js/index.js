/* eslint-disable */
function scrollToBottom() {
  var heights = $('#messages li')
    .toArray()
    .map(function (li) {
      return $(li).height();
    });

  if (heights.length > 0) {
    $('#messages').scrollTop(heights.reduce(function (a, b) {
      return a + b;
    }));
  }
}

$(function() {
  var socket = io();
  function sendMessage() {
    if (!$('#m').val().trim()) {
      alert('You cannot send an empty message.');
      return false;
    }

    socket.emit('message', {
      username: $('#username').val(),
      message: $('#m').val(),
    });
    $('#m').val('');

    return false;
  }

  $("#m").keydown(function (event) {
    if ((event.metaKey || event.ctrlKey) && event.keyCode == 13)
      sendMessage();
  });

  $('#username-form').submit(function() {
    if (!$('#username').val().trim()) {
      alert('Please input a username.');
      return false;
    }

    $('#username-container').hide();
    socket.emit('user-join', $('#username').val().trim());

    return false;
  });

  $('#message-bay').submit(function() {
    return sendMessage();
  });

  socket.on('user-join', function(name) {
    alert(name + ' has joined!');
  });

  socket.on('messages', function(data) {
    data.messages.map(function(message) {
        $('#messages')
          .append($('<li>')
          .text(message.username + ':' + message.message));
    });
    scrollToBottom();
  });

  socket.on('user-disconnect', function(name) {
    alert(name + ' has left!');
  });

  socket.on('message', function(data) {
    $('#messages').append($('<li>').text(data.username + ':' + data.message));
    scrollToBottom();
  });
});
