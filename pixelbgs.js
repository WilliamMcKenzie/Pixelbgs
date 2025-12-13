let current = quasicrystals
const html = document.querySelector('html')
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const seed = document.getElementById("seed")
let color = "#e0b467"
let pixel = 8
let zoom = 8
let speed = 8

let cursorX = window.innerWidth / 2
let cursorY = window.innerHeight / 2

let offset = 0

function randi() {
    return Math.floor(Math.random() * 999)
}

function changebg(color) {
    html.style.backgroundColor = color
    canvas.style.backgroundColor = color
}

function pixellate(x) {
    return pixel * Math.round(x / pixel)
}

function getOpacity(x, y, angle) {
	let angledX = Math.cos(angle) * x
	let angledY = Math.sin(angle) * y
	return Math.cos(angledX + angledY + offset) * 100
}

function getColor(x, y) {
	let opacity = 0
	let angle = 2 * Math.PI
	let delta = angle / seed.value
	for (let i = 0; i < seed.value; i++) {
		opacity += getOpacity(x, y, angle)
		angle -= delta
	}

	return (opacity / seed.value > 0.5) ? color : "transparent"
}

function quasicrystals() {
    for (let x = -canvas.width/2; x < canvas.width/2; x += pixel) {
        for (let y = -canvas.height/2; y < canvas.height/2; y += pixel) {
            ctx.fillStyle = getColor((x / zoom), (y / zoom))
            ctx.fillRect(pixellate(x + canvas.width/2), pixellate(y + canvas.height/2), pixel, pixel)
        }
    }
}


function renderPoint(x) {
	let y = Math.sin((offset + x * seed.value))
	y *= (zoom / 8)
	return y
}

function sinwaves() {
    ctx.fillStyle = color

    for (let i = 0; i < canvas.width; i += 1) {
        const baseHeight = canvas.height/2

        const leftDist = 1 - (i / cursorX)
        let leftStretch = (leftDist * baseHeight)
        let leftBaseValue = baseHeight + leftStretch * renderPoint(i)
        let leftCenterValue = cursorY
        let leftValue = (leftBaseValue * (leftDist)) + (leftCenterValue * (1 - leftDist))

        const rightDist = ((i - cursorX)) / (canvas.width - cursorX)
        let rightStretch = (rightDist * baseHeight)
        let rightBaseValue = baseHeight + rightStretch * renderPoint(i)
        let rightCenterValue = cursorY
        let rightValue = (rightBaseValue * (rightDist)) + (rightCenterValue * (1 - rightDist))

        if (i < cursorX) {
            ctx.fillRect(pixellate(i), pixellate(leftValue), pixel, pixel)
        }
        else {
            ctx.fillRect(pixellate(i), pixellate(rightValue), pixel, pixel)
        }
    }
}


function mouseeffects() {
    const radius = 160
    const radiussquared = radius ** 2

    ctx.fillStyle = color

    for (let i = -radius; i < radius; i += 1) {
        let y = Math.sqrt(radiussquared - i ** 2)
        let sinwave = (16 * zoom) * Math.sin(offset + (i) * seed.value * 4)
        // Best ones: 1000, 40, 57, 63, 69, 1.618 * 1000, 1.64 * 69

        ctx.fillRect(pixellate(cursorX + i), pixellate(sinwave + cursorY + y), pixel, pixel)
        ctx.fillRect(pixellate(cursorX + i), pixellate(sinwave + cursorY - y), pixel, pixel)
        ctx.fillRect(pixellate(sinwave + cursorX + y), pixellate(cursorY + i), pixel, pixel)
        ctx.fillRect(pixellate(sinwave + cursorX - y), pixellate(cursorY + i), pixel, pixel)
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    offset += (speed/128)
    current()
    requestAnimationFrame(animate)
}

window.addEventListener('resize', resizeCanvas)
function resizeCanvas() {
    canvas.width = window.innerWidth
    canvas.height = Math.max(html.clientHeight, html.scrollHeight, html.offsetHeight)
}

document.addEventListener('mousemove', function(event) {
  cursorX = event.clientX
  cursorY = event.clientY
})

function select(f) {
    current = f

    if (f == quasicrystals) {
		color = "#e0b467"
		document.getElementById('color').value = color
        zoom = 8
        document.getElementById("zoom").value = 8
        pixel = 8
        document.getElementById("resolution").value = 8
        seed.value = 4.2
        document.getElementById("speed").value = 8
        speed = 8
    }
    if (f == sinwaves) {
		color = ["#d3513e", "#263397", "#e0b467", "#6bb7ee"][randi() % 4]
		document.getElementById('color').value = color
        zoom = randi() % 24
        document.getElementById("zoom").value = zoom
        pixel = 24 - (randi() % 20)
        document.getElementById("resolution").value = 24 - pixel
        seed.value = (randi() % 200) / 10
        speed = randi() % 64
        document.getElementById("speed").value = speed
    }
    if (f == mouseeffects) {
		color = "#6bb7ee"
		document.getElementById('color').value = color
		zoom = 3
        document.getElementById("zoom").value = 3
        pixel = 4
        document.getElementById("resolution").value = 20
        seed.value = 15.1
        document.getElementById("speed").value = 24
        speed = 24
    }
}

function zoomin() {
    zoom = parseInt(document.getElementById('zoom').value)
}

function resolution() {
    pixel = 24 - parseInt(document.getElementById('resolution').value)
}

function setspeed() {
    speed = parseInt(document.getElementById('speed').value)
}

function setcolor() {
    color = document.getElementById('color').value
}

resizeCanvas()
animate()
