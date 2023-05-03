const { Configuration, OpenAIApi } = require("openai");

const config = new Configuration({
  apiKey: "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",
});

const chatgpt = async (req, res) => {
  const apiMessages = req.body.messages;
  let resmessage;
  console.log(req.body);
  const openapi = new OpenAIApi(config);

  // const apiRequestBody = {
  //   model: "gpt-3.5-turbo",
  //   messages: [
  //     // The system message DEFINES the logic of our chatGPT
  //     ...apiMessages, // The messages from our chat with ChatGPT
  //   ],
  // };
  openapi
    .createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        // The system message DEFINES the logic of our chatGPT
        ...apiMessages, // The messages from our chat with ChatGPT
      ],
    })
    .then((response) => {
      console.log(response.data.choices[0].message);
      resmessage = response.data.choices[0].message.content;
      //res.send(response.data.choices[0].message);
      //res.send();
      newMessage = {
        sender: "ChatGPT",
        message: response.data.choices[0].message.content,
        direction: "incoming",
        position: "normal",
      };
      res.status(200).json({ newMessage });
    });
};

module.exports = { chatgpt };
