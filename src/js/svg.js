(function(){

  //this loads all the svg background images and the favicon
  //this method is used because it seems to be the smallest and most flexible

  var open = "data:image/svg+xml;charset=utf8,<svg xmlns='http://www.w3.org/2000/svg' height='100' width='100'>"; //jshint ignore:line
  var close = '</svg>';

  // jshint ignore:start
  var paths = {
    '.logo': "<path d='M 43.1,82.5 C 39.2,81.9 35.3,79.6 33.4,76 32.1,73.1 35.2,69.7 38.3,70.9 40.9,72.6 43.8,76 47.5,73.9 51.3,72.5 50.8,68 52,64.9 53.2,61.4 55.9,58.8 59.1,57.1 65.9,52.8 68.8,43.3 65.4,35.9 62.8,29.4 55.9,24.9 48.8,25.5 42,25.5 35.8,30.4 33.4,36.7 32.3,40 27.2,40.1 26,36.8 24.9,34.2 26.9,31.7 28,29.4 32.7,21.8 41.3,17 50.2,17.4 60.4,17.4 70,24.4 73.4,34 75.1,37.8 74.6,42.2 74.6,46.4 73.6,54.1 68.5,61 61.8,64.9 58.6,66.7 59.3,70.6 58.1,73.5 56.1,79 50.4,82.5 44.5,82.5 44.1,82.5 43.6,82.5 43.1,82.5 Z M 59,45.8 C 55.8,44.5 57.8,39.8 55,37.9 51.9,34.7 46,35 43.7,38.9 43,41.9 38.9,44 37.7,40.3 37.7,37 40.2,34.2 42.8,32.3 48.5,28.5 57.1,30.5 60.6,36.4 61.9,38.8 62.9,41.7 62.1,44.5 61.6,45.6 60.1,46 59,45.8 Z' style='fill:white'/>",
    '.arrow': "<path d='M 40.1,20.7 68.4,48.8 40.1,82.2' style='fill:none;stroke:white;stroke-width:5' />",
    '.play': "<path d='M 81,50.5 30.8,79.5 30.7,21.5 Z' style='fill:white' />",
    '.pause': "<path d='M 26.2,27.5 26.2,74.5 46.7,74.5 46.7,27.5 26.2,27.5 Z M 53.5,27.5 53.5,74.5 74,74.5 74,27.5 53.5,27.5 Z' style='fill:white' />",
    '.redo': "<path d='M 32.2,26.6 17.4,28.7 17.9,32.7 25.6,31.7 C 21.9,36.7 19.4,43 19.4,49.9 19.4,66.3 32.5,79.7 49,79.7 65.5,79.7 78.7,66.3 78.7,49.9 78.7,41.4 75.2,33.8 69.7,28.4 L 66.7,31.2 C 71.7,35.9 74.7,42.5 74.7,49.9 74.7,64.1 63.2,75.6 49,75.6 34.7,75.6 23.6,64.1 23.6,49.9 23.6,43.8 25.6,38.2 29.1,33.8 L 30.4,42.1 34.2,41.6 32.2,26.6 Z' style='fill:white' />"
  };
  // jshint ignore:end

  //css backgrounds
  for (var selector in paths){
    document.styleSheets[0].insertRule(
      selector +
      ' {background-image: url("' + (open + paths[selector] + close).replace(/</g, '%3C').replace(/>/g, '%3E') +
      '"); background-repeat: no-repeat; background-position: center center; background-size: contain;}',
      0
    );
  }

  //favicon
  var canvas = document.createElement('canvas');
  canvas.width  = 16;
  canvas.height = 16;

  var img = new Image();
  img.onload = function() {
    canvas.getContext('2d').drawImage(img, 0, 0, 16, 16);
    var link = document.createElement('link');
    link.type = 'image/png';
    link.rel = 'shortcut icon';
    link.href = canvas.toDataURL();
    document.head.appendChild(link);
  }
  img.src = open + "<rect style='fill:%23ffc107' width='100' height='100' x='0' y='0' ry='15' />" + paths['.logo'] + close; //jshint ignore:line

})();
