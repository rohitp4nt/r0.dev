require("dotenv").config();
import express, { response } from "express";
import {basePrompt as nodeBasePrompt} from "./defaults/node";
import {basePrompt as reactBasePrompt} from "./defaults/react";
import { BASE_PROMPT, getSystemPrompt } from "./prompts";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const { GoogleGenerativeAI } = require("@google/generative-ai");
const app = express();
app.use(express.json());

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// const aiprompt = "Write the code for a todo application in js";

const SYSTEM_PROMPT = "Return either node or react based on what do you think this project should be. Only return a single word either 'node' or 'react'. Do not return anything extra";

app.post("/template", async (req, res) => {
  const prompt = req.body.prompt;
  const aiprompt = `${SYSTEM_PROMPT}\n\n${prompt}`;

  const result = await model.generateContent(aiprompt);
  // const answer = result.response.text();

  const answer = result.response.text().trim();
  console.log("Full Response:", answer); 


  if (answer == "react") {
    res.json({
        prompts: [BASE_PROMPT, `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
        uiPrompts: [reactBasePrompt]
    })
    return;
}

if (answer === "node") {
    res.json({
        prompts: [`Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
        uiPrompts: [nodeBasePrompt]
    })
    return;
}
res.status(403).json({message: "You cant access this"})
    return;


});


app.post("/chat", async (req, res)=>{
    const  messages = req.body.messages;
    const aiprompt = `${getSystemPrompt()}\n\n${messages}`;
    console.log(aiprompt);

    const result = await model.generateContent(aiprompt);
  
    const answer = result.response.text();
    console.log("Full Response:", answer); 
    res.json({response: answer});
});

//chat api is for generating the final response 
app.listen(3000);




