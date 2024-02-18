kaboom({
    width: 1280,
    height: 720,
    scale: 0.7

})

loadSprite("background", "assets/background/background_layer_1.png")
loadSprite("trees", "assets/background/background_layer_2.png")
loadSpriteAtlas("assets/oak_woods_tileset.png",{
    "ground-golden": {
        "x": 16,
        "y": 0, 
        "width": 16,
        "height": 16,
    },
    "deep-ground": {
        "x": 16,
        "y": 32, 
        "width": 16,
        "height": 16,
    },
    "ground-silver": {
        "x": 150,
        "y": 0, 
        "width": 16,
        "height": 16,
    },
})

loadSprite("shop", "assets/shop_anim.png",{
    sliceX: 6,
    sliceY: 1,
    anims: {
        "default": {
            from: 0,
            to: 5,
            speed: 12,
            loop: true
        }
    }
})
loadSprite("fence", "assets/fence_1.png")
loadSprite("sign", "assets/sign.png")

loadSprite("idle-player1", "assets/idle-player1.png", {
    sliceX: 8, sliceY: 1, anims: {"idle": {from: 0, to: 7, speed: 12, loop: true}}
})
loadSprite("jump-player1", "assets/jump-player1.png", {
    sliceX: 2, sliceY: 1, anims: {"jump": {from: 0, to: 1, speed: 2, loop: true}}
})
loadSprite("attack-player1", "assets/attack-player1.png", {
    sliceX: 6, sliceY: 1, anims: {"attack": {from: 1, to: 5, speed: 18}}
})
loadSprite("run-player1", "assets/run-player1.png", {
    sliceX: 8, sliceY: 1, anims: {"run": {from: 0, to: 7, speed: 18}}
})
loadSprite("death-player1", "assets/death-player1.png", {
    sliceX: 6, sliceY: 1, anims: {"death": {from: 0, to: 5, speed: 10}}
})

loadSprite("idle-player2", "assets/idle-player2.png", {
    sliceX: 4, sliceY: 1, anims: {"idle": {from: 0, to: 3, speed: 8, loop: true}}
})
loadSprite("jump-player2", "assets/jump-player2.png", {
    sliceX: 2, sliceY: 1, anims: {"jump": {from: 0, to: 1, speed: 2, loop: true}}
})
loadSprite("attack-player2", "assets/attack-player2.png", {
    sliceX: 4, sliceY: 1, anims: {"attack": {from: 0, to: 3, speed: 18}}
})
loadSprite("run-player2", "assets/run-player2.png", {
    sliceX: 8, sliceY: 1, anims: {"run": {from: 0, to: 7, speed: 18}}
})
loadSprite("death-player2", "assets/death-player2.png", {
    sliceX: 7, sliceY: 1, anims: {"death": {from: 0, to: 6, speed: 10}}
})

scene("fight", () =>{
    const background = add([
        sprite("background"),
        scale(4)
    ])

    background.add([
        sprite("trees"),
    ])

    const groundTiles = addLevel([
        "","","","","","","","","",
        "------#######-----------",
        "dddddddddddddddddddddddd",
        "dddddddddddddddddddddddd"
        ], {
            tileWidth: 16,
            tileHeight: 16,
            tiles:{
                "#": () => [
                    sprite("ground-golden"),
                    area(),
                    body({isStatic: true})
                ],
                "-": ()=>[
                    sprite("ground-silver"),
                    area(),
                    body({isStatic: true}),
                ],
                "d": ()=>[
                    sprite("deep-ground"),
                    area(),
                    body({isStatic: true})
                ]
            }
        })
        
        groundTiles.use(scale(4))

        const shop = background.add([
            sprite("shop"),
            pos(170, 15),
        ])

        shop.play("default")

        //left invisible wall
        add([
            rect(16, 720),
            area(),
            body({isStatic: true}),
            pos(-20, 0)
        ])
         //right invisible wall
         add([
            rect(16, 720),
            area(),
            body({isStatic: true}),
            pos(1280, 0)
        ])

        background.add([
            sprite("fence"),
            pos(85,125)
        ])
        background.add([
            sprite("fence"),
            pos(10,125)
        ])
        background.add([
            sprite("sign"),
            pos(290,115)
        ])


        function makePlayer(posX, posY, width, height, scaleFactor, id){
            return add([
                pos(posX, posY),
                scale(scaleFactor),
                area({shape: new Rect(vec2(0), width, height)}),
                anchor("center"),
                body({stickToPlatform: true}),
                {
                    isCurrentlyJumping: false,
                    health: 500,
                    sprites: {
                        run: "run-" + id,
                        idle: "idle-" + id,
                        jump: "jump-" + id,
                        attack: "attack-" + id,
                        death: "death-" + id
                    }
                }
            ])
        }

        setGravity(3200)

        const player1 = makePlayer(200, 100, 16, 42, 4, "player1")
        player1.use(sprite(player1.sprites.idle))
        player1.play("idle")

        function run(player, speed, flipPlayer){
            if(player.health === 0){
                return
            }

            if(player.curAnim() !== "run" && !player.isCurrentlyJumping) {
                player.use(sprite(player.sprites.run))
                player.play("run")
            }
            player.move(speed,0)
            player.flipX = flipPlayer
        }

        function resetPlayerToIdle(player){
            player.use(sprite(player.sprites.idle))
            player.play("idle")
        }

        onKeyDown("d", () => {
            run(player1, 500, false)
        })
        onKeyRelease("d", () => {
            if(player1.health !== 0){
                resetPlayerToIdle(player1)
                player1.flipX = false
            }
        })


})

go("fight")

