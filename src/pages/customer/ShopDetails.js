
// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { shopService, productService } from '../../services/api';
// import { useCart } from '../../context/CartContext';
// import { useAuth } from '../../context/AuthContext';
// import toast from 'react-hot-toast';
// import { FiStar, FiMapPin, FiClock, FiArrowLeft, FiShoppingCart } from 'react-icons/fi';

// const ShopDetails = () => {
//   const { shopId } = useParams();
//   const navigate = useNavigate();
//   const { addToCart } = useCart();
//   const { user } = useAuth();
//   const [shop, setShop] = useState(null);
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedCategory, setSelectedCategory] = useState('All');

//   useEffect(() => {
//     fetchShopAndProducts();
//   }, [shopId]);

//   const fetchShopAndProducts = async () => {
//     try {
//       setLoading(true);
//       const [shopRes, productsRes] = await Promise.all([
//         shopService.getShopDetails(shopId),
//         productService.getAllProducts({ shopId, isAvailable: true })
//       ]);
//       setShop(shopRes.data.data);
//       setProducts(productsRes.data.data);
//     } catch (error) {
//       toast.error('Error loading shop details');
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAddToCart = async (productId) => {
//     if (!user) {
//       toast.error('Please login to add items to cart');
//       navigate('/login');
//       return;
//     }

//     try {
//       await addToCart(productId, 1);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const categories = ['All', ...new Set(products.map(p => p.category))];

//   const filteredProducts = selectedCategory === 'All' 
//     ? products 
//     : products.filter(p => p.category === selectedCategory);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600"></div>
//       </div>
//     );
//   }

//   if (!shop) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <h2 className="text-2xl font-bold mb-4">Shop not found</h2>
//           <button onClick={() => navigate('/')} className="bg-indigo-600 text-white px-6 py-3 rounded-lg">
//             Back to Home
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Shop Header */}
//       <div className="bg-white shadow-md">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//           <button
//             onClick={() => navigate('/')}
//             className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600 mb-4 transition"
//           >
//             <FiArrowLeft />
//             <span>Back to shops</span>
//           </button>

//           <div className="flex flex-col md:flex-row md:items-start md:space-x-6">
//             {/* Shop Image */}
//             <div className="w-32 h-32 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center text-6xl mb-4 md:mb-0">
//               🏪
//             </div>

//             {/* Shop Info */}
//             <div className="flex-1">
//               <div className="flex items-start justify-between">
//                 <div>
//                   <h1 className="text-3xl font-bold text-gray-900 mb-2">{shop.name}</h1>
//                   <p className="text-gray-600 mb-3">{shop.description}</p>
//                 </div>
//                 {shop.isVerified && (
//                   <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
//                     ✓ Verified
//                   </span>
//                 )}
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
//                 {/* Rating */}
//                 <div className="flex items-center space-x-2">
//                   <FiStar className="text-yellow-400 fill-current text-xl" />
//                   <div>
//                     <p className="font-semibold text-gray-900">
//                       {shop.rating?.average ? shop.rating.average.toFixed(1) : 'New'}
//                     </p>
//                     <p className="text-xs text-gray-500">
//                       {shop.rating?.count || 0} ratings
//                     </p>
//                   </div>
//                 </div>

//                 {/* Delivery Time */}
//                 <div className="flex items-center space-x-2">
//                   <FiClock className="text-indigo-600 text-xl" />
//                   <div>
//                     <p className="font-semibold text-gray-900">{shop.estimatedDeliveryTime} mins</p>
//                     <p className="text-xs text-gray-500">Delivery time</p>
//                   </div>
//                 </div>

//                 {/* Min Order */}
//                 <div className="flex items-center space-x-2">
//                   <FiShoppingCart className="text-purple-600 text-xl" />
//                   <div>
//                     <p className="font-semibold text-gray-900">₹{shop.minimumOrderAmount}</p>
//                     <p className="text-xs text-gray-500">Minimum order</p>
//                   </div>
//                 </div>
//               </div>

//               {/* Address */}
//               <div className="mt-4 flex items-start space-x-2 text-gray-600">
//                 <FiMapPin className="mt-1" />
//                 <p className="text-sm">
//                   {shop.address.addressLine1}, {shop.address.city}, {shop.address.state} - {shop.address.pincode}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Category Tabs */}
//       <div className="bg-white border-b sticky top-16 z-40">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex space-x-4 overflow-x-auto py-4">
//             {categories.map((category) => (
//               <button
//                 key={category}
//                 onClick={() => setSelectedCategory(category)}
//                 className={`px-4 py-2 rounded-lg whitespace-nowrap transition ${
//                   selectedCategory === category
//                     ? 'bg-indigo-600 text-white'
//                     : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                 }`}
//               >
//                 {category}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Products Grid */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <h2 className="text-2xl font-bold mb-6">
//           {selectedCategory === 'All' ? 'All Products' : selectedCategory} ({filteredProducts.length})
//         </h2>

