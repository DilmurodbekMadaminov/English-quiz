
import React, { useState, useEffect } from 'react';
import { allQuestions, getQuestionsByVariant, totalVariants } from './data/questions';
import { QuizState } from './types';
import { 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  LayoutGrid, 
  Trophy, 
  Zap, 
  ChevronRight, 
  ArrowLeft,
  Bot,
  User,
  HelpCircle
} from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<QuizState>({
    selectedVariant: null,
    currentQuestionIndex: 0,
    score: 0,
    showResults: false,
    userAnswers: [],
    isStarted: false,
  });

  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showQuestion, setShowQuestion] = useState(false);

  useEffect(() => {
    if (state.isStarted && !state.showResults) {
      setShowQuestion(false);
      const timer = setTimeout(() => setShowQuestion(true), 150);
      return () => clearTimeout(timer);
    }
  }, [state.currentQuestionIndex, state.isStarted, state.showResults]);

  const selectVariant = (variant: number) => {
    const questions = getQuestionsByVariant(variant);
    setState({
      selectedVariant: variant,
      currentQuestionIndex: 0,
      score: 0,
      showResults: false,
      userAnswers: Array(questions.length).fill(null),
      isStarted: true,
    });
    setIsAnswered(false);
    setSelectedOption(null);
  };

  const currentQuestions = state.selectedVariant ? getQuestionsByVariant(state.selectedVariant) : [];
  const currentQuestion = currentQuestions[state.currentQuestionIndex];

  const handleOptionSelect = (idx: number) => {
    if (isAnswered) return;
    if (!currentQuestion) return;
    
    setSelectedOption(idx);
    setIsAnswered(true);
    
    const isCorrect = idx === currentQuestion.correctAnswer;
    if (isCorrect) {
      setState(prev => ({ ...prev, score: prev.score + 1 }));
    }

    // Auto-advance after delay for bot feeling
    setTimeout(() => {
      handleNext();
    }, 1500);
  };

  const handleNext = () => {
    setState(prev => {
      if (prev.showResults || !prev.isStarted || !prev.selectedVariant) return prev;
      const questions = getQuestionsByVariant(prev.selectedVariant);
      
      if (prev.currentQuestionIndex + 1 < questions.length) {
        return {
          ...prev,
          currentQuestionIndex: prev.currentQuestionIndex + 1
        };
      } else {
        return { ...prev, showResults: true };
      }
    });

    setIsAnswered(false);
    setSelectedOption(null);
  };

  const resetToHome = () => {
    setState({
      selectedVariant: null,
      currentQuestionIndex: 0,
      score: 0,
      showResults: false,
      userAnswers: [],
      isStarted: false,
    });
  };

  if (!state.isStarted) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 md:p-8 flex items-center justify-center font-sans">
        <div className="max-w-4xl w-full">
          <header className="mb-12 text-center">
            <div className="inline-flex p-5 bg-indigo-600 rounded-3xl mb-6 shadow-2xl shadow-indigo-200 ring-8 ring-indigo-50">
              <Bot className="text-white w-12 h-12" />
            </div>
            <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Business & English Master</h1>
            <p className="text-slate-500 font-medium text-lg">500 ta yakuniy test savollari jamlanmasi</p>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: totalVariants }, (_, i) => i + 1).map(v => {
              const qCount = getQuestionsByVariant(v).length;
              return (
              <button
                key={v}
                onClick={() => selectVariant(v)}
                className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-indigo-400 transition-all text-left flex items-center gap-5 group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
                  <LayoutGrid className="w-12 h-12 text-indigo-900" />
                </div>
                <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center group-hover:bg-indigo-600 transition-all">
                  <span className="text-indigo-600 group-hover:text-white font-black text-2xl">{v}</span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-xl">Variant {v}</h3>
                  <p className="text-sm text-slate-400 font-bold uppercase tracking-wider">{qCount} savol</p>
                </div>
              </button>
            )})}
          </div>
          
          <footer className="mt-16 text-center border-t border-slate-200 pt-8">
            <p className="text-xs text-slate-400 uppercase tracking-[0.2em] font-black">Powered by AI Studio Engine • v2.0</p>
          </footer>
        </div>
      </div>
    );
  }

  if (state.showResults) {
    const totalQ = currentQuestions.length;
    const percentage = totalQ > 0 ? Math.round((state.score / totalQ) * 100) : 0;
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full bg-white rounded-[3rem] shadow-2xl p-10 text-center relative overflow-hidden border border-slate-100">
          <div className="absolute top-0 left-0 w-full h-3 bg-indigo-600"></div>
          <div className="mb-8 inline-block p-8 bg-indigo-50 rounded-full text-indigo-600 shadow-inner">
            <Trophy className="w-20 h-20" />
          </div>
          <h2 className="text-4xl font-black text-slate-900 mb-2">Ajoyib!</h2>
          <p className="text-slate-500 mb-10 font-medium text-lg">Variant {state.selectedVariant} yakunlandi</p>
          
          <div className="flex justify-center items-center gap-8 mb-12">
            <div className="text-center">
              <p className="text-5xl font-black text-indigo-600">{state.score}</p>
              <p className="text-xs text-slate-400 uppercase font-black tracking-widest mt-2">To'g'ri</p>
            </div>
            <div className="w-px h-12 bg-slate-100"></div>
            <div className="text-center">
              <p className="text-5xl font-black text-slate-800">{percentage}%</p>
              <p className="text-xs text-slate-400 uppercase font-black tracking-widest mt-2">Natija</p>
            </div>
          </div>

          <div className="space-y-4">
            <button 
              onClick={() => selectVariant(state.selectedVariant!)}
              className="w-full py-6 bg-indigo-600 text-white rounded-[1.5rem] font-black shadow-2xl shadow-indigo-100 flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all active:scale-95 text-lg"
            >
              <RotateCcw className="w-6 h-6" /> Qayta boshlash
            </button>
            <button 
              onClick={resetToHome}
              className="w-full py-6 bg-slate-50 text-slate-600 rounded-[1.5rem] font-bold flex items-center justify-center gap-3 hover:bg-slate-100 transition-all text-lg border border-slate-200"
            >
              <ArrowLeft className="w-6 h-6" /> Bosh menyuga
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Bot Top Bar */}
      <nav className="bg-white/90 backdrop-blur-xl border-b border-slate-200 px-6 py-5 sticky top-0 z-20 flex items-center justify-between shadow-lg shadow-slate-100">
        <div className="flex items-center gap-4">
          <button onClick={resetToHome} className="p-3 hover:bg-slate-100 rounded-2xl transition-all active:scale-90">
            <ArrowLeft className="w-6 h-6 text-slate-600" />
          </button>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white ring-4 ring-indigo-50 shadow-lg shadow-indigo-100">
              <Bot className="w-7 h-7" />
            </div>
            <div>
              <h2 className="font-black text-slate-900 text-lg leading-none mb-1">Quiz Bot</h2>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Variant {state.selectedVariant}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="text-right flex flex-col items-end">
          <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-4 py-2 rounded-2xl shadow-sm">
            {state.currentQuestionIndex + 1} / {currentQuestions.length}
          </span>
        </div>
      </nav>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-10">
        <div className="max-w-3xl mx-auto space-y-10">
          
          {/* Progress Indicator */}
          <div className="px-4">
             <div className="flex justify-between items-center mb-3">
               <span className="text-xs font-black text-slate-400 uppercase">Jarayon</span>
               <span className="text-xs font-black text-indigo-600">{Math.round(((state.currentQuestionIndex + 1) / currentQuestions.length) * 100)}%</span>
             </div>
             <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden shadow-inner">
               <div 
                 className="h-full bg-indigo-600 transition-all duration-700 ease-out shadow-lg"
                 style={{ width: `${((state.currentQuestionIndex + 1) / currentQuestions.length) * 100}%` }}
               />
             </div>
          </div>

          {/* Bot Message (Question) */}
          {showQuestion && (
            <div className="flex items-start gap-4 animate-in fade-in slide-in-from-left-8 duration-500">
              <div className="w-10 h-10 rounded-2xl bg-white shadow-md flex-shrink-0 flex items-center justify-center text-indigo-600 mt-2 border border-slate-100">
                <Bot className="w-5 h-5" />
              </div>
              <div className="bg-white rounded-[2rem] rounded-tl-none shadow-xl shadow-slate-100 border border-slate-100 p-8 max-w-[90%]">
                <p className="text-slate-800 font-bold text-xl leading-relaxed">
                  {currentQuestion.text}
                </p>
              </div>
            </div>
          )}

          {/* Options (Keyboard) */}
          {showQuestion && (
            <div className="space-y-4 pl-14 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
              <div className="grid grid-cols-1 gap-4">
                {currentQuestion.options.map((option, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrect = idx === currentQuestion.correctAnswer;
                  const alphabet = ['A', 'B', 'C', 'D'];
                  
                  let btnStyle = "bg-white border-slate-200 hover:border-indigo-400 hover:shadow-xl text-slate-700";
                  let icon = null;

                  if (isAnswered) {
                    if (isCorrect) {
                      btnStyle = "bg-green-600 border-green-600 text-white shadow-2xl shadow-green-100 ring-4 ring-green-50 scale-[1.02]";
                      icon = <CheckCircle2 className="w-7 h-7" />;
                    } else if (isSelected) {
                      btnStyle = "bg-rose-500 border-rose-500 text-white shadow-2xl shadow-rose-100 ring-4 ring-rose-50";
                      icon = <XCircle className="w-7 h-7" />;
                    } else {
                      btnStyle = "bg-white border-slate-100 text-slate-300 opacity-50";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={isAnswered}
                      onClick={() => handleOptionSelect(idx)}
                      className={`w-full p-6 rounded-[1.75rem] border-2 transition-all flex items-center justify-between text-left group active:scale-[0.98] ${btnStyle}`}
                    >
                      <div className="flex items-center gap-5">
                        <span className={`w-10 h-10 rounded-xl flex items-center justify-center font-black transition-colors ${
                          isAnswered && isCorrect ? 'bg-white/20' : 
                          isAnswered && isSelected ? 'bg-white/20' :
                          'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white'
                        }`}>
                          {alphabet[idx]}
                        </span>
                        <span className="font-bold text-lg pr-4">{option}</span>
                      </div>
                      <div className="flex-shrink-0">
                        {icon ? icon : <div className="w-6 h-6 rounded-full border-2 border-slate-100 group-hover:border-indigo-200 transition-colors" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* User Bubble (Answer confirmation) */}
          {isAnswered && selectedOption !== null && (
            <div className="flex items-start justify-end gap-4 animate-in fade-in slide-in-from-right-8 duration-500">
              <div className="bg-indigo-600 text-white rounded-[2rem] rounded-tr-none shadow-2xl shadow-indigo-200 p-6 max-w-[80%] border-4 border-white">
                <p className="font-black text-base italic uppercase tracking-tight">
                  "{currentQuestion.options[selectedOption]}"
                </p>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex-shrink-0 flex items-center justify-center text-indigo-600 mt-2 shadow-sm border border-indigo-100">
                <User className="w-5 h-5" />
              </div>
            </div>
          )}
          
          <div className="h-20" /> {/* Extra spacing for scrolling */}
        </div>
      </main>

      {/* Stats Bottom Bar */}
      <footer className="bg-white border-t border-slate-200 px-8 py-6 sticky bottom-0 z-10 shadow-[0_-10px_30px_rgba(0,0,0,0.02)]">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
           <div className="flex items-center gap-8">
              <div className="flex flex-col">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">To'g'ri</span>
                <span className="text-xl font-black text-green-600">{state.score}</span>
              </div>
              <div className="w-px h-8 bg-slate-100"></div>
              <div className="flex flex-col">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">Qoldi</span>
                <span className="text-xl font-black text-slate-700">{currentQuestions.length - state.currentQuestionIndex - 1}</span>
              </div>
           </div>
           
           <div className="flex items-center gap-3 px-6 py-3 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-100">
             <Zap className="w-5 h-5 text-white fill-white animate-bounce" />
             <span className="text-sm font-black text-white uppercase tracking-wider">Level {Math.floor(state.score / 10) + 1}</span>
           </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
