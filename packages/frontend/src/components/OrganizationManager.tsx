import { useCallback, useEffect, useState } from 'react';
import '../styles/organization.css';

interface Organization {
  id: string;
  name: string;
  apiKey: string;
  users: User[];
}

interface User {
  id: string;
  email: string;
  role: 'ADMIN' | 'USER';
}

const OrganizationManager = ({ token }: { token: string }) => {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [newUser, setNewUser] = useState({ email: '', role: 'USER' });
  const [error, setError] = useState('');

  const fetchOrganization = useCallback(async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/organizations/current`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            ContentType: 'application/json',
          },
        },
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setOrganization(data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch organization');
    }
  }, [token]);

  useEffect(() => {
    fetchOrganization();
  }, [fetchOrganization]);

  const inviteUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/organizations/${
          organization?.id
        }/users/invite`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newUser),
        },
      );
      const data = await response.json();
      setOrganization((prev) =>
        prev
          ? {
              ...prev,
              users: [...prev.users, data],
            }
          : null,
      );
      setNewUser({ email: '', role: 'USER' });
    } catch (err) {
      console.error(err);
      setError('Failed to invite user');
    }
  };

  const removeUser = async (userId: string) => {
    if (!confirm('Are you sure you want to remove this user?')) return;

    try {
      await fetch(
        `${import.meta.env.VITE_API_URL}/api/organizations/${
          organization?.id
        }/users/${userId}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setOrganization((prev) =>
        prev
          ? {
              ...prev,
              users: prev.users.filter((u) => u.id !== userId),
            }
          : null,
      );
    } catch (err) {
      console.error(err);
      setError('Failed to remove user');
    }
  };

  const regenerateApiKey = async () => {
    if (!confirm('Are you sure? This will invalidate the current API key.'))
      return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/organizations/${
          organization?.id
        }/regenerate-api-key`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await response.json();
      setOrganization((prev) =>
        prev ? { ...prev, apiKey: data.apiKey } : null,
      );
    } catch (err) {
      console.error(err);
      setError('Failed to regenerate API key');
    }
  };

  if (!organization) return <div>Loading...</div>;

  return (
    <div className="organization-container">
      <h2>Organization Settings</h2>
      {error && <div className="error">{error}</div>}

      <div className="org-info">
        <h3>{organization.name}</h3>
        <div className="api-key-section">
          <p>
            API Key: <code>{organization.apiKey}</code>
          </p>
          <button type="button" onClick={regenerateApiKey} className="warning">
            Regenerate API Key
          </button>
        </div>
      </div>

      <div className="users-section">
        <h3>Users</h3>
        <form onSubmit={inviteUser} className="invite-form">
          <input
            type="email"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          />
          <select
            value={newUser.role}
            onChange={(e) =>
              setNewUser({
                ...newUser,
                role: e.target.value as 'ADMIN' | 'USER',
              })
            }
          >
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
          </select>
          <button type="submit">Invite User</button>
        </form>

        <div className="users-list">
          {organization.users.map((user) => (
            <div key={user.id} className="user-item">
              <div className="user-info">
                <span>{user.email}</span>
                <span className={`role ${user.role.toLowerCase()}`}>
                  {user.role}
                </span>
              </div>
              <button
                type="button"
                onClick={() => removeUser(user.id)}
                className="delete"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrganizationManager;
