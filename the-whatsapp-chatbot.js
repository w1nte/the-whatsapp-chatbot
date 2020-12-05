// ==UserScript==
// @name         the-whatsapp-chatbot
// @namespace    https://web.whatsapp.com/
// @version      0.1
// @description  don't blame me please
// @author       w1nte
// @match        https://web.whatsapp.com/
// @grant        GM_xmlhttpRequest
// ==/UserScript==

const SEND_MESSAGE_BUTTON_QUERY = '#main > footer > div._1mHgA.copyable-area > div:nth-child(3) > button > span';

const TEXT_INPUT_QUERY = '._2AuNk div._1awRl.copyable-text.selectable-text';

const INCOMING_MESSAGES_QUERY = '.message-in .selectable-text span';

const DEBUG = true;

const BOT_SERVER_CONFIG = {
    url: "http://localhost:5555/",
    method: "POST"
};

let isBotEnabled = false;


function debug(message, ...args) {
    if (DEBUG) {
        console.log(message, ...args);
    }
}

function dispatch(input, message) {
    const evtConfig = { bubbles: true };
    const InputEvent = Event || InputEvent;
    const sendMessageButton = document.querySelector(SEND_MESSAGE_BUTTON_QUERY);

    if (!sendMessageButton) {
        console.warn('no send message button found, maybe you have to adapt the selector query `SEND_MESSAGE_BUTTON_QUERY` in the script!');
    }

    const evtFocus = new InputEvent('focus', evtConfig);
    const evtInput = new InputEvent('input', evtConfig);

    // set text of message
    input.textContent = message;
    input.dispatchEvent(evtFocus);
    input.dispatchEvent(evtFocus);

    // send message
    sendMessageButton.click();
}

function getLatestIncomingMessage() {
    const incomingMessages = document.querySelectorAll(INCOMING_MESSAGES_QUERY);
    if (incomingMessages.length <= 0) {
        console.warn('no incoming messages found, maybe you have to adapt the selector query `INCOMING_MESSAGES_QUERY` in the script!');
        return '';
    }

    const latestMessage = incomingMessages[incomingMessages.length - 1];

    return latestMessage.innerHTML;
}

function buildAskBotRequest(message) {
    return {
        method: BOT_SERVER_CONFIG.method,
        url: BOT_SERVER_CONFIG.url,
        data: message,
        headers: {
            "Content-Type": "application/json"
        },
        onload: (response) => {
            const input = document.querySelector(TEXT_INPUT_QUERY);
            if (!input) {
                console.warn('no send message input field found, maybe you have to adapt the selector query `TEXT_INPUT_QUER` in the script!');
                return '';
            }

            debug('bot response:', response.responseText);
            dispatch(input, response.responseText);
        },
        onerror: () => {
            console.warn('chat-bot server is not reachable! please check if the server is running locally and the `BOT_SERVER_CONFIG` is correct!');
        }
    }
}

function askBot() {
    const yourMessageToTheBot = getLatestIncomingMessage();

    debug('ask bot:', yourMessageToTheBot);
    const botRequest = buildAskBotRequest(yourMessageToTheBot);

    GM_xmlhttpRequest(botRequest);
}

function onWhatsAppReady(callback) {
    let waitUntilWhatsAppLoadedTimer;
    const isWhatsAppReady = () => {
        if (document.getElementsByClassName('app-wrapper-web')[0] != null) {
            callback();
            clearInterval(waitUntilWhatsAppLoadedTimer);
        } else {
            debug('Waiting for Whatsapp to load...');
        }
    }
    waitUntilWhatsAppLoadedTimer = setInterval(isWhatsAppReady, 1000);
}

function createBotControlUI() {
    const botControl = document.createElement("div");
    botControl.style = "position: absolute; left: 10px; top: 10px; z-index: 9999;";

    const enableBotButton = document.createElement("button");
    enableBotButton.style = "background-color: #d13126; padding: 2rem; border-radius: 3px;";
    enableBotButton.innerHTML = "Chat-Bot disabled";
    enableBotButton.addEventListener('click', () => {
        isBotEnabled = !isBotEnabled;

        if (isBotEnabled) {
            enableBotButton.style.backgroundColor = '#11a2d6';
            enableBotButton.innerHTML = "Chat-Bot enabled";
        } else {
            enableBotButton.style.backgroundColor = '#d13126';
            enableBotButton.innerHTML = "Chat-Bot disabled";
        }
    });

    const askBotManually = document.createElement("button");
    askBotManually.innerHTML = "Force ask-Bot";
    askBotManually.style = "background-color: #f5f5f5; padding: 2rem; border-radius: 3px; margin-left: 2px;";
    askBotManually.addEventListener('click', () => {
        askBot();
    });

    botControl.appendChild(enableBotButton);
    botControl.appendChild(askBotManually);

    return botControl;
}

(function() {
    'use strict';

    debug('debug mode enabled');

    onWhatsAppReady(() => {
        const botControlUI = createBotControlUI();
        document.body.appendChild(botControlUI);

        let latestMessage = "";
        const checkForUpdates = () => {
            if (isBotEnabled) {
                debug("Check for update");
                const newMessage = getLatestIncomingMessage();
                if (newMessage != latestMessage) {
                    debug("New message detected:", newMessage);
                    latestMessage = newMessage;
                    askBot();
                }
            }
        }
        const checkTimer = setInterval(checkForUpdates,2000);
    });

})();