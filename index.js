navigator.getUserMedia = ( navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia);

navigator.getUserMedia({ video: true, audio: false }, function(stream){

    var Peer = require('simple-peer');

    var peer = new Peer({ initiator: location.hash === '#1', trickle: false, stream: stream });

    peer.on('signal', function(data){
        document.getElementById('yourId').value = JSON.stringify(data);
    });

    document.getElementById('connect').addEventListener('click', function(){
        var otherId = JSON.parse(document.getElementById('otherId').value);
        peer.signal(otherId);
    });

    document.getElementById('send').addEventListener('click', function(){
        var message = document.getElementById('yourMessage').value;
        document.getElementById('messages').textContent += message + '\n';
        peer.send(message);
    });

    peer.on('data', function(data){
        document.getElementById('messages').textContent += data + '\n';
    });

    peer.on('stream', function(stream){
        var videoElement = document.createElement('video');
        document.body.appendChild(videoElement);

        if ('srcObject' in videoElement) {
            videoElement.srcObject = stream
        } else {
            videoElement.src = window.URL.createObjectURL(stream) // for older browsers
        }
          
        videoElement.play();
    });

}, function(err){
    console.error(err);
});