'use client'

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useSession } from 'next-auth/react';
import { checkAirdropEligibility, CheckResult, FormState } from './actions';
import AuthButton from "@/components/AuthButton";
import UserCard from "@/components/UserCard";
import { Github, Users, GitPullRequest, Star, Clock, Trophy, CheckCircle, AlertTriangle } from 'lucide-react';
import { motion, Variants } from 'framer-motion'; // Import Variants
import CountUp from 'react-countup';
import Tilt from 'react-parallax-tilt';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button 
      type="submit" 
      disabled={pending}
      className="w-full px-6 py-3 text-lg font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-blue-500/50 button-glow"
    >
      {pending ? <span className="flex items-center justify-center">Mengecek...</span> : <span className="flex items-center justify-center gap-2"><Trophy size={20}/> Cek Kelayakan</span>}
    </button>
  );
}

// Secara eksplisit ketik varian dengan `Variants`
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: 'spring', stiffness: 100 } // Tipe sudah benar, tetapi pengetikan eksplisit membantu compiler
  },
};

function ManualCheckResultCard({ data }: { data: CheckResult }) {
    return (
      <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} glareEnable={true} glareMaxOpacity={0.1} perspective={1000}>
        <motion.div 
            className="glass-card p-8 mt-8"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.h2 variants={itemVariants} className="text-3xl font-bold mb-6 text-center flex items-center justify-center gap-3"><CheckCircle className="text-green-400"/> Hasil untuk <span className="text-gradient">{data.username}</span></motion.h2>
            
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6 text-lg">
                <div className="flex items-center gap-3"><Clock size={20} className="text-blue-400"/><span><span className="font-semibold">Umur Akun:</span> {data.accountAgeYears} tahun</span></div>
                <div className="flex items-center gap-3"><Star size={20} className="text-yellow-400"/><span><span className="font-semibold">Repositori:</span> {data.publicRepos}</span></div>
                <div className="flex items-center gap-3"><Users size={20} className="text-purple-400"/><span><span className="font-semibold">Pengikut:</span> {data.followers}</span></div>
                <div className="flex items-center gap-3"><GitPullRequest size={20} className="text-green-400"/><span><span className="font-semibold">Pull Requests:</span> {data.pullRequests}</span></div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="mt-8 pt-6 border-t border-slate-700 text-center">
                <p className="text-2xl font-bold">Skor Aktivitas: <span className="text-yellow-400 drop-shadow-[0_0_5px_rgba(250,204,21,0.5)]">
                    <CountUp end={data.score} duration={2} />
                </span></p>
                <p className="text-5xl font-extrabold mt-2 text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.5)]">
                    <CountUp end={data.allocation} separator="," duration={2.5} /> 
                    <span className="text-3xl">Token</span>
                </p>
            </motion.div>
        </motion.div>
      </Tilt>
    );
}

function ResultSkeleton() {
    return (
      <Tilt tiltMaxAngleX={3} tiltMaxAngleY={3} perspective={1000}>
        <div className="glass-card p-8 mt-8">
            <div className="h-8 bg-slate-700/50 rounded-md w-3/4 mx-auto mb-6 shimmer"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-lg">
                <div className="h-6 bg-slate-700/50 rounded-md shimmer"></div>
                <div className="h-6 bg-slate-700/50 rounded-md shimmer"></div>
                <div className="h-6 bg-slate-700/50 rounded-md shimmer"></div>
                <div className="h-6 bg-slate-700/50 rounded-md shimmer"></div>
            </div>
            <div className="mt-8 pt-6 border-t border-slate-700 text-center">
                <div className="h-7 bg-slate-700/50 rounded-md w-1/2 mx-auto mb-4 shimmer"></div>
                <div className="h-12 bg-slate-700/50 rounded-md w-3/4 mx-auto shimmer"></div>
            </div>
        </div>
      </Tilt>
    );
}

function ManualCheckSection() {
    const [state, formAction] = useActionState<FormState, FormData>(checkAirdropEligibility, null); 
    const { pending } = useFormStatus();

    return (
        <>
          <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} glareEnable={true} glareMaxOpacity={0.1} perspective={1000}>
            <div className="glass-card p-8 w-full animate-fade-in">
                <h2 className="text-2xl font-bold mb-5 text-center text-white">Masukkan Username GitHub</h2>
                <form action={formAction} className="space-y-6">
                    <div className="relative">
                        <Github className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={22}/>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            placeholder="e.g., torvalds"
                            className="w-full pl-14 pr-4 py-3 text-lg text-white bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            required
                        />
                    </div>
                    <SubmitButton />
                </form>
                
                {state?.status === 'error' && (
                    <p className="mt-6 text-center text-red-400 flex items-center justify-center gap-2 animate-fade-in"><AlertTriangle size={18}/>{state.message}</p>
                )}
            </div>
          </Tilt>

            {pending && <ResultSkeleton />}
            {state?.status === 'success' && !pending && <ManualCheckResultCard data={state.data} />}
        </>
    );
}

export default function HomePage() {
  const { data: session } = useSession();

  return (
    <main className="flex flex-col items-center justify-start min-h-screen p-4 sm:p-8 pt-20 md:pt-24 overflow-y-auto">
        <div className="w-full max-w-3xl mx-auto">
            <header className="text-center mb-12 animate-fade-in">
                <h1 className="text-6xl md:text-7xl font-extrabold mb-4 text-gradient">GitHub Airdrop Checker</h1>
                <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto">Rasakan pengalaman dinamis saat kami menganalisis aktivitas GitHub Anda untuk airdrop eksklusif kami.</p>
            </header>

            {session && (
                <div className="mb-12 animate-fade-in">
                    <UserCard />
                </div>
            )}
            
            <ManualCheckSection />

            {!session && (
                <div className="mt-12 text-center animate-fade-in">
                    <p className="mb-4 text-slate-300">Atau dapatkan hasil yang lebih terpersonalisasi:</p>
                    <AuthButton />
                </div>
            )}
        </div>
    </main>
  )
}
