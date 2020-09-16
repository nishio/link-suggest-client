import React from "react";
import "./App.css";
import { useState } from "react";
import { useEffect } from "react";
import { resultToDom } from "./resultToDom";

// const API_SERVER = "http://localhost:5000";
const API_SERVER = "https://link-suggest-server.herokuapp.com";

let isUsingIME = false;

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

  const doSearch = (query: string) => {
    setAPIState("SEARCHING");
    fetch(`${API_SERVER}/api/`, {
      mode: "cors",
      method: "POST",
      body: JSON.stringify({ q: query }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response: Response) => {
      response.json().then((json) => {
        const dom = resultToDom(json);
        setResult(dom);
        setAPIState("OK");
      });
    });
  };

  const onCompositionStart = (e: React.CompositionEvent) => {
    isUsingIME = true;
  };

  const onCompositionEnd = (e: React.CompositionEvent<HTMLTextAreaElement>) => {
    isUsingIME = false;
    if (apiState !== "OK") return;
    doSearch(e.currentTarget.value);
  };
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (isUsingIME) return;
    if (apiState !== "OK") return;
    doSearch(e.currentTarget.value);
  };
  return (
    <>
      <h1>linkSuggest</h1>
      <p>{apiState}</p>
      <textarea
        onCompositionStart={onCompositionStart}
        onCompositionEnd={onCompositionEnd}
        onChange={onChange}
      ></textarea>
      {result}
    </>
  );
}

export default App;
