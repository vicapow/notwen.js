Scene = function(){
    this.objects = new Array()
    this.PPCM = 50
    this.PPM = this.PPCM * 100 // pixels per centa meter
}
Scene.prototype.step = function(fn,deltaT,redraw){
    for(var i = 0; i < this.objects.length;i++){
        if(fn) fn(this.objects[i])
        this.objects[i].step(null,deltaT,false)
    }
    if(redraw) this.redraw()
    return this
}
Scene.prototype.redraw = function(){
    // TODO: use a `dirt` variable to keep track if a redraw is even needed
    this.each(function(obj){ obj.redraw() })
}

Scene.prototype.gravity = function(g){
    // gravity
    var f_mag, f_vec, self = this
    this.pairs(function(obj1,obj2){
        f_mag = obj1.getGForce(obj2,g)
        try{ f_vec = obj1.pos.lookAt(obj2.pos).normalize() } catch(e) { return }
        if(obj2.pos.minus(obj1.pos).magnitude() > obj2.radius + obj1.radius){
            obj1.applyForce(f_vec.scale(f_mag))
            obj2.applyForce(f_vec.scale(-f_mag))
        }
    })
}

Scene.prototype.applyForce = function(force){
    this.each(function(obj){
        obj.applyForce(force)
    })
}

Scene.prototype.collision = function(k,fn){
    var diff, dir, f
    this.pairs(function(obj1,obj2){
        diff = obj2.pos.minus(obj1.pos)
        try{ dir = diff.normalize() } catch(e) { return }
        var dif_mag = diff.magnitude()
        if(dif_mag < obj2.radius + obj1.radius){
            var x = obj2.radius + obj1.radius - dif_mag
            f = k*x
            obj1.applyForce(dir.scale(-f))
            obj2.applyForce(dir.scale(f))
            if(fn) fn(obj1,obj2)
        }
    })
}

Scene.prototype.dampen = function(d){
    for(var i = 0; i < this.objects.length;i++)
        this.objects[i].dampen(d)
}

Scene.prototype.pairs = function(fn){
    for(var i = 0; i < this.objects.length;i++){
        this.objects[i]
        for(var j = i; j < this.objects.length;j++){
            if(i===j) continue
            fn(this.objects[i],this.objects[j])
        }
    }
}
Scene.prototype.each = function(fn){
    for(var i = 0; i < this.objects.length;i++)
        fn(this.objects[i])
}

Scene.prototype.add = function(obj){
    this.objects.push(obj)
    return obj
}

Scene.prototype.energy = function(){
    var total = 0
    this.each(function(obj){
        total += obj.energy()
    })
    return total
}

Scene.prototype.constraint = function(w,h,obj){
    // var x, f, damping = 0.9
    if(obj.pos.x + obj.radius > w){
        // x = obj.pos.x + obj.radius - w
        // f = - x * k
        // obj.applyForce(new Vector(f,0))
        // obj.dampen(damping)
        obj.vel = obj.vel.reflect(new Vector(-1,0))
        obj.acc = obj.acc.reflect(new Vector(-1,0))
        obj.pos.x = w - obj.radius - 1
    }else if(obj.pos.x - obj.radius < 0){
        // x = obj.pos.x - obj.radius
        // f = - x * k
        // obj.applyForce(new Vector(f,0))
        //obj.dampen(damping)
        obj.vel = obj.vel.reflect(new Vector(1,0))
        obj.acc = obj.acc.reflect(new Vector(1,0))
        obj.pos.x = obj.radius + 1
    }
    if(obj.pos.y + obj.radius >= h){
        // x = obj.pos.y + obj.radius - h
        // f = - x * k
        // obj.applyForce(new Vector(0,f))
        //obj.dampen(damping)
        obj.vel = obj.vel.reflect(new Vector(0,-1))
        obj.acc = obj.acc.reflect(new Vector(0,-1))
        obj.pos.y = h - obj.radius - 1
    }else if(obj.pos.y - obj.radius <= 0){
        // x = obj.pos.y - obj.radius
        // f = - x * k
        // obj.applyForce(new Vector(0,f))
        //obj.dampen(damping)
        obj.vel = obj.vel.reflect(new Vector(0,1))
        obj.acc = obj.acc.reflect(new Vector(0,1))
        obj.pos.y = obj.radius + 1
    }
}


if(typeof(module)!=='undefined') module.exports = Scene