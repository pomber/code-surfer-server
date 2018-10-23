import React from "react";
import { renderToString } from "react-dom/server";
import inline from "glamor/inline";
import { readStateFromPath } from "./state-parser";
import Editor from "./components/Editor";

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

console.log(process.env.RAZZLE_ASSETS_MANIFEST);

export function getEditor(request, response) {
  const state = readStateFromPath(request.originalUrl);
  //TODO put styles in head
  const markup = inline(renderToString(<Editor initialState={state} />));
  const protocolAndHost = request.protocol + "://" + request.get("host");
  const fullUrl = protocolAndHost + request.originalUrl;
  //TODO move hardcoded styles to glamor or something
  response.status(200).send(
    `<!doctype html>
<html lang="">

<head>
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta charset="utf-8" />
  <title>Code Surfer Editor</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link 
    href="${protocolAndHost}/oembed?url=${encodeURIComponent(fullUrl)}" 
    rel="alternate"
    type="application/json+oembed" 
    title="Code Surfer oEmbed" />
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: sans-serif;
    }
    html,
    body,
    #root {
      height: 100%;
      padding: 0;
      margin: 0;
    }
    
    .react-codemirror2,
    .CodeMirror {
      height: 100% !important;
    }
  </style>
  ${
    assets.editor.css
      ? `<link rel="stylesheet" href="${assets.editor.css}">`
      : ""
  }
  ${
    process.env.NODE_ENV === "production"
      ? `<script src="${assets.editor.js}" defer></script>`
      : `<script src="${assets.editor.js}" defer crossorigin></script>`
  }
</head>

<body>
  <div id="root">${markup}</div>
</body>

</html>`
  );
}