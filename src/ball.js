

function Ball(opts){
    // call super constructor
    InteractiveObject.apply(this,arguments)
    var el = document.createElement("div")
    el.className = "ball"
    if(opts.color) el.style.backgroundColor = opts.color
    this.mass = 1
    el.style.borderRadius = this.radius + 'px'
    var shadowRadius = 0
    el.style.width = this.radius * 2 + 'px'
    el.style.height = this.radius * 2 + 'px'
    //el.style.boxShadow = '0px 0px ' + shadowRadius + 'px' + ' 0px #000'
    this.height = this.width = this.radius * 2 + shadowRadius
    this.radius = opts.radius
    this.attachElement(el)
    document.body.appendChild(el)
    this.listenForMouseEvents('mouseup','mousemove','mousedown')
    .on('mousedown',function(event){
        var self = this
        document.addEventListener('mousemove',mousemove)
        var prev_pos = this.pos.copy()
        var prev_vel = this.vel.copy()
        var prev_fixed = this.fixed
        mousemove(event)
        function mousemove(event){
            self.acc.x = prev_vel.x - self.vel.x
            self.acc.y = prev_vel.y - self.vel.y
            prev_vel.x = self.vel.x = self.pos.x - prev_pos.x
            prev_vel.y = self.vel.y = self.pos.y - prev_pos.y
            prev_pos.x = self.pos.x = event.clientX
            prev_pos.y = self.pos.y = event.clientY
            self.fixed = true
        }
        document.addEventListener('mouseup',function(event){
            document.removeEventListener('mousemove',mousemove)
            self.fixed = prev_fixed
        })
    })
}



// extend MovingObject
Ball.prototype.__proto__ = InteractiveObject.prototype