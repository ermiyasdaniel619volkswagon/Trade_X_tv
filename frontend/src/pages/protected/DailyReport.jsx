
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import api from '../../services/api.js';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import { 
  FiPlus, FiMinus, FiSave, FiClock, FiCheckCircle, 
  FiCamera, FiVideo, FiEdit, FiMic, FiFilm, FiCalendar,
  FiAward, FiTrendingUp, FiStar, FiUsers, FiMonitor,
  FiBookOpen
} from 'react-icons/fi';

const DailyReport = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [existingReport, setExistingReport] = useState(null);
  const [report, setReport] = useState({
    attendance: {
      reportedOnTime: false,
      uniformAndId: false,
      dailyPlanReviewed: false,
      equipmentInspected: false,
      cameraBatteriesChecked: false,
      memoryCardsChecked: false,
    },
    contentProduction: {
      videosRecorded: 0,
      interviewsRecorded: 0,
      brollClipsCaptured: 0,
      photosTaken: 0,
    },
    videoEditing: {
      videosEdited: 0,
      reelsProduced: 0,
      thumbnailsCreated: 0,
      subtitlesAdded: false,
    },
    tradexSupport: {
      studioProduction: false,
      presenterHost: false,
      livestreamPreparation: false,
      producerDirector: false,
    },
    equipmentManagement: {
      cameraCleaned: false,
      tripodsStored: false,
      microphonesChecked: false,
      filesBackedUp: false,
      studioOrganized: false,
    },
    learningAndImprovement: {
      attendedTraining: false,
      learnedNewSkill: false,
      reviewedFeedback: false,
    },
    eod: {
      accomplishments: '',
      challenges: '',
      supportRequired: '',
    },
  });

  useEffect(() => {
    loadTodayReport();
  }, []);

  const loadTodayReport = async () => {
    try {
      const response = await api.get('/reports/today');
      if (response.data.report) {
        setExistingReport(response.data.report);
        setReport(response.data.report);
      }
    } catch (error) {
      console.error('Failed to load today\'s report:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (section, field) => {
    setReport(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: !prev[section][field],
      },
    }));
  };

  const handleCounterChange = (section, field, delta) => {
    setReport(prev => {
      const current = typeof prev[section][field] === 'number' && !isNaN(prev[section][field]) 
        ? prev[section][field] 
        : 0;
      const newValue = Math.max(0, current + delta);
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [field]: newValue,
        },
      };
    });
  };

  const handleTextChange = (section, field, value) => {
    setReport(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const validateReport = () => {
    if (!report.eod.accomplishments || !report.eod.accomplishments.trim()) {
      toast.error('Please describe what you accomplished today');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateReport()) return;

    setSubmitting(true);
    try {
      const cleanReport = {
        ...report,
        contentProduction: {
          videosRecorded: Number(report.contentProduction.videosRecorded) || 0,
          interviewsRecorded: Number(report.contentProduction.interviewsRecorded) || 0,
          brollClipsCaptured: Number(report.contentProduction.brollClipsCaptured) || 0,
          photosTaken: Number(report.contentProduction.photosTaken) || 0,
        },
        videoEditing: {
          videosEdited: Number(report.videoEditing.videosEdited) || 0,
          reelsProduced: Number(report.videoEditing.reelsProduced) || 0,
          thumbnailsCreated: Number(report.videoEditing.thumbnailsCreated) || 0,
          subtitlesAdded: report.videoEditing.subtitlesAdded || false,
        },
      };

      const response = await api.post('/reports', cleanReport);
      toast.success(existingReport ? 'Report updated successfully!' : 'Report submitted successfully!');
      setExistingReport(response.data.report);
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Failed to submit report';
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className={isDark ? 'text-emerald-200/60' : 'text-emerald-800/60'}>Loading your report...</p>
        </div>
      </div>
    );
  }

  const Counter = ({ label, value, section, field, icon: Icon, color = 'from-emerald-500 to-teal-600' }) => {
    const displayValue = typeof value === 'number' && !isNaN(value) ? value : 0;
    
    return (
      <div className={`flex items-center justify-between p-4 rounded-xl transition-all duration-300 ${
        isDark ? 'bg-[#032e1d]/40 hover:bg-[#032e1d]/60' : 'bg-emerald-50/50 hover:bg-emerald-100/50'
      } border border-transparent hover:border-emerald-500/20`}>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-gradient-to-br ${color} shadow-lg shadow-emerald-900/10`}>
            {Icon && <Icon className="text-white" size={16} />}
          </div>
          <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-emerald-950'}`}>
            {label}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleCounterChange(section, field, -1)}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
              isDark 
                ? 'bg-white/5 hover:bg-white/10 text-emerald-200/60 hover:text-white' 
                : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-700 hover:text-emerald-950'
            }`}
          >
            <FiMinus size={14} />
          </button>
          <span className={`w-10 text-center font-bold text-lg ${isDark ? 'text-white' : 'text-emerald-950'}`}>
            {displayValue}
          </span>
          <button
            type="button"
            onClick={() => handleCounterChange(section, field, 1)}
            className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white transition-colors hover:scale-105 shadow-lg shadow-emerald-500/20"
          >
            <FiPlus size={14} />
          </button>
        </div>
      </div>
    );
  };

  const Checkbox = ({ label, checked, onChange, icon: Icon, color = 'from-emerald-500 to-teal-600' }) => (
    <label className={`flex items-center gap-3 cursor-pointer p-3 rounded-xl transition-all duration-300 ${
      isDark 
        ? 'hover:bg-[#032e1d]/40' 
        : 'hover:bg-emerald-50/50'
    } border border-transparent hover:border-emerald-500/20`}>
      <input
        type="checkbox"
        checked={checked || false}
        onChange={onChange}
        className="w-4 h-4 rounded border-2 border-emerald-500/30 text-emerald-600 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-[#032e1d] transition-all duration-200"
      />
      {Icon && <div className={`p-1.5 rounded-lg bg-gradient-to-br ${color} shadow-lg shadow-emerald-900/10`}>
        <Icon className="text-white" size={12} />
      </div>}
      <span className={`text-sm ${isDark ? 'text-white' : 'text-emerald-950'}`}>
        {label}
      </span>
    </label>
  );

  return (
    <>
      <Helmet>
        <title>Daily Report - TradeExTV</title>
      </Helmet>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className={`text-2xl md:text-3xl font-bold flex items-center gap-3 ${
              isDark ? 'text-white' : 'text-emerald-950'
            }`}>
              <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20">
                <FiCamera className="text-white" size={24} />
              </div>
              Daily Report
            </h1>
            <p className={`text-sm mt-1 ${isDark ? 'text-emerald-200/50' : 'text-emerald-800/50'}`}>
              {existingReport ? 'Update your daily log' : 'Log your daily activities'}
            </p>
          </div>
          {existingReport && (
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${
              isDark ? 'bg-amber-500/10 border border-amber-500/20' : 'bg-amber-50 border border-amber-200'
            }`}>
              <FiClock className="text-amber-500" size={16} />
              <span className={`text-sm font-medium ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>
                Status: {existingReport.status?.replace('_', ' ') || 'Pending'}
              </span>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className={`p-6 rounded-2xl ${
            isDark 
              ? 'bg-[#032e1d]/40 border border-white/5' 
              : 'bg-white/60 border border-emerald-100/50'
          } backdrop-blur-sm`}>
            <h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
              isDark ? 'text-white' : 'text-emerald-950'
            }`}>
              <span className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-emerald-500/20">
                A
              </span>
              Attendance & Preparation
            </h2>
            <div className="grid sm:grid-cols-2 gap-2">
              {Object.keys(report.attendance).map((field) => (
                <Checkbox
                  key={field}
                  label={field.replace(/([A-Z])/g, ' $1').trim()}
                  checked={report.attendance[field] || false}
                  onChange={() => handleCheckboxChange('attendance', field)}
                  icon={FiCheckCircle}
                />
              ))}
            </div>
          </div>

          <div className={`p-6 rounded-2xl ${
            isDark 
              ? 'bg-[#032e1d]/40 border border-white/5' 
              : 'bg-white/60 border border-emerald-100/50'
          } backdrop-blur-sm`}>
            <h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
              isDark ? 'text-white' : 'text-emerald-950'
            }`}>
              <span className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-blue-500/20">
                B
              </span>
              Content Production
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              <Counter
                label="Videos Recorded"
                value={report.contentProduction.videosRecorded}
                section="contentProduction"
                field="videosRecorded"
                icon={FiVideo}
                color="from-blue-500 to-cyan-600"
              />
              <Counter
                label="Interviews Recorded"
                value={report.contentProduction.interviewsRecorded}
                section="contentProduction"
                field="interviewsRecorded"
                icon={FiMic}
                color="from-purple-500 to-pink-600"
              />
              <Counter
                label="B-Roll Clips"
                value={report.contentProduction.brollClipsCaptured}
                section="contentProduction"
                field="brollClipsCaptured"
                icon={FiFilm}
                color="from-amber-500 to-orange-600"
              />
              <Counter
                label="Photos Taken"
                value={report.contentProduction.photosTaken}
                section="contentProduction"
                field="photosTaken"
                icon={FiCamera}
                color="from-rose-500 to-pink-600"
              />
            </div>
          </div>

          <div className={`p-6 rounded-2xl ${
            isDark 
              ? 'bg-[#032e1d]/40 border border-white/5' 
              : 'bg-white/60 border border-emerald-100/50'
          } backdrop-blur-sm`}>
            <h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
              isDark ? 'text-white' : 'text-emerald-950'
            }`}>
              <span className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-purple-500/20">
                C
              </span>
              Video Editing
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              <Counter
                label="Videos Edited"
                value={report.videoEditing.videosEdited}
                section="videoEditing"
                field="videosEdited"
                icon={FiEdit}
                color="from-purple-500 to-pink-600"
              />
              <Counter
                label="Reels/Shorts"
                value={report.videoEditing.reelsProduced}
                section="videoEditing"
                field="reelsProduced"
                icon={FiTrendingUp}
                color="from-emerald-500 to-teal-600"
              />
              <Counter
                label="Thumbnails"
                value={report.videoEditing.thumbnailsCreated}
                section="videoEditing"
                field="thumbnailsCreated"
                icon={FiStar}
                color="from-amber-500 to-orange-600"
              />
              <div className="flex items-center">
                <Checkbox
                  label="Subtitles Added"
                  checked={report.videoEditing.subtitlesAdded || false}
                  onChange={() => handleCheckboxChange('videoEditing', 'subtitlesAdded')}
                  icon={FiAward}
                  color="from-rose-500 to-pink-600"
                />
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-2xl ${
            isDark 
              ? 'bg-[#032e1d]/40 border border-white/5' 
              : 'bg-white/60 border border-emerald-100/50'
          } backdrop-blur-sm`}>
            <h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
              isDark ? 'text-white' : 'text-emerald-950'
            }`}>
              <span className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-amber-500/20">
                D
              </span>
              TradEx TV Support
            </h2>
            <div className="grid sm:grid-cols-2 gap-2">
              {Object.keys(report.tradexSupport).map((field) => (
                <Checkbox
                  key={field}
                  label={field.replace(/([A-Z])/g, ' $1').trim()}
                  checked={report.tradexSupport[field] || false}
                  onChange={() => handleCheckboxChange('tradexSupport', field)}
                  icon={FiUsers}
                  color="from-amber-500 to-orange-600"
                />
              ))}
            </div>
          </div>

          <div className={`p-6 rounded-2xl ${
            isDark 
              ? 'bg-[#032e1d]/40 border border-white/5' 
              : 'bg-white/60 border border-emerald-100/50'
          } backdrop-blur-sm`}>
            <h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
              isDark ? 'text-white' : 'text-emerald-950'
            }`}>
              <span className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-emerald-500/20">
                E
              </span>
              Equipment Management
            </h2>
            <div className="grid sm:grid-cols-2 gap-2">
              {Object.keys(report.equipmentManagement).map((field) => (
                <Checkbox
                  key={field}
                  label={field.replace(/([A-Z])/g, ' $1').trim()}
                  checked={report.equipmentManagement[field] || false}
                  onChange={() => handleCheckboxChange('equipmentManagement', field)}
                  icon={FiMonitor}
                  color="from-emerald-500 to-teal-600"
                />
              ))}
            </div>
          </div>

          <div className={`p-6 rounded-2xl ${
            isDark 
              ? 'bg-[#032e1d]/40 border border-white/5' 
              : 'bg-white/60 border border-emerald-100/50'
          } backdrop-blur-sm`}>
            <h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
              isDark ? 'text-white' : 'text-emerald-950'
            }`}>
              <span className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-rose-500/20">
                F
              </span>
              Learning & Improvement
            </h2>
            <div className="space-y-2">
              {Object.keys(report.learningAndImprovement).map((field) => (
                <Checkbox
                  key={field}
                  label={field.replace(/([A-Z])/g, ' $1').trim()}
                  checked={report.learningAndImprovement[field] || false}
                  onChange={() => handleCheckboxChange('learningAndImprovement', field)}
                  icon={FiBookOpen}
                  color="from-rose-500 to-pink-600"
                />
              ))}
            </div>
          </div>

          <div className={`p-6 rounded-2xl ${
            isDark 
              ? 'bg-[#032e1d]/40 border border-white/5' 
              : 'bg-white/60 border border-emerald-100/50'
          } backdrop-blur-sm`}>
            <h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
              isDark ? 'text-white' : 'text-emerald-950'
            }`}>
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20">
                <FiCalendar className="text-white" size={18} />
              </div>
              End of Day Report
            </h2>
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${
                  isDark ? 'text-emerald-200/70' : 'text-emerald-800/70'
                }`}>
                  What did I accomplish today?
                </label>
                <textarea
                  value={report.eod.accomplishments || ''}
                  onChange={(e) => handleTextChange('eod', 'accomplishments', e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-300 min-h-[100px] ${
                    isDark 
                      ? 'bg-[#032e1d]/40 border-white/10 focus:ring-emerald-500/50 focus:border-emerald-500/50 text-white placeholder-emerald-200/30' 
                      : 'bg-emerald-50/50 border-emerald-100 focus:ring-emerald-500/50 focus:border-emerald-500 text-emerald-950 placeholder-emerald-800/30'
                  }`}
                  placeholder="Describe your key achievements today..."
                  required
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${
                  isDark ? 'text-emerald-200/70' : 'text-emerald-800/70'
                }`}>
                  Challenges faced
                </label>
                <textarea
                  value={report.eod.challenges || ''}
                  onChange={(e) => handleTextChange('eod', 'challenges', e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-300 min-h-[80px] ${
                    isDark 
                      ? 'bg-[#032e1d]/40 border-white/10 focus:ring-emerald-500/50 focus:border-emerald-500/50 text-white placeholder-emerald-200/30' 
                      : 'bg-emerald-50/50 border-emerald-100 focus:ring-emerald-500/50 focus:border-emerald-500 text-emerald-950 placeholder-emerald-800/30'
                  }`}
                  placeholder="Any challenges you encountered..."
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${
                  isDark ? 'text-emerald-200/70' : 'text-emerald-800/70'
                }`}>
                  Support required
                </label>
                <textarea
                  value={report.eod.supportRequired || ''}
                  onChange={(e) => handleTextChange('eod', 'supportRequired', e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-300 min-h-[80px] ${
                    isDark 
                      ? 'bg-[#032e1d]/40 border-white/10 focus:ring-emerald-500/50 focus:border-emerald-500/50 text-white placeholder-emerald-200/30' 
                      : 'bg-emerald-50/50 border-emerald-100 focus:ring-emerald-500/50 focus:border-emerald-500 text-emerald-950 placeholder-emerald-800/30'
                  }`}
                  placeholder="What support do you need?"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl shadow-lg shadow-emerald-500/20 flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <FiSave size={18} />
                  {existingReport ? 'Update Report' : 'Submit Report'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default DailyReport;