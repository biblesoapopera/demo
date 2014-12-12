bso.slide.audio = function(config, sectionType){

    var template = document.querySelector('[data-slide=audio]');      
    var clone = document.importNode(template.content, true);
    var ready;    
    var waiting;
    var player = new Audio(); 
    var progressTime = config.start;
    
    if (config.audioUrl.then){
     
        var spinner = clone.querySelector('.spinner');
        var playerContainer = clone.querySelector('.player-container');
        spinner.setAttribute('class', 'spinner');      
        playerContainer.setAttribute('class', 'player-container hidden');
        
        config.audioUrl.then(function(audioUrl){       
            spinner.setAttribute('class', 'spinner hidden');      
            playerContainer.setAttribute('class', 'player-container');           
            player.src = audioUrl;
        }.bind(this))
    } else {
        player.src = config.audioUrl;         
    }

    clone.querySelector('.text').innerHTML = config.text;    
    clone.querySelector('.slide-inner').setAttribute('class', 'slide-inner ' + sectionType);      
    
    function setStartTime(){   
        player.removeEventListener('canplay', setStartTime);
        player.currentTime = config.start;             
        ready = true;    
        if (!waiting) play()
    }
    player.addEventListener('canplay', setStartTime);
    
    var actionBtn = clone.querySelector('.action');
    actionBtn.addEventListener('click', action);
    
    function play(){
        if (!ready) return; 
        player.play();
        actionBtn.setAttribute('class', 'btn sprite action pause');         
    }
    
    function pause(){
        if (!ready) return; 
        player.pause();
        actionBtn.setAttribute('class', 'btn sprite action play');        
    }
    
    function rewind(){
        if (!ready) return;
        player.currentTime = config.start;
        actionBtn.setAttribute('class', 'btn sprite action play');          
    }
      
    function action(){
        var cls = actionBtn.getAttribute('class');
        if (cls.indexOf('play') !== -1) play()
        else if (cls.indexOf('pause') !== -1) pause()
        else if (cls.indexOf('rewind') !== -1) rewind()
    }
       
    var volumeGrip = clone.querySelector('.vol-grip');
    function setVolumeGrip(){        
        volumeGrip.style.height = Math.round(30 * player.volume) + 'px';
        volumeGrip.style.top = Math.round(30 * (1 - player.volume)) + 'px';
    }
       
    clone.querySelector('.vol-plus').addEventListener('click', function(){
        if (player.volume > 0.9) player.volume = 1
        player.volume+=0.1;
        setVolumeGrip();
    });
    clone.querySelector('.vol-minus').addEventListener('click', function(){        
        if (player.volume < 0.1) player.volume = 0
        else player.volume-=0.1;
        setVolumeGrip();
    });
    setVolumeGrip();
              
    var grip = clone.querySelector('.grip');
    var progress = clone.querySelector('.progress');
    
    player.addEventListener('timeupdate', function(){
        if (player.currentTime >= config.end) {
            pause();
            actionBtn.setAttribute('class', 'btn sprite action rewind');
            this.complete = true;
            this.emit('complete');
        }
        var position = Math.round(300*(player.currentTime - config.start)/(config.end - config.start));
        if (position < 0) position = 0
        else if (position > 300) position = 300
        
        grip.style.left = (position - 2.5) + 'px';
        
        if (progressTime < player.currentTime){
            progressTime = player.currentTime;
            progress.style.width = position + 'px';            
        }
    }.bind(this))
    
    var isPlaying;
    var gripDragPosition;
    var dragstart = function(evt){
        isPlaying = !player.paused;
        player.pause();
        gripDragPosition = {
            left: parseInt(grip.style.left.replace('px', '')),
            client: bso.getClientX(evt)
        }
        document.addEventListener('mouseup', dragend);
        document.addEventListener('mousemove', dragmove);    
        document.addEventListener('touchend', dragend);
        document.addEventListener('touchmove', dragmove);     
    };
    
    var dragend = function(){        
        document.removeEventListener('mousemove', dragmove);        
        document.removeEventListener('mouseup', dragend);
        document.removeEventListener('touchmove', dragmove);        
        document.removeEventListener('touchend', dragend);  
        var currentTime = config.start + (gripDragPosition.left + 2.5) * (config.end - config.start) / 300;
        if (currentTime < config.start) currentTime = config.start
        else if (currentTime > config.end) currentTime = config.end
    
        player.currentTime = currentTime;        
        if (isPlaying) player.play();
    };
    
    var dragmove = function(evt){
        var clientX = bso.getClientX(evt);        
        var newLeft = gripDragPosition.left + clientX - gripDragPosition.client;

        if (newLeft < -2.5){
            newLeft = -2.5;
        } else if (newLeft > progress.style.width.replace('px', '') - 2.5){
            newLeft = progress.style.width.replace('px', '') - 2.5;
        }
        
        grip.style.left = newLeft + 'px';        
        gripDragPosition.left = newLeft;
        gripDragPosition.client = clientX;
    }
      
    grip.addEventListener('mousedown', dragstart);
    grip.addEventListener('touchstart', dragstart);        
    
    progress.addEventListener('click', function(event){
        var currentTime = config.start + (event.clientX - progress.getBoundingClientRect().left) * (config.end - config.start) / 300;
        if (currentTime < config.start) currentTime = config.start
        else if (currentTime > config.end) currentTime = config.end
        player.currentTime = currentTime; 
    })
    
    document.body.appendChild(clone);
    this.node = document.body.lastElementChild;   
    
    this.enter = function(){
        waiting = true;
        setTimeout(function(){
           waiting = false;
           if (actionBtn.getAttribute('class').indexOf('play') !== -1) play();
        }, 1400);        
    }
    
    this.exit = function(){
        if (actionBtn.getAttribute('class').indexOf('pause') !== -1) pause();
    }
    
    bso.evented(this);
}
