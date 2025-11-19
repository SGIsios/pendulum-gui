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
let pidActive = false;

// input: current angle
// output: controllerTorque
const PidController = {
	pValue: 0,
	iValue: 0,
	dValue: 0,
	setAngle: 0,
	calcP(diff) {
		return this.pValue * diff;
	},
	calcI(diff) {
		return 0;
	},
	calcD(diff) {
		return 0;
	},
	calculateTorque(currentAngle) {
		const diff = this.setAngle - currentAngle;
		const torque = this.calcP(diff) + this.calcI(diff) + this.calcD(diff);
		return torque;
	}
}

function updateValues() {
	const externalTorqueInput = document.getElementById('external-torque');
	externalTorque = parseFloat(externalTorqueInput.value);
	const dampingInput = document.getElementById('damping');
	damping = parseFloat(dampingInput.value);
	const setValueInput = document.getElementById('set-value');
	PidController.setAngle = parseFloat(setValueInput.value);
	const pValueInput = document.getElementById('p-value');
	PidController.pValue = parseFloat(pValueInput.value);
	const iValueInput = document.getElementById('i-value');
	PidController.iValue = parseFloat(iValueInput.value);
	const dValueInput = document.getElementById('d-value');
	PidController.dValue = parseFloat(dValueInput.value);
}

function step() {
	updateValues();
	angularVelocity += (-(9.8 / length) * Math.sin(angle)
		- angularVelocity * damping
		+ externalTorque / inertia) * dt;
	if (pidActive) {
		angularVelocity += (PidController.calculateTorque(angle) / inertia) * dt;
	}
	angle += angularVelocity * dt;
}

function drawCanvas() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	const x = canvas.width / 2 + lengthOnScreen * Math.sin(angle);
	const y = canvas.height / 2 + lengthOnScreen * Math.cos(angle);

	// Rod
	ctx.beginPath();
	ctx.moveTo(canvas.width / 2, canvas.height / 2);
	ctx.lineTo(x, y);
	ctx.strokeStyle = 'red';
	ctx.lineWidth = 4;
	ctx.stroke();

	// Bob
	ctx.beginPath();
	ctx.arc(x, y, 15, 0, 2 * Math.PI);
	ctx.fillStyle = 'red';
	ctx.fill();
	ctx.stroke();

	//setValue
	const x_setValue = canvas.width / 2 + lengthOnScreen * Math.sin(PidController.setAngle);
	const y_setValue = canvas.height / 2 + lengthOnScreen * Math.cos(PidController.setAngle);

	ctx.beginPath();
	ctx.moveTo(canvas.width / 2, canvas.height / 2);
	ctx.lineTo(x_setValue, y_setValue);
	ctx.strokeStyle = 'gray';
	ctx.lineWidth = 4;
	ctx.stroke();

}

function setStartingValues() {
	const angleInput = document.getElementById('start-angle');
	angle = parseFloat(angleInput.value);
	updateValues();
	angularVelocity = 0;
	drawCanvas();
}

function update() {
	if (!running) return;
	updateValues();
	step();
	drawCanvas();
	requestAnimationFrame(update);
}

// Buttons
document.getElementById('startBtn').onclick = () => { running = true; update(); }
document.getElementById('stopBtn').onclick = () => { running = false; }
document.getElementById('resetBtn').onclick = () => { setStartingValues(); }

// show slider values
const setValueSlider = document.getElementById("set-value");
const setValueOut = document.getElementById("set-value-output");
setValueSlider.addEventListener("input", () => {
	setValueOut.textContent = setValueSlider.value;
});

const externalTorqueSlider = document.getElementById("external-torque");
const externalTorqueOut = document.getElementById("external-torque-output");
externalTorqueSlider.addEventListener("input", () => {
	externalTorqueOut.textContent = externalTorqueSlider.value;
});

document.getElementById("activate-pid").addEventListener("change", e => {
	pidActive = e.target.checked;
});

// Initial draw
setStartingValues();
drawCanvas();
