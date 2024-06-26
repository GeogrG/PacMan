const canvas = document.querySelector('canvas')
const scoreEl = document.querySelector('#scoreEl')
console.log(canvas)
console.log(scoreEl)

const c = canvas.getContext("2d")

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Boundary 
{
    static height = 40
    static width = 40
    constructor ({position, image}) 
    {
        this.position = position
        this.width = 40
        this.height = 40
        this.image = image
    }
    Draw()
    {
       /*c.fillStyle = 'blue'
        c.fillRect(this.position.x, this.position.y, 
        this.width, this.height)*/
        c.drawImage(this.image, this.position.x, this.position.y)
    }

}

class Player
{
    constructor({position, velocity})
    {
        this.position = position
        this.velocity = velocity
        this.radius = 15
        this.radians = 0.75
        this.openRate = 0.12
        this.rotation = 0
    }
    Draw()
    {
        c.save()
        c.translate(this.position.x, this.position.y)
        c.rotate(this.rotation)
        c.translate(-this.position.x, -this.position.y)
        c.beginPath()
        c.arc(this.position.x ,this.position.y, this.radius, this.radians, Math.PI * 2 - this.radians)
        c.lineTo(this.position.x, this.position.y)
        c.fillStyle = 'yellow'
        c.fill()
        c.closePath()    
        c.restore()
    }
    Update()
    {
        this.Draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if(this.radians < 0 || this.radians > 0.75)
        {
            this.openRate = -this.openRate
        }
        this.radians+= this.openRate
    }
    
}

