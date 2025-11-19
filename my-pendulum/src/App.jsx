import { useState } from 'react'
import './App.css'
import Simulation from './Simulation.jsx'

function App() {
	const [count, setCount] = useState(0)

	return (
		<>
			<div className="container">
				<Simulation />
			</div>
		</>
	)
}

export default App
