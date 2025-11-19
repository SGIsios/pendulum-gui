import { useEffect, useRef, useState } from "react";

export default function Simulation() {
	const canvasRef = useRef(null);
	const runningRef = useRef(false);

	const length = 1; // m
	const pixPerM = 150;
	const lengthOnScreen = length * pixPerM;

	const angle = useRef(0.5);
	const [startAngle, setStartAngle] = useState(0.5); // input value
	const [damping, setDamping] = useState(0.1);
	const [externalTorque, setExternalTorque] = useState(0);
	const dampingRef = useRef(damping);
	const externalTorqueRef = useRef(externalTorque);

	useEffect(() => { dampingRef.current = damping; }, [damping]);
	useEffect(() => { externalTorqueRef.current = externalTorque; }, [externalTorque]);

	const angularVelocity = useRef(0);

	const dt = 0.016;   // 60 FPS
	const g = 9.81; // m/s^2
	const mass = 10; // kg
	const inertia = mass * length * length;

	function drawCanvas() {

		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d");
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		const x = canvas.width / 2 + lengthOnScreen * Math.sin(angle.current);
		const y = canvas.height / 2 + lengthOnScreen * Math.cos(angle.current);

		// Rod
		ctx.beginPath();
		ctx.moveTo(canvas.width / 2, canvas.height / 2);
		ctx.lineTo(x, y);
		ctx.strokeStyle = "red";
		ctx.lineWidth = 4;
		ctx.stroke();

		// Bob
		ctx.beginPath();
		ctx.arc(x, y, 15, 0, 2 * Math.PI);
		ctx.fillStyle = "red";
		ctx.fill();
		ctx.stroke();
	}

	useEffect(() => {
		drawCanvas(); // canvas exists now
	}, []);

	function step() {
		angularVelocity.current += (-(g / length) * Math.sin(angle.current)
			- angularVelocity.current * dampingRef.current
			+ externalTorqueRef.current / inertia) * dt;
		angle.current += angularVelocity.current * dt;
	}

	function update() {
		if (!runningRef.current) return;
		step();
		drawCanvas();
		requestAnimationFrame(update);
	}

	// Button handlers
	const handleStart = () => { runningRef.current = true; update(); };
	const handleStop = () => { runningRef.current = false; };
	const handleReset = () => {
		update();
		angularVelocity.current = 0;
		angle.current = startAngle;
		drawCanvas();
	};

	return (
		<>
			<div className="simulation">
				<canvas ref={canvasRef} width="400" height="500"></canvas>
				<br />
				<button onClick={handleStart}>Start</button>
				<button onClick={handleStop}>Stop</button>
				<button onClick={handleReset}>Reset</button>
			</div>

			<div id="physics-controls" className="controls">
				<h2>Physics Controls</h2>
				<div className="input-row">
					<label htmlFor="start-angle">&alpha;<sub>0</sub></label> <input
						id="start-angle"
						type="number"
						value={startAngle}
						onChange={(e) => setStartAngle(parseFloat(e.target.value))}
					/>
				</div>
				<div className="input-row">
					<label htmlFor="damping">damping</label> <input
						id="damping"
						type="number"
						value={damping}
						step="0.1"
						onChange={(e) => setDamping(parseFloat(e.target.value))}
					/>
				</div>
				<div className="input-row">
					<label htmlFor="external-torque">external Torque</label> <input
						type="range"
						min="-50"
						max="50"
						value={externalTorque}
						onChange={(e) => setExternalTorque(parseFloat(e.target.value))}
					/>
					<span>{externalTorque}</span>
				</div>
			</div>
		</>
	);
}
