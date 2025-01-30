require("dotenv").config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;


const { GoogleGenerativeAI } = require("@google/generative-ai");

// const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
// const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// const aiprompt = "create a todo application";

// async function main() {
//     const result = await model.generateContent(aiprompt);
// console.log(result.response.text());
// }

// main();

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const aiprompt = "Write the code for a todo application in js";

 async function main() {
    const result = await model.generateContentStream(aiprompt);

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      process.stdout.write(chunkText);
    }  
 }
main();
