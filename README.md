# HTML parser Node JS app

An html parser that user sax parsing method.

# Description

* This is a Node.js app that downloads an html response from a website and parses it into a JSON doc. 
* It currently parses an example html string from example.js file.
* The parsed JSON document would then be saved into a mongoDB document database.
  - A mongo connection string needs to be provided as an env vriable to enable this.
* The parsing logic in parseHTML.js file can be modified as per the structure of the response html.