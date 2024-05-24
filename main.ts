basic.showLeds(`
# # . . .
# # . # #
. . . . .
# . . . #
. # # # .
`)
radio.setGroup(210)
let servoValue: number = 1500
let strip = neopixel.create(DigitalPin.P0, 24, NeoPixelMode.RGB)
strip.showRainbow(1, 120)

let backward: number = 0
let right: number = 0
let rightMotor: number = 0
let leftMotor: number = 0
let block: boolean = false
let mode: string = "none"  // přidání proměnné pro režim ("none", "manual", "automatic")

radio.onReceivedValue(function (name, value) {
    if (name.compare("buttonA") == 0) {
        mode = "manual"  // přepnutí na manuální režim
    }
    if (name.compare("buttonB") == 0) {
        mode = "automatic"  // přepnutí na automatický režim
    }

    if (mode == "manual") {
        // manuální řízení
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
    } else if (mode == "automatic") {
        // automatický režim
        if (name.compare("buttonB") === 0) {
            servoValue = 500
            basic.pause(500)
            servoValue = 2500
            basic.pause(500)
            servoValue = 1500
            PCAmotor.MotorRun(PCAmotor.Motors.M1, 200)
            PCAmotor.MotorRun(PCAmotor.Motors.M4, leftMotor)
        }
    }
})

basic.forever(function () {
    if (mode != "none") {  // pokud není mód "none", provádí příkazy
        PCAmotor.GeekServo(PCAmotor.Servos.S1, servoValue)
        PCAmotor.MotorRun(PCAmotor.Motors.M1, rightMotor)
        PCAmotor.MotorRun(PCAmotor.Motors.M4, leftMotor)
    }
})
