$(function() { //jQuery Start

  // ---- BEGIN: GENERATE TONES ---- //

  var audioContext = new AudioContext();

  function playFrequency(frequency) {
    // create 2 second worth of audio buffer, with single channels and sampling rate of your device.
    var sampleRate = audioContext.sampleRate;
    var duration = 2*sampleRate;
    var numChannels = 1;
    var buffer  = audioContext.createBuffer(numChannels, duration, sampleRate);
    // fill the channel with the desired frequency's data
    var channelData = buffer.getChannelData(0);
    for (var i = 0; i < sampleRate; i++) {
      channelData[i]=Math.sin(2*Math.PI*frequency*i/(sampleRate));
    }

    // create audio source node.
    var source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContext.destination);

    // finally start to play
    source.start(0);
  };

  function playlow(){
    playFrequency(300);
    window.setTimeout(function() {
      if(Math.floor(Math.random()*100)%13 == 0){
        playhigh();
      } else {
        playlow();
      }
    }, 2000);
  }

  function playhigh(){
    playFrequency(1200);
    window.setTimeout(function() {
      if($("#container").hasClass("o--face")) return;
      playhigh()
    }, 1000);
  }

  // Thanks to https://www.agiletrailblazers.com/blog/quick-start-to-generate-tones-in-javascript

  // ---- END: GENERATE TONES ---- //

  // ---- BEGIN: ACTION CIRCLE ---- //

  $("#graph").hide();
  $("#container").addClass("o--start");
  $("#circle").addClass("o__start");

  $("#container").on("mouseenter", function(){
    $("#circle").addClass("hover");
  }).on("mouseleave", function() {
    $("#circle").removeClass("hover");
  });

  $("#container").on("click", function() {
    if($("#container").hasClass("o--face")){
      $("#circle").toggleClass("o__face--smile").toggleClass("o__face--frown");
    }
    if($("#container").hasClass("o--collect")){
      $("#circle").removeClass("o__collect").addClass("o__face o__face--smile");
      $("#container").removeClass("o--collect spin").addClass("o--face");
      $("#graph").show();
    }
    if($("#container").hasClass("o--start")){
      $("#circle").removeClass("o__start").addClass("o__collect");
      $("#container").removeClass("o--start").addClass("o--collect spin");
      playlow();
    }
  });

  // ---- END: ACTION CIRCLE ---- //

  // ---- BEGIN: GRADIENT BACKGROUND ---//

  var colors = new Array(
    [146,230,230],
    [255,249,175],
    [0,129,138],
    [151,222,149],
    [101,133,37],
    [207,238,145]);

  var step = 0;
  //color table indices for: 
  // current color left
  // next color left
  // current color right
  // next color right
  var colorIndices = [0,1,2,3];

  //transition speed
  var gradientSpeed = 0.002;

  function updateGradient()
  {
    
    if ( $===undefined ) return;
    
  var c0_0 = colors[colorIndices[0]];
  var c0_1 = colors[colorIndices[1]];
  var c1_0 = colors[colorIndices[2]];
  var c1_1 = colors[colorIndices[3]];

  var istep = 1 - step;
  var r1 = Math.round(istep * c0_0[0] + step * c0_1[0]);
  var g1 = Math.round(istep * c0_0[1] + step * c0_1[1]);
  var b1 = Math.round(istep * c0_0[2] + step * c0_1[2]);
  var color1 = "rgb("+r1+","+g1+","+b1+")";

  var r2 = Math.round(istep * c1_0[0] + step * c1_1[0]);
  var g2 = Math.round(istep * c1_0[1] + step * c1_1[1]);
  var b2 = Math.round(istep * c1_0[2] + step * c1_1[2]);
  var color2 = "rgb("+r2+","+g2+","+b2+")";

   $('#gradient').css({
     background: "-webkit-gradient(linear, left top, right top, from("+color1+"), to("+color2+"))"}).css({
      background: "-moz-linear-gradient(left, "+color1+" 0%, "+color2+" 100%)"});
    
    step += gradientSpeed;
    if ( step >= 1 )
    {
      step %= 1;
      colorIndices[0] = colorIndices[1];
      colorIndices[2] = colorIndices[3];
      
      //pick two new target color indices
      //do not pick the same as the current one
      colorIndices[1] = ( colorIndices[1] + Math.floor( 1 + Math.random() * (colors.length - 1))) % colors.length;
      colorIndices[3] = ( colorIndices[3] + Math.floor( 1 + Math.random() * (colors.length - 1))) % colors.length;
      
    }
  }

  setInterval(updateGradient,10);

  // Thanks to https://speckyboy.com/css-background-effects/
  // And https://colorhunt.co/

  //---- END: GRADIENT BACKGROUND ----///

  // ---- BEGIN: CSV PLOT ---- //

  var trace1 = {
    x: [1, 2, 3, 4], 
    y: [10, 15, 13, 17], 
    type: 'scatter'
  };
  var trace2 = {
    x: [1, 2, 3, 4], 
    y: [16, 5, 11, 9], 
    type: 'scatter'
  };
  var data = [trace1, trace2];
  Plotly.newPlot('plotdiv', data);

}); //jQuery End

