const chatBox=document.querySelector('.chatbox');
const closebtn = document.querySelector('.chatbox__close');
const discussion = document.querySelector('.chatbox__conversation');
const closedContainer = document.querySelector('.closed');
const openedContainer = document.querySelector('.opened');
const input = document.querySelector('.chatbox__message--input');
const greetingContainer = document.querySelector('.greeting');
const greetingClosebtn = document.querySelector('.greeting__close');
const bubble = document.querySelector('.bubble__container');
const sendbtn = document.querySelector('.chatbox__message--send');
const botquestionRepliesText=document.querySelector('.botquestion__replies--text')
let sendEvent;
let quickreplies;
let response;

document.addEventListener('click', (event) => {
    if (chatBox && !chatBox.contains(event.target) 
        && bubble && !bubble.contains(event.target)
    ) 
    {
        // closedContainer.classList.remove('closed-hide');
        // openedContainer.classList.remove('opened-show');
        // resetConversation();
        console.log('hello');
        
    }
});


bubble.addEventListener('click', () => {
    closedContainer.classList.add('closed-hide');
    openedContainer.classList.add('opened-show');
})

closebtn.addEventListener('click', () => {
    closedContainer.classList.remove('closed-hide');
    openedContainer.classList.remove('opened-show');
    resetConversation();
})

greetingClosebtn.addEventListener('click', () => {
    greetingContainer.classList.add('greeting-animation');
})


const userCaption = document.createElement('div');
userCaption.className = 'usercaption';

const textDiv = document.createElement('div');
textDiv.className = 'usercaption__text';
textDiv.textContent = 'You';

userCaption.appendChild(textDiv);

//chatbot caption 

const chatBotCaption = document.createElement('div');
chatBotCaption.className = 'caption';

const container = document.createElement('div');
container.className = 'caption__container';

const avatar = document.createElement('div');
avatar.className = 'caption__avatar';

const avatarContent = document.createElement('div');
avatarContent.className = 'caption__avatar--content';

const avatarImage = document.createElement('img');
avatarImage.src = './images/chat-icon.png';
avatarImage.alt = 'avatar';
avatarImage.className = 'caption__avatar--image';

avatarContent.appendChild(avatarImage);
avatar.appendChild(avatarContent);
container.appendChild(avatar);

const textSpan = document.createElement('span');
textSpan.className = 'caption__text';
textSpan.textContent = 'ChatBot';

container.appendChild(textSpan);
chatBotCaption.appendChild(container);


const userResponse = (res) => {
    return `<div class="userresponse">
                <div class="userresponse__text">${res}</div>
            </div>`
}

const chatbotResponse = (res) => {
    return `<div class="botresponse">
                <div class="botresponse__text">${res}</div>
            </div>`
}

const chatbotQuickreply = () => {
    return `<div class="botquestion">
                <div class="botquestion__text">What information are you looking for?</div>
                <div class="botquestion__replies">
                    <div class="botquestion__replies--text">🌡️Temperature</div>
                    <div class="botquestion__replies--text">🕛Time</div>
                    <div class="botquestion__replies--text">🎐Wind Speed</div>
                    <div class="botquestion__replies--text">⛅Weather Status</div>
                </div>
            </div>`;
}

const chatbotMoredetails = () => {
    return `<div class="botquestion">
                <div class="botquestion__text">looking for more information?</div>
                <div class="botquestion__replies">
                    <div class="botquestion__replies--text">Yes</div>
                    <div class="botquestion__replies--text">No</div>
                </div>
            </div>`;
}

const chatbotSame = (city) => {
    return `<div class="botquestion">
                <div class="botquestion__text">${city} or Any other City?</div>
                <div class="botquestion__replies">
                    <div class="botquestion__replies--text">${city}</div>
                    <div class="botquestion__replies--text">Other</div>
                </div>
            </div>`;
}

const startAgain = document.createElement('div');
startAgain.className = 'start';

const button = document.createElement('button');
button.className = 'start__btn';
button.textContent = 'Start the chat again';

startAgain.appendChild(button);

const matchCityOrAlternative = (city) => {
    quickreplies.forEach(item => {
        item.addEventListener('click', () => {
            const repliesContainer = document.querySelector('.botquestion__replies');
            repliesContainer.remove();
            discussion.appendChild(userCaption)
            discussion.innerHTML += userResponse(item.innerHTML);
            discussion.appendChild(chatBotCaption)
            if(item.innerHTML == city){
                discussion.innerHTML += chatbotQuickreply();
                discussion.scrollTo(0, discussion.scrollHeight - 330);
                quickreplies = document.querySelectorAll('.botquestion__replies--text');
                handleSameCityReplies(quickreplies, city);
            }
            else if(item.innerHTML == 'Other'){
                discussion.innerHTML += chatbotQuickreply();
                quickreplies = document.querySelectorAll('.botquestion__replies--text');
                handleQuickReplyAction();
                discussion.scrollTo(0, discussion.scrollHeight - 330);
            }
        })
    })
}

