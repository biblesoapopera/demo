bso.slide.discuss = function(config){
    this.config = config;
    
    var template = document.querySelector('[data-slide=discuss]');    
    var clone = document.importNode(template.content, true);
    clone.querySelector('[data-var=question]').innerHTML = config.question;
                        
    document.body.appendChild(clone);
    this.node = document.body.lastElementChild;
}