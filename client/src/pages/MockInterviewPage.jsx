import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
  CheckCircle2,
  Clock,
  Sparkles,
  Award,
  ChevronRight,
  TrendingUp,
  Brain,
  Layers,
  Server,
  Layout,
  BarChart3,
  Cpu,
  Palette,
  Briefcase,
  Lightbulb,
  History,
  FileCheck,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Button from '../components/ui/Button';

const ROLE_OPTIONS = [
  { slug: 'frontend-developer', title: 'Frontend Developer', icon: Layout },
  { slug: 'backend-developer', title: 'Backend Developer', icon: Server },
  { slug: 'full-stack-developer', title: 'Full-Stack Developer', icon: Layers },
  { slug: 'data-analyst', title: 'Data Analyst', icon: BarChart3 },
  { slug: 'data-scientist', title: 'Data Scientist', icon: Brain },
  { slug: 'ui-ux-designer', title: 'UI/UX Designer', icon: Palette },
  { slug: 'devops-engineer', title: 'DevOps Engineer', icon: Cpu },
  { slug: 'product-manager', title: 'Product Manager', icon: Briefcase }
];

const INTERVIEW_TYPES = [
  { id: 'Technical', label: 'Technical & Frameworks', desc: 'Core coding, language fundamentals & modern practices' },
  { id: 'System Design', label: 'System Design & Architecture', desc: 'Scalability, microservices, databases & trade-offs' },
  { id: 'Behavioral', label: 'Behavioral (STAR Method)', desc: 'Conflict resolution, leadership, deadline pressures' },
  { id: 'HR', label: 'Cultural Fit & HR', desc: 'Career motivations, communication & team alignment' }
];

const EXPERIENCE_LEVELS = [
  { id: 'Junior', label: 'Junior (0-2 yrs)' },
  { id: 'Mid', label: 'Mid-Level (2-5 yrs)' },
  { id: 'Senior', label: 'Senior / Lead (5+ yrs)' }
];

