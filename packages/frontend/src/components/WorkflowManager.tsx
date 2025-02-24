import { useCallback, useEffect, useState } from 'react';
import '../styles/workflows.css';

interface Workflow {
  id: string;
  name: string;
  active: boolean;
  description?: string;
}

interface WorkflowManagerProps {
  token: string;
  setToken: (token: string) => void;
}

const WorkflowManager = ({ token, setToken }: WorkflowManagerProps) => {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [newWorkflow, setNewWorkflow] = useState({ name: '', description: '' });

  const login = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'admin@example.com',
            password: 'admin123',
          }),
        },
      );
      const data = await response.json();
      setToken(data.token);
      localStorage.setItem('token', data.token);

      await fetchWorkflows(data.token);
    } catch (err) {
      console.error(err);
      setError('Failed to login');
    } finally {
      setLoading(false);
    }
  }, [setToken]);

  useEffect(() => {
    login();
  }, [login]);

  const fetchWorkflows = async (authToken: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/workflows`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        },
      );
      const data = await response.json();
      setWorkflows(data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch workflows');
    }
  };

  const createWorkflow = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/workflows`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newWorkflow),
        },
      );
      const data = await response.json();
      setWorkflows([...workflows, data]);
      setNewWorkflow({ name: '', description: '' });
    } catch (err) {
      console.error(err);
      setError('Failed to create workflow');
    }
  };

  const toggleWorkflow = async (workflowId: string, currentStatus: boolean) => {
    try {
      const action = currentStatus ? 'deactivate' : 'activate';
      await fetch(
        `${import.meta.env.VITE_API_URL}/api/workflows/${workflowId}/${action}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );
      // Update local state
      setWorkflows(
        workflows.map((w) =>
          w.id === workflowId ? { ...w, active: !currentStatus } : w,
        ),
      );
    } catch (err) {
      console.error(err);
      setError(
        `Failed to ${currentStatus ? 'deactivate' : 'activate'} workflow`,
      );
    }
  };

  const deleteWorkflow = async (workflowId: string) => {
    if (!confirm('Are you sure you want to delete this workflow?')) return;

    try {
      await fetch(
        `${import.meta.env.VITE_API_URL}/api/workflows/${workflowId}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setWorkflows(workflows.filter((w) => w.id !== workflowId));
    } catch (err) {
      console.error(err);
      setError('Failed to delete workflow');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container">
      <h1>Workflow Manager</h1>
      {error && <div className="error">{error}</div>}

      {/* Create New Workflow Form */}
      <div className="create-workflow">
        <h2>Create New Workflow</h2>
        <form onSubmit={createWorkflow}>
          <input
            type="text"
            placeholder="Workflow Name"
            value={newWorkflow.name}
            onChange={(e) =>
              setNewWorkflow({ ...newWorkflow, name: e.target.value })
            }
          />
          <textarea
            placeholder="Description"
            value={newWorkflow.description}
            onChange={(e) =>
              setNewWorkflow({ ...newWorkflow, description: e.target.value })
            }
          />
          <button type="submit">Create Workflow</button>
        </form>
      </div>

      {/* Workflows List */}
      <div className="workflows-section">
        <h2>Your Workflows</h2>
        <div className="workflows-list">
          {workflows.map((workflow) => (
            <div key={workflow.id} className="workflow-item">
              <div className="workflow-info">
                <h3>{workflow.name}</h3>
                <p>{workflow.description}</p>
              </div>
              <div className="workflow-status">
                <span
                  className={`status ${
                    workflow.active ? 'active' : 'inactive'
                  }`}
                >
                  {workflow.active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="workflow-actions">
                <button
                  type="button"
                  onClick={() => toggleWorkflow(workflow.id, workflow.active)}
                  className={workflow.active ? 'deactivate' : 'activate'}
                >
                  {workflow.active ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  type="button"
                  onClick={() => deleteWorkflow(workflow.id)}
                  className="delete"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkflowManager;
