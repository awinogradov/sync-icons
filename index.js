const join = require('path').join;
const fs = require('fs-extra');
const glob = require('glob');
const svg2png = require('svg2png');
const posthtml = require('posthtml');
const config = require('./config.js');

// -----------------------------------------------------------------------------

const originalColorFiles = glob.sync(`${config.svgRoot}/${config.originalColor.name}/**/*.svg`);

originalColorFiles.forEach(filePath => {
  const svg = fs.readFileSync(filePath, 'utf-8');

  config.generateColors.forEach(color => {
    const generatedPath = filePath.replace(new RegExp(config.originalColor.name, 'g'), color.name);

    colorsToReplace = [].concat(config.originalColor.value);
    const generatedSvg = posthtml([
      function(tree) {
        colorsToReplace.forEach(currColor => {
          tree.match({attrs: {fill: currColor}}, node => {
            node.attrs.fill = color.value;
            return node;
          });
        });

        return tree;
      }
    ]).process(svg, {sync: true}).html;

    fs.outputFileSync(generatedPath, generatedSvg);
  });
});

// -----------------------------------------------------------------------------

const svgFiles = glob.sync(`${config.svgRoot}/**/*.svg`);

svgFiles.forEach(filePath => {
  const svg = fs.readFileSync(filePath);
  const pngFilePath = filePath.replace(new RegExp('svg', 'g'), 'png');
  // const pdfFilePath = filePath.replace('.svg', '.pdf');

  svg2png(svg).then(png => fs.outputFileSync(pngFilePath, png))
});