//         {filteredProducts.length === 0 ? (
//           <div className="text-center py-12">
//             <p className="text-gray-600 text-lg">No products available in this category</p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
//             {filteredProducts.map((product) => (
//               <div
//                 key={product._id}
//                 className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
//               >
//                 {/* Product Image */}
//                 <div 
//                   className="h-40 bg-gray-200 flex items-center justify-center text-5xl cursor-pointer"
//                   onClick={() => navigate(`/product/${product._id}`)}
//                 >
//                   {product.images && product.images[0] ? (
//                     <img 
//                       src={product.images[0]} 
//                       alt={product.name}
//                       className="w-full h-full object-cover"
//                     />
//                   ) : (
//                     <span>📦</span>
//                   )}
//                 </div>

//                 {/* Product Details */}
//                 <div className="p-3">
//                   <h3 
//                     className="font-semibold text-sm mb-1 line-clamp-2 cursor-pointer hover:text-indigo-600"
//                     onClick={() => navigate(`/product/${product._id}`)}
//                   >
//                     {product.name}
//                   </h3>

//                   {/* Price */}
//                   <div className="mb-3">
//                     <span className="text-lg font-bold text-indigo-600">₹{product.price}</span>
//                     {product.comparePrice && product.comparePrice > product.price && (
//                       <span className="text-xs text-gray-500 line-through ml-2">
//                         ₹{product.comparePrice}
//                       </span>
//                     )}
//                   </div>

//                   {/* Stock Status */}
//                   {product.stock <= 0 ? (
//                     <button disabled className="w-full bg-gray-300 text-gray-600 py-2 rounded-lg text-sm">
//                       Out of Stock
//                     </button>
//                   ) : product.stock < 10 ? (
//                     <div>
//                       <p className="text-xs text-orange-600 mb-2">Only {product.stock} left</p>
//                       <button
//                         onClick={() => handleAddToCart(product._id)}
//                         className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition text-sm font-medium"
//                       >
//                         Add to Cart
//                       </button>
//                     </div>
//                   ) : (
//                     <button
//                       onClick={() => handleAddToCart(product._id)}
//                       className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition text-sm font-medium"
//                     >
//                       Add to Cart
//                     </button>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ShopDetails;




import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { shopService, productService, cartService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { FiStar, FiMapPin, FiClock, FiArrowLeft, FiShoppingCart } from 'react-icons/fi';

const ShopDetails = () => {
  const { shopId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    fetchShopAndProducts();
  }, [shopId]);

  const fetchShopAndProducts = async () => {
    try {
      setLoading(true);
      const [shopRes, productsRes] = await Promise.all([
        shopService.getShopDetails(shopId),
        productService.getAllProducts({ shopId, isAvailable: true })
      ]);
      setShop(shopRes.data.data);
      setProducts(productsRes.data.data);
    } catch (error) {
      toast.error('Error loading shop details');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIXED ADD TO CART
  const handleAddToCart = async (product) => {
    if (!user) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }

    try {
      await cartService.addToCart({
        productId: product._id,
        quantity: 1
      });
      toast.success('Added to cart');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Error adding to cart');
    }
  };

  const categories = ['All', ...new Set(products.map(p => p.category))];

  const filteredProducts =
    selectedCategory === 'All'
      ? products
      : products.filter(p => p.category === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Shop not found</h2>
          <button onClick={() => navigate('/')} className="bg-indigo-600 text-white px-6 py-3 rounded-lg">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Shop Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <button onClick={() => navigate('/')} className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600 mb-4">
            <FiArrowLeft />
            <span>Back to shops</span>
          </button>

          <h1 className="text-3xl font-bold">{shop.name}</h1>
          <p className="text-gray-600">{shop.description}</p>
        </div>
      </div>

      {/* Products */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <div key={product._id} className="bg-white rounded-lg shadow-md p-3">
              <div className="h-40 bg-gray-200 flex items-center justify-center">
                {product.images?.[0] ? (
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <span>📦</span>
                )}
              </div>

              <h3 className="font-semibold text-sm mt-2">{product.name}</h3>
              <p className="text-indigo-600 font-bold">₹{product.price}</p>

              <button
                onClick={() => handleAddToCart(product)}
                className="w-full bg-indigo-600 text-white py-2 rounded-lg mt-2 hover:bg-indigo-700"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShopDetails;
