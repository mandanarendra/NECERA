import React, { useState, useMemo } from 'react';
import { LearningModule, AcademicYear } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { neceraStore } from '../../services/store';
import { ProgressBar } from '../common/ProgressBar';
import {
  Search,
  BookOpen,
  Clock,
  User,
  Star,
  Users,
  ChevronRight,
  Sparkles,
  GraduationCap,
  Filter,
  CheckCircle2,
  Info,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface ModulesViewProps {
  onSelectModule: (moduleId: string) => void;
  onOpenRoadmap: () => void;
}

export const ModulesView: React.FC<ModulesViewProps> = ({
  onSelectModule,
  onOpenRoadmap,
}) => {
  const { currentUser } = useAuth();
  const [modules] = useState<LearningModule[]>(() => neceraStore.getModules());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');

  const studentYear = currentUser?.year || '1st Year';

  const academicYears = ['All', '1st Year', '2nd Year', '3rd Year', '4th Year'];

  const categories = [
    'All',
    'AI & Machine Learning',
    'Programming',
    'Web Development',
    'Systems & Full Stack',
    'Data Science',
    'Cloud & DevOps',
    'Cybersecurity',
  ];

  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const filteredModules = useMemo(() => {
    return modules.filter((m) => {
      const matchesSearch =
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (m.skillsLearned && m.skillsLearned.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())));

      const matchesYear =
        selectedYear === 'All' || m.recommendedYear === selectedYear || m.recommendedYear === 'All Years';

      const matchesCategory = selectedCategory === 'All' || m.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'All' || m.difficulty === selectedDifficulty;

      return matchesSearch && matchesYear && matchesCategory && matchesDifficulty;
    });
  }, [modules, searchQuery, selectedYear, selectedCategory, selectedDifficulty]);

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-200">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 mb-1">
            <GraduationCap className="w-4 h-4" />
            <span>Curriculum Catalog & Course Discovery</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-400">Current Student: {studentYear}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Engineering Learning Tracks & Modules
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
            Curricula organized from 1st Year foundations to 4th Year advanced capstones.
            Academic year serves as a recommendation — you are encouraged to explore courses across all 4 years.
          </p>
        </div>

        <button
          onClick={onOpenRoadmap}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors flex items-center gap-2 self-start md:self-auto shrink-0 shadow-lg shadow-indigo-600/20"
        >
          <Sparkles className="w-4 h-4" />
          <span>Active Concept Roadmap</span>
        </button>
      </div>

      {/* Year = Recommendation Level Guidance Banner */}
      <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-800/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-white">
              Recommendation Engine Active: {studentYear} Priority
            </div>
            <div className="text-slate-300 mt-0.5">
              Courses highlighted with <span className="text-indigo-400 font-semibold">Recommended for You</span> align with your year and branch, but all modules are open to enroll.
            </div>
          </div>
        </div>

        <button
          onClick={() => setSelectedYear(studentYear)}
          className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors shrink-0 flex items-center gap-1.5"
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Show My Year Courses</span>
        </button>
      </div>

      {/* Year Filter Tabs */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1 hidden sm:inline">
            Year:
          </div>
          {academicYears.map((yr) => {
            const isSelected = selectedYear === yr;
            const isStudentYear = yr === studentYear;
            return (
              <button
                key={yr}
                onClick={() => setSelectedYear(yr)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                    : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                <span>{yr}</span>
                {isStudentYear && (
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

        {/* Search and Secondary Filter Row */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by course title, skills, faculty, or topic..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Category Dropdown */}
          <div className="sm:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  Category: {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty Dropdown */}
          <div className="sm:col-span-3">
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
            >
              {difficulties.map((diff) => (
                <option key={diff} value={diff}>
                  Difficulty: {diff}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModules.map((module) => {
          const isRecommendedForStudent = module.recommendedYear === studentYear;

          return (
            <div
              key={module.id}
              className={`rounded-2xl border transition-all flex flex-col justify-between overflow-hidden group hover:border-indigo-500/80 hover:shadow-xl hover:shadow-indigo-500/10 ${
                isRecommendedForStudent
                  ? 'bg-slate-900/90 border-indigo-500/40'
                  : 'bg-slate-900/60 border-slate-800'
              }`}
            >
              <div>
                {/* Thumbnail Header */}
                <div className="relative h-44 w-full overflow-hidden bg-slate-950">
                  <img
                    src={module.thumbnail}
                    alt={module.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent" />

                  {/* Badges on Thumbnail */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    {module.recommendedYear && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-950/80 backdrop-blur-md text-indigo-300 border border-indigo-500/30">
                        {module.recommendedYear}
                      </span>
                    )}
                    {isRecommendedForStudent && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/90 text-slate-950 font-bold shadow-md shadow-emerald-500/20">
                        Recommended for You
                      </span>
                    )}
                  </div>

                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-950/80 backdrop-blur-md text-slate-300 border border-slate-800">
                      {module.difficulty}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-slate-300">
                    <span className="font-mono text-[11px] text-indigo-300">
                      {module.category}
                    </span>
                    <span className="flex items-center gap-1 font-mono text-[11px]">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {module.estimatedHours}h syllabus
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
                    {module.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {module.description}
                  </p>

                  {/* Skills tags */}
                  {module.skillsLearned && module.skillsLearned.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {module.skillsLearned.slice(0, 3).map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-slate-950/80 border border-slate-800 text-[10px] font-mono text-slate-400"
                        >
                          {skill}
                        </span>
                      ))}
                      {module.skillsLearned.length > 3 && (
                        <span className="text-[10px] text-slate-500 self-center">
                          +{module.skillsLearned.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Instructor & Meta */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-1.5 truncate max-w-[180px]">
                      <User className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="truncate">{module.instructor}</span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-400 font-mono text-xs shrink-0">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span>{module.rating}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer Action */}
              <div className="p-5 pt-0">
                <button
                  onClick={() => onSelectModule(module.id)}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white font-semibold text-xs transition-all flex items-center justify-center gap-1.5 group/btn cursor-pointer"
                >
                  <span>Explore Concept Roadmap</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredModules.length === 0 && (
        <div className="p-12 text-center rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
          <BookOpen className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No courses match your filter criteria</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Try resetting your search query or switching to "All Years" to explore the full curriculum.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedYear('All');
              setSelectedCategory('All');
              setSelectedDifficulty('All');
            }}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}

    </div>
  );
};
