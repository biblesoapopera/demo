$.transition.push(
  function(from, to){
    if (from[0] === 'episode' && to[0] === 'episode' && to[1] === from[1] && to[2] === from[2]){
      var episode = $.getEpisode(to[1], to[2]);
      episode.show(to[2], false);
    }
  }
);
