import React from "react";
import PropTypes from "prop-types";
import { faCheckCircle as farCheckCircle } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";

import "./outlinetab.css";

function ResourceLink(props) {
  const download = (path, filename) => {
    const anchor = document.createElement("a");
    anchor.href = path;
    anchor.target = "_blank";
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  var documentList = function () {
    const endpoint = "http://localhost:18000/get_doc/";
    const doc_id = { doc_id: props.courseId };
    const response = fetch(endpoint, {
      method: "post",
      body: JSON.stringify(doc_id),
    })
      .then((data) => data.json())
      .then((response) => {
        var data = response["data"];
        var items = data.filter((e) => {
          if (
            e.document_name !== null &&
            e.chapter_name === props.section.title
          ) {
            return e;
          }
        });

        if (items.length !== 0) {
          var i = 0;
          function myLoop() {
            setTimeout(function () {
              download(items[i].document, items[i].document_name);
              i++;
              if (i < items.length) {
                myLoop();
              }
            }, 500);
          }
          myLoop();
        }
      })
      .catch(console.error);
  };

  return (
    <li>
      <div className="row w-100 m-0">
        <div className="col-auto p-0">
          <FontAwesomeIcon
            icon={faDownload}
            fixedWidth
            className="float-left text-success mt-1"
            aria-hidden="true"
          />
        </div>
        <div className="col-10 p-0 ml-3 text-break">
          <span
            className="align-middle"
            onClick={documentList}
            style={{ cursor: "pointer" }}
          >
            Materials
          </span>
        </div>
      </div>
    </li>
  );
}

ResourceLink.propTypes = {
  courseId: PropTypes.string.isRequired,
};

export default ResourceLink;