class Ghost
{
    static speed = 2
    constructor({position, velocity, color = 'red'})
    {
        this.position = position
        this.velocity = velocity
        this.radius = 15
        this.color = color
        this.prevCollisions = []
        this.speed = 2
        this.scared = false
    }
    Draw()
    {
        c.beginPath()
        c.arc(this.position.x ,this.position.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = this.scared? 'blue' : this.color
        c.fill()
        c.closePath()    
    }
    Update()
    {
        this.Draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
    
}

class Pellete
{
    constructor({position})
    {
        this.position = position
        this.radius = 3
    }
    Draw()
    {
        c.beginPath()
        c.arc(this.position.x ,this.position.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = 'yellow'
        c.fill()
        c.closePath()    
    }    
}

class PowerUp
{
    constructor({position})
    {
        this.position = position
        this.radius = 8
    }
    Draw()
    {
        c.beginPath()
        c.arc(this.position.x ,this.position.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = 'yellow'
        c.fill()
        c.closePath()    
    }    
}


const keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    }
}

let lastKey = ''
let score = 0

const map = [ 
    ['1','-','-','-','-','-','-','-','-','-','2'],
    ['|',' ','.','.','.','.','.','.','.','.','|'],
    ['|','.','b','.','[','7',']','.','b','.','|'],
    ['|','.','.','.','.','_','.','.','.','.','|'],
    ['|','.','[',']','.','.','.','[',']','.','|'],
    ['|','.','.','.','.','^','.','.','.','.','|'],
    ['|','.','b','.','[','+',']','.','b','.','|'],
    ['|','.','.','.','.','_','.','.','.','.','|'],
    ['|','.','[',']','.','.','.','[',']','.','|'],
    ['|','.','.','.','.','^','.','.','.','.','|'],
    ['|','.','b','.','[','6',']','.','b','.','|'],
    ['|','.','.','.','.','.','.','.','.','p','|'],
    ['4','-','-','-','-','-','-','-','-','-','3']
]

const pellets = []
const boundaries = []
const powerUps = []
const ghosts = [
    new Ghost({
        position: {
            x: Boundary.width * 6 + Boundary.width/2,
            y: Boundary.height + Boundary.height/2
        },
        velocity: {x: Ghost.speed, y: 0}
    })
]
const player = new Player({
    position:{
        x: Boundary.width + Boundary.width/2,
        y: Boundary.height + Boundary.height/2
    },
    velocity: {
        x: 0,
        y: 0
    }
});

function createImage(src)
{
    const image = new Image()
    image.src = src
    return image
}

//generate map
map.forEach((row, i) => {
    row.forEach((symbol, j) =>
    {
        switch(symbol)
        {
            case '-':
                boundaries.push
                (
                    new Boundary({ position: {
                    x: Boundary.width * j,
                    y: Boundary.height * i
                }, image: createImage('./imgs/pipeHorizontal.png')})
                )
            break
            case '|':
                boundaries.push
                (
                    new Boundary({ position: {
                    x: Boundary.width * j,
                    y: Boundary.height * i
                }, image: createImage('./imgs/pipeVertical.png')})
                )
            break
            case '1':
                boundaries.push
                (
                    new Boundary({ position: {
                    x: Boundary.width * j,
                    y: Boundary.height * i
                }, image: createImage('./imgs/pipeCorner1.png')})
                )
            break
            case '2':
                boundaries.push
                (
                    new Boundary({ position: {
                    x: Boundary.width * j,
                    y: Boundary.height * i
                }, image: createImage('./imgs/pipeCorner2.png')})
                )
            break
            case '3':
                boundaries.push
                (
                    new Boundary({ position: {
                    x: Boundary.width * j,
                    y: Boundary.height * i
                }, image: createImage('./imgs/pipeCorner3.png')})
                )
            break
            case '4':
                boundaries.push
                (
                    new Boundary({ position: {
                    x: Boundary.width * j,
                    y: Boundary.height * i
                }, image: createImage('./imgs/pipeCorner4.png')})
                )
            break
            case 'b':
                boundaries.push
                (
                    new Boundary({ position: {
                    x: Boundary.width * j,
                    y: Boundary.height * i
                }, image: createImage('./imgs/block.png')})
                )
            break
            case '[':
                boundaries.push
                (
                    new Boundary({ position: {
                    x: Boundary.width * j,
                    y: Boundary.height * i
                }, image: createImage('./imgs/capLeft.png')})
                )
            break
            case ']':
                boundaries.push
                (
                    new Boundary({ position: {
                    x: Boundary.width * j,
                    y: Boundary.height * i
                }, image: createImage('./imgs/capRight.png')})
                )
            break
            case '+':
                boundaries.push
                (
                    new Boundary({ position: {
                    x: Boundary.width * j,
                    y: Boundary.height * i
                }, image: createImage('./imgs/pipeCross.png')})
                )
            break
            case '_':
                boundaries.push
                (
                    new Boundary({ position: {
                    x: Boundary.width * j,
                    y: Boundary.height * i
                }, image: createImage('./imgs/capBottom.png')})
                )
            break
            case '^':
                boundaries.push
                (
                    new Boundary({ position: {
                    x: Boundary.width * j,
                    y: Boundary.height * i
                }, image: createImage('./imgs/capTop.png')})
                )
            break
            case '7':
                boundaries.push
                (
                    new Boundary({ position: {
                    x: Boundary.width * j,
                    y: Boundary.height * i
                }, image: createImage('./imgs/pipeConnectorBottom.png')})
                )
            break
            case '6':
                boundaries.push
                (
                    new Boundary({ position: {
                    x: Boundary.width * j,
                    y: Boundary.height * i
                }, image: createImage('./imgs/pipeConnectorTop.png')})
                )
            break
            case '.':
                pellets.push
                (
                    new Pellete({ position: {
                    x: Boundary.width * j + Boundary.width/2,
                    y: Boundary.height * i + Boundary.height/2
                }})
                )
            break
            case 'p':
                powerUps.push
                (
                    new PowerUp({ position: {
                    x: Boundary.width * j + Boundary.width/2,
                    y: Boundary.height * i + Boundary.height/2
                }})
                )
            break
        }
    })
})

//collision
function circleCollideWithRect({circle, rectangle})
{
    const padding = Boundary.width/2 - circle.radius - 1
    return (circle.position.y - circle.radius + circle.velocity.y <= rectangle.position.y 
    + rectangle.height + padding
    && circle.position.x + circle.radius + circle.velocity.x >= rectangle.position.x - padding
    && circle.position.y + circle.radius + circle.velocity.y >= rectangle.position.y - padding
    && circle.position.x - circle.radius + circle.velocity.x <= rectangle.position.x 
    + rectangle.width + padding) 
}

let animationId

//the main animation function
function animate()
{
    animationId = requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height)

    if(keys.w.pressed && lastKey === 'w')
    {
        for(let i = 0; i < boundaries.length; i++)
        {
            const boundary = boundaries[i]
            if (circleCollideWithRect({
                circle: {...player, velocity:{
                    x: 0, y: -5
                }},
                rectangle: boundary
            }))
            {
                player.velocity.y = 0
                break
            }
            else 
            {
                player.velocity.y = -5
            }
        }
    }
    else if(keys.s.pressed && lastKey === 's')
    {
        for(let i = 0; i < boundaries.length; i++)
        {
            const boundary = boundaries[i]
            if (circleCollideWithRect({
                circle: {...player, velocity:{
                    x: 0, y: 5
                }},
                rectangle: boundary
            }))
            {
                player.velocity.y = 0
                break
            }
            else 
            {
                player.velocity.y = 5
            }
        }
    }
    else if(keys.d.pressed && lastKey === 'd')
    {
        for(let i = 0; i < boundaries.length; i++)
        {
            const boundary = boundaries[i]
            if (circleCollideWithRect({
                circle: {...player, velocity:{
                    x: 5, y: 0
                }},
                rectangle: boundary
            }))
            {
                player.velocity.x = 0
                break
            }
            else 
            {
                player.velocity.x = 5
            }
        }
    }
    else if(keys.a.pressed && lastKey === 'a')
    {
        for(let i = 0; i < boundaries.length; i++)
        {
            const boundary = boundaries[i]
            if (circleCollideWithRect({
                circle: {...player, velocity:{
                    x: -5, y: 0
                }},
                rectangle: boundary
            }))
            {
                player.velocity.x = 0
                break
            }
            else 
            {
                player.velocity.x = -5
            }
        }
    }

    for(let i = ghosts.length - 1; i >= 0; i--)
    { //ghost touches a player
        const ghost = ghosts[i]
        if(Math.hypot(ghost.position.x - player.position.x,
            ghost.position.y - player.position.y) 
            < ghost.radius + player.radius)
        {
            if(ghost.scared)
            {
                ghosts.splice(i,1)
            }
            else
            {
                cancelAnimationFrame(animationId)
                console.log('you lose')
            }
        }
    }
    //Draw a powerUp and when the player collides with a powerUp ghosts scare
    for(let i = powerUps.length - 1; i >= 0; i--)
    {
        const powerUp = powerUps[i]
        powerUp.Draw()

        if(Math.hypot(powerUp.position.x - player.position.x,
            powerUp.position.y - player.position.y) 
            < player.radius + powerUp.radius)
        {
            powerUps.splice(i, 1)

            ghosts.forEach(ghost => {
                ghost.scared = true

                setTimeout(() => {
                    ghost.scared = false
                }, 3500)
            })
        }
    }

    if(pellets.length === 0)
    {
        cancelAnimationFrame(animationId)
    }

    //touching and removing pellets
    for(let i = pellets.length - 1; i >= 0; i--)
    {
        const pellet = pellets[i]
        pellet.Draw()

        if(Math.hypot(pellet.position.x - player.position.x,
            pellet.position.y - player.position.y) 
            < player.radius + pellet.radius)
            {
                pellets.splice(i,1)
                score+=10
                scoreEl.innerHTML = score
            }
    }

    boundaries.forEach((boundary) => {
        boundary.Draw()

        if (circleCollideWithRect({
            circle: player,
            rectangle: boundary
        }))
        {
            player.velocity.x = 0
            player.velocity.y = 0
        }
    })

    player.Update()

    ghosts.forEach((ghost) => {
        ghost.Update()

        const collisions = []
        boundaries.forEach((boundary) => {
            if (!collisions.includes('right') && 
            circleCollideWithRect({
                circle: {...ghost, velocity:{
                    x: ghost.speed, y: 0
                }},
                rectangle: boundary
            }))
            {
                collisions.push('right')
            }
            if (!collisions.includes('left') &&
            circleCollideWithRect({
                circle: {...ghost, velocity:{
                    x: -ghost.speed, y: 0
                }},
                rectangle: boundary
            }))
            {
                collisions.push('left')
            }
            if (!collisions.includes('down') &&
            circleCollideWithRect({
                circle: {...ghost, velocity:{
                    x: 0, y: ghost.speed
                }},
                rectangle: boundary
            }))
            {
                collisions.push('down')
            }
            if (!collisions.includes('up') &&
            circleCollideWithRect({
                circle: {...ghost, velocity:{
                    x: 0, y: -ghost.speed
                }},
                rectangle: boundary
            }))
            {
                collisions.push('up')
            }
        })
        if(collisions.length > ghost.prevCollisions.length)
        ghost.prevCollisions = collisions

        if(JSON.stringify(collisions) !== JSON.stringify(ghost.prevCollisions))
        {
            if(ghost.velocity.x > 0)
            {
                ghost.prevCollisions.push('right')
            }
            else if(ghost.velocity.x < 0)
            {
                ghost.prevCollisions.push('left')
            }
            else if(ghost.velocity.y < 0)
            {
                ghost.prevCollisions.push('up')
            }
            else if(ghost.velocity.y > 0)
            {
                ghost.prevCollisions.push('down')
            }

            const pathways = ghost.prevCollisions.filter(collision =>
                {
                    return !collisions.includes(collision)
                }    
            )
            const direction = pathways[Math.floor(Math.random() 
            * pathways.length)]

            switch (direction){
                case 'down':
                    ghost.velocity.y = ghost.speed
                    ghost.velocity.x = 0
                    break

                case 'up':
                    ghost.velocity.y = -ghost.speed
                    ghost.velocity.x = 0
                    break

                case 'left':
                    ghost.velocity.y = 0
                    ghost.velocity.x = -ghost.speed
                    break

                case 'right':
                    ghost.velocity.y = 0
                    ghost.velocity.x = ghost.speed
                    break
            }
            ghost.prevCollisions = []
        }
    })
    if(player.velocity.x > 0) player.rotation = 0
    else if(player.velocity.x < 0) player.rotation = Math.PI
    else if(player.velocity.y > 0) player.rotation = Math.PI/2
    else if(player.velocity.y < 0) player.rotation = Math.PI * 1.5
}

animate()

addEventListener('keydown', ({key}) => {
    switch (key){
        case 'w':
            keys.w.pressed = true;
            lastKey = 'w'
            break;
        case 's':
            keys.s.pressed = true;
            lastKey = 's'
            break;
        case 'a':
            keys.a.pressed = true;
            lastKey = 'a'
            break;
        case 'd':
            keys.d.pressed = true;
            lastKey = 'd'
            break;    
    }
})

addEventListener('keyup', ({key}) => {
    switch (key){
        case 'w':
            keys.w.pressed = false
            break
        case 's':
            keys.s.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
        case 'd':
            keys.d.pressed = false
            break
    }
})