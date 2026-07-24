const login = document.getElementById("login");
const chat = document.getElementById("chat");

const password = document.getElementById("password");
const nickname = document.getElementById("nickname");

const button = document.getElementById("continue");

const error = document.getElementById("error");

const send = document.getElementById("send");
const message = document.getElementById("message");

const messages = document.getElementById("messages");

let user = localStorage.getItem("nickname") || "";

let stage = 0;

// =====================

function showError(text){

error.textContent=text;

setTimeout(()=>{

error.textContent="";

},2500);

}

// =====================

function openChat(){

login.style.opacity="0";
login.style.transform="scale(.96)";

setTimeout(()=>{

login.style.display="none";

chat.style.display="flex";

requestAnimationFrame(()=>{

chat.classList.add("show");

});

},450);

}

// =====================

if(user){

nickname.value=user;

openChat();

}

// =====================

button.onclick=()=>{

// ЭТАП 1

if(stage===0){

if(password.value!=="pupsland"){

showError("Неверный пароль");

password.value="";

return;

}

password.style.display="none";

nickname.style.display="block";

nickname.focus();

button.textContent="Войти";

stage=1;

return;

}

// ЭТАП 2

if(stage===1){

const nick=nickname.value.trim();

if(nick.length<2){

showError("Введите псевдоним");

return;

}

localStorage.setItem("nickname",nick);

user=nick;

openChat();

addMessage(

"Система",

"Добро пожаловать в PupsLand Chat 👋",

false

);

}

};

// =====================

function getTime(){

const d=new Date();

return d.getHours().toString().padStart(2,"0")

+":"

+d.getMinutes().toString().padStart(2,"0");

}
// =====================
// Создание сообщения
// =====================

function addMessage(author, text, self = false) {

    const msg = document.createElement("div");
    msg.className = self ? "message self" : "message";

    msg.innerHTML = `
        <div class="author">${author}</div>
        <div class="text">${text}</div>
        <div class="time">${getTime()}</div>
    `;

    messages.appendChild(msg);

    messages.scrollTop = messages.scrollHeight;
}

// =====================
// Отправка
// =====================

function sendMessage() {

    const text = message.value.trim();

    if (text === "") return;

    addMessage(user, text, true);

    message.value = "";

    message.focus();

}

// Кнопка
send.onclick = sendMessage;

// Enter
message.addEventListener("keydown", e => {

    if (e.key === "Enter") {

        e.preventDefault();

        sendMessage();

    }

});

// =====================
// Демо сообщения
// =====================

setTimeout(() => {

    if (chat.classList.contains("show")) {

        addMessage(
            "PupsLand",
            "Добро пожаловать в общий чат!"
        );

    }

}, 1500);

setTimeout(() => {

    if (chat.classList.contains("show")) {

        addMessage(
            "Система",
            "Пока сервер не подключён, сообщения видны только тебе."
        );

    }

}, 2800);
