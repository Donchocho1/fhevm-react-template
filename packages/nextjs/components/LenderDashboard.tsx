'use client';

import { useState, useEffect } from 'react';
import { setupPrivateLoanSDK } from '@loan-dapp/sdk';

export function LenderDashboard() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const loanSDK = await setupPrivateLoanSDK(11155111);
      
      // Use fixed IDs instead of random ones for hydration
      const sampleApps = await Promise.all(
        [101, 102, 103].map(async (id) => {
          const status = await loanSDK.getApplicationStatus(id);
          // Fix the credit score calculation - use proper hex conversion
          const baseScore = 600 + (id % 3) * 50;
          const decryptedScore = await loanSDK.decryptCreditScore(
            `0x656e637279707465645f${baseScore}00000000000000000000000000000000`
          );
          return { 
            ...status, 
            decryptedScore,
            applicationId: id,
            requestedAmount: `${2 + (id % 3)} ETH`, // Sample amounts
            submittedAt: new Date(Date.now() - (id * 86400000)).toISOString() // Sample dates
          };
        })
      );
      
      setApplications(sampleApps);
    } catch (error) {
      console.error('Failed to load applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (applicationId: number) => {
    alert(`Application ${applicationId} approved!`);
    // Refresh applications to show updated status
    loadApplications();
  };

  const handleReject = async (applicationId: number) => {
    alert(`Application ${applicationId} rejected!`);
    // Refresh applications to show updated status
    loadApplications();
  };

  if (!isClient) {
    return <div className="text-center py-8 text-gray-600">Loading dashboard...</div>;
  }

  if (loading) {
    return <div className="text-center py-8 text-gray-600">Loading applications...</div>;
  }

  return (
    <div className="w-full">
      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-primary-50 rounded-lg p-3 text-center border border-primary-200">
          <div className="text-2xl font-bold text-primary-700">{applications.length}</div>
          <div className="text-xs text-primary-600 uppercase tracking-wide">Total</div>
        </div>
        <div className="bg-green-50 rounded-lg p-3 text-center border border-green-200">
          <div className="text-2xl font-bold text-green-700">
            {applications.filter(app => app.status === 'approved').length}
          </div>
          <div className="text-xs text-green-600 uppercase tracking-wide">Approved</div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-3 text-center border border-yellow-200">
          <div className="text-2xl font-bold text-yellow-700">
            {applications.filter(app => app.status === 'pending').length}
          </div>
          <div className="text-xs text-yellow-600 uppercase tracking-wide">Pending</div>
        </div>
      </div>

      {/* Applications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {applications.map((app) => (
          <div 
            key={app.applicationId} 
            className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-all duration-200 flex flex-col h-full"
          >
            {/* Header with ID and Status - FIXED HEIGHT */}
            <div className="flex justify-between items-center p-3 border-b border-gray-100 bg-gradient-to-r from-primary-50 to-primary-25 rounded-t-lg min-h-[60px]">
              <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wide flex-shrink-0">
                App #{app.applicationId}
              </h3>
              <span className={`px-2 py-1 rounded-full text-xs font-bold flex-shrink-0 ${
                app.status === 'approved' ? 'bg-green-100 text-green-800 border border-green-300' :
                app.status === 'rejected' ? 'bg-red-100 text-red-800 border border-red-300' :
                'bg-yellow-100 text-yellow-800 border border-yellow-300'
              }`}>
                {app.status?.toUpperCase() || 'PENDING'}
              </span>
            </div>
            
            {/* Application Details - Compact Layout */}
            <div className="p-3 space-y-3 flex-grow">
              {/* Applicant - Compact */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Applicant
                </label>
                <div className="font-mono text-xs text-gray-800 bg-gray-50 px-2 py-1 rounded border truncate">
                  {app.applicant?.slice(0, 8)}...{app.applicant?.slice(-6)}
                </div>
              </div>

              {/* Amount and Credit Score in one row */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Amount
                  </label>
                  <div className="font-mono text-xs text-gray-800 bg-gray-50 px-2 py-1 rounded border text-center">
                    {app.requestedAmount || '2 ETH'}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Credit Score
                  </label>
                  <div className="font-mono text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded border text-center font-bold">
                    {app.decryptedScore || '650'}
                  </div>
                </div>
              </div>

              {/* Submission Date */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Submitted
                </label>
                <div className="text-xs text-gray-700 bg-gray-50 px-2 py-1 rounded border">
                  {app.submittedAt ? new Date(app.submittedAt).toLocaleDateString() : '2024-01-01'}
                </div>
              </div>
            </div>
            
            {/* Action Buttons - ALL CLICKABLE, NO CHECKMARKS */}
            <div className="p-3 border-t border-gray-100 bg-gray-50 rounded-b-lg">
              <div className="flex gap-2">
                <button
                  onClick={() => handleApprove(app.applicationId)}
                  className="flex-1 py-2 px-2 rounded text-xs font-medium transition-all min-h-[40px] flex items-center justify-center bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow-md"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(app.applicationId)}
                  className="flex-1 py-2 px-2 rounded text-xs font-medium transition-all min-h-[40px] flex items-center justify-center bg-red-600 hover:bg-red-700 text-white shadow-sm hover:shadow-md"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {applications.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-400 text-6xl mb-4">📄</div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No Applications</h3>
          <p className="text-gray-500 text-sm">Loan applications will appear here when submitted.</p>
        </div>
      )}
    </div>
  );
}
