// Click to edit!

echo('Hello world!')

beep(300)
sleep()
beep(400)

let a = 10 + 12;

echo('Answer to the sum:', a)

echo(window)

function echo(msg, param2 = '') {
    postMessage(msg + ' ' + param2)
}
