# The Whatsapp Chatbot :speech_balloon:

This is a Chatbot for Whatsapp, based on Chatterbot. It uses a Tampermonkey script for `web.whatsapp.com` to automatically answer the incoming messages.
This is just a fun project and I don't take liability for the sent messages of the bot :grin:.

# :star2: Set-up your chatty bot
1. use Linux or at least Windows Subsystems for Linux (WSL 1 or 2) to execute the python script
2. I recommend to create a python environment with Python 3.6 (venv or Conda)
3. install the requirements `pip3 install -r requirements.txt`
4. add [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=de) to your chrome browser.
5. install and enable the script `the-whatsapp-chatbot.js` in Tampermonkey.
6. start the chatbot-server with `python3 main.py` and open `web.whatsapp.com` in the browser.
7. Now, on `web.whatsapp.com` at the left-top corner should be new big buttons.
8. Open a conversation and enable the bot.
9. Have fun! :thumbsup:

should something not work, check the browsers console log (F12), maybe you have to adapt the 
query selectors for the whats-app page.
