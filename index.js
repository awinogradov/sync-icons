const join = require('path').join;
const fs = require('fs-extra');
const glob = require('glob');
const svg2png = require('svg2png');
const posthtml = require('posthtml');

// -----------------------------------------------------------------------------

const svgRoot = '/Users/grape/Sources/sync-icons/icons/svg';
const originalColor = {name: 'white', value: ['#fff', '#f1f1f1']};
const generateColors = [
  {name: 'black', value: '#000'}
];

// -----------------------------------------------------------------------------

const originalColorFiles = glob.sync(`${svgRoot}/${originalColor.name}/**/*.svg`);

originalColorFiles.forEach(filePath => {
  const svg = fs.readFileSync(filePath, 'utf-8');

  generateColors.forEach(color => {
    const generatedPath = filePath.replace(new RegExp(originalColor.name, 'g'), color.name);

    colorsToReplace = [].concat(originalColor.value);
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

const svgFiles = glob.sync(`${svgRoot}/**/*.svg`);

svgFiles.forEach(filePath => {
  const svg = fs.readFileSync(filePath);
  const pngFilePath = filePath.replace(new RegExp('svg', 'g'), 'png');
  console.log(pngFilePath);
  // const pdfFilePath = filePath.replace('.svg', '.pdf');

  svg2png(svg).then(png => fs.outputFileSync(pngFilePath, png))
});