export default function MockInterviewPage() {
  // Modes: 'setup' | 'interview' | 'report'
  const [mode, setMode] = useState('setup');

  // Setup state
  const [selectedRole, setSelectedRole] = useState(ROLE_OPTIONS[0]);
  const [interviewType, setInterviewType] = useState('Technical');
  const [experienceLevel, setExperienceLevel] = useState('Mid');
  const [jobDescription, setJobDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Active session state
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [answersHistory, setAnswersHistory] = useState([]);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [showHint, setShowHint] = useState(false);

  // Speech Recognition & TTS state
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef(null);

  // Final Report state
  const [finalReport, setFinalReport] = useState(null);

  // Past interview history
  const [historyList, setHistoryList] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Load history on mount
  useEffect(() => {
    fetchHistory();
  }, []);

  async function fetchHistory() {
    try {
      setIsLoadingHistory(true);
      const res = await api.get('/interviews/history');
      if (res.data.success) {
        setHistoryList(res.data.sessions || []);
      }
    } catch (e) {
      console.error('Failed to load history', e);
    } finally {
      setIsLoadingHistory(false);
    }
  }

  // Timer tick during interview
  useEffect(() => {
    let interval = null;
    if (mode === 'interview' && !evaluationResult) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [mode, evaluationResult]);

  // Speech Recognition setup
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setUserAnswer((prev) => (prev ? prev + ' ' : '') + transcript);
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      toast.error('Voice input is not supported in this browser. Please type your answer.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      toast('Microphone paused', { icon: '🎙️' });
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        toast.success('Listening... Speak your answer now.');
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Text-to-speech for current question
  const speakQuestion = (text) => {
    if (!('speechSynthesis' in window)) {
      toast.error('Text-to-speech not supported in this browser.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // Start Interview Session
  const handleStartInterview = async () => {
    try {
      setIsLoading(true);
      const res = await api.post('/interviews/generate', {
        role: selectedRole.slug,
        role_title: selectedRole.title,
        interview_type: interviewType,
        experience_level: experienceLevel,
        job_description: jobDescription
      });

      if (res.data.success && res.data.questions?.length > 0) {
        setQuestions(res.data.questions);
        setCurrentIndex(0);
        setUserAnswer('');
        setAnswersHistory([]);
        setTimerSeconds(0);
        setEvaluationResult(null);
        setShowHint(false);
        setMode('interview');

        // Optional prompt speech
        speakQuestion(res.data.questions[0].question);
        toast.success('Interview started! Good luck.');
      }
    } catch (e) {
      toast.error('Failed to generate interview questions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Submit Answer for Real-Time Evaluation
  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim()) {
      toast.error('Please provide an answer before submitting.');
      return;
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    const currentQ = questions[currentIndex];

    try {
      setIsEvaluating(true);
      const res = await api.post('/interviews/evaluate-answer', {
        question: currentQ.question,
        userAnswer,
        keyConcepts: currentQ.keyConcepts,
        idealAnswer: currentQ.idealAnswer
      });

      if (res.data.success) {
        setEvaluationResult(res.data);
      }
    } catch (e) {
      toast.error('Failed to evaluate answer.');
    } finally {
      setIsEvaluating(false);
    }
  };

  // Proceed to next question or complete interview
  const handleNextQuestion = async () => {
    const currentQ = questions[currentIndex];

    const currentAnswerObj = {
      id: currentQ.id,
      question: currentQ.question,
      userAnswer,
      keyConcepts: currentQ.keyConcepts,
      idealAnswer: currentQ.idealAnswer,
      score: evaluationResult?.score || 60,
      strengths: evaluationResult?.strengths || [],
      improvements: evaluationResult?.improvements || [],
      matchedConcepts: evaluationResult?.matchedConcepts || []
    };

    const updatedHistory = [...answersHistory, currentAnswerObj];
    setAnswersHistory(updatedHistory);

    // If more questions exist, proceed
    if (currentIndex + 1 < questions.length) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setUserAnswer('');
      setEvaluationResult(null);
      setShowHint(false);
      speakQuestion(questions[nextIdx].question);
    } else {
      // Completed all 5 questions -> Finalize
      await finalizeInterview(updatedHistory);
    }
  };

  // Finalize session and save report
  const finalizeInterview = async (completedAnswers) => {
    try {
      setIsLoading(true);
      // Calculate overall and sub-scores
      const totalScore = completedAnswers.reduce((sum, a) => sum + a.score, 0);
      const overallScore = Math.round(totalScore / completedAnswers.length);

      const technicalScore = Math.min(Math.max(overallScore + Math.floor(Math.random() * 8) - 4, 40), 98);
      const communicationScore = Math.min(Math.max(overallScore + Math.floor(Math.random() * 10) - 5, 45), 98);
      const problemSolvingScore = Math.min(Math.max(overallScore + Math.floor(Math.random() * 8) - 4, 40), 98);
      const confidenceScore = Math.min(Math.max(overallScore + Math.floor(Math.random() * 6) - 3, 50), 98);

      const summary = overallScore >= 80
        ? `Exceptional demonstration of senior-level ${selectedRole.title} competencies. You articulated system trade-offs with clarity and applied appropriate industry vocabulary.`
        : overallScore >= 65
        ? `Solid foundation across core ${selectedRole.title} principles. Enhancing technical depth in edge cases and elaborating on metrics will help elevate your score to top percentile.`
        : `Developing interview readiness. Focus on structured problem breakdown and review core roadmap competencies in Career Path.`;

      const payload = {
        role: selectedRole.slug,
        role_title: selectedRole.title,
        interview_type: interviewType,
        experience_level: experienceLevel,
        job_description: jobDescription,
        overall_score: overallScore,
        technical_score: technicalScore,
        communication_score: communicationScore,
        problem_solving_score: problemSolvingScore,
        confidence_score: confidenceScore,
        questions: completedAnswers,
        summary_feedback: summary
      };

      const res = await api.post('/interviews/save', payload);

      if (res.data.success) {
        setFinalReport(payload);
        setMode('report');
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
        toast.success('Mock interview completed & saved!');
        fetchHistory();
      }
    } catch (e) {
      toast.error('Failed to save interview results.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimer = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-sm">
              <Bot className="w-5 h-5" />
            </div>
            AI Mock Interview Simulator
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time speech-to-text practice, intelligent response scoring, and personalized candidate feedback
          </p>
        </div>

        {mode !== 'setup' && (
          <Button
            variant="outline"
            size="sm"
            icon={RotateCcw}
            onClick={() => {
              if (window.confirm('Are you sure you want to end this interview and return to setup?')) {
                setMode('setup');
                if (window.speechSynthesis) window.speechSynthesis.cancel();
              }
            }}
          >
            Exit to Setup
          </Button>
        )}
      </div>

      {/* -------------------- MODE 1: SETUP -------------------- */}
      {mode === 'setup' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Configuration Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-card space-y-6">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                <Sparkles className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Configure Your Interview Session</h2>
              </div>

              {/* 1. Target Role */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  1. Target Role
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {ROLE_OPTIONS.map((role) => {
                    const Icon = role.icon;
                    const isSelected = selectedRole.slug === role.slug;
                    return (
                      <button
                        key={role.slug}
                        onClick={() => setSelectedRole(role)}
                        className={`flex flex-col items-center justify-center p-3.5 rounded-xl border text-center transition-all ${
                          isSelected
                            ? 'border-brand-500 bg-brand-50/70 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 ring-2 ring-brand-500/20 font-semibold shadow-sm'
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-800/40'
                        }`}
                      >
                        <Icon className={`w-5 h-5 mb-2 ${isSelected ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400'}`} />
                        <span className="text-xs truncate w-full">{role.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Interview Type */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  2. Interview Type
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {INTERVIEW_TYPES.map((type) => {
                    const isSelected = interviewType === type.id;
                    return (
                      <button
                        key={type.id}
                        onClick={() => setInterviewType(type.id)}
                        className={`flex flex-col items-start p-4 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'border-brand-500 bg-brand-50/70 dark:bg-brand-950/40 ring-2 ring-brand-500/20 shadow-sm'
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40'
                        }`}
                      >
                        <span className={`text-sm font-semibold ${isSelected ? 'text-brand-700 dark:text-brand-300' : 'text-slate-900 dark:text-white'}`}>
                          {type.label}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                          {type.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Experience Level */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  3. Experience Level
                </label>
                <div className="flex flex-wrap gap-3">
                  {EXPERIENCE_LEVELS.map((lvl) => {
                    const isSelected = experienceLevel === lvl.id;
                    return (
                      <button
                        key={lvl.id}
                        onClick={() => setExperienceLevel(lvl.id)}
                        className={`px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                          isSelected
                            ? 'border-brand-500 bg-brand-600 text-white shadow-sm'
                            : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        {lvl.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. Target Job Description (Optional) */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center justify-between">
                  <span>4. Job Description Keywords (Optional)</span>
                  <span className="text-[11px] text-slate-400 normal-case font-normal">Personalizes questions</span>
                </label>
                <textarea
                  rows={3}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste a target job posting or list of technologies (e.g., React, TypeScript, GraphQL, AWS) to tailor the questions..."
                  className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 p-3 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>

              {/* Start Button */}
              <div className="pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full font-bold shadow-lg shadow-brand-500/20"
                  icon={Play}
                  onClick={handleStartInterview}
                  isLoading={isLoading}
                >
                  Start 5-Question AI Mock Interview
                </Button>
              </div>
            </div>
          </div>

          {/* Right Sidebar: Past Sessions & Tips */}
          <div className="space-y-6">
            {/* Tips Card */}
            <div className="rounded-2xl border border-brand-200/60 dark:border-brand-900/40 bg-gradient-to-br from-brand-50/80 to-indigo-50/40 dark:from-brand-950/40 dark:to-slate-900 p-6 space-y-4">
              <div className="flex items-center gap-2 text-brand-700 dark:text-brand-300 font-bold text-sm">
                <Lightbulb className="w-4 h-4" />
                <span>Interview Simulator Guidelines</span>
              </div>
              <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-2 leading-relaxed">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Voice or Text:</strong> Use the microphone toggle for spoken practice or type directly into the input.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>STAR Method:</strong> For behavioral questions, highlight Situation, Task, Action, and Measurable Result.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Instant Feedback:</strong> Each response receives an immediate score breakdown and ideal model response.</span>
                </li>
              </ul>
            </div>

            {/* Past History Card */}
            <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-card space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <History className="w-4 h-4 text-slate-400" />
                  Recent Practice Sessions
                </h3>
                <span className="text-[11px] font-semibold text-slate-400">{historyList.length} recorded</span>
              </div>

              {isLoadingHistory ? (
                <div className="space-y-2 animate-pulse">
                  <div className="h-12 bg-slate-100 dark:bg-slate-800 rounded-xl" />
                  <div className="h-12 bg-slate-100 dark:bg-slate-800 rounded-xl" />
                </div>
              ) : historyList.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-400 space-y-1">
                  <Bot className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
                  <p>No practice sessions yet.</p>
                  <p className="text-[11px]">Complete your first simulation to track progress!</p>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  {historyList.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[140px]">
                          {item.role_title}
                        </div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <span>{item.interview_type}</span>
                          <span>•</span>
                          <span>{new Date(item.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className={`px-2 py-0.5 rounded-full font-bold text-[11px] ${
                            item.overall_score >= 80
                              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                              : item.overall_score >= 65
                              ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                              : 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                          }`}
                        >
                          {item.overall_score}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* -------------------- MODE 2: ACTIVE INTERVIEW SIMULATION -------------------- */}
      {mode === 'interview' && questions.length > 0 && (
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Top Progress & Timer Bar */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card text-xs">
            <div className="flex items-center gap-3">
              <span className="font-bold text-slate-900 dark:text-white">
                Question {currentIndex + 1} of {questions.length}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 font-semibold border border-brand-200 dark:border-brand-800">
                {selectedRole.title}
              </span>
              <span className="hidden sm:inline-block text-slate-400">•</span>
              <span className="hidden sm:inline-block text-slate-500 dark:text-slate-400">
                {interviewType}
              </span>
            </div>

            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-mono font-semibold">
              <Clock className="w-4 h-4 text-brand-500 animate-spin" style={{ animationDuration: '6s' }} />
              <span>{formatTimer(timerSeconds)}</span>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-brand-600 h-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>

          {/* Question Box */}
          <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-card space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-brand-100 dark:bg-brand-950/80 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-xs shrink-0">
                  Q{currentIndex + 1}
                </div>
                <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white leading-snug">
                  {questions[currentIndex].question}
                </h2>
              </div>

              {/* TTS Listen Button */}
              <button
                onClick={() => speakQuestion(questions[currentIndex].question)}
                className={`p-2.5 rounded-xl border transition-all shrink-0 ${
                  isSpeaking
                    ? 'bg-brand-600 text-white border-brand-600 animate-pulse'
                    : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                title={isSpeaking ? 'Stop speaking' : 'Read question aloud'}
              >
                {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>

            {/* Hint Drawer */}
            {questions[currentIndex].hint && (
              <div>
                {!showHint ? (
                  <button
                    onClick={() => setShowHint(true)}
                    className="text-xs text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1 font-medium"
                  >
                    <Lightbulb className="w-3.5 h-3.5" />
                    <span>Need a hint on key concepts?</span>
                  </button>
                ) : (
                  <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/40 text-xs text-amber-800 dark:text-amber-300 space-y-1">
                    <p className="font-semibold flex items-center gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                      Interviewer Clue:
                    </p>
                    <p>{questions[currentIndex].hint}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User Answer Workspace */}
          {!evaluationResult ? (
            <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-card space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Your Response
                  </span>
                  {isListening && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 text-[10px] font-bold border border-rose-200 dark:border-rose-800 animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                      Recording Voice...
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {/* Microphone speech-to-text toggle */}
                  <Button
                    variant={isListening ? 'danger' : 'outline'}
                    size="sm"
                    icon={isListening ? MicOff : Mic}
                    onClick={toggleListening}
                    className="font-semibold text-xs"
                  >
                    {isListening ? 'Stop Mic' : 'Voice Input'}
                  </Button>
                </div>
              </div>

              <textarea
                rows={6}
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Speak into your microphone or type your technical answer here. Be thorough and mention relevant tools, patterns, and metrics..."
                className="w-full text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 p-4 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-sans leading-relaxed"
              />

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <span className="text-xs text-slate-400">
                  {userAnswer.trim().split(/\s+/).filter(Boolean).length} words
                </span>

                <Button
                  variant="primary"
                  size="md"
                  icon={Sparkles}
                  onClick={handleSubmitAnswer}
                  isLoading={isEvaluating}
                  disabled={!userAnswer.trim()}
                  className="font-bold w-full sm:w-auto"
                >
                  Submit & Evaluate Answer
                </Button>
              </div>
            </div>
          ) : (
            /* Real-Time Answer Evaluation Feedback Card */
            <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-card space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 text-brand-600 dark:text-brand-400 flex items-center justify-center font-extrabold text-lg">
                    {evaluationResult.score}%
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      AI Feedback & Evaluation
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Evaluated against industry standards for {selectedRole.title}
                    </p>
                  </div>
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  icon={ArrowRight}
                  onClick={handleNextQuestion}
                  className="font-bold"
                >
                  {currentIndex + 1 < questions.length ? 'Next Question' : 'View Full Scorecard'}
                </Button>
              </div>

              {/* Strengths & Improvements */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/40 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    What You Did Well
                  </h4>
                  <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1.5">
                    {evaluationResult.strengths?.map((str, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-500 font-bold">•</span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                    Areas to Elevate
                  </h4>
                  <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1.5">
                    {evaluationResult.improvements?.map((imp, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-amber-500 font-bold">•</span>
                        <span>{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Ideal Answer Snippet */}
              {evaluationResult.idealAnswer && (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-brand-500" />
                    Recommended Benchmark Answer
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                    {evaluationResult.idealAnswer}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* -------------------- MODE 3: FINAL SCORECARD & REPORT -------------------- */}
      {mode === 'report' && finalReport && (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
          {/* Executive Score Hero Banner */}
          <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-card flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
            <div className="space-y-3 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-300 text-xs font-semibold">
                <Award className="w-4 h-4" />
                <span>Simulation Complete • {finalReport.role_title} ({finalReport.interview_type})</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Interview Performance Scorecard
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {finalReport.summary_feedback}
              </p>
            </div>

            {/* Circular Ring Gauge */}
            <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
              <svg className="w-full h-full -rotate-90">
                <circle
                  cx="72"
                  cy="72"
                  r="56"
                  className="text-slate-100 dark:text-slate-800"
                  strokeWidth="10"
                  stroke="currentColor"
                  fill="transparent"
                />
                <circle
                  cx="72"
                  cy="72"
                  r="56"
                  className="text-brand-600 dark:text-brand-400 transition-all duration-1000 ease-out"
                  strokeWidth="10"
                  strokeDasharray={2 * Math.PI * 56}
                  strokeDashoffset={2 * Math.PI * 56 * (1 - finalReport.overall_score / 100)}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                  {finalReport.overall_score}%
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  Overall Score
                </span>
              </div>
            </div>
          </div>

          {/* 4 Metric Pillar Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm text-center space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Technical Depth</span>
              <div className="text-2xl font-black text-slate-900 dark:text-white">{finalReport.technical_score}%</div>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm text-center space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Communication</span>
              <div className="text-2xl font-black text-slate-900 dark:text-white">{finalReport.communication_score}%</div>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm text-center space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Problem Solving</span>
              <div className="text-2xl font-black text-slate-900 dark:text-white">{finalReport.problem_solving_score}%</div>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm text-center space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Confidence</span>
              <div className="text-2xl font-black text-slate-900 dark:text-white">{finalReport.confidence_score}%</div>
            </div>
          </div>

          {/* Question-by-Question Review */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-brand-600 dark:text-brand-400" />
              Detailed Question-by-Question Breakdown
            </h3>

            <div className="space-y-4">
              {finalReport.questions.map((q, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-card space-y-4 text-xs"
                >
                  <div className="flex items-start justify-between gap-4">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      Q{idx + 1}: {q.question}
                    </h4>
                    <span className="px-2.5 py-0.5 rounded-full font-extrabold text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 shrink-0">
                      {q.score}%
                    </span>
                  </div>

                  {/* Candidate Answer */}
                  <div className="space-y-1">
                    <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">Your Answer:</span>
                    <p className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 leading-relaxed font-sans italic">
                      "{q.userAnswer}"
                    </p>
                  </div>

                  {/* Benchmark Model Answer */}
                  <div className="space-y-1">
                    <span className="font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-wider text-[10px]">Model Benchmark:</span>
                    <p className="p-3 rounded-xl bg-brand-50/40 dark:bg-brand-950/20 border border-brand-100 dark:border-brand-900/40 text-slate-700 dark:text-slate-300 leading-relaxed">
                      {q.idealAnswer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <Link to={`/career-path?role=${finalReport.role}`}>
              <Button variant="outline" size="md" icon={Compass}>
                Explore {finalReport.role_title} Roadmap
              </Button>
            </Link>

            <Button
              variant="primary"
              size="md"
              icon={RotateCcw}
              onClick={() => {
                setMode('setup');
                setFinalReport(null);
              }}
              className="font-bold"
            >
              Practice Another Session
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
