import React, { useState, useEffect } from 'react';
import { intervalToDuration } from 'date-fns';
import backgroundMusic from './assets/9e6a6eebec7be72.mp3';
import { Heart, Sparkles, Camera, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import InteractiveMap from './components/InteractiveMap';
import RomanticLetter from './components/RomanticLetter';

// --- Background Animation ---
const FloatingHearts = () => {
  const [elements, setElements] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const id = Math.random();
      const duration = Math.random() * 15 + 10;
      const heart = {
        id,
        left: Math.random() * 100,
        size: Math.random() * 30 + 10,
        duration,
      };
      setElements(prev => [...prev, heart]);

      // Remove heart only after its animation ends
      setTimeout(() => {
        setElements(prev => prev.filter(h => h.id !== id));
      }, duration * 1000);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="heart-layer" style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: -1 }}>
      {elements.map(h => (
        <div key={h.id} className="heart-particle" style={{
          left: `${h.left}%`,
          width: h.size,
          height: h.size,
          animationDuration: `${h.duration}s`,
          color: '#ff85a1'
        }}>
          <Heart fill="currentColor" size={h.size} />
        </div>
      ))}
    </div>
  );
};

const DecorativeMice = () => {
  const [mice, setMice] = useState([]);

  useEffect(() => {
    const urls = [
      '/src/assets/mouse1.png',
      '/src/assets/mouse2.png'
    ];

    const interval = setInterval(() => {
      const id = Math.random();
      const duration = Math.random() * 20 + 15;
      const mouse = {
        id,
        url: urls[Math.floor(Math.random() * urls.length)],
        left: Math.random() * 100,
        size: Math.random() * 60 + 80,
        duration,
        rotationStart: Math.random() * 360,
      };
      setMice(prev => [...prev, mouse]);

      // Remove mouse only after its animation ends
      setTimeout(() => {
        setMice(prev => prev.filter(m => m.id !== id));
      }, duration * 1000);
    }, 4000); // New mouse every 4 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: -1 }}>
      {mice.map(m => (
        <img
          key={m.id}
          src={m.url}
          className="heart-particle" // Reuse the floating animation
          style={{
            left: `${m.left}%`,
            width: `${m.size}px`,
            animationDuration: `${m.duration}s`,
            mixBlendMode: 'multiply',
            opacity: 0.5,
            filter: 'sepia(0.2) saturate(1.5)',
            transform: `rotate(${m.rotationStart}deg)`
          }}
        />
      ))}
    </div>
  );
};

// --- Pluralization Helper ---
const getPlural = (n, forms) => {
  const n1 = Math.abs(n) % 100;
  const n2 = n1 % 10;
  if (n1 > 10 && n1 < 20) return forms[2];
  if (n2 > 1 && n2 < 5) return forms[1];
  if (n2 === 1) return forms[0];
  return forms[2];
};

// --- Timer Components ---
const TimeBox = ({ value, label, isLast }) => (
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <motion.div whileHover={{ y: -5 }} className="timer-box">
      <span className="timer-val">{value || 0}</span>
      <span className="timer-unit">{label}</span>
    </motion.div>
    {!isLast && (
      <div className="timer-separator">
        <div className="dot"></div>
      </div>
    )}
  </div>
);

const PhotoItem = ({ url, caption, rotation, onClick }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    style={{ transform: `rotate(${rotation}deg)` }}
    className="polaroid-card"
    onClick={onClick}
  >
    <img src={url} alt={caption} loading="lazy" />
    <div className="polaroid-caption">{caption}</div>
  </motion.div>
);

// --- Photo Gallery Logic ---
const photoCaptionsMap = {
  "20241130_161107": "Самый милый котенок",
  "20241226_142733": "Чтобы показать всем какую отхватил✨",
  "20241226_142959": "Один из тех вечеров, когда время замерло...",
  "20241226_235626": "Почти Новый Год, и мы вместе 🎄",
  "20241227_193435": "Твои глаза светятся ярче гирлянд 💖",
  "20241227_193436": "По фотке для твоей мамы на каждый день",
  "20241227_193438": "Лучший подарок — это ты 🎁",
  "20241227_193439": "Самая милая кошечка на свете",
  "20241227_193441": "Просто люблю тебя бесконечно",
  "20241227_193443": "Тут всё идеально, потому что ты рядом",
  "20241227_193447": "Лучшая фотка ✨",
  "20250412_161438": "Наша первая весна вместе🌸",
  "20250715_004648": "Чистим твои красивые зубки 🌙",
  "20250715_004650": "Не упускаю момент подаставать тебя",
  "20250730_190219": "Лето и мы 🌅",
  "20250730_190224": "Твоя красота всегда завораживает меня",
  "20250802_225643": "Августовский вечер, полный любви",
  "20250802_225650": "Тут мы смотрим так по-особенному... Как будто у нас голоса в голове",
  "20250802_225709": "Не могу наглядеться на тебя 😍",
  "20251226_135829": "Год пролетел, а я люблю тебя всё сильнее",
  "20251226_135831": "Перед выходом обязательно покрасоваться❄️",
  "20251228_162839": "Декабрьское счастье в каждом кадре",
  "20251228_162847": "Знаменитая моська - я от нее всегда наповал",
  "20260101_174154": "Обожаю какая ты смешная",
  "20260101_174155": "Наше светлое будущее начинается с этой фотки",
  "20260108_144215": "Самая красивая парочка на районе",
  "20260108_144217": "Тут мы такие счастливые... 🥰",
  "20260108_144218": "Моя опора и моё вдохновение",
  "20260108_144220": "Пусть таких дней будет миллион",
  "20260108_144221": "Твоя улыбка — моё самое любимое видео (почти фото)",
  "20260108_144223": "Целовать тебя это самое приятное в жизни",
  "20260108_144231": "Завершаем эту серию кадров любовью ❤️"
};

// Automatically import all images from the assets/photo directory
const photoModules = import.meta.glob('/src/assets/photo/*.{jpg,jpeg,png,webp}', { eager: true });
const videoModules = import.meta.glob('/src/assets/photo/*.{mp4,webm}', { eager: true });

const Gallery = ({ onOpen }) => {
  const photos = Object.entries(photoModules).map(([path, module]) => {
    const fileName = path.split('/').pop().split('.')[0];
    return {
      url: module.default,
      caption: photoCaptionsMap[fileName] || "Наш милый момент ❤️",
      rotation: Math.random() * 8 - 4
    };
  });

  return (
    <div className="photo-wall">
      {photos.map((it, i) => (
        <PhotoItem
          key={i}
          url={it.url}
          caption={it.caption}
          rotation={it.rotation}
          onClick={() => onOpen(it.url, 'image', it.caption)}
        />
      ))}
    </div>
  );
};

const VideoSection = ({ onOpen }) => {
  const videos = Object.values(videoModules).map(mod => mod.default);
  const videoCaptions = [
    "Мы самая лучшая пара на свете.",
    "Мне говорят что моя девушка не котенок - также моя девушка"
  ];

  if (videos.length === 0) return null;

  return (
    <section className="container" style={{ marginTop: '100px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
        <div style={{ height: '2px', background: '#ffe5ec', flex: 1 }}></div>
        <h2 className="romantic-text" style={{ fontSize: '3.5rem', color: '#ff4d6d' }}>Два моих любимых видео вместе</h2>
        <div style={{ height: '2px', background: '#ffe5ec', flex: 1 }}></div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
        {videos.map((url, i) => {
          const caption = videoCaptions[i] || `Видео момент #${i + 1}`;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="polaroid-card"
              style={{ paddingBottom: '20px', cursor: 'pointer', display: 'flex', flexDirection: 'column' }}
              onClick={() => onOpen(url, 'video', caption)}
            >
              <div style={{ width: '100%', height: '400px', background: '#000', borderRadius: '12px', overflow: 'hidden' }}>
                <video
                  src={url}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div className="polaroid-caption" style={{ fontSize: '1.5rem', marginTop: 'auto' }}>{caption}</div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

const Lightbox = ({ asset, onClose }) => {
  if (!asset) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="modal-overlay"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="modal-content"
        onClick={e => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <Heart size={32} fill="white" />
        </button>
        {asset.type === 'image' ? (
          <img src={asset.url} alt={asset.caption} loading="lazy" />
        ) : (
          <video src={asset.url} controls autoPlay preload="metadata" />
        )}
        <p className="romantic-text" style={{ color: 'white', fontSize: '2.5rem', marginTop: '20px' }}>
          {asset.caption}
        </p>
      </motion.div>
    </motion.div>
  );
};


// Final Relationship Timeline Component

function App() {
  const startDate = new Date(2024, 1, 12);
  const [now, setNow] = useState(new Date());
  const [selectedAsset, setSelectedAsset] = useState(null);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Background music auto-play logic (some browsers require interaction)
  useEffect(() => {
    const playMusic = () => {
      const audio = document.getElementById('bg-music');
      if (audio) {
        audio.play().catch(() => {
          // Fallback if autoplay is blocked
        });
      }
    };
    window.addEventListener('click', playMusic, { once: true });
    return () => window.removeEventListener('click', playMusic);
  }, []);

  const d = intervalToDuration({ start: startDate, end: now });

  const timeData = [
    { val: d.years, labels: ['Год', 'Года', 'Лет'] },
    { val: d.days, labels: ['День', 'Дня', 'Дней'] },
    { val: d.hours, labels: ['Час', 'Часа', 'Часов'] },
    { val: d.minutes, labels: ['Минута', 'Минуты', 'Минут'] },
    { val: d.seconds, labels: ['Секунда', 'Секунды', 'Секунд'] },
  ];

  return (
    <div className="app-root">
      <FloatingHearts />
      <DecorativeMice />
      <audio id="bg-music" src={backgroundMusic} loop autoPlay style={{ display: 'none' }} />

      <AnimatePresence>
        {selectedAsset && (
          <Lightbox
            asset={selectedAsset}
            onClose={() => setSelectedAsset(null)}
          />
        )}
      </AnimatePresence>

      {/* Header & Timer Section */}
      <section className="container hero">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '50px', background: 'white', color: '#ff4d6d', fontWeight: 'bold', fontSize: '14px', marginBottom: '1rem', border: '1px solid #ffe5ec' }}
        >
          <Sparkles size={16} /> Наша вечная история <Sparkles size={16} />
        </motion.div>

        <h1 className="romantic-text">Моей Любимой</h1>
        <p style={{ fontWeight: 700, fontScale: '1.2rem', color: '#ff85a1', marginTop: '10px' }}>
          Мы вместе счастливо уже:
        </p>

        <div className="timer-grid">
          {timeData.map((item, idx) => (
            <TimeBox
              key={idx}
              value={item.val}
              label={getPlural(item.val || 0, item.labels)}
              isLast={idx === timeData.length - 1}
            />
          ))}
        </div>
      </section>

      {/* Gallery Section */}
      <section className="container">
        <div style={{ textAlign: 'center', marginTop: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
          <div style={{ height: '2px', background: '#ffe5ec', flex: 1 }}></div>
          <h2 className="romantic-text" style={{ fontSize: '3.5rem', color: '#ff4d6d' }}>Наши Моменты</h2>
          <div style={{ height: '2px', background: '#ffe5ec', flex: 1 }}></div>
        </div>

        <Gallery onOpen={(url, type, caption) => setSelectedAsset({ url, type, caption })} />
      </section>

      {/* Interactive Map Section */}
      <section className="container" style={{ marginTop: '100px' }}>
        <InteractiveMap />
      </section>

      {/* Video Section */}
      <VideoSection onOpen={(url, type, caption) => setSelectedAsset({ url, type, caption })} />

      {/* Love Message Section */}
      <section className="container" style={{ padding: '60px 0' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          style={{ background: 'white', padding: '60px 40px', borderRadius: '40px', textAlign: 'center', border: '2px solid #ffe5ec', boxShadow: '0 20px 40px rgba(255, 133, 161, 0.05)' }}
        >
          <p className="romantic-text" style={{ fontSize: '2.5rem', color: '#ff4d6d', lineHeight: 1.2 }}>
            "Ты — лучшее, что случилось со мной. Каждый день с тобой — это мечта, и я не могу дождаться, чтобы провести с тобой вечность."
          </p>
        </motion.div>
      </section>
      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '100px 0 60px' }}>
        <Heart fill="#ff4d6d" color="#ff4d6d" size={48} />
      </footer>

      {/* Final Romantic Letter Surprise */}
      <section style={{ paddingBottom: '120px' }}>
        <RomanticLetter />
      </section>
    </div>
  );
}

export default App;