const getData = (city) => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&&appid=66994ba9a9d0ad6d2d9d878fc92faf52`)
    .then((response) => {
        if (!response.ok) {
            throw new Error("Invalid city");
        }
        return response.json();
    })
    .then((data) => {
        if(response == '🌡️Temperature'){
            discussion.appendChild(chatBotCaption)
            discussion.innerHTML += chatbotResponse(`${data.main.temp} °C`);
            discussion.innerHTML += chatbotMoredetails();
            discussion.scrollTo(0, discussion.scrollHeight - 345)
            input.value = "";
            input.disabled = true;
            quickreplies = document.querySelectorAll('.botquestion__replies--text');
            manageCityReplyEvent(quickreplies, city);
        }
        else if(response == '🕛Time'){
            input.value = "";
            input.disabled = true;
            fetch("https://api.api-ninjas.com/v1/timezone?city=" + city, {
                    headers: { "X-Api-Key": "Yru7ISH3Xk3w3IRT9uTInA==jIeiYB0f79vIAJwq" },
                    contentType: "application/json",
                }).then(response => response.json())
                .then(data => {
                    let time = new Date().toLocaleString("en-US", {
                    timeStyle: "medium",
                    hourCycle: "h12",
                    });
                    discussion.appendChild(chatBotCaption)
                    discussion.innerHTML += chatbotResponse(`${time}`);
                    discussion.innerHTML += chatbotMoredetails();
                    discussion.scrollTo(0, discussion.scrollHeight - 345)
                    quickreplies = document.querySelectorAll('.botquestion__replies--text');
                    manageCityReplyEvent(quickreplies, city);
                });
            
        }
        else if(response == '🎐Wind Speed'){
            discussion.appendChild(chatBotCaption)
            discussion.innerHTML += chatbotResponse(`${data.wind.speed} meter/sec`);
            discussion.innerHTML += chatbotMoredetails();
            discussion.scrollTo(0, discussion.scrollHeight - 345)
            input.value = "";
            input.disabled = true;
            quickreplies = document.querySelectorAll('.botquestion__replies--text');
            manageCityReplyEvent(quickreplies, city);
        }
        else if(response == '⛅Weather Status'){
            const status = data.weather[0].description;
            discussion.appendChild(chatBotCaption)
            discussion.innerHTML += chatbotResponse(`${status.charAt(0).toUpperCase() + status.slice(1)}`);
            discussion.innerHTML += chatbotMoredetails();
            discussion.scrollTo(0, discussion.scrollHeight - 345)
            input.value = "";
            input.disabled = true;
            quickreplies = document.querySelectorAll('.botquestion__replies--text');
            manageCityReplyEvent(quickreplies, city);
        }
    })
    .catch(error => {
        discussion.appendChild(chatBotCaption)
        discussion.innerHTML += chatbotResponse('Please enter a valid city name! 🤕');
        discussion.scrollTo(0, discussion.scrollHeight - 345)
        input.value = "";
        input.focus();
    });
    
}


const manageCityReplyEvent = (res, city) => {
    res.forEach(item => {
        item.addEventListener('click', () => {
            const repliesContainer = document.querySelector('.botquestion__replies');
            repliesContainer.remove();
            discussion.appendChild(userCaption)
            discussion.innerHTML += userResponse(item.innerHTML);
            discussion.appendChild(chatBotCaption)
            if(item.innerHTML == 'Yes'){
                discussion.innerHTML += chatbotSame(city);
                discussion.scrollTo(0, discussion.scrollHeight - 330);
                quickreplies = document.querySelectorAll('.botquestion__replies--text');
                matchCityOrAlternative(city);
            }
            else if(item.innerHTML == 'No'){
                discussion.innerHTML += chatbotResponse('Thank You! 😊');
                discussion.appendChild(startAgain)
                discussion.scrollTo(0, discussion.scrollHeight - 345)
                const startbtn = document.querySelector('.start__btn');
                startbtn.addEventListener('click', () => {
                    resetConversation();
                })
            }
        })
    })
}


const sendCity = () => {
    let city = input.value;
    if(city!=""){
    discussion.appendChild(userCaption)
    discussion.innerHTML += userResponse(city);
    getData(city);
    }
}

sendbtn.addEventListener('click', () => {
    sendCity();
});

addEventListener('keyup', (e) => {
    if(e.key == 'Enter'){
        sendCity();
    }
})
    
const handleSameCityReplies = (quickreplies, city) => {
    quickreplies.forEach(item => {
        item.addEventListener('click', () => {
            response = item.innerHTML;
            const reply = userResponse(item.innerHTML);
            discussion.appendChild(userCaption)
            discussion.innerHTML += reply;
            const repliesContainer = document.querySelector('.botquestion__replies');
            repliesContainer.remove();
            discussion.scrollTo(0, discussion.scrollHeight - 330);
            getData(city);
        })
    })
}

const handleQuickReplyAction = () => {
    quickreplies.forEach(item => {
        item.addEventListener('click', () => {
            response = item.innerHTML;
            const reply = userResponse(item.innerHTML);
            discussion.appendChild(userCaption)
            discussion.innerHTML += reply;
            discussion.appendChild(chatBotCaption)
            discussion.innerHTML += chatbotResponse('Please enter your city name in the typing area! 😊');
            input.disabled = false;
            input.focus();
            const repliesContainer = document.querySelector('.botquestion__replies');
            repliesContainer.remove();
            discussion.scrollTo(0, discussion.scrollHeight - 330);
        })
    })
}


//code to reset discussion
const resetConversation = () => {
    while(discussion.innerHTML)
    discussion.removeChild(discussion.firstChild);
    discussion.appendChild(chatBotCaption)
    discussion.innerHTML += chatbotResponse("Hi! I'm Mr. Chatbot 😎 Nice to meet you! 👋");
    discussion.innerHTML += chatbotQuickreply();
    quickreplies = document.querySelectorAll('.botquestion__replies--text');
    handleQuickReplyAction();
}

resetConversation();