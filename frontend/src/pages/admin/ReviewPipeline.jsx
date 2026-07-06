
import React, { useState, useEffect } from 'react';
import api from '../../services/api.js';
import { useTheme } from '../../context/ThemeContext.jsx';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import {
  FiCheckCircle, FiXCircle, FiClock, FiAlertCircle,
  FiUser, FiFileText, FiMessageSquare,
  FiChevronDown, FiChevronUp, FiStar, FiRefreshCw
} from 'react-icons/fi';
import { format } from 'date-fns';

const ReviewPipeline = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [pendingCount, setPendingCount] = useState(0);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });
  const [expandedSections, setExpandedSections] = useState({
    attendance: true,
    production: true,
    editing: true,
    support: true,
    equipment: true,
    learning: true,
    eod: true,
  });
  const { isDark } = useTheme();

  useEffect(() => {
    loadReports();
  }, [pagination.page]);

  const loadReports = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/admin/reports/pending?page=${pagination.page}&limit=${pagination.limit}`);
      setReports(response.data.reports || []);
      setPendingCount(response.data.pendingCount || 0);
      setPagination({
        ...pagination,
        total: response.data.pagination?.total || 0,
        pages: response.data.pagination?.pages || 0,
      });
    } catch (error) {
      toast.error('Failed to load reports');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadReportDetails = async (report) => {
    try {
      const response = await api.get(`/admin/reports/${report._id}/details`);
      setSelectedReport(response.data.report);
    } catch (error) {
      toast.error('Failed to load report details');
      console.error(error);
    }
  };

  const handleReview = async (status) => {
    if (!selectedReport) return;

    try {
      await api.put(`/admin/reports/${selectedReport._id}/review`, {
        status,
        feedback,
      });
      toast.success(`Report ${status} successfully`);
      setSelectedReport(null);
      setFeedback('');
      loadReports();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to review report');
      console.error(error);
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const Section = ({ title, icon: Icon, section, children }) => (
    <div className={`rounded-xl border ${isDark ? 'border-white/5' : 'border-emerald-100/50'} overflow-hidden`}>
      <button
        onClick={() => toggleSection(section)}
        className={`w-full px-4 py-3 flex items-center justify-between transition-colors ${
          isDark ? 'hover:bg-white/5' : 'hover:bg-emerald-50/50'
        }`}
      >
        <div className="flex items-center gap-2">
          <Icon size={16} className={isDark ? 'text-emerald-400' : 'text-emerald-600'} />
          <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-emerald-950'}`}>
            {title}
          </span>
        </div>
        {expandedSections[section] ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
      </button>
      {expandedSections[section] && <div className="px-4 pb-4">{children}</div>}
    </div>
  );

  const CheckboxView = ({ label, value }) => (
    <div className="flex items-center gap-2 py-1">
      <span className={value ? 'text-emerald-400' : 'text-rose-400'}>
        {value ? '✅' : '❌'}
      </span>
      <span className={`text-sm ${isDark ? 'text-emerald-200/70' : 'text-emerald-800/70'}`}>
        {label}
      </span>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className={isDark ? 'text-emerald-200/60' : 'text-emerald-800/60'}>Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Review Pipeline - TradeExTV</title>
      </Helmet>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className={`text-2xl md:text-3xl font-bold flex items-center gap-3 ${
              isDark ? 'text-white' : 'text-emerald-950'
            }`}>
              <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/20">
                <FiStar className="text-white" size={24} />
              </div>
              Review Pipeline
            </h1>
            <p className={`text-sm mt-1 ${isDark ? 'text-emerald-200/50' : 'text-emerald-800/50'}`}>
              Review and manage pending reports from team members
            </p>
          </div>
          <div className={`px-4 py-2 rounded-xl flex items-center gap-2 ${
            isDark ? 'bg-amber-500/10 border border-amber-500/20' : 'bg-amber-50 border border-amber-200'
          }`}>
            <FiClock className="text-amber-500" size={16} />
            <span className={`text-sm font-medium ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>
              {pendingCount} Pending Reviews
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            {reports.length === 0 ? (
              <div className={`p-8 text-center rounded-2xl ${
                isDark 
                  ? 'bg-[#032e1d]/40 border border-white/5' 
                  : 'bg-white/60 border border-emerald-100/50'
              } backdrop-blur-sm`}>
                <div className="text-4xl mb-4">✅</div>
                <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-emerald-950'}`}>
                  All Caught Up!
                </h3>
                <p className={`text-sm mt-1 ${isDark ? 'text-emerald-200/50' : 'text-emerald-800/50'}`}>
                  No pending reports to review.
                </p>
              </div>
            ) : (
              reports.map((report) => (
                <div
                  key={report._id}
                  className={`p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                    selectedReport?._id === report._id
                      ? isDark 
                        ? 'bg-emerald-500/20 border border-emerald-500/40 shadow-lg shadow-emerald-500/10' 
                        : 'bg-emerald-100/50 border border-emerald-400/40 shadow-lg shadow-emerald-500/10'
                      : isDark 
                        ? 'bg-[#032e1d]/40 border border-white/5 hover:border-emerald-500/30' 
                        : 'bg-white/60 border border-emerald-100/50 hover:border-emerald-400/30'
                  } backdrop-blur-sm`}
                  onClick={() => loadReportDetails(report)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-600'
                      }`}>
                        <FiUser size={18} />
                      </div>
                      <div>
                        <p className={`font-medium ${isDark ? 'text-white' : 'text-emerald-950'}`}>
                          {report.userId?.firstName} {report.userId?.lastName}
                        </p>
                        <p className={`text-xs ${isDark ? 'text-emerald-200/40' : 'text-emerald-800/40'}`}>
                          {format(new Date(report.date), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 ${
                      isDark 
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/20' 
                        : 'bg-amber-100 text-amber-700 border border-amber-200'
                    }`}>
                      <FiClock size={12} />
                      Pending
                    </span>
                  </div>
                </div>
              ))
            )}

            {pagination.pages > 1 && (
              <div className={`flex items-center justify-between gap-4 pt-4 border-t ${
                isDark ? 'border-white/5' : 'border-emerald-100/50'
              }`}>
                <p className={`text-sm ${isDark ? 'text-emerald-200/40' : 'text-emerald-800/40'}`}>
                  {reports.length} of {pagination.total}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                    disabled={pagination.page === 1}
                    className={`px-4 py-2 rounded-xl border text-sm transition-all duration-300 ${
                      isDark 
                        ? 'border-white/10 text-emerald-200/60 hover:bg-white/5 disabled:opacity-30' 
                        : 'border-emerald-100 text-emerald-800/60 hover:bg-emerald-50 disabled:opacity-30'
                    }`}
                  >
                    Previous
                  </button>
                  <span className={`text-sm px-3 ${isDark ? 'text-emerald-200/60' : 'text-emerald-800/60'}`}>
                    {pagination.page} / {pagination.pages}
                  </span>
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.pages, prev.page + 1) }))}
                    disabled={pagination.page === pagination.pages}
                    className={`px-4 py-2 rounded-xl border text-sm transition-all duration-300 ${
                      isDark 
                        ? 'border-white/10 text-emerald-200/60 hover:bg-white/5 disabled:opacity-30' 
                        : 'border-emerald-100 text-emerald-800/60 hover:bg-emerald-50 disabled:opacity-30'
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-2">
            {selectedReport ? (
              <div className={`p-6 rounded-2xl max-h-[700px] overflow-y-auto ${
                isDark 
                  ? 'bg-[#032e1d]/40 border border-white/5' 
                  : 'bg-white/60 border border-emerald-100/50'
              } backdrop-blur-sm`}>
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/5">
                  <div>
                    <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-emerald-950'}`}>
                      Report Review
                    </h3>
                    <div className="flex items-center gap-4 mt-1">
                      <span className={`text-sm ${isDark ? 'text-emerald-200/60' : 'text-emerald-800/60'}`}>
                        {selectedReport.userId?.firstName} {selectedReport.userId?.lastName}
                      </span>
                      <span className={`text-sm ${isDark ? 'text-emerald-200/60' : 'text-emerald-800/60'}`}>
                        {format(new Date(selectedReport.date), 'EEEE, MMM d, yyyy')}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedReport(null)}
                    className={`p-2 rounded-lg transition-colors ${
                      isDark ? 'hover:bg-white/5' : 'hover:bg-emerald-50'
                    }`}
                  >
                    <FiXCircle size={20} />
                  </button>
                </div>

                <div className="space-y-3">
                  <Section title="Attendance & Preparation" icon={FiCheckCircle} section="attendance">
                    <div className="grid grid-cols-2 gap-1">
                      {Object.entries(selectedReport.attendance || {}).map(([key, value]) => (
                        <CheckboxView key={key} label={key.replace(/([A-Z])/g, ' $1').trim()} value={value} />
                      ))}
                    </div>
                  </Section>

                  <Section title="Content Production" icon={FiFileText} section="production">
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: 'Videos Recorded', value: selectedReport.contentProduction?.videosRecorded || 0 },
                        { label: 'Interviews Recorded', value: selectedReport.contentProduction?.interviewsRecorded || 0 },
                        { label: 'B-Roll Clips', value: selectedReport.contentProduction?.brollClipsCaptured || 0 },
                        { label: 'Photos Taken', value: selectedReport.contentProduction?.photosTaken || 0 },
                      ].map((item, index) => (
                        <div key={index} className={`p-2 rounded-lg text-center ${
                          isDark ? 'bg-[#032e1d]/40' : 'bg-emerald-50/50'
                        }`}>
                          <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-emerald-950'}`}>
                            {item.value}
                          </span>
                          <p className={`text-xs ${isDark ? 'text-emerald-200/40' : 'text-emerald-800/40'}`}>
                            {item.label}
                          </p>
                        </div>
                      ))}
                    </div>
                  </Section>

                  <Section title="Video Editing" icon={FiCheckCircle} section="editing">
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: 'Videos Edited', value: selectedReport.videoEditing?.videosEdited || 0 },
                        { label: 'Reels Produced', value: selectedReport.videoEditing?.reelsProduced || 0 },
                        { label: 'Thumbnails', value: selectedReport.videoEditing?.thumbnailsCreated || 0 },
                      ].map((item, index) => (
                        <div key={index} className={`p-2 rounded-lg text-center ${
                          isDark ? 'bg-[#032e1d]/40' : 'bg-emerald-50/50'
                        }`}>
                          <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-emerald-950'}`}>
                            {item.value}
                          </span>
                          <p className={`text-xs ${isDark ? 'text-emerald-200/40' : 'text-emerald-800/40'}`}>
                            {item.label}
                          </p>
                        </div>
                      ))}
                      <div className={`p-2 rounded-lg text-center ${
                        isDark ? 'bg-[#032e1d]/40' : 'bg-emerald-50/50'
                      }`}>
                        <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-emerald-950'}`}>
                          {selectedReport.videoEditing?.subtitlesAdded ? '✅' : '❌'}
                        </span>
                        <p className={`text-xs ${isDark ? 'text-emerald-200/40' : 'text-emerald-800/40'}`}>
                          Subtitles Added
                        </p>
                      </div>
                    </div>
                  </Section>

                  <Section title="TradEx TV Support" icon={FiCheckCircle} section="support">
                    <div className="grid grid-cols-2 gap-1">
                      {Object.entries(selectedReport.tradexSupport || {}).map(([key, value]) => (
                        <CheckboxView key={key} label={key.replace(/([A-Z])/g, ' $1').trim()} value={value} />
                      ))}
                    </div>
                  </Section>

                  <Section title="Equipment Management" icon={FiCheckCircle} section="equipment">
                    <div className="grid grid-cols-2 gap-1">
                      {Object.entries(selectedReport.equipmentManagement || {}).map(([key, value]) => (
                        <CheckboxView key={key} label={key.replace(/([A-Z])/g, ' $1').trim()} value={value} />
                      ))}
                    </div>
                  </Section>

                  <Section title="Learning & Improvement" icon={FiCheckCircle} section="learning">
                    <div className="grid grid-cols-2 gap-1">
                      {Object.entries(selectedReport.learningAndImprovement || {}).map(([key, value]) => (
                        <CheckboxView key={key} label={key.replace(/([A-Z])/g, ' $1').trim()} value={value} />
                      ))}
                    </div>
                  </Section>

                  <Section title="End of Day Report" icon={FiFileText} section="eod">
                    <div className="space-y-3">
                      <div>
                        <p className={`text-xs font-medium ${isDark ? 'text-emerald-200/50' : 'text-emerald-800/50'}`}>
                          Accomplishments
                        </p>
                        <p className={`text-sm p-3 rounded-lg ${
                          isDark ? 'bg-[#032e1d]/40 text-emerald-200/80' : 'bg-emerald-50/50 text-emerald-800/80'
                        }`}>
                          {selectedReport.eod?.accomplishments || 'Not provided'}
                        </p>
                      </div>
                      {selectedReport.eod?.challenges && (
                        <div>
                          <p className={`text-xs font-medium ${isDark ? 'text-emerald-200/50' : 'text-emerald-800/50'}`}>
                            Challenges
                          </p>
                          <p className={`text-sm p-3 rounded-lg ${
                            isDark ? 'bg-[#032e1d]/40 text-emerald-200/80' : 'bg-emerald-50/50 text-emerald-800/80'
                          }`}>
                            {selectedReport.eod.challenges}
                          </p>
                        </div>
                      )}
                      {selectedReport.eod?.supportRequired && (
                        <div>
                          <p className={`text-xs font-medium ${isDark ? 'text-emerald-200/50' : 'text-emerald-800/50'}`}>
                            Support Required
                          </p>
                          <p className={`text-sm p-3 rounded-lg ${
                            isDark ? 'bg-[#032e1d]/40 text-emerald-200/80' : 'bg-emerald-50/50 text-emerald-800/80'
                          }`}>
                            {selectedReport.eod.supportRequired}
                          </p>
                        </div>
                      )}
                    </div>
                  </Section>
                </div>

                <div className="mt-4 pt-4 border-t border-white/5">
                  <div>
                    <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-emerald-200/70' : 'text-emerald-800/70'}`}>
                      Feedback
                    </label>
                    <textarea
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-300 min-h-[80px] ${
                        isDark 
                          ? 'bg-[#032e1d]/40 border-white/10 focus:ring-emerald-500/50 focus:border-emerald-500/50 text-white placeholder-emerald-200/30' 
                          : 'bg-emerald-50/50 border-emerald-100 focus:ring-emerald-500/50 focus:border-emerald-500 text-emerald-950 placeholder-emerald-800/30'
                      }`}
                      placeholder="Add feedback for the employee..."
                    />
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleReview('approved')}
                      className="flex-1 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                    >
                      <FiCheckCircle size={18} />
                      Approve
                    </button>
                    <button
                      onClick={() => handleReview('revision_required')}
                      className="flex-1 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
                    >
                      <FiAlertCircle size={18} />
                      Revise
                    </button>
                    <button
                      onClick={() => handleReview('rejected')}
                      className="flex-1 py-2.5 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl shadow-lg shadow-rose-500/20 flex items-center justify-center gap-2"
                    >
                      <FiXCircle size={18} />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className={`p-12 text-center rounded-2xl ${
                isDark 
                  ? 'bg-[#032e1d]/40 border border-white/5' 
                  : 'bg-white/60 border border-emerald-100/50'
              } backdrop-blur-sm`}>
                <FiFileText size={48} className="mx-auto mb-4 opacity-30" />
                <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-emerald-950'}`}>
                  Select a Report
                </h3>
                <p className={`text-sm mt-1 ${isDark ? 'text-emerald-200/50' : 'text-emerald-800/50'}`}>
                  Choose a report from the list to review its complete details
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ReviewPipeline;