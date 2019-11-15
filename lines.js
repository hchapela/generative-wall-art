const canvasSketch = require('canvas-sketch');
const { lerp } = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random')
const palettes = require('nice-color-palettes/1000.json')

const settings = {
  dimensions: [ 2048, 2048 ],
  margin: 2048 * 0.85,
  radius: 800,
  innerRadiusMax: 500,
  noiseMultiplier: 0.0001,
  animate: true,
  fps: 1
};

const sketch = ({ update }) => {

  // Create a color palette
  const chosePalette = () => {
    let palette = random.pick(palettes);

    palette = random.shuffle(palette);
    return palette.slice(0, 2);
  }

  const drawCircle = (context, width, height) => {
    context.beginPath();
    context.arc(width / 2, height / 2, settings.radius, 0, 2 * Math.PI);
    context.lineWidth = 2
    context.strokeStyle = 'black'
    context.stroke();
  }

  const drawPoint = (context, angle, radius) => {
    let x = settings.center + radius * Math.cos(-angle*Math.PI/180);
    let y = settings.center + radius * Math.sin(-angle*Math.PI/180);

    context.beginPath();
    context.arc(x, y, 10, 0, 2 * Math.PI);
    context.fillStyle = 'red'
    context.fill();
  }

  const drawLine = (innerPoint, outterPoint, context, color) => {
    context.beginPath();
    context.moveTo(outterPoint.x, outterPoint.y);
    context.lineTo(innerPoint.x, innerPoint.y);
    context.lineWidth = 24
    context.strokeStyle = `${color}`
    context.stroke();
  }

  // Create palette
  palette = chosePalette()
  settings.background = palette.slice(0,1)
  palette.shift()

  // Return
  return ({ context, width, height, params, playhead, time }) => {

    settings.center = settings.dimensions[0] / 2

    // Fill with background color
    context.fillStyle = `${settings.background}`
    context.fillRect(0, 0, width, height)

    // Line for development debuging
    // drawCircle(context, width, height)
    
    // Create Line
    for (let i = 0; i < 360; i+=3,6) {
      // Noise random inner Radius of the line
      const innerRadius = Math.abs(random.noise1D(i, settings.noiseMultiplier, settings.innerRadiusMax)) + 200
      // Create innerPoint
      const innerPoint = {
        x: settings.center + (settings.radius) * Math.cos(-i*Math.PI/180),
        y: settings.center + (settings.radius) * Math.sin(-i*Math.PI/180)
      }
      const outterPoint = {
        x: settings.center + innerRadius * Math.cos(-i*Math.PI/180),
        y: settings.center + innerRadius * Math.sin(-i*Math.PI/180)
      }
      drawLine(innerPoint, outterPoint, context, random.pick(palette))
    }

    settings.noiseMultiplier += time * .000001
    
  };
};

canvasSketch(sketch, settings)
