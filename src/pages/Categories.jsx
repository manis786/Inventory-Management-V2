import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export function Categories() {
  const { categories = [], products = [] } = useApp();

  const categoryStats = (categories || []).map((cat) => {
    const catProds = (products || []).filter(p => p.categoryId === cat.id);
    return { ...cat, count: catProds.length, value: catProds.reduce((sum, p) => sum + (p.costPrice * p.stock), 0) };
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Categories</h1>
      {categoryStats.length === 0 ? <p>No categories found.</p> : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {categoryStats.map(cat => <div key={cat.id} className="p-4 border rounded">{cat.name} ({cat.count} items)</div>)}
        </div>
      )}
    </div>
  );
}
export default Categories;