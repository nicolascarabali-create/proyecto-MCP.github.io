  import express from "express";
  import cors from "cors";
  import dotenv from "dotenv";
  import OpenAI from "openai";
  import multer from "multer";
  import fs from "fs";
  import * as pdfParse from "pdf-parse";

  dotenv.config();

  console.log("API KEY:");
  console.log(process.env.OPENAI_API_KEY);

  const app = express();

  app.use(cors());
  app.use(express.json());
  
  app.get("/", (req,res)=>{

res.send(`
<h1>MCP Amalakay funcionando 🚀</h1>
<p>Servidor activo correctamente</p>
`);

});
  /* ================= MULTER ================= */

  const upload = multer({
    dest: "uploads/"
  });

  /* ================= CLIENTE IA ================= */

  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: "https://openrouter.ai/api/v1"
  });

  /* ================= CONTEXTO MCP ================= */

  const MCP_CONTEXT = `
  Eres Amalakay.

  Especializado en:
  - Mecatrónica
  - Robótica
  - Automatización industrial
  - Electrónica
  - PLC
  - Control industrial
  - Arduino
  - Programación aplicada
  - IA en ingeniería

  REGLAS:
  1. Respuestas claras, técnicas y paso a paso.
  2. No inventar información.
  `;

  /* ================= CHAT ================= */

  app.post("/ai-chat", async (req, res) => {

    try {

      const message = req.body.message;

      const completion = await client.chat.completions.create({
        model: "openai/gpt-4o-mini",
        messages: [
          { role: "system", content: MCP_CONTEXT },
          { role: "user", content: message }
        ],
        temperature: 0.4
      });

      res.json({
        response: completion.choices[0].message.content
      });

    } catch (err) {

      console.error(err);

      res.status(500).json({
        response: "❌ Error en MCP"
      });

    }

  });

  /* ================= SUBIDA DE ARCHIVOS ================= */

  app.post("/upload", upload.single("file"), async (req, res) => {

    try {

      const filePath = req.file.path;
      const fileName = req.file.originalname.toLowerCase();

      let text = "";

      /* ===== TXT / CÓDIGO ===== */
      if (
        fileName.endsWith(".txt") ||
        fileName.endsWith(".js") ||
        fileName.endsWith(".py") ||
        fileName.endsWith(".cpp") ||
        fileName.endsWith(".ino") ||
        fileName.endsWith(".json")
      ) {
        text = fs.readFileSync(filePath, "utf-8");
      }

      /* ===== PDF ===== */
      else if (fileName.endsWith(".pdf")) {

        const buffer = fs.readFileSync(filePath);

        const pdfData = await pdfParse.default(buffer);

        text = pdfData.text;

      }

      else {
        fs.unlinkSync(filePath);

        return res.status(400).json({
          response: "❌ Formato no soportado"
        });
      }

      /* ===== IA ===== */

      const completion = await client.chat.completions.create({
        model: "openai/gpt-4o-mini",
        messages: [
          { role: "system", content: MCP_CONTEXT },
          {
            role: "user",
            content: `
  Analiza este documento técnico:

  ${text}
            `
          }
        ],
        temperature: 0.4
      });

      fs.unlinkSync(filePath);

      res.json({
        response: completion.choices[0].message.content
      });

    } catch (err) {

      console.error(err);

      res.status(500).json({
        response: "❌ Error procesando archivo"
      });

    }

  });
/* ================= MCP TOOLS ================= */

/*
ARDUINO TOOL
*/

app.post("/tool/arduino", async(req,res)=>{

try{

const code=req.body.code;

const completion =
await client.chat.completions.create({

model:"openai/gpt-4o-mini",

messages:[

{
role:"system",
content:MCP_CONTEXT
},

{
role:"user",
content:
`
Analiza este código Arduino:

${code}
`
}

]

});

res.json({

result:
completion.choices[0].message.content

});

}catch(err){

res.json({

result:"Error Arduino Tool"

});

}

});


/*
PLC TOOL
*/

app.post("/tool/plc", async(req,res)=>{

try{

const plc=req.body.code;

const completion=
await client.chat.completions.create({

model:"openai/gpt-4o-mini",

messages:[

{
role:"system",
content:MCP_CONTEXT
},

{
role:"user",
content:
`
Analiza este proyecto PLC:

${plc}
`
}

]

});

res.json({

result:
completion.choices[0].message.content

});

}catch{

res.json({

result:"Error PLC"

});

}

});


/*
PYTHON TOOL
*/

app.post("/tool/python", async(req,res)=>{

try{

const code=req.body.code;

const completion=
await client.chat.completions.create({

model:"openai/gpt-4o-mini",

messages:[

{
role:"system",
content:MCP_CONTEXT
},

{
role:"user",
content:
`
Analiza este código Python:

${code}
`
}

]

});

res.json({

result:
completion.choices[0].message.content

});

}catch{

res.json({

result:"Error Python"

});

}

});
  
  /* ================= SERVIDOR ================= */

  app.listen(3000, () => {
    console.log("🚀 MCP ACTIVO");
    console.log("http://localhost:3000");
  });