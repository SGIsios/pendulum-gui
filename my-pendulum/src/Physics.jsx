export default function PendulumPhysics() {
	return (
		<div id="physics-controls" className="controls">
			<h2>Physics Controls</h2>
			<div className="input-row">
				<label htmlFor="start-angle">&alpha;<sub>0</sub></label> <input
					id="start-angle" type="number" value="0.5" />
			</div>
			<div className="input-row">
				<label htmlFor="damping">damping</label> <input id="damping"
					type="number" value="0.5" />
			</div>
			<div className="input-row">
				<label htmlFor="external-torque">external Torque</label> <input
					type="range" min="-50" max="50" value="0" className="slider"
					id="external-torque" /> <span id="external-torque-output">0</span>
			</div>
		</div>
	);
}