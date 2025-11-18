const canvas = document.getElementById('pendulumCanvas');
const ctx = canvas.getContext('2d');

let angle = 0.5;
let damping = 0.1;
let angularVelocity = 0;
let externalTorque = 0;
const length = 1; // m
const pixPerM = 150;
const lengthOnScreen = length * pixPerM;
const dt = 0.016;   // 60 FPS
const g = 9.81; // m/s^2
const mass = 10; // kg
const inertia = mass * length * length;
let running = false;

function step() {
    angularVelocity += ( -(9.8 / length) * Math.sin(angle) 
    					 - angularVelocity * damping
    					 + externalTorque / inertia) * dt;
    angle += angularVelocity * dt;
}

function drawPendulum() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const x = canvas.width/2 + lengthOnScreen * Math.sin(angle);
    const y = canvas.height/2 + lengthOnScreen * Math.cos(angle);

    // Rod
    ctx.beginPath();
    ctx.moveTo(canvas.width/2, canvas.height/2);
    ctx.lineTo(x, y);
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Bob
    ctx.beginPath();
    ctx.arc(x, y, 15, 0, 2*Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.stroke();
}

function updateTorqueValue() {
	const externalTorqueInput = document.getElementById('external-torque');
	externalTorque = parseFloat(externalTorqueInput.value);	
}

function setStartingValues() {
	const angleInput = document.getElementById('start-angle');
	const dampingInput = document.getElementById('damping');
	angle = parseFloat(angleInput.value);
	damping = parseFloat(dampingInput.value);
	updateTorqueValue();
    angularVelocity = 0;
    drawPendulum();	
}

function update() {
    if (!running) return;
    updateTorqueValue();
    step();
    drawPendulum();
    requestAnimationFrame(update);
}

// Buttons
document.getElementById('startBtn').onclick = () => { running = true; update(); }
document.getElementById('stopBtn').onclick = () => { running = false; }
document.getElementById('resetBtn').onclick = () => {setStartingValues();}

// Initial draw
setStartingValues();
drawPendulum();
