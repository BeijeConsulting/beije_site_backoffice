import { useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";

function ReactPortal({ children }) {  //function to create a portal.
    const [state, setState] = useState(null);

    function createPortalNode(className) {

      // simple function to create an element and add it to the dom
      const nodeElement = document.createElement('div');
      nodeElement.setAttribute('class', className)
      document.body.appendChild(nodeElement);
   
      return nodeElement;
   }

    useLayoutEffect(() => {

        let element = createPortalNode("modal");
        setState(element);

        return () => {
            //delete the programmatically created element
            element.parentNode.removeChild(element);
        }
    }, []);  // lifeCycle

    if (state === null) return null;

    return createPortal(children, state);
}

export default ReactPortal;