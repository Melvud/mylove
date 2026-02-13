import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';

const RomanticLetter = () => {
    // states: 'closed', 'opening', 'flying', 'open'
    const [step, setStep] = useState('closed');

    const letterText = `Солнышко, котёночек, воробушек моя любименькая АОАОАОАОАО!!! МЫ ЦЕЛЫХ ДВА ГОДА ВМЕСТЕ!!!

Спасибо тебе огромное за всё время проведённое вместе, эти два года были очень сложными и если бы не ты, я бы ни за что не справился с жизнью и депрессией😭😭😭 

Наши встречи это самое лучшее время в году, с тобой у меня всегда ощущения спокойствия и нормальности, забываешь какой пиздец в мире. Я по настоящему счастлив только когда ты рядом со мной🥺🥺🥺

И больше всего на свете хочу чтобы мы уже наконец-то жили вместе... Создавали свою семью, с котятами и кутятами, и может 👀👀👀 ещё что-то... Хочу жениться на тебе и никогда не расставаться😳😳😳

Я так горжусь всем тем, что ты делаешь и как стараешься, ты самая крутая на свете, кто бы ещё смог столько переводиться и менять жизнь так, как лучше тебе, а не ждут от тебя. Ты самая умная, самая красивая, самая лучшая на свете девочка-креветочка🥺🥺🥺😭 

Мне так с тобой повезло, никогда никого не любил как тебя, и никогда не полюблю... Если ты пропадаешь из моей жизни, жизни больше и не будет..

Прости за все моменты когда я делал тебе больно, я буду стараться еще сильнее, чтобы такого никогда не было

Люблю тебя, 
Ваня ❤️❤️❤️`;

    const handleOpen = () => {
        if (step !== 'closed') return;
        setStep('opening');
        setTimeout(() => setStep('flying'), 600);
        setTimeout(() => setStep('open'), 1600);
    };

    return (
        <div style={{ padding: '60px 20px', textAlign: 'center', position: 'relative' }}>
            <AnimatePresence>
                {step === 'open' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setStep('closed')}
                        style={{
                            position: 'fixed', inset: 0, zIndex: 9999,
                            background: 'rgba(255, 255, 255, 0.98)', backdropFilter: 'blur(15px)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px',
                            cursor: 'zoom-out'
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.8, y: 100, rotate: -5 }}
                            animate={{ scale: 1, y: 0, rotate: 0 }}
                            transition={{ type: "spring", damping: 15 }}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                maxWidth: '800px', width: '100%', maxHeight: '90vh', overflowY: 'auto',
                                background: '#fff', padding: '60px 40px', borderRadius: '15px',
                                boxShadow: '0 40px 100px rgba(255, 77, 109, 0.15)', border: '1px solid #ffe5ec',
                                position: 'relative', scrollbarWidth: 'none',
                                cursor: 'default'
                            }}
                        >
                            <button
                                onClick={() => setStep('closed')}
                                style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', cursor: 'pointer', color: '#ff85a1' }}
                            >
                                <Heart size={30} fill="#ff85a1" />
                            </button>

                            <div style={{
                                color: '#444', fontSize: '1.25rem', lineHeight: '1.8',
                                whiteSpace: 'pre-wrap', textAlign: 'left',
                                fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif'
                            }}>
                                {letterText.split('❤️').map((segment, i) => (
                                    <React.Fragment key={i}>
                                        {segment}
                                        {i < letterText.split('❤️').length - 1 && (
                                            <Heart size={22} fill="#ff4d6d" color="#ff4d6d" style={{ display: 'inline-block', verticalAlign: 'middle', margin: '0 5px' }} />
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>

                            {/* Decorative hearts inside letter */}
                            {[...Array(12)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    animate={{
                                        y: [0, -20, 0],
                                        opacity: [0.1, 0.3, 0.1]
                                    }}
                                    transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: i * 0.2 }}
                                    style={{
                                        position: 'absolute',
                                        top: `${Math.random() * 100}%`,
                                        left: `${Math.random() * 100}%`,
                                        zIndex: -1, pointerEvents: 'none'
                                    }}
                                >
                                    <Heart size={Math.random() * 30 + 15} fill="#ffccd5" />
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Envelope Interactive Area */}
            {step !== 'open' && (
                <div style={{ perspective: '1000px', width: '300px', height: '200px', margin: '0 auto', position: 'relative' }}>
                    <motion.div
                        onClick={handleOpen}
                        animate={step === 'opening' || step === 'flying' ? { scale: 1.1, y: -20 } : { scale: 1, y: 0 }}
                        whileHover={step === 'closed' ? { scale: 1.05 } : {}}
                        style={{
                            width: '300px', height: '200px',
                            background: '#fff0f3', borderRadius: '10px',
                            border: '2px solid #ff85a1', boxShadow: '0 20px 40px rgba(255, 77, 109, 0.1)',
                            cursor: step === 'closed' ? 'pointer' : 'default',
                            position: 'relative'
                        }}
                    >
                        {/* Letter Flying Out Animation */}
                        <AnimatePresence>
                            {step === 'flying' && (
                                <motion.div
                                    initial={{ y: 0, scale: 0.5, opacity: 1 }}
                                    animate={{ y: -300, scale: 1, rotate: 360, opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    style={{
                                        position: 'absolute', top: '10px', left: '20px', right: '20px', bottom: '10px',
                                        background: 'white', border: '1px solid #ffd1dc', borderRadius: '5px',
                                        zIndex: 5, display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}
                                >
                                    <Heart size={40} fill="#ff4d6d" color="#ff4d6d" />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Envelope Body (Background) */}
                        <div style={{
                            position: 'absolute', bottom: 0, width: '100%', height: '100%',
                            background: '#fff0f3', borderRadius: '10px', zIndex: 1
                        }} />

                        {/* Envelope Flap */}
                        <motion.div
                            animate={step === 'opening' || step === 'flying' ? { rotateX: -160 } : { rotateX: 0 }}
                            transition={{ duration: 0.6, ease: "easeInOut" }}
                            style={{
                                position: 'absolute', top: 0, left: 0, width: '100%', height: '100px',
                                background: '#ffccd5', border: '1px solid #ff85a1',
                                borderBottom: 'none',
                                borderRadius: '10px 10px 0 0',
                                clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)',
                                zIndex: step === 'closed' ? 10 : 0, // Behind letter when opening
                                transformOrigin: 'top center'
                            }}
                        />

                        {/* Front Decorations */}
                        <div style={{
                            position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 8,
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <Heart size={40} fill="#ff4d6d" color="#ff4d6d" />
                        </div>

                        {/* Address Placeholder */}
                        <div style={{
                            position: 'absolute', bottom: '20px', left: '20px',
                            width: '100px', height: '2px', background: '#ff85a1', opacity: 0.4
                        }} />
                        <div style={{
                            position: 'absolute', bottom: '15px', left: '20px',
                            width: '60px', height: '2px', background: '#ff85a1', opacity: 0.4
                        }} />
                    </motion.div>

                    {step === 'closed' && (
                        <motion.div
                            animate={{ y: [0, -5, 0] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            style={{ marginTop: '20px', color: '#ff4d6d', fontWeight: 'bold' }}
                        >
                            Нажми, чтобы открыть секретное письмо ❤️
                        </motion.div>
                    )}
                </div>
            )}
        </div>
    );
};

export default RomanticLetter;
