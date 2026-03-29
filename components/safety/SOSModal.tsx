'use client';
import { useStore } from '@/store/useStore';
import { useState, useEffect } from 'react';
import { X, Shield, MapPin, Phone, AlertCircle, CheckCircle } from 'lucide-react';

export default function SOSModal() {
  const { setShowSOS, alias, isAnonymous } = useStore();
  const [step, setStep] = useState<'confirm' | 'sending' | 'sent'>('confirm');
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (step !== 'sent') return;
    const t = setTimeout(() => setShowSOS(false), 5000);
    return () => clearTimeout(t);
  }, [step, setShowSOS]);

  const handleSOS = () => {
    setStep('sending');
    setTimeout(() => setStep('sent'), 2000);
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/75 flex items-end sm:items-center justify-center p-4 sm:p-6"
      onClick={() => step !== 'sent' && setShowSOS(false)}>
      <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}>

        {step === 'confirm' && (
          <>
            <div className="bg-red-500 p-5 text-center relative">
              <button onClick={() => setShowSOS(false)}
                className="absolute top-4 right-4 text-red-200 hover:text-white p-1">
                <X size={18} />
              </button>
              <div className="text-5xl mb-2 animate-bounce">🚨</div>
              <h2 className="text-white font-black text-xl">Emergency SOS</h2>
              <p className="text-red-100 text-sm mt-1">Your location will be shared with park security and emergency contact</p>
            </div>
            <div className="p-5 space-y-3">
              <div className="text-xs font-black text-gray-500 uppercase tracking-wide mb-2">What happens when you press SOS:</div>
              {[
                { icon: <MapPin size={14} className="text-red-500" />, text: 'Approximate location sent to park security instantly' },
                { icon: <Phone size={14} className="text-red-500" />, text: 'Emergency contact receives SMS with your park location' },
                { icon: <Shield size={14} className="text-green-500" />, text: isAnonymous ? 'Sent as anonymous — identity protected' : `Sent as ${alias}` },
                { icon: <AlertCircle size={14} className="text-amber-500" />, text: 'Admin is alerted and will dispatch help immediately' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 py-2 border-b border-gray-50">
                  <div className="mt-0.5 flex-shrink-0">{item.icon}</div>
                  <span className="text-sm text-gray-600">{item.text}</span>
                </div>
              ))}
              <button onClick={handleSOS}
                className="w-full bg-red-500 hover:bg-red-600 active:scale-[0.98] text-white font-black py-4 rounded-2xl text-lg transition-all mt-2 shadow-lg shadow-red-200">
                🚨 Send SOS Now
              </button>
              <button onClick={() => setShowSOS(false)}
                className="w-full text-gray-400 text-sm py-2 hover:text-gray-600 transition-colors">
                I'm safe — Cancel
              </button>
            </div>
          </>
        )}

        {step === 'sending' && (
          <div className="p-10 text-center">
            <div className="w-16 h-16 border-4 border-red-200 border-t-red-500 rounded-full animate-spin mx-auto mb-4" />
            <div className="font-black text-gray-800 text-lg mb-1">Sending SOS Alert...</div>
            <div className="text-gray-400 text-sm">Contacting park security and emergency services</div>
          </div>
        )}

        {step === 'sent' && (
          <div className="p-10 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-green-600" />
            </div>
            <div className="font-black text-green-700 text-xl mb-2">Help is on the way!</div>
            <p className="text-gray-500 text-sm mb-4">Park security has been notified. Stay visible, stay calm, and wait for assistance.</p>
            <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-xs text-green-600 text-left space-y-1">
              <div className="flex items-center gap-2"><CheckCircle size={11} /> Park security alerted</div>
              <div className="flex items-center gap-2"><CheckCircle size={11} /> Emergency contact SMS sent</div>
              <div className="flex items-center gap-2"><Shield size={11} /> Sent anonymously — identity protected</div>
            </div>
            <p className="text-gray-300 text-xs mt-3">This dialog will close in 5 seconds</p>
          </div>
        )}
      </div>
    </div>
  );
}
