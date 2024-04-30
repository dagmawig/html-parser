import getDocument from "./routes/documentRoute.js"
import sax from "sax";
import htmlString from "./example.js";

const parser = sax.parser(false, {
    normalize: true
});

const getHTML = getDocument().then(response => {
    //console.log(response);

    try {
        let parsedHTML = {};
        let nodeStack = [];
        let elementName = null;
        let lastID = null;
        let lastTitle = null;
        let lastSubtitle = null;
        let lastPart = null;
        let lastSubpart = null;
        let lastSection = null;
        let lastParentDiv = null;
        let inlineParStr = [];
        let hString = [];
        let inlineHeaderStr = [];
        let indent_1Str = [];
        let plainParaStr = [];

        parser.onopentag = (node) => {
            elementName = node.name;
            nodeStack.push(node);
            if (node.attributes.CLASS === 'inline-paragraph') inlineParStr = [];
            if (elementName === 'H1' || elementName === 'H2' || elementName === 'H3' || elementName === 'H4' || elementName === 'H5' || elementName === 'H6') {
                if (node.attributes.CLASS === 'inline-header') inlineHeaderStr = [];
                else hString = [];
            }
            if (elementName === 'DIV' && node.attributes.ID !== undefined) {
                lastID = node.attributes.ID;
                lastParentDiv = node.attributes.CLASS;
                if (node.attributes.CLASS === 'title') lastTitle = lastID;
                if (node.attributes.CLASS === 'subtitle') lastSubtitle = lastID;
                if (node.attributes.CLASS === 'part') lastPart = lastID;
                if (node.attributes.CLASS === 'subpart') lastSubpart = lastID;
                if (node.attributes.CLASS === 'section') lastSection = lastID;
            }
            if (elementName === 'P') {
               if(node.attributes.CLASS==='indent-1') indent_1Str = [];
               else plainParaStr = [];
            }
        }

        // parser.onattribute = (attr) => {
        //     console.log(attr);
        // }

        parser.ontext = (text) => {
            let parentNode = nodeStack[nodeStack.length - 2];
            let currentNode = nodeStack[nodeStack.length - 1]
            let currentNodeClass = currentNode?.attributes.CLASS;
            let parentNodeClass = parentNode?.attributes.CLASS;
            let parentElementName = parentNode?.name;
            let isHElement = elementName === 'H1' || elementName === 'H2' || elementName === 'H3' || elementName === 'H4' || elementName === 'H5' || elementName === 'H6';
            let isParentHElement = parentElementName === 'H1' || parentElementName === 'H2' || parentElementName === 'H3' || parentElementName === 'H4' || parentElementName === 'H5' || parentElementName === 'H6';
            const trimmedText = text.trim();
            if (trimmedText !== "") {
                if (isHElement || isParentHElement) {


                    let textObj = { text }
                    if (currentNode.name === 'A') {
                        textObj.hyperlink = currentNode.attributes.HREF;
                    }
                    if (currentNode?.attributes.CLASS === 'inline-header' || parentNode?.attributes.CLASS === 'inline-header') {
                        inlineHeaderStr.push(textObj);
                    }
                    else hString.push(textObj);
                }

                if (currentNodeClass === 'inline-paragraph' || parentNodeClass === 'inline-paragraph') {

                    let textObj = { text }
                    if (currentNode?.name === 'A') {
                        textObj.hyperlink = currentNode.attributes.HREF;
                    }
                    inlineParStr.push(textObj);

                }

                if (currentNodeClass === 'indent-1' || parentNodeClass === 'indent-1') {
                    let textObj = { text };
                    if (currentNode?.name === 'A') {
                        textObj.hyperlink = currentNode.attributes.HREF;
                    }
                    indent_1Str.push(textObj);
                }
                else if (currentNode.name==='P' || parentNode.name==='P') {
                    let textObj = { text };
                    if (currentNode?.name === 'A') {
                        textObj.hyperlink = currentNode.attributes.HREF;
                    }
                    plainParaStr.push(textObj);
                }
            }
        }

        parser.onclosetag = (node) => {
            let currentNode = nodeStack[nodeStack.length - 1];
            let parentNode = nodeStack[nodeStack.length - 2];
            let currentNodeClass = currentNode?.attributes.CLASS;
            let parentNodeClass = parentNode?.attributes.CLASS;

            if (node === 'H1' || node === 'H2' || node === 'H3' || node === 'H4' || node === 'H5' || node === 'H6') {

                let obj = { title: hString };

                if (parentNodeClass === 'title') {
                    parsedHTML[lastTitle] = obj;
                }
                else if (parentNodeClass === 'subtitle') {
                    parsedHTML[lastTitle][lastSubtitle] = obj;
                }
                else if (parentNodeClass === 'part') {
                    parsedHTML[lastTitle][lastSubtitle][lastPart] = obj;
                }
                else if (parentNodeClass === 'subpart') {
                    parsedHTML[lastTitle][lastSubtitle][lastPart][lastSubpart] = obj;
                }
                else if (parentNodeClass === 'section') {
                    parsedHTML[lastTitle][lastSubtitle][lastPart][lastSubpart][lastSection] = obj;
                }
                else if (parentNodeClass === 'authority' || parentNodeClass === 'source') {

                    if (lastParentDiv === 'title') {
                        parsedHTML[lastTitle][parentNodeClass] = { title: inlineHeaderStr };
                    }
                    else if (lastParentDiv === 'subtitle') {
                        parsedHTML[lastTitle][lastSubtitle][parentNodeClass] = { title: inlineHeaderStr };
                    }
                    else if (lastParentDiv === 'part') {
                        parsedHTML[lastTitle][lastSubtitle][lastPart][parentNodeClass] = { title: inlineHeaderStr };
                    }
                    else if (lastParentDiv === 'subpart') {
                        parsedHTML[lastTitle][lastSubtitle][lastPart][lastSubpart][parentNodeClass] = { title: inlineHeaderStr };
                    }
                    else if (lastParentDiv === 'section') {
                        parsedHTML[lastTitle][lastSubtitle][lastPart][lastSubpart][lastSection][parentNodeClass] = { title: inlineHeaderStr };
                    }
                }
            }

            if (currentNodeClass === 'inline-paragraph' && (parentNodeClass === 'authority' || parentNodeClass === 'source')) {

                if (lastParentDiv === 'title') {

                    parsedHTML[lastTitle][parentNodeClass].body = inlineParStr;
                }
                else if (lastParentDiv === 'subtitle') {
                    parsedHTML[lastTitle][lastSubtitle][parentNodeClass].body = inlineParStr;
                }
                else if (lastParentDiv === 'part') {
                    parsedHTML[lastTitle][lastSubtitle][lastPart][parentNodeClass].body = inlineParStr;
                }
                else if (lastParentDiv === 'subpart') {
                    parsedHTML[lastTitle][lastSubtitle][lastPart][lastSubpart][parentNodeClass].body = inlineParStr;
                }
                else if (lastParentDiv === 'section') {
                    parsedHTML[lastTitle][lastSubtitle][lastPart][lastSubpart][lastSection][parentNodeClass].body = inlineParStr;
                }
            }
            
            if (currentNodeClass==='indent-1') {
                let parentID = parentNode?.attributes.ID
                if(parentID) {
                    parsedHTML[lastTitle][lastSubtitle][lastPart][lastSubpart][lastSection][parentID] = indent_1Str;
                }
            }
            else if (currentNode.name==='P') {
                let parentID = parentNode?.attributes.ID;
                if(parentID) {
                    parsedHTML[lastTitle][lastSubtitle][lastPart][lastSubpart][lastSection]['sectionOpener'] = plainParaStr;
                }
            }

            nodeStack.pop();
        }
        parser.onend = () => {
            console.log(JSON.stringify(parsedHTML, null, 2));
        }

        parser.write(htmlString).close();
    } catch (error) {
        console.log(error);
    }

});