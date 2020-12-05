from chatterbot.trainers import ListTrainer
from chatterbot import ChatBot
from chatterbot.comparisons import LevenshteinDistance
from chatterbot.response_selection import get_first_response
from http.server import BaseHTTPRequestHandler, HTTPServer


# configuration
chatbot_name = 'your-bot'
hostName = "localhost"
serverPort = 5555


class MyServer(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)

        print("got:", post_data, flush=True)
        bot_response = chatbot.get_response(str(post_data))
        print("answer:", bot_response, flush=True)

        self.send_response(200)
        self.send_header("Content-type", "application/json")
        self.end_headers()
        self.wfile.write(bytes(str(bot_response), "utf-8"))


if __name__ == "__main__":
    chatbot = ChatBot(
        chatbot_name,
        logic_adapters=[
            {
                "import_path": "chatterbot.logic.BestMatch",
                "statement_comparison_function": LevenshteinDistance,
                "response_selection_method": get_first_response
            },
            'chatterbot.logic.MathematicalEvaluation'
        ],
    )

    trainer = ListTrainer(chatbot)

    conversation = [
        "Hallo",
        "Hey",
        "Wie heißt du?",
        "Ich heiße {}".format(chatbot_name)
    ]

    trainer.train(conversation)

    webServer = HTTPServer((hostName, serverPort), MyServer)
    print("Chatbot-Server started http://%s:%s" % (hostName, serverPort))

    try:
        webServer.serve_forever()
    except KeyboardInterrupt:
        pass

    webServer.server_close()
    print("Chatbot-Server stopped.")