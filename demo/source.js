// Click to edit!

echo('Hello world!')

let a = 10 + 12;

echo('Answer to the sum:', a)

echo(window)

function echo(msg, param2 = '') {
    postMessage(msg + ' ' + param2)
}
