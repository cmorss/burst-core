##Burst-Core
A Timeline Animation Library for JavaScript<br />
Copyright F1LT3R © 2010, All Rights Reserved<br />
http://creativecommons.org/licenses/by-sa/3.0/

###What does it do?

The Burst-Core brings time-line animation control to JavaScript. Based on the classic structure: **Time-line > Object > Track > Key-frame**, Burst-Core is suitable for complex, multi-layered, non-linear animations. Burst-Core also supports method-chaining and call-back architecture to support rich, interactive use cases.

###Show Me The Syntax!

Here is an example that will create a timeline, grab a DIV from the DOM and animate it over 100 frame with a 'outBounce' easing.

  // Timeline args: timelineName, startFrame, endFrame, speedRatio, loop, callBack
  burst.timeline( 'myTimeline', 0, 100, 1, false, function(){ alert('finished!'); )

    // Object args: name, objectReference
    .obj( 'myDiv', document.getElementById( 'myDiv' ).style )
    
      // Track args: property to change over time
      .track( 'left' )

        // Key args: frameNumber, valueAtFrame, easeingMethod
        .key(   0,   0, 'outBounce' )
        .key( 100, 100 )
        
  ;

###What can it control?

- WebGL Objects
- Processing JS Game Characters
- DOM Objects
- SVG Elements
- Audio Signals
- Anything with values that change over time

###Demos

[CSS](http://code.bocoup.com/burst-core/examples/css-demo/)

[Processing.js](http://code.bocoup.com/burst-core/examples/processing-js/)
