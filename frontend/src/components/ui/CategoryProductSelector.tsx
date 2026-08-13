import React, { useState, useEffect } from 'react';
import { useProducts } from '../../context/ProductContext';
import { Filter, Box } from 'lucide-react';

interface CategoryProductSelectorProps {
  selectedProductId: string;
  onSelectProduct: (productId: string) => void;
  className?: string;
  variant?: 'light' | 'dark' | 'natural';
  showLabels?: boolean;
}

export const CATEGORIES = [
  'All Categories',
  'Food & Perishables',
  'Electronics & Tech',
  'Pharmaceuticals & Health',
  'Luxury Goods & Apparel',
  'Raw Materials & Minerals',
];

export const CategoryProductSelector: React.FC<CategoryProductSelectorProps> = ({
  selectedProductId,
  onSelectProduct,
  className = '',
  variant = 'natural',
  showLabels = true,
}) => {
  const { products } = useProducts();

  // Selected Category state
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');

  // Sync category if selectedProductId changes externally
  useEffect(() => {
    const currentProd = products.find((p) => p.productId.toUpperCase() === selectedProductId.toUpperCase());
    if (currentProd && currentProd.category && currentProd.category !== selectedCategory) {
      if (CATEGORIES.includes(currentProd.category)) {
        setSelectedCategory(currentProd.category);
      }
    }
  }, [selectedProductId, products]);

  const isCategoryMatch = (p: { category?: string; name?: string; productId?: string }, catFilter: string) => {
    if (catFilter === 'All Categories') return true;
    const prodCat = (p.category || '').toLowerCase().trim();
    const prodName = (p.name || '').toLowerCase().trim();
    const prodId = (p.productId || '').toLowerCase().trim();
    const target = (catFilter || '').toLowerCase().trim();

    if (prodCat === target) return true;

    // Check category specific keyword aliases
    if (target.includes('food')) {
      const foodKeywords = ['food', 'perishable', 'rice', 'grain', 'avocado', 'wheat', 'milk', 'dairy', 'produce', 'crop', 'farm', 'agri'];
      return foodKeywords.some(kw => prodCat.includes(kw) || prodName.includes(kw) || prodId.includes('rice') || prodId.includes('food') || prodId.includes('wheat'));
    }
    if (target.includes('electronic')) {
      const elecKeywords = ['electronic', 'tech', 'chip', 'processor', 'semiconductor', 'iot', 'hardware', 'sensor', 'device'];
      return elecKeywords.some(kw => prodCat.includes(kw) || prodName.includes(kw) || prodId.includes('elec') || prodId.includes('chip'));
    }
    if (target.includes('pharmaceutical')) {
      const pharmKeywords = ['pharm', 'health', 'vaccine', 'medicine', 'vial', 'drug', 'insulin', 'medical'];
      return pharmKeywords.some(kw => prodCat.includes(kw) || prodName.includes(kw) || prodId.includes('pharm') || prodId.includes('vac'));
    }
    if (target.includes('luxury')) {
      const luxKeywords = ['luxury', 'apparel', 'watch', 'tote', 'bag', 'leather', 'jewelry', 'gold', 'fashion'];
      return luxKeywords.some(kw => prodCat.includes(kw) || prodName.includes(kw) || prodId.includes('lux') || prodId.includes('wtch'));
    }
    if (target.includes('raw') || target.includes('mineral')) {
      const rawKeywords = ['raw', 'material', 'mineral', 'lithium', 'copper', 'steel', 'metal', 'ore', 'gold'];
      return rawKeywords.some(kw => prodCat.includes(kw) || prodName.includes(kw) || prodId.includes('raw') || prodId.includes('lith'));
    }

    const pFirst = prodCat.split(' ')[0];
    const fFirst = target.split(' ')[0];
    return prodCat.includes(fFirst) || target.includes(pFirst);
  };

  // Filter products by selected category; fallback to all products if no match found so selector is NEVER empty
  const matchedProducts = products.filter((p) => isCategoryMatch(p, selectedCategory));
  const filteredProducts = matchedProducts.length > 0 ? matchedProducts : products;

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    const matches = products.filter((p) => isCategoryMatch(p, cat));
    if (matches.length > 0) {
      onSelectProduct(matches[0].productId);
    } else if (products.length > 0) {
      onSelectProduct(products[0].productId);
    }
  };

  const isDark = variant === 'dark';

  return (
    <div className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-3 ${className}`}>
      {/* 1. SELECT CATEGORY DROPDOWN */}
      <div className="flex-1 space-y-1">
        {showLabels && (
          <label className={`text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${isDark ? 'text-emerald-400' : 'text-slate-600'}`}>
            <Filter className="w-3.5 h-3.5 text-teal-600" />
            <span>Select Category</span>
          </label>
        )}
        <div className="relative">
          <select
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className={`w-full h-[42px] px-3.5 pr-8 rounded-xl text-xs font-semibold appearance-none border transition-all cursor-pointer focus:outline-none focus:ring-2 ${
              isDark
                ? 'bg-slate-900 text-white border-slate-700 focus:ring-teal-500 focus:border-teal-500'
                : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300 focus:ring-teal-500/30 focus:border-teal-600 shadow-xs'
            }`}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat} className={isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}>
                📁 {cat}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">
            ▼
          </div>
        </div>
      </div>

      {/* 2. SELECT ITEM / PRODUCT DROPDOWN */}
      <div className="flex-1 space-y-1">
        {showLabels && (
          <label className={`text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${isDark ? 'text-teal-400' : 'text-slate-600'}`}>
            <Box className="w-3.5 h-3.5 text-indigo-600" />
            <span>Select Item / Product</span>
          </label>
        )}
        <div className="relative">
          <select
            value={selectedProductId}
            onChange={(e) => onSelectProduct(e.target.value)}
            className={`w-full h-[42px] px-3.5 pr-8 rounded-xl text-xs font-semibold appearance-none border transition-all cursor-pointer focus:outline-none focus:ring-2 ${
              isDark
                ? 'bg-slate-900 text-white border-slate-700 focus:ring-indigo-500 focus:border-indigo-500'
                : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300 focus:ring-teal-500/30 focus:border-teal-600 shadow-xs'
            }`}
          >
            {filteredProducts.length === 0 ? (
              <option value="" disabled>No products in category</option>
            ) : (
              filteredProducts.map((p) => (
                <option key={p.productId} value={p.productId} className={isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}>
                  📦 {p.productId} — {p.name || p.batchId} ({p.currentStatus})
                </option>
              ))
            )}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">
            ▼
          </div>
        </div>
      </div>
    </div>
  );
};
