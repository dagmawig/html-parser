import getDocument from "./routes/documentRoute.js"

const getHTML = getDocument().then(response=> {
    console.log(response);
})