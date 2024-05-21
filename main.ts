basic.showLeds(`
# # . . .
# # . # #
. . . . .
# . . . #
. # # # .
`)
radio.setGroup(210)
let strip = neopixel.create(DigitalPin.P0, 24, NeoPixelMode.RGB)
let strip2 = neopixel.create(DigitalPin.P16, 24, NeoPixelMode.RGB)
strip.showRainbow(1, 360)

let backward: number = 0
let right: number = 0
let rightMotor: number = 0
let leftMotor: number = 0
let block: boolean = false

radio.onReceivedValue(function (name, value) {
    if (name.compare("mgy") == 0) {
        right = value
    }
    if (name.compare("mgx") == 0) {
        backward = value
    }
    if (name.compare("block") == 0) {
        block = true
    }
    if (name.compare("unblock") == 0) {
        block = false
    }
    if (block) {
        rightMotor = 0
        leftMotor = 0
    } else {
        // Kombinace pro pohyb a zatáčení
        rightMotor = backward - right
        leftMotor = backward + right
    }
})

basic.forever(function () {
    PCAmotor.MotorRun(PCAmotor.Motors.M1, rightMotor)
    PCAmotor.MotorRun(PCAmotor.Motors.M4, leftMotor)
})
