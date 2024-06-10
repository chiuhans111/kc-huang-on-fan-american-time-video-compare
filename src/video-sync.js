import transform from './data/transform.json'
/* eslint-disable */



/**
 * Time re mapping
 * @param {number} master 
 * @param {number} time 
 * @param {HTMLCanvasElement} canvas 
 * @returns 
 */
function f(master, time) {
    for (let segment of transform) {
        var [x1, x2, y1, y2] = segment
        if (master == 2) {
            x1 = segment[2]
            x2 = segment[3]
            y1 = segment[0]
            y2 = segment[1]
        }

        if (time >= x1 && time <= x2) {
            return (time - x1) / (x2 - x1) * (y2 - y1) + y1
        }
    }
    return null
}


/**
* Time re mapping
* @param {HTMLCanvasElement} canvas 
* @returns 
*/
function g(master, t1, t2, canvas) {

    if (master == 2) {
        let t3 = t1
        t1 = t2
        t2 = t3
    }
    var s = 1
    var ctx = canvas.getContext('2d')
    ctx.reset()
    ctx.resetTransform()
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.translate(canvas.width / 2, canvas.height / 2)


    var height1 = 20
    var height2 = 60

    ctx.lineWidth = 2
    for (let segment of transform) {
        var [x1, x2, y1, y2] = segment

        x1 -= t1
        x2 -= t1
        y1 -= t2
        y2 -= t2

        x1 *= s
        x2 *= s
        y1 *= s
        y2 *= s

        ctx.fillStyle = 'lightgreen'

        if (((x2 < -canvas.width / 2) || (x1 > canvas.width / 2))
            && ((y2 < -canvas.width / 2) || (y1 > canvas.width / 2))) continue

        // Bricks
        ctx.beginPath()
        ctx.rect(x1, height1, x2 - x1, height2 - height1)
        ctx.fill()
        ctx.stroke()

        ctx.beginPath()
        ctx.rect(y1, -height1, y2 - y1, height1 - height2)
        ctx.fill()
        ctx.stroke()

        // Connection line
        ctx.beginPath()
        ctx.moveTo(x1, height1)
        ctx.lineTo(y1, -height1)
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(x2, height1)
        ctx.lineTo(y2, -height1)
        ctx.stroke()
    }

    ctx.strokeStyle = 'red'

    ctx.beginPath()
    ctx.moveTo(0, height2)
    ctx.lineTo(0, -height2)
    ctx.stroke()
}


export { f, g, transform }