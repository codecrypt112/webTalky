const express = require("express");
const app = express();
const port = 5000;
const gtts = require("node-gtts");
const path = require("path");
const puppeteer = require("puppeteer");
const cors = require("cors");
const fs = require("fs");
const translatte = require("translatte");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.post("/get_text", async (req, res) => {
	let { url, name, lang } = req.body;
	try {
	  const filepath = path.join(__dirname, `${name}.mp3`);
	  const browser = await puppeteer.launch({ timeout: 60000 });
	  const page = await browser.newPage();
	  await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36');
	  await page.goto(url);
	  const content = await page.$eval("*", (el) => el.innerText);
	  const strippedContent = content.replace(/[^\S\r\n]+/g, " ").trim();
	  console.log(strippedContent);
	  // Translate the content using translatte
	  translatte(strippedContent, { to: lang })
		.then((translated) => {
		  const translatedText = translated.text;
		  // Save the translated text to the audio file
		  const gtts = require("node-gtts")(lang);
		  gtts.save(filepath, translatedText, function () {
			console.log("Audio Downloaded");
		  });
  
		  const audioStream = fs.createReadStream(filepath);
  
		  audioStream.on("open", function () {
			res.set("Content-Type", "audio/mpeg");
			audioStream.pipe(res);
		  });
  
		  audioStream.on("error", function (err) {
			res.status(500).send(err);
		  });
		})
		.catch((err) => {
		  res.status(500).json({ error: "Error translating content" });
		});
  
	  await browser.close();
	} catch (error) {
	  res.status(500).json({ error: "Error creating audio" });
	}
  });
  app.use(express.static(__dirname)); // Provide the correct path to serve static files


app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
