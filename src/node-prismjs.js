"use strict";

const fs = require("fs");
const path = require("path");

function uniq(arr) {
  const set = arr.reduce((set, item) => {
    set[item] = true;
    return set;
  }, {});
  return Object.keys(set);
}

const prismCore = "prismjs/components/prism-core";
const Prism = require(prismCore);
let initialized = false;

const getPrism = (externalLangs = [], forceReinitialize = false) => {
  if (!initialized || forceReinitialize) {
    const prelude = [
      "prism-clike",
      "prism-markup",
      "prism-javascript",
      "prism-typescript",
      "prism-javadoclike",
      "prism-c",
      "prism-cpp",
      "prism-ruby",
      "prism-css",
      "prism-sql",
      "prism-t4-templating",
      "prism-markup-templating",
      "prism-turtle",
    ];
    const prismComponents = path.dirname(require.resolve(prismCore));
    const components = prelude.concat(
      fs
        .readdirSync(prismComponents)
        .map((component) => component.replace(/(\.min)?\.js$/, ""))
    );

    const componentsSet = uniq(components);
    componentsSet.forEach((component) =>
      require(path.join(prismComponents, component))
    );
    externalLangs.forEach((item) => {
      require(item.startsWith(".") ? path.join(process.cwd(), item) : item);
    });

    initialized = true;
  }

  return Prism;
};

module.exports = getPrism;
