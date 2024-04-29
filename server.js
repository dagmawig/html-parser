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
        let elementName = null;
        let lastID = null;
        let lastTitle = null;
        let lastSubtitle = null;
        let lastPart = null;
        let lastSubpart = null;
        let lastSection = null;
        let lastTitleDiv = null;
        let lastParentDiv = null;
        let lastClass = null;

        parser.onopentag = (node) => {
            elementName = node.name;

            if (node.name === 'DIV') {
                if (node.attributes.CLASS === 'authority' || node.attributes.CLASS === 'source') {
                    console.log("heeeeeeeeere", node.attributes.CLASS)
                    lastClass = node.attributes.CLASS;
                }
            }
            if (node.name === 'DIV' && node.attributes.ID !== undefined) {
                lastID = node.attributes.ID;
                lastTitleDiv = node.attributes.CLASS;
                lastParentDiv = node.attributes.CLASS;
                if (node.attributes.CLASS === 'title') lastTitle = lastID;
                if (node.attributes.CLASS === 'subtitle') lastSubtitle = lastID;
                if (node.attributes.CLASS === 'part') lastPart = lastID;
                if (node.attributes.CLASS === 'subpart') lastSubpart = lastID;
                if (node.attributes.CLASS === 'section') lastSection = lastID;
            }
        }

        // parser.onattribute = (attr) => {
        //     console.log(attr);
        // }

        parser.ontext = (text) => {

            const trimmedText = text.trim();
            if (trimmedText !== "") {
                if (elementName === 'H1' || elementName === 'H2' || elementName === 'H3' || elementName === 'H4' || elementName === 'H5' || elementName === 'H6' || lastTitleDiv !== null) {
                    let obj = { title: text };
                    if (lastTitleDiv === 'title') {
                        if (parsedHTML[lastTitle] === undefined) parsedHTML[lastTitle] = obj;
                        else parsedHTML[lastTitle].title += text;
                    }
                    else if (lastTitleDiv === 'subtitle') {
                        if (parsedHTML[lastTitle][lastSubtitle] === undefined) parsedHTML[lastTitle][lastSubtitle] = obj;
                        else parsedHTML[lastTitle][lastSubtitle].title += text;
                    }
                    else if (lastTitleDiv === 'part') {
                        if (parsedHTML[lastTitle][lastSubtitle][lastPart] === undefined) parsedHTML[lastTitle][lastSubtitle][lastPart] = obj;
                        else parsedHTML[lastTitle][lastSubtitle][lastPart].title += text;
                    }
                    else if (lastTitleDiv === 'subpart') {
                        if (parsedHTML[lastTitle][lastSubtitle][lastPart][lastSubpart] === undefined) parsedHTML[lastTitle][lastSubtitle][lastPart][lastSubpart] = obj;
                        else parsedHTML[lastTitle][lastSubtitle][lastPart][lastSubpart].title += text;
                    }
                    else if (lastTitleDiv === 'section') {
                        if (parsedHTML[lastTitle][lastSubtitle][lastPart][lastSubpart][lastSection] === undefined) parsedHTML[lastTitle][lastSubtitle][lastPart][lastSubpart][lastSection] = obj;
                        else parsedHTML[lastTitle][lastSubtitle][lastPart][lastSubpart][lastSection].title += text;
                    }
                }
                if (lastClass !== null) {
                    if (lastParentDiv === 'title') {

                        parsedHTML[lastTitle][lastClass] = { title: text }
                    }
                    else if (lastParentDiv === 'subtitle') {
                        parsedHTML[lastTitle][lastSubtitle][lastClass] = { title: text }
                    }
                    else if (lastParentDiv === 'part') {
                        parsedHTML[lastTitle][lastSubtitle][lastPart][lastClass] = { title: text }
                    }
                    else if (lastParentDiv === 'subpart') {
                        parsedHTML[lastTitle][lastSubtitle][lastPart][lastSubpart][lastClass] = { title: text }
                    }
                    else if (lastParentDiv === 'section') {
                        parsedHTML[lastTitle][lastSubtitle][lastPart][lastSubpart][lastSection][lastClass] = { title: text }
                    }
                }
            }
        }

        parser.onclosetag = (node) => {
            if (node === 'H1' || node === 'H2' || node === 'H3' || node === 'H4' || node === 'H5' || node === 'H6') {
                lastTitleDiv = null;
                lastClass = null;
            }
        }
        parser.onend = () => {
            console.log(JSON.stringify(parsedHTML, null, 2));
        }

        parser.write(htmlString).close();
    } catch (error) {
        console.log(error);
    }

});