'use client'

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useSession } from 'next-auth/react';
import { checkAirdropEligibility, CheckResult, FormState } from '@/app/actions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, GitPullRequest, Star, Clock, Trophy, AlertTriangle } from 'lucide-react';
import { motion, Variants } from 'framer-motion'; // Import Variants
import CountUp from 'react-countup';
import Tilt from 'react-parallax-tilt';

// Secara eksplisit ketik varian dengan `Variants`
const cardVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: 'spring', stiffness: 100 } // Tipe sudah benar, tetapi pengetikan eksplisit membantu compiler
  },
};

function CheckButton() {
    const { pending } = useFormStatus();
    return (
        <button 
            type="submit" 
            disabled={pending}
            className="w-full sm:w-auto px-6 py-3 text-lg font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-blue-500/50 button-glow"
        >
            {pending ? 'Mengecek...' : <span className="flex items-center justify-center gap-2"><Trophy size={20}/>Cek Kelayakan Saya</span>}
        </button>
    );
}

function ResultsDisplay({ data }: { data: CheckResult }) {
    return (
        <motion.div className="mt-6 space-y-4" variants={cardVariants} initial="hidden" animate="visible">
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
    );
}

function CardContentSkeleton() {
    return (
        <div className="mt-6 space-y-4">
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
    );
}

function CardFormContent({ username }: { username: string }) {
    const [state, formAction] = useActionState<FormState, FormData>(checkAirdropEligibility, null); 
    const { pending } = useFormStatus();

    return (
        <div>
            {!state && !pending && (
                <form action={formAction} className="text-center">
                    <input type="hidden" name="username" value={username} />
                    <CheckButton />
                </form>
            )}

            {pending && <CardContentSkeleton />}
            
            {state?.status === 'error' && !pending && (
                <p className="mt-4 text-center text-red-400 flex items-center justify-center gap-2 animate-fade-in"><AlertTriangle size={18}/>Error: {state.message}</p>
            )}

            {state?.status === 'success' && !pending && (
                <ResultsDisplay data={state.data} />
            )}
      </div>
    )
}

export default function UserCard() {
  const { data: session } = useSession();
  const username = session?.user?.name;

  if (!username) {
    return null;
  }

  return (
    <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} glareEnable={true} glareMaxOpacity={0.1} perspective={1000}>
      <div className="glass-card p-8">
        <div className="flex flex-col sm:flex-row items-center gap-5 mb-6">
          <Avatar className="w-20 h-20 border-2 border-slate-600">
            <AvatarImage src={session?.user?.image ?? ''} />
            <AvatarFallback className="text-3xl bg-slate-700">{username.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-3xl font-bold text-gradient">{username}</h2>
            <p className="text-slate-300">Anda login sebagai {session?.user?.email}</p>
          </div>
        </div>
        
        <CardFormContent username={username} />
      </div>
    </Tilt>
  );
}
