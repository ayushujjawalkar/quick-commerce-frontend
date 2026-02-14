import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { shopService, productService } from '../../services/api';
import toast from 'react-hot-toast';
import { FiSave, FiX } from 'react-icons/fi';

const ProductForm = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    shopId: '',
    name: '',
    description: '',
    category: '',
    brand: '',
    price: '',
    comparePrice: '',
    stock: '',
    unit: 'piece',
    unitValue: '1'
  });

  const categories = ['grocery', 'dairy', 'beverages', 'snacks', 'vegetables', 'fruits', 'bakery', 'meat', 'electronics', 'fashion', 'home', 'beauty'];
  const units = ['kg', 'g', 'l', 'ml', 'piece', 'dozen', 'packet', 'box'];

  useEffect(() => {
    fetchShops();
    if (productId) fetchProduct();
  }, [productId]);

  const fetchShops = async () => {
    try {
      const { data } = await shopService.getMyShops();
      setShops(data.data || []);
      if (!productId && data.data.length > 0) {
        setFormData(prev => ({ ...prev, shopId: data.data[0]._id }));
      }
    } catch (error) {
      toast.error('Error loading shops');
    }
  };

  const fetchProduct = async () => {
    try {
      const { data } = await productService.getProductDetails(productId);
      const p = data.data;
      setFormData({
        shopId: p.shopId,
        name: p.name,
        description: p.description,
        category: p.category,
        brand: p.brand || '',
        price: p.price,
        comparePrice: p.comparePrice || '',
        stock: p.stock,
        unit: p.unit,
        unitValue: p.unitValue
      });
    } catch (error) {
      toast.error('Error loading product');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        comparePrice: formData.comparePrice ? parseFloat(formData.comparePrice) : undefined,
        stock: parseInt(formData.stock),
        unitValue: parseFloat(formData.unitValue)
      };

      if (productId) {
        await productService.updateProduct(productId, productData);
        toast.success('Product updated');
      } else {
        await productService.createProduct(productData);
        toast.success('Product created');
      }
      navigate('/manager/products');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error saving product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">{productId ? 'Edit Product' : 'Add New Product'}</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-8 space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Shop *</label>
          <select name="shopId" required value={formData.shopId} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg">
            <option value="">Select Shop</option>
            {shops.map(shop => <option key={shop._id} value={shop._id}>{shop.name}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Product Name *</label>
            <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Brand</label>
            <input type="text" name="brand" value={formData.brand} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description *</label>
          <textarea name="description" required value={formData.description} onChange={handleChange} rows="3" className="w-full px-4 py-2 border rounded-lg" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Category *</label>
          <select name="category" required value={formData.category} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg">
            <option value="">Select Category</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Price (₹) *</label>
            <input type="number" step="0.01" name="price" required value={formData.price} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Compare Price (₹)</label>
            <input type="number" step="0.01" name="comparePrice" value={formData.comparePrice} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Stock *</label>
            <input type="number" name="stock" required value={formData.stock} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Unit</label>
            <select name="unit" value={formData.unit} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg">
              {units.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Unit Value</label>
            <input type="number" step="0.01" name="unitValue" value={formData.unitValue} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" />
          </div>
        </div>

        <div className="flex space-x-4 pt-6">
          <button type="submit" disabled={loading} className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg hover:shadow-xl disabled:opacity-50">
            <FiSave className="inline mr-2" /> {loading ? 'Saving...' : productId ? 'Update' : 'Create'} Product
          </button>
          <button type="button" onClick={() => navigate('/manager/products')} className="bg-gray-200 px-6 py-3 rounded-lg hover:bg-gray-300">
            <FiX className="inline mr-2" /> Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;