import axios from 'axios';
import React, { useState, useEffect } from 'react';
import './App.css';

function HomePage({displayName}) {
  const [url, setUrl] = useState("");
  const [sent, setSent] = useState(false);
  const [name, setName] = useState("");
  const [audioURL, setAudioURL] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en"); // Default language

  // Define a list of supported languages
  const languageOptions = [
    { value: "en", label: "English" },
    { value: "es", label: "Spanish" },
    // Add more languages as needed
  ];

  useEffect(() => {
    let timeout;
    if (sent) {
      timeout = setTimeout(() => {
        setLoading(false);
      }, 60000); // Set loading to false after 60 seconds
    }

    return () => clearTimeout(timeout);
  }, [sent]);

  const sendUrl = async (e) => {
    e.preventDefault();
    setSent(true);
    setLoading(true);

    try {
      await axios.post("http://192.168.12.9:5000/get_text", {
        url,
        name: displayName,
        lang: selectedLanguage, // Pass selected language to the server
      });

      

      setAudioURL(`http://192.168.12.9:5000/${displayName}.mp3`);
      setFeedback("Audio Created successfully");
    } catch (error) {
      console.log(error);
      setFeedback("Error creating audio");
      setLoading(false);
    }
  }

  return (
    <div className="App">
      <>
        <h1>Enter Name for File and URL</h1>
        <form onSubmit={sendUrl} className="form">


          <input
            type="text"
            className="text-input"
            placeholder="URL goes here"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />

          {/* New language selection dropdown */}
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
          >
            {languageOptions.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>

          <button type="submit">Create Audio</button>
        </form>

        {loading ? (
          <h1>Loading...</h1>
        ) : (
          <>
            <h1>{feedback}</h1>
            {audioURL && <audio controls src={audioURL} />}
          </>
        )}
      </>
    </div>
  );
}

export default HomePage;
