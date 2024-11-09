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
    care: ''
  });
  const [gallery, setGallery] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAdmin(user?.uid === "1ph4IGD1DTY4rXUct7kBrnYAWdD3");
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

  const handleGalleryChange = (e) => {
    setGallery(Array.from(e.target.files));
  };

  const handleThumbnailChange = (e) => {
    setThumbnail(e.target.files[0]);
  };

  // Update the getGoogleDriveDirectLink function
  const getGoogleDriveDirectLink = (shareLink) => {
    // Extract file ID from sharing link - matches both folder and direct file links
    const fileId = shareLink.match(/[-\w]{25,}/);
    if (fileId) {
      return `https://drive.google.com/uc?export=view&id=${fileId[0]}`;
    }
    return shareLink;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Check if user is authenticated and is admin
      if (!auth.currentUser || auth.currentUser.uid !== "1ph4IGD1DTY4rXUct7kBrnYAWdD3") {
        throw new Error("Unauthorized access");
      }

      const db = getFirestore();

      // Modified instructions to use the provided Google Drive folder
      const uploadInstructions = `
Please use images from the following Google Drive folder:
https://drive.google.com/drive/folders/19AcXDgPJqqB_UU6ccRroNeMA5Vujo8FP?usp=sharing

Instructions:
1. Open the Google Drive folder
2. Right-click on the desired image
3. Select "Get link" and ensure "Anyone with the link" is selected
4. Click "Copy link"
5. Paste the link here when prompted`;

      alert(uploadInstructions);

      // Continue with existing image handling code...
      const thumbnailLink = prompt('Paste Google Drive sharing link for thumbnail:', '');
      const galleryLinks = [];
      for (let i = 0; i < gallery.length; i++) {
        const link = prompt(`Paste Google Drive sharing link for gallery image ${i + 1}:`, '');
        if (link) galleryLinks.push(link);
      }

      // Convert sharing links to direct links
      const directThumbnailLink = getGoogleDriveDirectLink(thumbnailLink);
      const directGalleryLinks = galleryLinks.map(getGoogleDriveDirectLink);

      // Create product document with direct links
      const productToAdd = {
        ...productData,
        thumbnailUrl: directThumbnailLink,
        galleryUrls: directGalleryLinks
      };

      // Add to Firestore with explicit admin UID
      await addDoc(collection(db, 'products'), {
        ...productToAdd,
        createdBy: auth.currentUser.uid,
        createdAt: new Date().toISOString()
      });

      // Clear form
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
        care: ''
      });
      setGallery([]);
      setThumbnail(null);

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
          <label>Thumbnail:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleThumbnailChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Gallery Images:</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleGalleryChange}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Adding Product...' : 'Add Product'}
        </button>
      </form>
    </div>
  );
}

export default AdminProducts;
