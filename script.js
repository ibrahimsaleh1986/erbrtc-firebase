//Create an account on Firebase, and use the credentials they give you in place of the following
var config = {
    apiKey: "AIzaSyB_hC6EAi4Lcubx5oKdt6XhfUhy9eIqt3A",
    authDomain: "maqraa-18b00.firebaseapp.com",
    databaseURL: "https://maqraa-18b00.firebaseio.com",
    projectId: "maqraa-18b00",
    storageBucket: "maqraa-18b00.appspot.com",
    messagingSenderId: "484319770328",
    appId: "1:484319770328:web:d814f4b0787ebcdca709ad",
    measurementId: "G-4M23TN8TNL"
};
firebase.initializeApp(config);

var partnerAudio = document.querySelector('.audio.partner');

var database = firebase.database().ref();
// var yourVideo = document.getElementById("yourVideo");
// var friendsVideo = document.getElementById("friendsVideo");
var yourId = Math.floor(Math.random()*1000000000);
//Create an account on Viagenie (http://numb.viagenie.ca/), and replace {'urls': 'turn:numb.viagenie.ca','credential': 'websitebeaver','username': 'websitebeaver@email.com'} with the information from your account
var servers = {'iceServers': [{'urls': 'stun:stun.services.mozilla.com'}, {'urls': 'stun:stun.l.google.com:19302'}]};
var pc = new RTCPeerConnection(servers);
pc.onicecandidate = (event => event.candidate?sendMessage(yourId, JSON.stringify({'ice': event.candidate})):console.log("Sent All Ice") );
pc.onaddstream = (event => partnerAudio.srcObject = event.stream);

function sendMessage(senderId, data) {
    var msg = database.push({ sender: senderId, message: data });
	// if(messageRead)
		msg.remove();
}
var messageRead = false;
function readMessage(data) {
    var msg = JSON.parse(data.val().message);
    var sender = data.val().sender;
    if (sender != yourId) {
        if (msg.ice != undefined)
            pc.addIceCandidate(new RTCIceCandidate(msg.ice));
        else if (msg.sdp.type == "offer")
            pc.setRemoteDescription(new RTCSessionDescription(msg.sdp))
              .then(() => pc.createAnswer())
              .then(answer => pc.setLocalDescription(answer))
              .then(() => sendMessage(yourId, JSON.stringify({'sdp': pc.localDescription})));
        else if (msg.sdp.type == "answer")
            pc.setRemoteDescription(new RTCSessionDescription(msg.sdp));
		// messageRead = true;
    }
};

database.on('child_added', readMessage);

function showMyFace() {
  navigator.mediaDevices.getUserMedia({audio:true})
    // .then(stream => yourVideo.srcObject = stream)
    .then(stream => pc.addStream(stream));
}

function showFriendsFace() {
  pc.createOffer()
    .then(offer => pc.setLocalDescription(offer) )
    .then(() => sendMessage(yourId, JSON.stringify({'sdp': pc.localDescription})) );
}

// function stopStreamedAudio() {
  // const stream = partnerAudio.srcObject;
  // const tracks = stream.getTracks();

  // tracks.forEach(function(track) {
    // track.stop();
  // });

  // // partnerAudio.srcObject = null;
// }
// function mute(){
	// // audio1.srcObject.getTracks().forEach(t => t.enabled = !t.enabled);
	// // partnerAudio.srcObject.getTracks().forEach(t => t.muted = !t.muted);
	// audio1.srcObject.getTracks()[0].stop();
	
// }