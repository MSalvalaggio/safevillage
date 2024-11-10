import React, { useState, useEffect } from 'react';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { auth } from '../firebase';
import '../styles/AdminProducts.css';

function AdminProducts() {
  const [loading, setLoading] = useState(false);
  const [productData, setProductData] = useState({
    name: '',
    price: '',
    description: '',
    details: '',
    specifications: {
      dimensions: '',
      material: '',
      finish: '',
      weight: '',
      seating: '',
      construction: '',
      warranty: ''
    },
    care: '',
    thumbnailUrl: '',
    galleryUrls: ['']
  });
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAdmin(user?.uid === process.env.REACT_APP_ADMIN_UID);
    });

    return () => unsubscribe();
  }, []);

  if (!isAdmin) {
    return <div>Access Denied</div>;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('specifications.')) {
      const specName = name.split('.')[1];
      setProductData(prev => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [specName]: value
        }
      }));
    } else {
      setProductData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const addGalleryUrlInput = () => {
    setProductData(prev => ({
      ...prev,
      galleryUrls: [...prev.galleryUrls, '']
    }));
  };

  const updateGalleryUrl = (index, url) => {
    const newGalleryUrls = [...productData.galleryUrls];
    newGalleryUrls[index] = url;
    setProductData(prev => ({
      ...prev,
      galleryUrls: newGalleryUrls
    }));
  };

  const removeGalleryUrl = (index) => {
    setProductData(prev => ({
      ...prev,
      galleryUrls: prev.galleryUrls.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!auth.currentUser || auth.currentUser.uid !== process.env.REACT_APP_ADMIN_UID) {
        throw new Error("Unauthorized access");
      }

      const db = getFirestore();

      await addDoc(collection(db, 'products'), {
        ...productData,
        createdBy: auth.currentUser.uid,
        createdAt: new Date().toISOString()
      });

      setProductData({
        name: '',
        price: '',
        description: '',
        details: '',
        specifications: {
          dimensions: '',
          material: '',
          finish: '',
          weight: '',
          seating: '',
          construction: '',
          warranty: ''
        },
        care: '',
        thumbnailUrl: '',
        galleryUrls: ['']
      });

      alert('Product added successfully!');
    } catch (error) {
      console.error('Error adding product:', error);
      alert(`Error adding product: ${error.message}`);
    }

    setLoading(false);
  };

  return (
    <div className="admin-products">
      <h1>Add New Product</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={productData.name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Price:</label>
          <input
            type="text"
            name="price"
            value={productData.price}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Description:</label>
          <textarea
            name="description"
            value={productData.description}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Details:</label>
          <textarea
            name="details"
            value={productData.details}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="specifications-section">
          <h2>Specifications</h2>
          {Object.keys(productData.specifications).map(spec => (
            <div key={spec} className="form-group">
              <label>{spec}:</label>
              <input
                type="text"
                name={`specifications.${spec}`}
                value={productData.specifications[spec]}
                onChange={handleInputChange}
              />
            </div>
          ))}
        </div>

        <div className="form-group">
          <label>Care Instructions:</label>
          <textarea
            name="care"
            value={productData.care}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Thumbnail URL (Google Drive):</label>
          <input
            type="text"
            value={productData.thumbnailUrl}
            onChange={(e) => setProductData(prev => ({
              ...prev,
              thumbnailUrl: e.target.value
            }))}
            placeholder="Paste Google Drive sharing link"
            required
          />
        </div>

        <div className="form-group">
          <label>Gallery URLs (Google Drive):</label>
          {productData.galleryUrls.map((url, index) => (
            <div key={index} className="gallery-url-input">
              <input
                type="text"
                value={url}
                onChange={(e) => updateGalleryUrl(index, e.target.value)}
                placeholder="Paste Google Drive sharing link"
                required
              />
              {index > 0 && (
                <button 
                  type="button" 
                  onClick={() => removeGalleryUrl(index)}
                  className="remove-url-btn"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button 
            type="button" 
            onClick={addGalleryUrlInput}
            className="add-url-btn"
          >
            Add Another Image URL
          </button>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Adding Product...' : 'Add Product'}
        </button>
      </form>
    </div>
  );
}

export default AdminProducts;
