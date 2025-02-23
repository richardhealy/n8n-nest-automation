import { useState } from 'react';
import OrganizationManager from './components/OrganizationManager';
import WorkflowManager from './components/WorkflowManager';
import './styles/app.css';

function App() {
	const [activeTab, setActiveTab] = useState<'workflows' | 'organization'>(
		'workflows',
	);
	const [token, setToken] = useState('');

	return (
		<div className="app">
			<nav className="tabs">
				<button
					type="button"
					className={activeTab === 'workflows' ? 'active' : ''}
					onClick={() => setActiveTab('workflows')}
				>
					Workflows
				</button>
				<button
					type="button"
					className={activeTab === 'organization' ? 'active' : ''}
					onClick={() => setActiveTab('organization')}
				>
					Organization
				</button>
			</nav>

			<main>
				{activeTab === 'workflows' ? (
					<WorkflowManager token={token} setToken={setToken} />
				) : (
					<OrganizationManager token={token} />
				)}
			</main>
		</div>
	);
}

export default App;
