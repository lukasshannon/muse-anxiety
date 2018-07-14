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

  $("#bottomlink").hide();
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
      if($("#circle").hasClass("o__face--smile")) $("#lowertext").text("Congratulations! Your anxiety response is within a normal range!");
      if($("#circle").hasClass("o__face--frown")) $("#lowertext").text("Your anxiety levels are above a normal range today. Take care of yourself!");
    }
    if($("#container").hasClass("o--collect")){
      $("#circle").removeClass("o__collect").addClass("o__face o__face--smile");
      $("#container").removeClass("o--collect spin").addClass("o--face");
      $("#bottomlink").show();
      $("#uppertext").text("Your results for today:");
      $("#lowertext").text("Congratulations! Your anxiety response is within a normal range!");
    }
    if($("#container").hasClass("o--start")){
      $("#circle").removeClass("o__start").addClass("o__collect");
      $("#container").removeClass("o--start").addClass("o--collect spin");
      playlow();
      $("#uppertext").text("Keep very still and breathe deeply");
      $("#lowertext").text("Click the action circle when you hear the high pitch tone");
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

  var data1 = {x: [1, 2, 3, 4],
              y: [5, 10, 2, 8]};
  var data2 = {x: [1, 2, 3, 4],
              y: [16, 5, 11, 9]};



  var d3 = Plotly.d3;

  var WIDTH_IN_PERCENT_OF_PARENT = 100,
      HEIGHT_IN_PERCENT_OF_PARENT = 100;

  var gd3 = d3.select('body')
      .append('div')
      .style({
          width: WIDTH_IN_PERCENT_OF_PARENT + '%',
          'margin-left': (100 - WIDTH_IN_PERCENT_OF_PARENT) / 2 + '%',

          height: HEIGHT_IN_PERCENT_OF_PARENT + 'vh',
          'margin-top': (100 - HEIGHT_IN_PERCENT_OF_PARENT) / 2 + 'vh'
      });

  var gd = gd3.node();

  Plotly.plot(gd, 
    [
      {
        type: 'scatter',
        name: 'Last Week',
        x: data1.x,
        y: data1.y

      },
      {
        type: 'scatter',
        name: 'This Week',
        x: data2.x,
        y: data2.y
      }
    ], 
    {
      title: 'Your Progress This Week',
      font: {
          size: 16
      },

    }
  );

  window.onresize = function() {
      Plotly.Plots.resize(gd);
  };

  // ---- END: CSV PLOT ---- //

  // ---- BEGIN: SCROLL TO BOTTOM ---- //

  $("#bottomlink").on("click", function() {
    $('html, body').animate({ 
      scrollTop: $(document).height()-$(window).height()}, 
      1400, 
      "swing"
    );
  });

  // ---- END: SCROLL TO BOTTOM ---- //  

}); //jQuery End

