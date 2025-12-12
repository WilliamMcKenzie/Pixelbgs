async function download(color, seed, pixel, zoom, speed) {
	let contents = `
const html = document.querySelector('html')
const body = document.querySelector('body')
const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')
const color = '${color}'
const seed = ${seed}
body.appendChild(canvas)
canvas.style = 'position: absolute; top: 0; left: 0; z-index: -1;'

let pixel = ${pixel}
let zoom = ${zoom}
let speed = ${speed}

let cursorX = window.innerWidth / 2
let cursorY = window.innerHeight / 2

let offset = 0

function randi() {
    return Math.floor(Math.random() * 999)
}

function pixellate(x) {
    return pixel * Math.round(x / pixel)
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    offset += (speed/128)
    backgroundLoop()
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






	`
	
	
	if (current == quasicrystals) {
		contents += `

function getOpacity(x, y, angle) {
	let angledX = Math.cos(angle) * x
	let angledY = Math.sin(angle) * y
	return Math.cos(angledX + angledY + offset) * 100
}

function getColor(x, y) {
	let opacity = 0
	let angle = 2 * Math.PI
	let delta = angle / seed
	for (let i = 0; i < seed; i++) {
		opacity += getOpacity(x, y, angle)
		angle -= delta
	}

	return (opacity / seed > 0.5) ? color : "transparent"
}


function backgroundLoop() {
    for (let x = -canvas.width/2; x < canvas.width/2; x += pixel) {
        for (let y = -canvas.height/2; y < canvas.height/2; y += pixel) {
            ctx.fillStyle = getColor((x / zoom), (y / zoom))
            ctx.fillRect(pixellate(x + canvas.width/2), pixellate(y + canvas.height/2), pixel, pixel)
        }
    }
}

resizeCanvas()
animate()

		`
	}
	
	if (current == sinwaves) {
		contents += `

function renderPoint(x) {
	let y = Math.sin((offset + x * seed))
	y *= (zoom / 8)
	return y
}

function backgroundLoop() {
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


resizeCanvas()
animate()
	
`
	}
	
	if (current == mouseeffects) {
		contents += `

function backgroundLoop() {
    const radius = 160
    const radiussquared = radius ** 2

    ctx.fillStyle = color

    for (let i = -radius; i < radius; i += 1) {
        let y = Math.sqrt(radiussquared - i ** 2)
        let sinwave = (16 * zoom) * Math.sin(offset + (i) * seed * 4)
        // Best seeds: 1000, 40, 57, 63, 69, 1.618 * 1000, 1.64 * 69

        ctx.fillRect(pixellate(cursorX + i), pixellate(sinwave + cursorY + y), pixel, pixel)
        ctx.fillRect(pixellate(cursorX + i), pixellate(sinwave + cursorY - y), pixel, pixel)
        ctx.fillRect(pixellate(sinwave + cursorX + y), pixellate(cursorY + i), pixel, pixel)
        ctx.fillRect(pixellate(sinwave + cursorX - y), pixellate(cursorY + i), pixel, pixel)
    }
}

resizeCanvas()
animate()

	
`
	}
	
	
	let file = new Blob([contents], {type: "text/plain"})
	let a = document.getElementById("download")
	a.innerHTML = "download bg.js"
	a.href = URL.createObjectURL(file)
	a.download = "bg.js"
	
	await fetch("https://100.28.2.231:8080/download", {
		method: "POST"
	})
	
	updateDownloads()
}


async function updateDownloads(){
	let data = await fetch("https://100.28.2.231:8080/getdownloads", {
		method: "GET"
	})
	
	let downloads = await data.json()
	document.getElementById("download-counter").innerHTML = `total: ${downloads}`
	console.log(downloads)
}

updateDownloads()


