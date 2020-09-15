import React from "react";
import "./App.css";
import { useState } from "react";
import { useEffect } from "react";

// const API_SERVER = "http://localhost:5000";
const API_SERVER = "https://link-suggest-server.herokuapp.com";

function App() {
  const [result, setResult] = useState(<div></div>);
  const [apiState, setAPIState] = useState(
    "CONNECTING" as "CONNECTING" | "OK" | "SEARCHING"
  );

  useEffect(() => {
    fetch(`${API_SERVER}/`, {
      mode: "cors",
      method: "GET",
    }).then((response) => {
      setAPIState("OK");
    });
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // setResult(e.target.value);
    if (apiState !== "OK") return;
    setAPIState("SEARCHING");
    fetch(`${API_SERVER}/api/`, {
      mode: "cors",
      method: "POST",
      body: JSON.stringify({ q: e.target.value }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      response.json().then((json) => {
        const items = json.items.map((x: any) => {
          const links = x.digest.items.map((y: any) => {
            const url = `https://scrapbox.io/nishio/${y[0]}`;
            return (
              <span>
                <a href={url}>{y[0]}</a>
                {y[1]} &nbsp;
              </span>
            );
          });
          return (
            <li>
              {x.text}: <ul>{links}</ul>
            </li>
          );
        });
        setResult(
          <div>
            <p>search time: {json.search_time.toFixed(2)} msec</p>
            <ul>{items}</ul>
          </div>
        );
        setAPIState("OK");
      });
    });
  };
  return (
    <>
      <h1>linkSuggest</h1>
      <p>{apiState}</p>
      <textarea onChange={onChange}></textarea>
      {result}
    </>
  );
}

export default App;
