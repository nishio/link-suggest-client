import React from "react";

export const resultToDom = (json: any) => {
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

  return (
    <div>
      <p>search time: {json.search_time.toFixed(2)} msec</p>
      <ul>{items}</ul>
    </div>
  );
};
