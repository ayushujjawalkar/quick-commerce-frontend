// import React from "react";
// const ProductDetails = () => (
//   <div className="p-8">
//     <h1 className="text-2xl font-bold">Product Details</h1>
//   </div>
// );
// export default ProductDetails;


import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService } from '../../services/api';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { FiArrowLeft, FiStar } from 'react-icons/fi';

const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const { data } = await productService.getProductDetails(productId);
      setProduct(data.data);
      if (data.data.hasVariants && data.data.variants.length > 0) {
        setSelectedVariant(data.data.variants[0]._id);
      }
    } catch (error) {
      toast.error('Error loading product');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Please login first');
      navigate('/login');
      return;
    }
    try {
      await addToCart(productId, quantity, selectedVariant);
      navigate('/cart');
    } catch (error) {
      console.error(error);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600"></div>
      </div>
    );

  if (!product)
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl">Product not found</h2>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600 mb-6"
        >
          <FiArrowLeft /> <span>Back</span>
        </button>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            <div>
              <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center text-9xl">
                {product.images?.[0] ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  '📦'
                )}
              </div>
            </div>

            <div>
              <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

              <div className="flex items-center space-x-2 mb-4">
                <FiStar className="text-yellow-400 fill-current" />
                <span className="font-semibold">
                  {product.rating?.average?.toFixed(1) || 'New'}
                </span>
                <span className="text-gray-500">
                  ({product.rating?.count || 0} reviews)
                </span>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-bold text-indigo-600">
                  ₹{product.price}
                </span>
                {product.comparePrice && (
                  <span className="text-xl text-gray-500 line-through ml-3">
                    ₹{product.comparePrice}
                  </span>
                )}
              </div>

              <p className="text-gray-700 mb-6">{product.description}</p>

              {product.hasVariants && product.variants.length > 0 && (
                <div className="mb-6">
                  <label className="block font-semibold mb-2">
                    Select Variant:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((variant) => (
                      <button
                        key={variant._id}
                        onClick={() => setSelectedVariant(variant._id)}
                        className={`px-4 py-2 border-2 rounded-lg ${
                          selectedVariant === variant._id
                            ? 'border-indigo-600 bg-indigo-50'
                            : 'border-gray-300'
                        }`}
                      >
                        {variant.name}: {variant.value} - ₹{variant.price}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-6">
                <label className="block font-semibold mb-2">Quantity:</label>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 border rounded-lg"
                  >
                    -
                  </button>
                  <span className="text-xl font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 border rounded-lg"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="w-full bg-indigo-600 text-white py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-300"
              >
                {product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
