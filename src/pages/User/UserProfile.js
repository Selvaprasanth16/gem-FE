import React, { useEffect, useState } from 'react';
import userService from '../../services/user/userService';
import MessageModal from '../../components/Modal/MessageModal';
import './UserPages.css';

const UserProfile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changing, setChanging] = useState(false);
  const [profile, setProfile] = useState({ full_name: '', email: '', phone: '' });
  const [passwords, setPasswords] = useState({ old: '', next: '' });
  const [messageModal, setMessageModal] = useState({ open: false, type: 'info', title: '', message: '' });

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await userService.getProfile();
        const u = res.user || res.data?.user || res;
        setProfile({
          full_name: u?.full_name || '',
          email: u?.email || '',
          phone: u?.phone || ''
        });
      } catch (e) {
        setMessageModal({ open: true, type: 'error', title: 'Load Failed', message: e.message || 'Failed to load profile' });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const save = async (e) => {
    e.preventDefault();
    setMessageModal({ open: false, type: 'info', title: '', message: '' });
    try {
      setSaving(true);
      await userService.updateProfile(profile);
      setMessageModal({ open: true, type: 'success', title: 'Saved', message: 'Profile updated successfully.' });
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const u = JSON.parse(userStr);
        localStorage.setItem('user', JSON.stringify({ ...u, full_name: profile.full_name, email: profile.email, phone: profile.phone }));
      }
    } catch (e) {
      setMessageModal({ open: true, type: 'error', title: 'Update Failed', message: e.message || 'Update failed' });
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    setMessageModal({ open: false, type: 'info', title: '', message: '' });
    try {
      setChanging(true);
      await userService.changePassword(undefined, passwords.old, passwords.next);
      setMessageModal({ open: true, type: 'success', title: 'Password Updated', message: 'Your password has been changed.' });
      setPasswords({ old: '', next: '' });
    } catch (e) {
      setMessageModal({ open: true, type: 'error', title: 'Change Password Failed', message: e.message || 'Change password failed' });
    } finally {
      setChanging(false);
    }
  };

  if (loading) return <div className="loading-container"><div className="spinner"/><p>Loading profile...</p></div>;

  return (
    <div className="admin-page" style={{maxWidth: 900, margin: '0 auto'}}>
      <div className="page-header"><h1>My Profile</h1></div>

      <div className="filters-section" style={{display:'block'}}>
        <form onSubmit={save}>
          <div className="form-group">
            <label>Full Name</label>
            <input value={profile.full_name} onChange={(e)=>setProfile({...profile, full_name:e.target.value})} required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={profile.email} onChange={(e)=>setProfile({...profile, email:e.target.value})} required />
          </div>
          <div className="form-group">
            <label>Mobile</label>
            <input type="tel" value={profile.phone} onChange={(e)=>setProfile({...profile, phone:e.target.value})} />
          </div>
          <div className="modal-actions">
            <button type="submit" className="btn-primary" disabled={saving}>{saving?'Saving...':'Save Profile'}</button>
          </div>
        </form>
      </div>

      <div className="filters-section" style={{display:'block', marginTop:16}}>
        <h3 style={{marginTop:0}}>Change Password</h3>
        <form onSubmit={changePassword}>
          <div className="form-group">
            <label>Old Password</label>
            <input type="password" value={passwords.old} onChange={(e)=>setPasswords({...passwords, old:e.target.value})} required />
          </div>
          <div className="form-group">
            <label>New Password</label>
            <input type="password" value={passwords.next} onChange={(e)=>setPasswords({...passwords, next:e.target.value})} required />
          </div>
          <div className="modal-actions">
            <button type="submit" className="btn-secondary" disabled={changing}>{changing?'Updating...':'Update Password'}</button>
          </div>
        </form>
      </div>

      <MessageModal
        isOpen={messageModal.open}
        onClose={() => setMessageModal({ ...messageModal, open: false })}
        type={messageModal.type}
        title={messageModal.title}
        message={messageModal.message}
      />
    </div>
  );
};

export default UserProfile;
