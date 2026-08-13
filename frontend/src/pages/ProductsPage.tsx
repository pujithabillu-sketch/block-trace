import React, { useState } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { useProducts } from '../context/ProductContext';
import { PageContainer } from '../components/layout/PageContainer';
import { PageHeader } from '../components/ui/PageHeader';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Button } from '../components/ui/Button';
import { SearchBar } from '../components/ui/SearchBar';
import { WalletAddress } from '../components/ui/WalletAddress';
import { Modal } from '../components/ui/Modal';
import {
  PlusCircle,
  ShieldCheck,
  Filter,
  ArrowUpDown,
  Eye,
  ArrowLeftRight,
  ChevronLeft,
  ChevronRight,
  Layers,
} from 'lucide-react';
import type { ProductRecord } from '../types';

export const ProductsPage: React.FC = () => {
  const { setActiveNav, setGlobalSearch, navigateToProductDetails } = useNavigation();
  const { products } = useProducts();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [domainFilter, setDomainFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'id' | 'timestamp' | 'status'>('timestamp');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Product Details Modal state
  const [selectedProduct, setSelectedProduct] = useState<ProductRecord | null>(null);

  // Filter & Search Logic
  const filteredProducts = products.filter((p) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      p.productId.toLowerCase().includes(query) ||
      p.batchId.toLowerCase().includes(query) ||
      (p.name && p.name.toLowerCase().includes(query)) ||
      (p.category && p.category.toLowerCase().includes(query));

    const matchesDomain =
      domainFilter === 'ALL' ||
      (p.category && p.category.toLowerCase().includes(domainFilter.toLowerCase()));

    if (!matchesDomain) return false;

    if (statusFilter === 'ALL') return matchesSearch;
    if (statusFilter === 'RECALLED') return matchesSearch && p.recalled;
    if (statusFilter === 'COUNTERFEIT_REPORTED') return matchesSearch && p.counterfeitReported;
    if (statusFilter === 'AUTHENTIC') return matchesSearch && !p.recalled && !p.counterfeitReported;
    return matchesSearch && p.currentStatus === statusFilter;
  });

  // Sort Logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'id') {
      return sortOrder === 'asc'
        ? a.productId.localeCompare(b.productId)
        : b.productId.localeCompare(a.productId);
    }
    if (sortBy === 'status') {
      return sortOrder === 'asc'
        ? a.currentStatus.localeCompare(b.currentStatus)
        : b.currentStatus.localeCompare(a.currentStatus);
    }
    // timestamp default
    return sortOrder === 'asc'
      ? a.lastUpdateTimestamp - b.lastUpdateTimestamp
      : b.lastUpdateTimestamp - a.lastUpdateTimestamp;
  });

  // Pagination Logic
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage) || 1;
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleSort = (type: 'id' | 'timestamp' | 'status') => {
    if (sortBy === type) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(type);
      setSortOrder('desc');
    }
  };

  const handleVerifyClick = (pId: string) => {
    setGlobalSearch(pId);
    setActiveNav('verify-product');
  };

  const handleTransferClick = (_pId?: string) => {
    setActiveNav('transfers');
  };

  return (
    <PageContainer>
      <PageHeader
        title="Products"
        description="Catalog of physical products registered on Algorand Box storage."
        breadcrumbs={[{ label: 'Products' }]}
        actions={
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<PlusCircle className="w-4 h-4" />}
            onClick={() => setActiveNav('register-product')}
          >
            Register New Product
          </Button>
        }
      />

      <Card variant="default">
        {/* Controls Header: Search, Filter, Sort */}
        <CardHeader className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex-1 max-w-md">
            <SearchBar
              value={searchQuery}
              onChange={(val) => {
                setSearchQuery(val);
                setCurrentPage(1);
              }}
              placeholder="Search by Product ID or Batch ID..."
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Industry Domain Filter */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs">
              <Layers className="w-3.5 h-3.5 text-indigo-500" />
              <select
                value={domainFilter}
                onChange={(e) => {
                  setDomainFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="ALL">🌐 All Industry Domains</option>
                <option value="Food & Agriculture">🌾 Food & Agriculture</option>
                <option value="Pharmaceuticals">💊 Pharmaceuticals & Biotech</option>
                <option value="Electronics & Chips">⚡ Electronics & Semiconductors</option>
                <option value="Luxury Goods">💎 Luxury Goods & Watches</option>
                <option value="Industrial & Aerospace">🏭 Industrial & Aerospace</option>
                <option value="Fine Beverages & Wine">🍷 Fine Beverages & Wine</option>
                <option value="Apparel & Textiles">👗 Apparel & Textiles</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Statuses</option>
                <option value="REGISTERED">REGISTERED</option>
                <option value="MANUFACTURED">MANUFACTURED</option>
                <option value="IN_TRANSIT">IN TRANSIT</option>
                <option value="AT_DISTRIBUTOR">AT DISTRIBUTOR</option>
                <option value="AT_WAREHOUSE">AT WAREHOUSE</option>
                <option value="AT_RETAILER">AT RETAILER</option>
                <option value="SOLD">SOLD</option>
                <option value="RECALLED">RECALLED</option>
                <option value="COUNTERFEIT_REPORTED">COUNTERFEIT REPORTED</option>
              </select>
            </div>

            {/* Sort Dropdown */}
            <Button
              variant="outline"
              size="sm"
              leftIcon={<ArrowUpDown className="w-3.5 h-3.5" />}
              onClick={() => toggleSort('timestamp')}
            >
              Sort: {sortBy} ({sortOrder})
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Desktop Table View */}
          <div className="hidden lg:block table-responsive">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-6 cursor-pointer" onClick={() => toggleSort('id')}>
                    <div className="flex items-center gap-1">Product ID <ArrowUpDown className="w-3 h-3" /></div>
                  </th>
                  <th className="py-3.5 px-6">Batch ID</th>
                  <th className="py-3.5 px-6">Manufacturer</th>
                  <th className="py-3.5 px-6">Current Holder</th>
                  <th className="py-3.5 px-6 cursor-pointer" onClick={() => toggleSort('status')}>
                    <div className="flex items-center gap-1">Status <ArrowUpDown className="w-3 h-3" /></div>
                  </th>
                  <th className="py-3.5 px-6 cursor-pointer" onClick={() => toggleSort('timestamp')}>
                    <div className="flex items-center gap-1">Last Updated <ArrowUpDown className="w-3 h-3" /></div>
                  </th>
                  <th className="py-3.5 px-6">Verification</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {paginatedProducts.map((p) => {
                  const verificationState = p.recalled
                    ? 'RECALLED'
                    : p.counterfeitReported
                    ? 'SUSPICIOUS'
                    : 'AUTHENTIC';

                  return (
                    <tr key={p.productId} className="hover:bg-slate-50/70 transition-colors table-row-animate">
                      <td className="py-4 px-6 font-mono font-bold text-slate-900">{p.productId}</td>
                      <td className="py-4 px-6 font-mono text-slate-600">{p.batchId}</td>
                      <td className="py-4 px-6"><WalletAddress address={p.manufacturer} /></td>
                      <td className="py-4 px-6"><WalletAddress address={p.currentHolder} /></td>
                      <td className="py-4 px-6"><StatusBadge status={p.currentStatus} showIcon={false} /></td>
                      <td className="py-4 px-6 text-slate-500 font-mono">
                        {new Date(p.lastUpdateTimestamp).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6"><StatusBadge verificationState={verificationState} /></td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            size="sm"
                            variant="ghost"
                            title="View Record Details"
                            leftIcon={<Eye className="w-3.5 h-3.5" />}
                            onClick={() => navigateToProductDetails(p.productId)}
                          >
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            title="Verify On-Chain"
                            leftIcon={<ShieldCheck className="w-3.5 h-3.5" />}
                            onClick={() => handleVerifyClick(p.productId)}
                          >
                            Verify
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            title="Initiate Custody Transfer"
                            leftIcon={<ArrowLeftRight className="w-3.5 h-3.5" />}
                            onClick={() => handleTransferClick(p.productId)}
                          >
                            Transfer
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile / Tablet Responsive Cards View */}
          <div className="lg:hidden p-4 space-y-4">
            {paginatedProducts.map((p) => {
              const verificationState = p.recalled
                ? 'RECALLED'
                : p.counterfeitReported
                ? 'SUSPICIOUS'
                : 'AUTHENTIC';

              return (
                <div key={p.productId} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-extrabold text-sm text-slate-900">{p.productId}</span>
                    <StatusBadge verificationState={verificationState} />
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Batch ID:</span>
                      <span className="font-mono font-bold text-slate-800">{p.batchId}</span>
                    </div>
                    <div className="flex justify-between items-center pt-1">
                      <span className="text-slate-500">Holder:</span>
                      <WalletAddress address={p.currentHolder} />
                    </div>
                    <div className="flex justify-between items-center pt-1">
                      <span className="text-slate-500">Status:</span>
                      <StatusBadge status={p.currentStatus} showIcon={false} />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex items-center justify-end gap-2">
                    <Button size="sm" variant="ghost" onClick={() => navigateToProductDetails(p.productId)}>
                      View
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleVerifyClick(p.productId)}>
                      Verify
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => handleTransferClick(p.productId)}>
                      Transfer
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          <div className="p-4 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between text-xs text-slate-500">
            <span>
              Showing {paginatedProducts.length} of {sortedProducts.length} products (Page {currentPage} of {totalPages})
            </span>
            <div className="flex items-center gap-1.5">
              <Button
                size="sm"
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                leftIcon={<ChevronLeft className="w-3.5 h-3.5" />}
              >
                Previous
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Product View Details Modal */}
      {selectedProduct && (
        <Modal
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          title={`Product Record: ${selectedProduct.productId}`}
          subtitle="Algorand Smart Contract Box Storage State"
          maxWidth="lg"
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-700">Verification Status</span>
              <StatusBadge
                verificationState={
                  selectedProduct.recalled
                    ? 'RECALLED'
                    : selectedProduct.counterfeitReported
                    ? 'SUSPICIOUS'
                    : 'AUTHENTIC'
                }
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-500 block">Product ID:</span>
                <span className="font-mono font-bold text-slate-900 text-sm">{selectedProduct.productId}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-500 block">Batch / Lot Code:</span>
                <span className="font-mono font-bold text-slate-900 text-sm">{selectedProduct.batchId}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Registered Manufacturer:</span>
                <WalletAddress address={selectedProduct.manufacturer} />
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-slate-200">
                <span className="text-slate-500">Current Custody Holder:</span>
                <WalletAddress address={selectedProduct.currentHolder} />
              </div>
            </div>

            <div className="p-3 bg-slate-900 text-white rounded-xl space-y-1 font-mono">
              <span className="text-teal-400 font-bold block">Document SHA-256 Metadata Hash</span>
              <p className="text-slate-300 break-all text-[11px]">{selectedProduct.metadataHash}</p>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setSelectedProduct(null)}>
                Close
              </Button>
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<ShieldCheck className="w-3.5 h-3.5" />}
                onClick={() => {
                  const id = selectedProduct.productId;
                  setSelectedProduct(null);
                  handleVerifyClick(id);
                }}
              >
                Verify Authenticity
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </PageContainer>
  );
};
