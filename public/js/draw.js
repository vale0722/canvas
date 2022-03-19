const canvas = document.getElementById('sheet');
let context = canvas.getContext('2d');

const socket = io();

window.onload= function() {
    let isDrawing = false;
    let x = 0;
    let y = 0;

    canvas.addEventListener('mousedown', e => {
        x = e.offsetX;
        y = e.offsetY;
        isDrawing = true;
    });

    canvas.addEventListener('mousemove', e => {
        if (isDrawing) {
            drawLine(context, x, y, e.offsetX, e.offsetY);
            x = e.offsetX;
            y = e.offsetY;
        }
    });

    window.addEventListener('mouseup', e => {
        if (isDrawing) {
            drawLine(context, x, y, e.offsetX, e.offsetY);
            x = 0;
            y = 0;
            isDrawing = false;
        }
    });

    socket.on('update_canvas',function(data){
        let {x1,y1,x2,y2,color} = JSON.parse(data);
        drawLine(context,x1,y1,x2,y2,color,true);
    });

    socket.on('clear', function(data){
        console.log('clear surface request - ', data);
        context.clearRect(0, 0, canvas.width, canvas.height);
    });

    function drawLine(context, x1, y1, x2, y2,color = selected_color,from_server = false) {
        if(!from_server)
            socket.emit('update_canvas',JSON.stringify({x1,y1,x2,y2,color}));
        context.beginPath();
        context.strokeStyle = color;
        context.lineWidth = 5;
        context.lineCap = 'round'
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
        context.stroke();
        context.closePath();
    }
}

let selected_color = 'red';
function selectColor(color){
    document.getElementsByClassName(selected_color)[0].classList.remove('selected');
    document.getElementsByClassName(color)[0].classList.add('selected');
    selected_color = color;
}

function clearCanvas(){
    context.clearRect(0, 0, canvas.width, canvas.height);
    socket.emit('clear', 'canvas');
}
