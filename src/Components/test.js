import { useState, useEffect, useCallback } from 'react'
import { pdfjs, Document, Page } from 'react-pdf'
import 'react-pdf/dist/esm/Page/TextLayer.css'

import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import '../CSS/uploadedFiles.css'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`

// source: https://github.com/wojtekmaj/react-pdf/issues/614

const stringToHighlight = 'They spend roughly half of their lives on land and the other half in the sea. The largest living species';

// You might want to merge the items a little smarter than that
function getTextItemWithNeighbors(textItems, itemIndex, span = 1) {
  return textItems.slice(
    Math.max(0, itemIndex - span), 
    itemIndex + 1 + span
  )
    .filter(Boolean)
    .map(item => item.str)
    .join('');
}

function getIndexRange(string, substring) {
  const indexStart = string.indexOf(substring);
  const indexEnd = indexStart + substring.length;

  return [indexStart, indexEnd];
}

function highlightPattern(text, pattern) {
    const splitText = text.split(pattern);
  
    if (splitText.length <= 1) {
      return text;
    }
  
    const matches = text.match(pattern);
  
    const text2 = (splitText.reduce((arr, element, index) => (matches[index] ? [
      ...arr,
      element,
      <mark key={index}>
        {matches[index]}
      </mark>,
    ] : [...arr, element]), []))

    console.log('text2: ', text2)
    console.log('text2: ', text2[1].props.children)
    return `<mark>${text2[1].props.children}</mark>`
  }

export default function UploadedFiles() {


  const [textItems, setTextItems] = useState();

  const onPageLoadSuccess = useCallback(async page => {
    const textContent = await page.getTextContent();
    setTextItems(textContent.items);
  }, []);

  const customTextRenderer = useCallback(textItem => {
    if (!textItems) {
      return;
    }

    const { itemIndex } = textItem;

    const matchInTextItem = textItem.str.match(stringToHighlight);

    if (matchInTextItem) {
      // Found full match within current item, no need for black magic
      return highlightPattern(textItem.str, stringToHighlight);
    }

    // Full match within current item not found, let's check if we can find it
    // spanned across multiple lines

    // Get text item with neighbors
    const textItemWithNeighbors = getTextItemWithNeighbors(textItems, itemIndex);

    const matchInTextItemWithNeighbors = textItemWithNeighbors.match(stringToHighlight);

    if (!matchInTextItemWithNeighbors) {
      // No match
      return textItem.str;
    }

    // Now we need to figure out if the match we found was at least partially
    // in the line we're currently rendering
    const [matchIndexStart, matchIndexEnd] = getIndexRange(textItemWithNeighbors, stringToHighlight);
    const [textItemIndexStart, textItemIndexEnd] = getIndexRange(textItemWithNeighbors, textItem.str);

    if (
      // Match entirely in the previous line
      matchIndexEnd < textItemIndexStart ||
      // Match entirely in the next line
      matchIndexStart > textItemIndexEnd
    ) {
      return textItem.str;
    }

    // Match found was partially in the line we're currently rendering. Now
    // we need to figure out what does "partially" exactly mean

    // Find partial match in a line
    const indexOfCurrentTextItemInMergedLines = textItemWithNeighbors.indexOf(textItem.str);

    const matchIndexStartInTextItem = Math.max(0, matchIndexStart - indexOfCurrentTextItemInMergedLines);
    const matchIndexEndInTextItem = matchIndexEnd - indexOfCurrentTextItemInMergedLines;

    const partialStringToHighlight = textItem.str.slice(matchIndexStartInTextItem, matchIndexEndInTextItem);

    return highlightPattern(textItem.str, partialStringToHighlight);
  }, [stringToHighlight, textItems]);

  return (
    <Document file='https://storage.googleapis.com/analyzai.appspot.com/XKW3oKmzfvgvtsFImoWKoLd7qEj1/1685577173477-penguins.pdf?GoogleAccessId=firebase-adminsdk-i35vb%40analyzai.iam.gserviceaccount.com&Expires=7231676400&Signature=Jx4irOEj35RzauBlbzGeUjH6k%2Fn7DNvtu135cT0D4PvuQHpax8WL%2F9q4I%2BUY%2BCp2Ebz4PE5yUPMG733R5cG08tx77nHGJnFIaipVx1GknIKKVeOibwLPeSdAMPWYUjcDyDiTJxMR9RDvU7BYBTLs1cxTEnIEHYaDmyjmggF7A4LVRYRIwmZTRM%2F8%2FVxImT2184hC6MBjL4%2BsJcK%2FNCT4Vwka9tOHIbDECTMH303%2FJLFlSAjU5tQiEUTcmtG3wGqCr5SlnUvj%2FrJBcEzUS1qqnE%2BhCeohtXz57fZSLMNZhC57OJ9n9MhO6O8%2FL8qN%2FrLzF3VGoQZYDwsAxP%2BiywcCeQ%3D%3D'  onLoadError={(error) => console.error('Error while loading document', error)}
    >
      <Page
        customTextRenderer={customTextRenderer}
        onLoadSuccess={onPageLoadSuccess}
        pageNumber={1}
      />
    </Document>
  );
}