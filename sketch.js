var NUMSINES = 8; 
var sines = new Array(NUMSINES); 
var rad; 
var i; 


var fund = 0.05; 
var ratio = 0.01; 
var alpha = 10; 
var trace = false; 
var osc1, echo1;
var sequence = [62, 62, 64, 62, 67, 66, 62, 62, 64, 62, 69, 67, 62, 62, 74, 71, 67, 66, 64, 72, 72, 71, 67, 69, 67]; // MIDI 
var step = 0; 

var thechain = []; // Markov Chain Array
var thecurrentnote;


function setup()
{
  createCanvas(1200, 800); 

  rad = height/2; 
  background(255); 

  for (i = 0; i<sines.length; i++)
  {
    sines[i] = PI; 
  }
  
  osc1 = new p5.Oscillator();
  osc1.setType('square');
  osc1.freq(240);
  osc1.amp(0);
  osc1.start();

  echo1 = new p5.Delay();
  echo1.process(osc1, 0.25, 0.5, 3000); 
  
  domarkov();
  thecurrentnote = sequence[floor(random(sequence.length))];
  
}

function draw()
{
  if (!trace) {
    background(255); 
    stroke(0, 120, 0, 125); 
    noFill(); 
    osc1.amp(0.2);
    osc1.freq(midiToFreq(thecurrentnote));
  
  if(frameCount % 15 == 0) {
    var which = picknote(thecurrentnote);
    thecurrentnote = which;
  }
  } 

  push(); 
  translate(width/4, height/4); 

  for (i = 0; i<sines.length; i++)
  {
    var erad = 0; 
    if (trace) {
      stroke(0, 0, 255*(float(i)/sines.length), alpha); 
      fill(0, 0, 255, alpha/2); 
      erad = 5.0*(1.0-float(i)/sines.length);
    }
    var radius = rad/(i+1); 
    rotate(sines[i]); 
    if (!trace) ellipse(0, 0, radius*2, radius*2); 
    push(); 
    translate(0, radius); 
    if (!trace) ellipse(0, 0, 5, 5);
    if (trace) ellipse(0, 0, erad, erad); 
    pop(); 
    translate(0, radius); 
    sines[i] = (sines[i]+(fund+(fund*i*ratio)))%TWO_PI; 
  }
  
  pop(); 
}

function keyReleased()
{
  if (key==' ') {
    trace = !trace; 
    background(255);
  }
}



function picknote(note)
{
  var pick = floor(random(thechain[note].length));
  console.log("chain length is " + thechain[note].length + " for note " + note);
  return(thechain[note][pick]);
}

function domarkov()
{
  for(var i = 0; i<sequence.length;i++)
  {
    var current = sequence[i]; // current note in melody
    var next = sequence[(i+1)%sequence.length]; // next note in melody
    if(!thechain[current]) // first time we're seeing this note
    {
      thechain[current] = []; // make an array for it in the chain
    }
    // add the next note to the chain
    thechain[current].push(next);
  }
}


