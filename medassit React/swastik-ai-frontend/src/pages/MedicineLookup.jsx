import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TbSearch, TbCamera, TbX, TbMoodEmpty, TbPill } from 'react-icons/tb';
import { getMedicineInfo, clearMedicineInfo } from '../redux/medicine/Action';
import EmptyState from '../components/EmptyState';
import NotificationBell from '../components/NotificationBell';

function MedicineLookup() {
  const dispatch = useDispatch();
  const { medicineInfo, infoLoading } = useSelector((state) => state.medicine);
  const [searchTerm, setSearchTerm] = useState('');
  const [searched, setSearched] = useState(false);
  const fileInputRef = React.useRef(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    setSearched(true);
    await dispatch(getMedicineInfo(searchTerm.trim()));
  };

  const handleClear = () => {
    setSearchTerm('');
    setSearched(false);
    dispatch(clearMedicineInfo());
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch(e);
    }
  };

  return (
    <div className="container-custom pb-8">
      <div className="flex justify-between items-start py-4">
        <div>
          <h2 className="heading flex items-center gap-2" style={{ fontSize: 20 }}>
            <TbSearch size={20} style={{ color: 'var(--accent-dark)' }} />
            Medicine lookup
          </h2>
          <p className="text-secondary mt-1" style={{ fontSize: 14 }}>Search by name or scan the label</p>
        </div>
        <NotificationBell />
      </div>

      <form className="flex gap-2 mb-6" onSubmit={handleSearch}>
        <input
          type="text"
          className="input-field"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter medicine name…"
          disabled={infoLoading}
        />
        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" />
        <button
          type="button"
          className="icon-chip icon-chip--info"
          style={{ width: 44, height: 44, borderRadius: 10 }}
          onClick={() => fileInputRef.current?.click()}
          title="Upload a photo"
        >
          <TbCamera size={19} />
        </button>
        <button
          type="submit"
          className="btn-primary"
          style={{ flexShrink: 0 }}
          disabled={infoLoading || !searchTerm.trim()}
        >
          <TbSearch size={16} />
          {infoLoading ? 'Searching…' : 'Search'}
        </button>
      </form>

      {infoLoading ? (
        <p className="text-secondary text-center" style={{ padding: '32px 0' }}>Searching for medicine information…</p>
      ) : medicineInfo ? (
        <div className="label-card">
          <div className="label-card__perf" />
          <div style={{ padding: 16 }}>
            <div className="flex justify-between items-start mb-3">
              <h3 className="heading" style={{ fontSize: 16 }}>Medicine information</h3>
              <button className="icon-chip" style={{ width: 30, height: 30, borderRadius: 8 }} onClick={handleClear}>
                <TbX size={15} />
              </button>
            </div>
            <div style={{ fontSize: 15, lineHeight: 1.7, whiteSpace: 'pre-wrap', color: 'var(--text-primary)' }}>
              {medicineInfo.reply || medicineInfo}
            </div>
          </div>
        </div>
      ) : searched ? (
        <EmptyState icon={TbMoodEmpty} tint="danger" title="No results found" description="Try searching with a different medicine name." />
      ) : (
        <EmptyState
          icon={TbPill}
          tint="accent"
          title="Search for any medicine"
          description="Get information about purpose, dosage, and precautions."
        />
      )}
    </div>
  );
}

export default MedicineLookup;
