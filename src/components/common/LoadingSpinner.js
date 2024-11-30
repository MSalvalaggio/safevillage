// components/common/LoadingSpinner.js
const LoadingSpinner = () => (
  <div className="loading-spinner">
    <div className="spinner"></div>
  </div>
);

// Update App.js
if (loading) return <LoadingSpinner />;