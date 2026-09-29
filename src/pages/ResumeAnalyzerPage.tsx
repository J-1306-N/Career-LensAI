import React, { useState } from 'react';
import {
  FileText,
  Upload,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Plus,
  X,
  ShieldCheck,
  RefreshCw,
  FolderGit2,
  Award,
  GraduationCap,
  Briefcase,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { extractResumeWithAI } from '../services/aiService';
import { DEMO_RESUME_TEXT } from '../data/demoData';
import { ExtractedResumeData, ProficiencyLevel } from '../types';

export const ResumeAnalyzerPage: React.FC = () => {
  const {
    extractedResume,
    setExtractedResume,
    bulkAddSkillsFromResume,
    setActiveTab,
    showToast,
  } = useApp();

  const [rawText, setRawText] = useState(DEMO_RESUME_TEXT);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string>('jeffry_a_resume.txt');
  const [activeTabSub, setActiveTabSub] = useState<'upload' | 'text'>('upload');

  // Editable local state for detected skills before committing
  const [editableLanguages, setEditableLanguages] = useState<string[]>([]);
  const [editableDatabases, setEditableDatabases] = useState<string[]>([]);
  const [editableTools, setEditableTools] = useState<string[]>([]);
  const [editableFrameworks, setEditableFrameworks] = useState<string[]>([]);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState<'lang' | 'db' | 'tool' | 'fw'>('lang');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);

    // If text-like or readable by FileReader
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setRawText(content);
        showToast(`Loaded ${file.name}. Click "Analyze Resume with AI" to extract.`);
      }
    };

    if (file.name.endsWith('.txt') || file.name.endsWith('.md')) {
      reader.readAsText(file);
    } else {
      // For PDF/DOCX where browser binary text reading is approximated
      reader.readAsText(file);
      showToast(`Ingested ${file.name}. Raw text ready for AI extraction.`);
    }
  };

  const handleLoadSampleResume = () => {
    setRawText(DEMO_RESUME_TEXT);
    setUploadedFileName('jeffry_a_sample_resume.txt');
    showToast('Loaded demo student resume for Jeffry A (Data Analyst)');
  };

  const handleRunAnalysis = async () => {
    if (!rawText.trim()) {
      showToast('Please upload or paste resume text', 'error');
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await extractResumeWithAI(rawText);
      setExtractedResume(result);
      setEditableLanguages(result.programming_languages || []);
      setEditableDatabases(result.databases || []);
      setEditableTools(result.data_tools || []);
      setEditableFrameworks(result.frameworks || []);
      showToast('Resume successfully parsed! Review detected skills below.');
    } catch (err) {
      showToast('Error analyzing resume. Please retry.', 'error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAddCustomDetectedSkill = () => {
    if (!newSkillInput.trim()) return;
    const val = newSkillInput.trim();
    if (newSkillCategory === 'lang') setEditableLanguages([...editableLanguages, val]);
    else if (newSkillCategory === 'db') setEditableDatabases([...editableDatabases, val]);
    else if (newSkillCategory === 'tool') setEditableTools([...editableTools, val]);
    else setEditableFrameworks([...editableFrameworks, val]);

    setNewSkillInput('');
    showToast(`Added ${val} to detected list`);
  };

  const handleRemoveSkill = (category: 'lang' | 'db' | 'tool' | 'fw', skillName: string) => {
    if (category === 'lang') setEditableLanguages(editableLanguages.filter((s) => s !== skillName));
    else if (category === 'db') setEditableDatabases(editableDatabases.filter((s) => s !== skillName));
    else if (category === 'tool') setEditableTools(editableTools.filter((s) => s !== skillName));
    else setEditableFrameworks(editableFrameworks.filter((s) => s !== skillName));
  };

  const handleCommitSkillsToProfile = () => {
    const combined: Array<{ name: string; category: string; proficiency: ProficiencyLevel }> = [];

    editableLanguages.forEach((l) => combined.push({ name: l, category: 'Language', proficiency: 'Beginner' }));
    editableDatabases.forEach((d) => combined.push({ name: d, category: 'Database', proficiency: 'Beginner' }));
    editableTools.forEach((t) => combined.push({ name: t, category: 'Data Tool', proficiency: 'Beginner' }));
    editableFrameworks.forEach((f) => combined.push({ name: f, category: 'Framework', proficiency: 'Beginner' }));

    bulkAddSkillsFromResume(combined);
    setActiveTab('gap-analysis');
  };

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Entity Extraction Engine</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
            Resume Analyzer
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Ingest your academic resume, extract verified competencies, and sync them directly to your career gap model.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleLoadSampleResume}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
            <span>Load Demo Resume</span>
          </button>
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex items-start gap-3 text-xs text-slate-600">
        <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-slate-800">Student Privacy Notice:</strong> Resume content is processed exclusively in-memory for career skill extraction and roadmap calculation. We do not sell or store personal identity data. API keys are handled strictly via server-side environment configurations.
        </div>
      </div>

      {/* Ingestion Methods: Upload / Paste */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Dropzone */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Upload className="w-4 h-4 text-indigo-600" />
              Upload Document (PDF, DOCX, TXT)
            </h3>
            <span className="text-[10px] font-mono text-slate-400">File Ingestion</span>
          </div>

          <label className="border-2 border-dashed border-slate-200 hover:border-indigo-400 bg-slate-50 hover:bg-indigo-50/20 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all group">
            <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-slate-200 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform mb-3">
              <FileText className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-slate-800">
              {uploadedFileName ? uploadedFileName : 'Click to select or drag and drop your resume'}
            </span>
            <span className="text-[11px] text-slate-400 mt-1">
              Supports .pdf, .docx, .txt (up to 5MB)
            </span>
            <input
              type="file"
              accept=".pdf,.docx,.doc,.txt,.rtf"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
            <span>Sample ready: <strong>Jeffry A (Data Analyst)</strong></span>
            <button
              onClick={handleLoadSampleResume}
              className="text-indigo-600 hover:underline font-semibold"
            >
              Paste Demo
            </button>
          </div>
        </div>

        {/* Raw Text Fallback Editor */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-sky-600" />
              Direct Text Editor / Fallback
            </h3>
            <span className="text-[10px] font-mono text-slate-400">
              {rawText.length} characters
            </span>
          </div>

          <textarea
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            rows={7}
            placeholder="Paste your resume or CV text here..."
            className="w-full text-xs font-mono p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />

          <button
            onClick={handleRunAnalysis}
            disabled={isAnalyzing}
            className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Extracting Skills with Gemini AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Analyze Resume with AI</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Extracted Information Preview & Editable Skill Tags */}
      {extractedResume && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <h2 className="text-lg font-bold text-slate-900">
                  Extracted Resume Competencies
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Review and remove or add skills before finalizing your Career Gap Analysis.
              </p>
            </div>

            <button
              onClick={handleCommitSkillsToProfile}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <span>Commit Skills to Gap Analysis</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Extracted Groups */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Programming Languages */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
              <div className="text-xs font-bold text-slate-800 flex items-center justify-between">
                <span>Programming Languages</span>
                <span className="text-[10px] font-mono text-slate-400">
                  {editableLanguages.length}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 min-h-[40px]">
                {editableLanguages.map((lang) => (
                  <span
                    key={lang}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-800 shadow-2xs"
                  >
                    <span>{lang}</span>
                    <button
                      onClick={() => handleRemoveSkill('lang', lang)}
                      className="text-slate-400 hover:text-rose-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Databases */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
              <div className="text-xs font-bold text-slate-800 flex items-center justify-between">
                <span>Databases</span>
                <span className="text-[10px] font-mono text-slate-400">
                  {editableDatabases.length}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 min-h-[40px]">
                {editableDatabases.map((db) => (
                  <span
                    key={db}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-800 shadow-2xs"
                  >
                    <span>{db}</span>
                    <button
                      onClick={() => handleRemoveSkill('db', db)}
                      className="text-slate-400 hover:text-rose-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Data & Analytics Tools */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
              <div className="text-xs font-bold text-slate-800 flex items-center justify-between">
                <span>Data & Analytics Tools</span>
                <span className="text-[10px] font-mono text-slate-400">
                  {editableTools.length}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 min-h-[40px]">
                {editableTools.map((tool) => (
                  <span
                    key={tool}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-800 shadow-2xs"
                  >
                    <span>{tool}</span>
                    <button
                      onClick={() => handleRemoveSkill('tool', tool)}
                      className="text-slate-400 hover:text-rose-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Frameworks & Cloud */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
              <div className="text-xs font-bold text-slate-800 flex items-center justify-between">
                <span>Frameworks & DevOps</span>
                <span className="text-[10px] font-mono text-slate-400">
                  {editableFrameworks.length}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 min-h-[40px]">
                {editableFrameworks.map((fw) => (
                  <span
                    key={fw}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-800 shadow-2xs"
                  >
                    <span>{fw}</span>
                    <button
                      onClick={() => handleRemoveSkill('fw', fw)}
                      className="text-slate-400 hover:text-rose-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Manual Add Row */}
          <div className="p-3.5 rounded-xl bg-indigo-50/50 border border-indigo-100 flex flex-col sm:flex-row items-center gap-2">
            <span className="text-xs font-semibold text-slate-700 whitespace-nowrap">
              Missed a skill?
            </span>
            <input
              type="text"
              value={newSkillInput}
              onChange={(e) => setNewSkillInput(e.target.value)}
              placeholder="e.g. Scikit-Learn, Docker, Power BI"
              className="flex-1 text-xs px-3 py-1.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomDetectedSkill())}
            />
            <select
              value={newSkillCategory}
              onChange={(e) => setNewSkillCategory(e.target.value as any)}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
            >
              <option value="lang">Language</option>
              <option value="db">Database</option>
              <option value="tool">Data Tool</option>
              <option value="fw">Framework/Cloud</option>
            </select>
            <button
              onClick={handleAddCustomDetectedSkill}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add
            </button>
          </div>

          {/* Extracted Projects, Education & Experience Preview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl border border-slate-200 space-y-2">
              <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                <FolderGit2 className="w-4 h-4 text-indigo-600" />
                Detected Projects ({extractedResume.projects?.length || 0})
              </h4>
              <div className="space-y-2 max-h-36 overflow-y-auto">
                {extractedResume.projects?.map((p, idx) => (
                  <div key={idx} className="text-xs p-2 rounded-lg bg-slate-50 space-y-1">
                    <div className="font-semibold text-slate-800">{p.title}</div>
                    <p className="text-[11px] text-slate-500 line-clamp-2">{p.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 space-y-2">
              <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-emerald-600" />
                Education History
              </h4>
              <div className="space-y-2 max-h-36 overflow-y-auto">
                {extractedResume.education?.map((edu, idx) => (
                  <div key={idx} className="text-xs p-2 rounded-lg bg-slate-50 space-y-0.5">
                    <div className="font-semibold text-slate-800">{edu.degree}</div>
                    <div className="text-[11px] text-slate-500">{edu.institution}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{edu.year_or_status}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 space-y-2">
              <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-600" />
                Certifications & Soft Skills
              </h4>
              <div className="space-y-1 max-h-36 overflow-y-auto text-xs text-slate-600">
                {extractedResume.certifications?.map((c, idx) => (
                  <div key={idx} className="p-1.5 rounded bg-slate-50 text-[11px]">
                    • {c}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
