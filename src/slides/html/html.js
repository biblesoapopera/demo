bso.slide.html = function(config, sectionType){
           
    var node = bso.slide.call(this, 'html', config, sectionType);
    node.querySelector('.content').innerHTML = config.content;
        
    this._complete();
}

bso.extend(bso.slide.html)
