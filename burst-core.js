  /* Burst-Core
     Copyright F1LT3R @ Bocoup
     License: Call me - http://bocoup.com */
(function(){

  // Array Sort
  //////////////////////////////////////////////////////////////////////////////
  function sortNumber(a,b){ return a - b; }

  // Easing
  //////////////////////////////////////////////////////////////////////////////
  var ease = {
    linear        : function(x,t,b,c,d){ return c*t/d + b; },
    inOutQuad     : function(x,t,b,c,d){ if((t/=d/2) < 1){ return c/2*t*t + b;}else{ return -c/2 * ((--t)*(t-2) - 1) + b; }},
    inOutCubic    : function(x,t,b,c,d){ if((t/=d/2) < 1){ return c/2*t*t*t + b;}else{ return c/2*((t-=2)*t*t + 2) + b; }},
    inOutElastic  : function(x,t,b,c,d){ var s=1.70158;var p=0;var a=c; if (t===0){ return b;}  if ((t/=d/2)==2){ return b+c;}  if (!p){ p=d*(0.3*1.5);} if (a < Math.abs(c)) { a=c; s=p/4; } else{ s = p/(2*Math.PI) * Math.asin (c/a); if (t < 1){ return -0.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;}else{ return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*0.5 + c + b; }}},
    inBounce      : function(x,t,b,c,d){ return c - ease.outBounce( x, d-t, 0, c, d) + b; },
    outBounce     : function(x,t,b,c,d){ if((t/=d) < (1/2.75)){ return c*(7.5625*t*t) + b; } else if (t < (2/2.75)) { return c*(7.5625*(t-=(1.5/2.75))*t + 0.75) + b; } else if (t < (2.5/2.75)) { return c*(7.5625*(t-=(2.25/2.75))*t + 0.9375) + b; } else { return c*(7.5625*(t-=(2.625/2.75))*t + 0.984375) + b; } },
    inOutBounce   : function(x,t,b,c,d){ if(t < d/2){ return ease.inBounce(x, t*2, 0, c, d) * 0.5 + b;}else{ return ease.outBounce(x, t*2-d, 0, c, d) * 0.5 + c*0.5 + b; }}
  };

  // Burst Instance
  //////////////////////////////////////////////////////////////////////////////
  var Burst = function Burst(){
    this.timelines={};
    this.loaded={};
    this.fps = 30;    
    this.onframe=undefined;
  };
  Burst.prototype.timeline = function(name,start,end,speed,loop,callback){
    return this.timelines[name]||(arguments.length>1?this.timelines[name]=new Timeline(name,start,end,speed,loop,callback,this):undefined);
  };
  Burst.prototype.load = function( name ){
    return this.loaded[name] || (function(){
      for(var i in this.timelines ){
        if( this.timelines[i] ){            
          return (this.loaded[i] = this.timelines[i]);
        }else{
          return this;
        }
      }
    }).call(this);
  };
  Burst.prototype.unload = function( name ){
    delete this.loaded[name];
  };
  Burst.prototype.play = function(){
    var deepref = this;
    this.interval = window.setInterval(function(){
      deepref.frame();
    }, 1000 / this.fps );
  };
  Burst.prototype.frame = function( frame ){
    if(this.onframe){this.onframe();}
    for( var i in this.loaded ){
      if(this.hasOwnProperty("loaded")){
        this.loaded[i].play( frame );
      }
    }
  };
  Burst.prototype.stop = function(){
    window.clearInterval( this.interval );
    delete this.interval;
  };

  // Timeline
  //////////////////////////////////////////////////////////////////////////////
  var Timeline = function Timeline(name,start,end,speed,loop,callback,parent){
    this.name=name;
    this.start=this.frame=start;
    this.end=end;
    this.speed=speed;
    this.loop=loop;
    this.callback=callback;
    this.parent=parent;
    this.tracks={};
    return this;
  };
  Timeline.prototype.track = function(name,objRef,prop){
    return this.tracks[name]||(arguments.length>1?this.tracks[name]=new Track(name,objRef,prop,this):undefined);
  };
  Timeline.prototype.play = function( frame ){
    this.frame = frame || (this.frame += this.speed);
    if( this.loop ){
      if( this.frame > this.end ){ this.frame = this.start; }
      if( this.frame < this.start ){ this.frame = this.end; }
    }else{
      if( this.frame >= this.end){
        this.frame = this.end;
        this.parent.unload(this.name);
        if(this.callback){this.callback();}
      }
      if( this.frame <= this.start ){
        this.frame = this.start;
        this.parent.unload(this.name);
        if(this.callback){this.callback();}
      }
    }
    for( var j in this.tracks ){
      if(this.hasOwnProperty("tracks")){
        this.tracks[j].play( this.frame );
      }
    }
  };  

  // Track
  //////////////////////////////////////////////////////////////////////////////
  var Track = function Track(name,objRef,prop,parent){
    this.name=name;
    this.objRef=objRef;
    this.prop=prop;
    this.unit = typeof this.objRef[this.prop] === 'number' ? undefined : this.objRef[this.prop].replace(/[.0-9]/g,'');
    this.parent=parent;
    this.keys=[];
    return this;
  };
  Track.prototype.key = function(frame,value,ease){
    for(var i=0,l=this.keys.length;i<l;i++){
      if(this.keys[i].frame === frame){
        return this.keys[i];
      }
    }
    if(arguments.length>1){
      var keyIndex=[], keyStack=[], thisKey = this.keys[this.keys.length] = new Key(frame,value,ease,this);
      for(i=0;i<this.keys.length;i++){
        keyIndex[i]=this.keys[i].frame;
      }
      keyIndex.sort(sortNumber);      
      for(i=0;i<this.keys.length;i++){
        for(var j=0;j<this.keys.length;j++){
          if(keyIndex[i]==this.keys[j].frame){
            keyStack[i]=this.keys[j];
          }
        }
      }
      this.keys=[];
      for(i=0, l=keyStack.length; i< l; i++){
        this.keys[i] = keyStack[i];
      }
      return thisKey;
    }else{
      return false;
    }
  };
  Track.prototype.play = function(frame){  
    var curKey, nextKey, val;
    for(var i=0, l=this.keys.length; i<l; i++){
      curKey = this.keys[i];
      nextKey = this.keys[i+1];
      if(nextKey === undefined && i+1 > l-1){
        nextKey = this.keys[l-1];
      }
      if( frame >= curKey.frame && frame < nextKey.frame ){
        val = ease[ curKey.ease ]( 0,
          frame-curKey.frame,
          curKey.value,
          nextKey.value-curKey.value,
          nextKey.frame-curKey.frame );
      }else if( frame >= nextKey.frame || frame === 0 ){
        val = curKey.value;
      }
    }
    this.objRef[this.prop] = val + (this.unit||0);
  };

  // Key
  //////////////////////////////////////////////////////////////////////////////
  var Key = function Key(frame,value,ease,parent){
    this.frame=frame;
    this.value=value;
    this.ease=ease||'linear';
    this.parent=parent;
    return this;
  };
  Key.prototype.track=function(name,objRef,prop){
    var timeline = this.parent.parent;
    return timeline.track.call(timeline,name,objRef,prop);
  };
  Key.prototype.key=function(name,objRef){
    var track = this.parent;
    return track.key.call(track,name,objRef);
  };

  // Instantiation
  //////////////////////////////////////////////////////////////////////////////
  window.burst = new Burst();

})();
