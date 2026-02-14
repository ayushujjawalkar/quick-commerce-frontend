import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { shopService, productService } from '../../services/api';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiToggleLeft, FiToggleRight } from 'react-icons/fi';

const Products = () => {
  const [shops, setShops] = useState([]);
  const [selectedShop, setSelectedShop] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShops();
  }, []);

  useEffect(() => {
    if (selectedShop) {
      fetchProducts();
    }
  }, [selectedShop]);

  const fetchShops = async () => {
    try {
      const { data } = await shopService.getMyShops();
      const shopsList = data.data || [];
      setShops(shopsList);
      if (shopsList.length > 0) {
        setSelectedShop(shopsList[0]._id);
      }
    } catch (error) {
      toast.error('Error loading shops');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await productService.getAllProducts({ shopId: selectedShop });
      setProducts(data.data || []);
    } catch (error) {
      toast.error('Error loading products');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAvailability = async (productId) => {
    try {
      await productService.toggleAvailability(productId);
      toast.success('Product availability updated');
      fetchProducts();
    } catch (error) {
      toast.error('Error updating product');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await productService.deleteProduct(productId);
      toast.success('Product deleted');
      fetchProducts();
    } catch (error) {
      toast.error('Error deleting product');
    }
  };

  if (loading && shops.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Products</h1>
        <Link
          to="/manager/products/new"
          className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-xl transition"
        >
          <FiPlus /> <span>Add Product</span>
        </Link>
      </div>

      {shops.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <p className="text-xl text-gray-600 mb-4">Create a shop first to add products</p>
          <Link
            to="/manager/shops/new"
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg inline-block"
          >
            Create Shop
          </Link>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-md p-4">
            <label className="block text-sm font-medium mb-2">Select Shop</label>
            <select
              value={selectedShop}
              onChange={(e) => setSelectedShop(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            >
              {shops.map((shop) => (
                <option key={shop._id} value={shop._id}>
                  {shop.name}
                </option>
              ))}
            </select>
          </div>

          {products.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-2xl font-bold mb-2">No products yet</h3>
              <p className="text-gray-600 mb-6">Add your first product to start selling</p>
              <Link
                to="/manager/products/new"
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg inline-block"
              >
                Add Product
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition"
                >
                  <div className="h-40 bg-gray-200 flex items-center justify-center text-5xl">
                    {product.images?.[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      '📦'
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="font-bold mb-2 line-clamp-2">{product.name}</h3>
                    <p className="text-2xl font-bold text-indigo-600 mb-2">
                      ₹{product.price}
                    </p>

                    <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                      <span>Stock: {product.stock}</span>
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          product.isAvailable
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {product.isAvailable ? 'Available' : 'Unavailable'}
                      </span>
                    </div>

                    <div className="flex space-x-2">
                      <Link
                        to={`/manager/products/edit/${product._id}`}
                        className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 text-center"
                      >
                        <FiEdit2 className="inline" /> Edit
                      </Link>

                      <button
                        onClick={() => handleToggleAvailability(product._id)}
                        className="bg-blue-50 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-100"
                      >
                        {product.isAvailable ? (
                          <FiToggleRight size={20} />
                        ) : (
                          <FiToggleLeft size={20} />
                        )}
                      </button>

                      <button
                        onClick={() => handleDeleteProduct(product._id)}
                        className="bg-red-50 text-red-600 px-3 py-2 rounded-lg hover:bg-red-100"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Products;
