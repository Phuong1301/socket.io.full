var socket = io();

socket.on('connected', function(data) {
    console.log(data);
});

var login = document.getElementById('login');
var inputLogin = document.querySelector('#input-login');

var search = document.getElementById('search');
var inputSearch = document.getElementById('input-search');
var submitSearch = document.getElementById('submit-search')

var form = document.getElementById('chat-box');
var input = document.getElementById('input');

login.addEventListener('submit', function(e) {
    e.preventDefault();
    if(inputLogin.value) {
        socket.emit('addUser', [inputLogin.value, socket.id]);
    }
    socket.on('addUser', function(data) {
        login.style.display = "none";
        search.style.display = "block";
        document.querySelector("#name").innerText = "Tên tài khoản của bạn: " + data;
        document.querySelector("#name").style.color = "black";
    });

    socket.on('userOnline', function(data) {
        function userOnline() {
            let ds = ""
            for(let i = 0; i < data.length; i++) {
                ds += data[i].name + ", "
            }
            return ds;
        };

        console.log(userOnline());
        document.querySelector("#online").innerText = "Những người đang online: "+ userOnline();
    });


    socket.on('error', function(data) {
        document.querySelector("#name").innerText = data;
        document.querySelector("#name").style.color = "red";
    });
});

search.addEventListener('submit', function(e) {
    e.preventDefault();
    if(inputSearch.value) {
        socket.emit('findUser', inputSearch.value);
    }
    socket.on('found', function(data) {
        form.style.display = "block";
        document.getElementById('header').innerHTML = `<span id="userChat">${data.name}</span>`;
        document.querySelector("#find").innerText = "";
    });

    socket.on('notfound', function(data) {
        document.querySelector("#find").innerText = data;
        form.style.display = "none";
    })
});

form.addEventListener('submit', function(e) {
    e.preventDefault();
    var data = document.getElementById('userChat').textContent;
    if (input.value) {
        socket.emit('chat-message', [data, input.value]);
        input.value = '';
    }

});

socket.on('chat', function(msg) {
    var user = document.getElementById('userChat').textContent;
    function sendChat() {
        if(user == msg[1]) {
            message = msg[0];
        }
        else {
            message = '';
        }
        return message;
    }
    document.getElementById("view-chat").innerHTML += sendChat();
}); 

