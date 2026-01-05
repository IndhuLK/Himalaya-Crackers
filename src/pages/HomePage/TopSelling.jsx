import React from "react";
import { Star, ShoppingCart, Heart, Flame, Zap } from "lucide-react";

const products = [
    {
        id: 1,
        name: "240 Shots Multi Color",
        price: 3500,
        oldPrice: 4200,
        rating: 4.8,
        reviews: 120,
        image: "https://images.unsplash.com/photo-1498931299472-f7a63a5a1cfa?auto=format&fit=crop&q=80&w=400",
        tag: "Bestseller",
    },
    {
        id: 2,
        name: "1000 Wala Giant Crackers",
        price: 1200,
        oldPrice: 1500,
        rating: 4.9,
        reviews: 85,
        image: "https://images.unsplash.com/photo-1549465220-1d8c9d9c470c?auto=format&fit=crop&q=80&w=400",
        tag: "Trending",
    },
    {
        id: 3,
        name: "Flower Pots - Large",
        price: 450,
        oldPrice: 600,
        rating: 4.7,
        reviews: 200,
        image: "https://images.unsplash.com/photo-1533230408703-a2321476d067?auto=format&fit=crop&q=80&w=400",
    },
    {
        id: 4,
        name: "Rocket Bomb Box",
        price: 850,
        oldPrice: 1100,
        rating: 4.6,
        reviews: 95,
        image: "https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?auto=format&fit=crop&q=80&w=400",
        tag: "Hot Deal",
    },
];

const TopSelling = () => {
    return (
        <section className="py-20 bg-white font-poppins">
            <div className="max-w-7xl mx-auto px-6">

                {/* Section Header */}
                <div className="text-center mb-16">
                    <h4 className="text-orange-500 font-bold tracking-widest uppercase mb-3">
                        Customer Favorites
                    </h4>
                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">
                        Top Selling <span className="text-[#1E60F2]">Crackers</span>
                    </h2>
                    <div className="w-24 h-1.5 bg-gradient-to-r from-orange-400 to-[#1E60F2] mx-auto rounded-full"></div>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="group relative bg-white border border-gray-100 shadow-lg hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 overflow-hidden"
                        >
                            {/* Image Container */}
                            <div className="relative h-64 overflow-hidden bg-gray-100">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />

                                {/* Overlay Tags */}
                                {product.tag && (
                                    <div className="absolute top-4 left-4">
                                        <span className="px-3 py-1 bg-orange-500 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-md">
                                            {product.tag}
                                        </span>
                                    </div>
                                )}

                                {/* Wishlist Button */}
                                <button className="absolute top-4 right-4 p-2.5 bg-white/80 backdrop-blur-sm rounded-full text-gray-500 hover:text-red-500 hover:bg-white transition-all duration-300 shadow-sm opacity-0 group-hover:opacity-100 transform translate-y-[-10px] group-hover:translate-y-0">
                                    <Heart size={18} />
                                </button>

                                {/* Quick Action Overlay */}
                                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/80 to-transparent">
                                    <button className="w-full py-3 bg-[#1E60F2] text-white font-bold 
                                    rounded-xl shadow-lg hover:bg-blue-700 transition-colors 
                                    flex items-center justify-center gap-2 cursor-pointer">
                                        <ShoppingCart size={18} />
                                        Add to Cart
                                    </button>
                                </div>
                            </div>

                            {/* Product Info */}
                            <div className="p-6">
                                <div className="flex items-center gap-1 mb-2">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={14}
                                            className={`${i < Math.floor(product.rating)
                                                    ? "fill-orange-400 text-orange-400"
                                                    : "fill-gray-200 text-gray-200"
                                                }`}
                                        />
                                    ))}
                                    <span className="text-xs text-gray-400 ml-1">({product.reviews})</span>
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-[#1E60F2] transition-colors">
                                    {product.name}
                                </h3>

                                <div className="flex items-baseline gap-3">
                                    <span className="text-2xl font-black text-gray-900">
                                        ₹{product.price}
                                    </span>
                                    <span className="text-sm text-gray-400 line-through font-medium">
                                        ₹{product.oldPrice}
                                    </span>
                                    <span className="text-sm font-bold text-green-600">
                                        {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}% OFF
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* View All Button */}
                <div className="mt-16 text-center">
                    <button className="px-10 py-4 bg-white text-gray-900 border-2 
                    border-gray-900  font-bold hover:bg-gray-900 cursor-pointer
                    hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl
                     inline-flex items-center gap-2 uppercase tracking-wide text-sm">
                        View All Bestsellers
                        <Zap size={18} className="text-orange-500" />
                    </button>
                </div>

            </div>
        </section>
    );
};

export default TopSelling;
