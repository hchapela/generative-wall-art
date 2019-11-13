const canvasSketch = require('canvas-sketch');
const { lerp } = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random')
const palettes = require('nice-color-palettes/1000.json')

const settings = {
  dimensions: [ 2048, 2048 ],
  gridSize: 10,
  gridPointsSize: 20,
  margin: 2048 * 0.85,
  strokeLine: 32
};

const sketch = ({ update }) => {

  // Create a grid of N points
  const createGrid = () => {
    const points = []
    for (let x = 0; x < settings.gridSize; x++) {
      for (let y = 0; y < settings.gridSize; y++) {
        const u = x / (settings.gridSize - 1)
        const v = y / (settings.gridSize - 1)
        points.push([ u, v ])
      }
    }
    return points;
  };

  // Choose 2 points in the grid
  const choosePoints = (points) => {
    // Duplicate points
    const drawnedPoints = points
    // Choose a point
    const choosenFirst = drawnedPoints.splice(
      random.range(drawnedPoints.length),
      1
    )
    const choosenSecond = drawnedPoints.splice(
      random.range(drawnedPoints.length),
      1
    )
    
    return [choosenFirst, choosenSecond]
  }

  // Draw a shape
  const drawShape = (points, context, width, height, color) => {
    const firstPoint = points[0][0]
    const secondPoint = points[1][0]

    context.beginPath()
    context.moveTo(lerp(settings.margin, width - settings.margin, firstPoint[0]), height)
    context.lineTo(lerp(settings.margin, width - settings.margin, firstPoint[0]), lerp(settings.margin, height - settings.margin, firstPoint[1]))
    context.lineTo(lerp(settings.margin, width - settings.margin, secondPoint[0]), lerp(settings.margin, height - settings.margin, secondPoint[1]))
    context.lineTo(lerp(settings.margin, width - settings.margin, secondPoint[0]), height)
    context.fillStyle = `${color}`
    context.fill()
    // Stroke with the color of the background
    context.strokeStyle = `${settings.background}`
    context.lineWidth = `${settings.strokeLine}`
    context.stroke()
  }

  // Create a color palette
  const chosePalette = () => {
    let palette = random.pick(palettes);

    palette = random.shuffle(palette);
    return palette.slice(0, 3);
  }

  const drawGrid = (width, height, context) => {
    points.forEach(([ u, v ]) => {
      const x = lerp(settings.margin, width - settings.margin, u)
      const y = lerp(settings.margin, height - settings.margin, v)

      context.beginPath()
      context.arc(x, y, settings.gridPointsSize, 0, Math.PI * 2)
      context.fillStyle = 'black'
      context.fill()
    });
  }

  const points = createGrid()

  // Return
  return ({ context, width, height, params }) => {

    // Create palette
    palette = chosePalette()
    settings.background = palette.slice(0,1)
    palette.shift()

    // Fill with background color
    context.fillStyle = `${settings.background}`
    context.fillRect(0, 0, width, height)

    // Create grid points
    // drawGrid(width, height, context)
    
    // Create the shape
    newShape = choosePoints(points)
    drawShape(
      newShape,
      context,
      width,
      height,
      random.pick(palette)
    )

    // Draw on all points
    while(typeof points !== 'undefined' && points.length > 0) {
      newShape = choosePoints(points)
      drawShape(
        newShape,
        context,
        width,
        height,
        random.pick(palette)
      )
    }

  };
};

canvasSketch(sketch, settings)