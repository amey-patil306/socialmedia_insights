import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import Papa from 'papaparse';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { SocialPost } from '../types';

export function DataVisualizer() {
  const [data, setData] = useState<SocialPost[]>([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          setData(results.data as SocialPost[]);
        },
      });
    }
  };

  const aggregateDataByType = () => {
    const aggregated = data.reduce((acc, post) => {
      const type = post.post_type;
      if (!acc[type]) {
        acc[type] = { post_type: type, likes: 0, shares: 0, comments: 0, count: 0 };
      }
      acc[type].likes += Number(post.likes) || 0;
      acc[type].shares += Number(post.shares) || 0;
      acc[type].comments += Number(post.comments) || 0;
      acc[type].count += 1;
      return acc;
    }, {} as Record<string, any>);

    return Object.values(aggregated).map(type => ({
      ...type,
      likes: Number((type.likes / type.count).toFixed(2)),
      shares: Number((type.shares / type.count).toFixed(2)),
      comments: Number((type.comments / type.count).toFixed(2)),
    }));
  };

  const formatTooltipValue = (value: number) => {
    return value.toFixed(2);
  };

  return (
    <div className="flex flex-col h-[600px] bg-gray-900/50 rounded-lg border border-purple-500/30 backdrop-blur-sm">
      <div className="flex items-center gap-2 p-4 border-b border-purple-500/30">
        <Upload className="w-6 h-6 text-purple-400" />
        <h2 className="text-lg font-semibold text-purple-400">Data Visualization</h2>
      </div>

      {!data.length ? (
        <div className="flex-1 flex items-center justify-center">
          <label className="flex flex-col items-center gap-4 cursor-pointer">
            <div className="p-6 rounded-lg border-2 border-dashed border-purple-500/30 hover:border-purple-400/50 transition-colors">
              <div className="text-purple-400 text-center">
                <Upload className="w-12 h-12 mx-auto mb-4" />
                <p className="text-lg font-semibold">Upload CSV File</p>
                <p className="text-sm text-purple-400/70">Click to browse or drag and drop</p>
              </div>
            </div>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      ) : (
        <div className="flex-1 p-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={aggregateDataByType()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
              <XAxis dataKey="post_type" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip
                formatter={formatTooltipValue}
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                }}
              />
              <Legend />
              <Bar dataKey="likes" fill="#3b82f6" name="Avg. Likes" />
              <Bar dataKey="shares" fill="#8b5cf6" name="Avg. Shares" />
              <Bar dataKey="comments" fill="#ec4899" name="Avg. Comments" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}