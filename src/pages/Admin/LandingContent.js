import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/auth/authService';
import siteContentService from '../../services/content/siteContentService';
import adminService from '../../services/admin/adminService';
import imageUploadService from '../../services/admin/imageUploadService';
import Landing from '../../components/landing';
import './AdminPages.css';
import { Upload, Save, RefreshCw } from 'lucide-react';

const LandingContent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState({
    stats: { premium_properties: 50, happy_clients: 500, years_experience: 10, client_satisfaction: 98 },
    features: [ { text: '' }, { text: '' }, { text: '' }, { text: '' } ],
    testimonials: [ { initials: '', name: '', title: '', text: '', stars: 5, avatar_url: '' }, { initials: '', name: '', title: '', text: '', stars: 5, avatar_url: '' }, { initials: '', name: '', title: '', text: '', stars: 5, avatar_url: '' } ],
    instagram: { description: '', handle: '', url: '', followers: '', posts: '', properties: '' },
    images: { why_image: '' },
    urgent_sales: []
  });
  const [uploading, setUploading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState([false, false, false]);
  const [uploadingUrgent, setUploadingUrgent] = useState([false, false, false, false, false]);
  const [availableLands, setAvailableLands] = useState([]);

  useEffect(() => {
    if (!authService.isAdmin()) {
      navigate('/');
      return;
    }
    (async () => {
      try {
        const res = await siteContentService.getAdminLanding();
        setContent({
          stats: res.data?.stats || content.stats,
          features: res.data?.features?.length ? res.data.features : content.features,
          testimonials: res.data?.testimonials?.length ? res.data.testimonials : content.testimonials,
          instagram: res.data?.instagram || content.instagram,
          images: res.data?.images || content.images,
          urgent_sales: Array.isArray(res.data?.urgent_sales) ? res.data.urgent_sales.slice(0,5) : []
        });
        // Load lands for urgent selection (all statuses)
        const landsResp = await adminService.getAllLands();
        const lands = landsResp.data?.lands || [];
        setAvailableLands(lands.map(l => ({
          id: l.id,
          title: l.title,
          location: l.location,
          size: l.size,
          size_unit: l.size_unit || 'sqft',
          price: l.price,
          status: l.status,
          images_urls: l.images_urls || []
        })));
      } catch (e) {
        // Use defaults
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChangeStat = (key, value) => {
    setContent(c => ({ ...c, stats: { ...c.stats, [key]: value } }));
  };

  const prefillFromLand = (idx, landId) => {
    const land = availableLands.find(l => l.id === landId);
    if (!land) return;
    setContent(c => {
      const arr = [...(c.urgent_sales || [])];
      const curr = { ...(arr[idx] || {}) };
      curr.land_id = land.id;
      curr.title = curr.title || land.title;
      curr.location = curr.location || land.location;
      curr.size_text = curr.size_text || (land.size ? `${land.size} ${land.size_unit || 'sqft'}` : '');
      curr.price = curr.price ?? land.price;
      curr.status = curr.status || land.status || 'available';
      if (!curr.image_url) curr.image_url = (land.images_urls && land.images_urls[0]) || '';
      arr[idx] = curr;
      return { ...c, urgent_sales: arr };
    });
  };

  const handleFeatureChange = (idx, value) => {
    setContent(c => {
      const next = [...(c.features || [])];
      while (next.length < 4) next.push({ text: '' });
      next[idx] = { ...(next[idx] || {}), text: value };
      return { ...c, features: next };
    });
  };

  const handleTestimonialChange = (idx, field, value) => {
    setContent(c => {
      const next = [...(c.testimonials || [])];
      while (next.length < 3) next.push({ initials: '', name: '', title: '', text: '', stars: 5, avatar_url: '' });
      next[idx] = { ...(next[idx] || {}), [field]: value };
      return { ...c, testimonials: next };
    });
  };

  const handleInstagramChange = (field, value) => {
    setContent(c => ({ ...c, instagram: { ...(c.instagram || {}), [field]: value } }));
  };

  const uploadWhyImage = async (file) => {
    try {
      setUploading(true);
      const resp = await imageUploadService.uploadLandImages([file]);
      const url = (resp.image_urls && resp.image_urls[0]) || '';
      if (url) setContent(c => ({ ...c, images: { ...(c.images || {}), why_image: url } }));
    } finally {
      setUploading(false);
    }
  };

  const uploadTestimonialAvatar = async (idx, file) => {
    if (!file) return;
    try {
      setUploadingAvatar(prev => prev.map((v,i)=> i===idx ? true : v));
      const resp = await imageUploadService.uploadLandImages([file]);
      const url = (resp.image_urls && resp.image_urls[0]) || '';
      if (url) {
        setContent(c => {
          const next = [...(c.testimonials || [])];
          next[idx] = { ...(next[idx] || {}), avatar_url: url };
          return { ...c, testimonials: next };
        });
      }
    } finally {
      setUploadingAvatar(prev => prev.map((v,i)=> i===idx ? false : v));
    }
  };

  const save = async () => {
    try {
      setSaving(true);
      const payload = {
        stats: content.stats,
        features: content.features,
        testimonials: content.testimonials,
        instagram: content.instagram,
        images: content.images,
        urgent_sales: (content.urgent_sales || []).slice(0,5)
      };
      const res = await siteContentService.updateLanding(payload);
      // Re-fetch to ensure UI reflects persisted server state
      const latest = await siteContentService.getAdminLanding();
      setContent(latest.data || res.data || content);
      alert('Landing content updated successfully');
    } catch (e) {
      const msg = (e && e.message) ? e.message : 'Failed to save landing content';
      alert(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleUrgentChange = (idx, field, value) => {
    setContent(c => {
      const next = [...(c.urgent_sales || [])];
      while (next.length < idx+1) next.push({});
      next[idx] = { ...(next[idx] || {}), [field]: value };
      return { ...c, urgent_sales: next.slice(0,5) };
    });
  };

  const addUrgent = () => {
    setContent(c => {
      const arr = [...(c.urgent_sales || [])];
      if (arr.length < 5) arr.push({ status: 'available' });
      return { ...c, urgent_sales: arr };
    });
  };

  const removeUrgent = (idx) => {
    setContent(c => {
      const arr = [...(c.urgent_sales || [])];
      arr.splice(idx,1);
      return { ...c, urgent_sales: arr };
    });
  };

  const uploadUrgentImage = async (idx, file) => {
    if (!file) return;
    try {
      setUploadingUrgent(prev => prev.map((v,i)=> i===idx ? true : v));
      const resp = await imageUploadService.uploadLandImages([file]);
      const url = (resp.image_urls && resp.image_urls[0]) || '';
      if (url) handleUrgentChange(idx, 'image_url', url);
    } finally {
      setUploadingUrgent(prev => prev.map((v,i)=> i===idx ? false : v));
    }
  };

  if (loading) return <div className="admin-page"><div className="loading">Loading...</div></div>;

  return (
    <div className="admin-page">
      <div className="landing-header">
        <h2>Landing Content</h2>
        <div className="landing-actions">
          <button className="landing-btn" onClick={save} disabled={saving}>
            <Save size={16}/> Save
          </button>
          <button className="landing-btn secondary" onClick={() => window.location.reload()}>
            <RefreshCw size={16}/> Refresh
          </button>
        </div>
      </div>

      <div className="landing-grid two-cols">
        <div className="landing-card">
          <h3>Stats</h3>
          <div className="landing-form-grid two-cols">
            <label>Premium Properties
              <input type="number" value={content.stats.premium_properties} onChange={e=>handleChangeStat('premium_properties', Number(e.target.value))}/>
            </label>
            <label>Happy Clients
              <input type="number" value={content.stats.happy_clients} onChange={e=>handleChangeStat('happy_clients', Number(e.target.value))}/>
            </label>
            <label>Years Experience
              <input type="number" value={content.stats.years_experience} onChange={e=>handleChangeStat('years_experience', Number(e.target.value))}/>
            </label>
            <label>Client Satisfaction (%)
              <input type="number" value={content.stats.client_satisfaction} onChange={e=>handleChangeStat('client_satisfaction', Number(e.target.value))}/>
            </label>
          </div>
        </div>

        <div className="landing-card">
          <h3>Features (texts only)</h3>
          {[0,1,2,3].map(i => (
            <label key={i}>Feature {i+1}
              <textarea rows={2} value={(content.features?.[i]?.text) || ''} onChange={e=>handleFeatureChange(i, e.target.value)} />
            </label>
          ))}
        </div>

        <div className="landing-card">
          <h3>Testimonials</h3>
          <div className="landing-form-grid landing-testimonial-grid">
            {[0,1,2].map(i => (
              <div className="landing-testimonial-item" key={i}>
                <div className="landing-avatar-col">
                  <div className="landing-avatar-preview">
                    {content.testimonials?.[i]?.avatar_url ? (
                      <img src={content.testimonials[i].avatar_url} alt="avatar" />
                    ) : (
                      <div className="landing-avatar-fallback">{(content.testimonials?.[i]?.initials || 'NA').substring(0,2)}</div>
                    )}
                  </div>
                  <label className="landing-btn small">
                    <Upload size={14}/> {uploadingAvatar[i] ? 'Uploading...' : 'Upload'}
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e)=> e.target.files && uploadTestimonialAvatar(i, e.target.files[0])}/>
                  </label>
                </div>
                <div className="landing-fields-col">
                  <div className="landing-row">
                    <label>Name
                      <input value={content.testimonials?.[i]?.name || ''} onChange={e=>handleTestimonialChange(i,'name', e.target.value)} />
                    </label>
                    <label>Initials
                      <input value={content.testimonials?.[i]?.initials || ''} onChange={e=>handleTestimonialChange(i,'initials', e.target.value)} />
                    </label>
                    <label>Stars
                      <input type="number" min={1} max={5} value={content.testimonials?.[i]?.stars || 5} onChange={e=>handleTestimonialChange(i,'stars', Number(e.target.value))} />
                    </label>
                  </div>
                  <label>Title
                    <input value={content.testimonials?.[i]?.title || ''} onChange={e=>handleTestimonialChange(i,'title', e.target.value)} />
                  </label>
                  <label>Text
                    <textarea rows={3} value={content.testimonials?.[i]?.text || ''} onChange={e=>handleTestimonialChange(i,'text', e.target.value)} />
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="landing-card">
          <div className="landing-card-header">
            <h3>Urgent Sale (max 5)</h3>
            { (content.urgent_sales?.length || 0) < 5 && (
              <button className="landing-btn small" onClick={addUrgent}>+ Add</button>
            )}
          </div>
          <div className="landing-urgent-grid">
            {(content.urgent_sales || []).map((u, idx) => (
              <div className="landing-urgent-item" key={idx}>
                <div className="landing-urgent-image">
                  {u?.image_url ? (
                    <img src={u.image_url} alt="urgent" />
                  ) : (
                    <div className="landing-avatar-fallback">IMG</div>
                  )}
                  <label className="landing-btn small">
                    <Upload size={14}/> {uploadingUrgent[idx] ? 'Uploading...' : 'Upload Image'}
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e)=> e.target.files && uploadUrgentImage(idx, e.target.files[0])}/>
                  </label>
                </div>
                <div className="landing-fields-col">
                  <div className="landing-row">
                    <label>Choose Land (auto-fill)
                      <select value={u.land_id || ''} onChange={(e)=>{ const v=e.target.value; handleUrgentChange(idx,'land_id', v); prefillFromLand(idx, v); }}>
                        <option value="">-- Select --</option>
                        {availableLands.map(l => (
                          <option key={l.id} value={l.id}>{`${l.title} — ${l.location}`}</option>
                        ))}
                      </select>
                    </label>
                    <label>Status
                      <input value={u.status || ''} onChange={e=>handleUrgentChange(idx,'status', e.target.value)} placeholder="available/sold"/>
                    </label>
                    <div>
                      <button className="landing-btn small secondary" type="button" onClick={()=>removeUrgent(idx)}>Remove</button>
                    </div>
                  </div>
                  <label>Title
                    <input value={u.title || ''} onChange={e=>handleUrgentChange(idx,'title', e.target.value)} placeholder="Override title"/>
                  </label>
                  <div className="landing-row">
                    <label>Location
                      <input value={u.location || ''} onChange={e=>handleUrgentChange(idx,'location', e.target.value)} />
                    </label>
                    <label>Size Text
                      <input value={u.size_text || ''} onChange={e=>handleUrgentChange(idx,'size_text', e.target.value)} placeholder="e.g., 5.2 acres"/>
                    </label>
                    <label>Price
                      <input type="number" value={u.price ?? ''} onChange={e=>handleUrgentChange(idx,'price', e.target.value)} />
                    </label>
                  </div>
                  <label>Description
                    <textarea rows={2} value={u.description || ''} onChange={e=>handleUrgentChange(idx,'description', e.target.value)} />
                  </label>
                </div>
              </div>
            ))}
            {(!content.urgent_sales || content.urgent_sales.length === 0) && (
              <p>No urgent sales added yet.</p>
            )}
          </div>
        </div>

        <div className="landing-card">
          <h3>Instagram Section</h3>
          <label>Description
            <textarea rows={3} value={content.instagram?.description || ''} onChange={e=>handleInstagramChange('description', e.target.value)} />
          </label>
          <div className="landing-row">
            <label>Handle
              <input value={content.instagram?.handle || ''} onChange={e=>handleInstagramChange('handle', e.target.value)} />
            </label>
            <label>URL
              <input value={content.instagram?.url || ''} onChange={e=>handleInstagramChange('url', e.target.value)} />
            </label>
          </div>
          <div className="landing-row">
            <label>Followers
              <input value={content.instagram?.followers || ''} onChange={e=>handleInstagramChange('followers', e.target.value)} />
            </label>
            <label>Posts
              <input value={content.instagram?.posts || ''} onChange={e=>handleInstagramChange('posts', e.target.value)} />
            </label>
            <label>Properties
              <input value={content.instagram?.properties || ''} onChange={e=>handleInstagramChange('properties', e.target.value)} />
            </label>
          </div>
        </div>

        <div className="landing-card">
          <h3>Images</h3>
          <label>Why Choose Image</label>
          <div className="landing-row align-center">
            <input type="text" value={content.images?.why_image || ''} onChange={e=>setContent(c=>({ ...c, images: { ...(c.images||{}), why_image: e.target.value } }))} placeholder="Image URL" />
            <label className="landing-btn inline">
              <Upload size={16}/> Upload
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e=>e.target.files && e.target.files[0] && uploadWhyImage(e.target.files[0])} />
            </label>
          </div>
          {uploading && <p>Uploading...</p>}
        </div>
      </div>

      <div className="landing-card">
        <h3>Live Preview</h3>
        <div className="landing-preview">
          <Landing contentOverride={content} />
        </div>
      </div>
    </div>
  );
};

export default LandingContent;
