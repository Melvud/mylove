import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Plane, PlayCircle, RotateCcw } from 'lucide-react';
import { format, addDays, isWithinInterval, isSameDay, differenceInDays } from 'date-fns';
import { ru } from 'date-fns/locale';

const cities = {
    ufa: { name: 'Уфа', coords: [55.97, 54.74] },
    linz: { name: 'Линц', coords: [14.28, 48.30] },
    tashkent: { name: 'Ташкент', coords: [69.24, 41.31] },
    istanbul: { name: 'Стамбул', coords: [28.97, 41.01] },
    yerevan: { name: 'Ереван', coords: [44.51, 40.18] },
};

// Photo Data Mapping
const photoCollections = {
    istanbul: [
        "photo_2026-02-13_17-26-23.jpg", "photo_2026-02-13_17-26-25.jpg", "photo_2026-02-13_17-26-27.jpg",
        "photo_2026-02-13_17-26-28.jpg", "photo_2026-02-13_17-26-34.jpg", "photo_2026-02-13_17-26-36.jpg",
        "photo_2026-02-13_17-26-39.jpg"
    ],
    yerevan1: [
        "20241226_142733.jpg", "20241226_142959.jpg", "20241226_235626.jpg", "20241227_193435.jpg",
        "20241227_193436.jpg", "20241227_193438.jpg", "20241227_193439.jpg", "20241227_193441.jpg",
        "20241227_193443.jpg", "20241227_193447.jpg"
    ],
    yerevan2: ["20250412_161438.jpg", "20250715_004648.jpg", "20250715_004650.jpg"],
    tashkent1: [
        "20250730_190219.jpg", "20250730_190224.jpg", "20250802_225643.jpg", "20250802_225650.jpg",
        "20250802_225709.jpg", "photo_2026-02-13_17-29-14.jpg", "photo_2026-02-13_17-29-17.jpg",
        "photo_2026-02-13_17-29-19.jpg", "photo_2026-02-13_17-29-21.jpg", "photo_2026-02-13_17-29-22.jpg",
        "photo_2026-02-13_17-29-24.jpg", "photo_2026-02-13_17-29-25.jpg", "photo_2026-02-13_17-29-27.jpg"
    ],
    tashkent2: [
        "20251226_135829.jpg", "20251226_135831.jpg", "20251228_162839.jpg", "20251228_162847.jpg",
        "20260101_174154.jpg", "20260101_174155.jpg", "20260108_144215.jpg", "20260108_144217.jpg",
        "20260108_144218.jpg", "20260108_144220.jpg", "20260108_144221.jpg", "20260108_144223.jpg",
        "20260108_144231.jpg"
    ],
    ldr: [
        "photo_2026-02-13_17-27-23.jpg", "photo_2026-02-13_17-27-26.jpg", "photo_2026-02-13_17-27-28.jpg",
        "photo_2026-02-13_17-27-30.jpg", "photo_2026-02-13_17-27-33.jpg", "photo_2026-02-13_17-27-34.jpg",
        "photo_2026-02-13_17-27-35.jpg", "photo_2026-02-13_17-27-36.jpg", "photo_2026-02-13_17-27-38.jpg",
        "photo_2026-02-13_17-27-39.jpg", "photo_2026-02-13_17-27-41.jpg", "photo_2026-02-13_17-27-42.jpg",
        "photo_2026-02-13_17-27-43.jpg", "photo_2026-02-13_17-27-45.jpg", "photo_2026-02-13_17-27-46.jpg",
        "photo_2026-02-13_17-27-47.jpg", "photo_2026-02-13_17-27-51.jpg", "photo_2026-02-13_17-27-53.jpg",
        "photo_2026-02-13_17-27-55.jpg", "photo_2026-02-13_17-28-07.jpg", "photo_2026-02-13_17-28-09.jpg",
        "photo_2026-02-13_17-28-13.jpg", "photo_2026-02-13_17-28-15.jpg", "photo_2026-02-13_17-28-18.jpg",
        "photo_2026-02-13_17-28-19.jpg", "photo_2026-02-13_17-28-20.jpg", "photo_2026-02-13_17-28-21.jpg",
        "photo_2026-02-13_17-28-23.jpg", "photo_2026-02-13_17-28-24.jpg", "photo_2026-02-13_17-28-25.jpg",
        "photo_2026-02-13_17-28-27.jpg", "photo_2026-02-13_17-28-28.jpg", "photo_2026-02-13_17-28-29.jpg"
    ]
};

const meetings = [
    { start: new Date(2024, 7, 31), end: new Date(2024, 8, 7), city: 'istanbul', name: 'Первая встреча: Стамбул', folder: 'Стамбул', collection: 'istanbul' },
    { start: new Date(2024, 11, 25), end: new Date(2025, 0, 7), city: 'yerevan', name: 'Новый Год в Ереване', folder: 'Ереван1', collection: 'yerevan1' },
    { start: new Date(2025, 3, 12), end: new Date(2025, 3, 19), city: 'yerevan', name: 'Весна в Ереване', folder: 'Ереван2', collection: 'yerevan2' },
    { start: new Date(2025, 6, 7), end: new Date(2025, 8, 1), city: 'tashkent', name: 'Лето в Ташкенте', folder: 'Ташкент1', collection: 'tashkent1' },
    { start: new Date(2025, 11, 23), end: new Date(2026, 0, 16), city: 'tashkent', name: 'Зима в Ташкенте', folder: 'Ташкент2', collection: 'tashkent2' },
];

const relocationDate = new Date(2025, 6, 3);
const startDate = new Date(2024, 1, 12);
const endDate = new Date(2026, 1, 14);

const minLon = 5;
const maxLon = 80;
const minLat = 30;
const maxLat = 65;

const project = (lon, lat) => {
    const x = ((lon - minLon) / (maxLon - minLon)) * 1000;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 600;
    return { x, y };
};

const FlyingHeart = ({ startPos, endPos, index }) => {
    return (
        <motion.g
            initial={{ offsetDistance: "0%", opacity: 0 }}
            animate={{
                offsetDistance: ["0%", "100%"],
                opacity: [0, 1, 1, 0]
            }}
            transition={{
                duration: 1.5 + Math.random() * 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.05
            }}
            style={{
                offsetPath: `path('M ${startPos.x} ${startPos.y} Q ${((startPos.x + endPos.x) / 2) + (Math.random() * 100 - 50)} ${Math.min(startPos.y, endPos.y) - (50 + Math.random() * 100)} ${endPos.x} ${endPos.y}')`
            }}
        >
            <Heart size={6 + Math.random() * 10} fill="#ff85a1" color="#ff85a1" style={{ opacity: 0.6 + Math.random() * 0.4 }} />
        </motion.g>
    );
};

const Flight = ({ from, to }) => {
    const start = project(...cities[from].coords);
    const end = project(...cities[to].coords);

    const pathData = `M ${start.x} ${start.y} Q ${(start.x + end.x) / 2} ${Math.min(start.y, end.y) - 80} ${end.x} ${end.y}`;

    return (
        <motion.g
            initial={{ offsetDistance: "0%", opacity: 0 }}
            animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
            transition={{ duration: 3, ease: "easeInOut" }}
            style={{ offsetPath: `path('${pathData}')`, offsetRotate: "auto 180deg" }}
        >
            <Plane size={24} color="#ff4d6d" fill="#ff4d6d" style={{ transform: 'rotate(-90deg)' }} />
        </motion.g>
    );
};

const PhotoPolaroid = ({ fileName, folderName, position }) => {
    const src = `/assets/photo/${folderName}/${fileName}`;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.5, rotate: position.rotate - 10, x: position.x - 20, y: position.y + 20 }}
            animate={{ opacity: 1, scale: 1, rotate: position.rotate, x: position.x, y: position.y }}
            exit={{ opacity: 0, scale: 0.8, rotate: position.rotate + 10, y: position.y - 20, transition: { duration: 0.5 } }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '180px',
                padding: '12px 12px 35px 12px',
                background: 'white',
                boxShadow: '0 20px 45px rgba(0,0,0,0.12)',
                border: '1px solid #ffe5ec',
                zIndex: 10,
                transformOrigin: 'center center'
            }}
        >
            <div style={{ width: '100%', aspectRatio: '1/1', overflow: 'hidden', background: '#f5f5f5', borderRadius: '4px' }}>
                <img src={src} alt="Travel memory" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ position: 'absolute', bottom: '10px', left: 0, right: 0, textAlign: 'center' }}>
                <Heart size={14} fill="#ff85a1" color="#ff85a1" style={{ display: 'inline-block' }} />
            </div>
        </motion.div>
    );
};

const InteractiveMap = () => {
    const [currentDate, setCurrentDate] = useState(startDate);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [isFlying, setIsFlying] = useState(false);

    const activeMeeting = useMemo(() =>
        meetings.find(m => isWithinInterval(currentDate, { start: m.start, end: m.end })),
        [currentDate]);

    const isLDR = !activeMeeting;
    const isPostRelocation = currentDate >= relocationDate;

    useEffect(() => {
        if (!isPlaying || isFinished) return;

        if (isFlying) {
            const timer = setTimeout(() => {
                setIsFlying(false);
                setCurrentDate(prev => addDays(prev, 1));
            }, 3000);
            return () => clearTimeout(timer);
        }

        const isStartDay = meetings.some(m => isSameDay(currentDate, m.start));
        const isEndDay = meetings.some(m => isSameDay(currentDate, m.end));
        const isRelocationDay = isSameDay(currentDate, relocationDate);

        if (isStartDay || isEndDay || isRelocationDay) {
            setIsFlying(true);
            return;
        }

        const tick = () => {
            setCurrentDate(prev => {
                const nextDate = addDays(prev, 1);
                if (nextDate > endDate) {
                    setIsFinished(true);
                    return endDate;
                }
                return nextDate;
            });
        };

        // Custom Speed: Long meetings (>28 days) = 1s, Short = 2.5s, LDR = 25ms
        let speed = 25;
        if (activeMeeting) {
            const duration = differenceInDays(activeMeeting.end, activeMeeting.start);
            speed = duration >= 28 ? 1000 : 2500;
        }

        const timeout = setTimeout(tick, speed);
        return () => clearTimeout(timeout);
    }, [currentDate, isPlaying, isFinished, isFlying, activeMeeting]);

    const handleStart = () => {
        setCurrentDate(startDate);
        setIsFlying(false);
        setIsPlaying(true);
        setIsFinished(false);
    };

    const getCityPos = (key) => project(...cities[key].coords);

    const photoData = useMemo(() => {
        if (!isPlaying || isFinished || isFlying) return null;

        let folder, file, key;
        if (activeMeeting) {
            const daysIn = differenceInDays(currentDate, activeMeeting.start);
            const collection = photoCollections[activeMeeting.collection];
            const photoIndex = Math.floor(daysIn * (collection.length / (differenceInDays(activeMeeting.end, activeMeeting.start) + 1)));
            folder = activeMeeting.folder;
            file = collection[Math.min(photoIndex, collection.length - 1)];
            key = `${activeMeeting.collection}-${file}`;
        } else {
            const cycleIndex = Math.floor(differenceInDays(currentDate, startDate) / 70);
            const collection = photoCollections.ldr;
            folder = 'Между поездок';
            file = collection[cycleIndex % collection.length];
            key = `ldr-${file}`;
        }

        // Strictly Safe Zones for 1400px Container (160px Top/Bottom, 150px Left/Right)
        // We move zones further from edges (min 50px) to avoid any clipping with overflow: hidden
        const zones = [
            { x: [50, 120], y: [150, 400], rotate: [-10, -5] },    // Left Margin
            { x: [1120, 1180], y: [150, 400], rotate: [5, 10] },   // Right Margin
            { x: [350, 850], y: [30, 70], rotate: [-1, 1] },      // Top (North)
            { x: [350, 850], y: [740, 780], rotate: [-1, 1] },     // Bottom (South)
            { x: [50, 120], y: [500, 700], rotate: [-8, -4] },    // Bottom Left
            { x: [1120, 1180], y: [500, 700], rotate: [4, 8] },   // Bottom Right
        ];

        const hash = file.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const zoneIndex = hash % zones.length;
        const zone = zones[zoneIndex];

        const randomX = zone.x[0] + (hash % (zone.x[1] - zone.x[0]));
        const randomY = zone.y[0] + ((hash * 7) % (zone.y[1] - zone.y[0]));
        const randomRotate = zone.rotate[0] + (hash % (zone.rotate[1] - zone.rotate[0]));

        return { folder, file, key, position: { x: randomX, y: randomY, rotate: randomRotate } };
    }, [currentDate, activeMeeting, isPlaying, isFinished, isFlying]);

    return (
        <div className="map-container" style={{
            width: '100%', maxWidth: '1400px', margin: '60px auto', padding: '160px 150px 180px 150px',
            background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(20px)',
            borderRadius: '60px', border: '2px solid #ffe5ec',
            boxShadow: '0 30px 60px rgba(255, 133, 161, 0.12)', position: 'relative', overflow: 'hidden'
        }}>

            {/* Travel Photos Polaroid */}
            <AnimatePresence mode="wait">
                {photoData && (
                    <PhotoPolaroid
                        key={photoData.key}
                        folderName={photoData.folder}
                        fileName={photoData.file}
                        position={photoData.position}
                    />
                )}
            </AnimatePresence>

            {/* Header & Date Display */}
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <h2 className="romantic-text" style={{ fontSize: '3rem', color: '#ff4d6d', marginBottom: '10px' }}>
                    История Нашей Любви
                </h2>
                <div style={{ display: 'inline-block', padding: '10px 20px', background: 'white', borderRadius: '20px', border: '1px solid #ffe5ec', minWidth: '200px' }}>
                    <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ff4d6d' }}>
                        {format(currentDate, 'd MMMM yyyy', { locale: ru })}
                    </span>
                </div>
            </div>

            <div style={{ position: 'relative', width: '100%', paddingBottom: '60%', height: 0 }}>
                <svg viewBox="0 0 1000 600" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'visible' }}>
                    <path
                        d="M 50 150 Q 200 80 400 120 T 700 180 T 950 150 L 920 500 Q 700 550 400 520 T 80 450 Z"
                        fill="#fff5f7" stroke="#ffe5ec" strokeWidth="3"
                    />

                    {/* Flying Hearts during LDR */}
                    {isPlaying && isLDR && !isFinished && !isFlying && (
                        <>
                            {[...Array(60)].map((_, i) => (
                                <FlyingHeart
                                    key={`h1-${i}`}
                                    startPos={getCityPos(isPostRelocation ? 'tashkent' : 'linz')}
                                    endPos={getCityPos('ufa')}
                                    index={i}
                                />
                            ))}
                            {[...Array(60)].map((_, i) => (
                                <FlyingHeart
                                    key={`h2-${i}`}
                                    startPos={getCityPos('ufa')}
                                    endPos={getCityPos(isPostRelocation ? 'tashkent' : 'linz')}
                                    index={i}
                                />
                            ))}
                        </>
                    )}

                    {activeMeeting && (
                        <g transform={`translate(${getCityPos(activeMeeting.city).x}, ${getCityPos(activeMeeting.city).y})`}>
                            <motion.path
                                d="M 10,30 A 20,20 0,0,1,50,30 A 20,20 0,0,1,90,30 Q 90,60 50,90 Q 10,60 10,30 Z"
                                fill="none" stroke="#ff4d6d" strokeWidth="12"
                                initial={{ scale: 0 }}
                                animate={{ scale: [0.4, 0.48, 0.4] }}
                                transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
                                style={{
                                    x: -50, y: -48,
                                    filter: 'drop-shadow(0 0 10px rgba(255, 77, 109, 0.6))'
                                }}
                            />
                        </g>
                    )}

                    {isPlaying && isFlying && (
                        <>
                            {meetings.map((m, i) => (
                                <React.Fragment key={i}>
                                    {isSameDay(currentDate, m.start) && (
                                        <>
                                            {i < 3 && <Flight from="linz" to={m.city} />}
                                            <Flight from="ufa" to={m.city} />
                                        </>
                                    )}
                                    {isSameDay(currentDate, m.end) && (
                                        <>
                                            {i < 3 && <Flight from={m.city} to="linz" />}
                                            <Flight from={m.city} to="ufa" />
                                        </>
                                    )}
                                </React.Fragment>
                            ))}
                            {isSameDay(currentDate, relocationDate) && <Flight from="linz" to="tashkent" />}
                        </>
                    )}

                    {Object.entries(cities).map(([key, city]) => {
                        const { x, y } = getCityPos(key);
                        const isHidden = (key === 'linz' && currentDate > relocationDate && !isSameDay(currentDate, relocationDate)) ||
                            (key === 'tashkent' && currentDate < relocationDate);

                        return (
                            <g key={key} style={{ opacity: isHidden ? 0.3 : 1, transition: 'opacity 0.5s' }}>
                                <circle cx={x} cy={y} r="5" fill="#ff4d6d" />
                                <text x={x} y={y + 25} textAnchor="middle" fill="#ff4d6d" style={{ fontSize: '14px', fontWeight: 'bold' }}>{city.name}</text>
                            </g>
                        );
                    })}
                </svg>
            </div>

            <div style={{ marginTop: '40px', textAlign: 'center' }}>
                <AnimatePresence mode="wait">
                    {!isPlaying || isFinished ? (
                        <motion.button
                            key="btn"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={handleStart}
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: '10px',
                                padding: '15px 40px', borderRadius: '40px', background: '#ff4d6d',
                                color: 'white', fontWeight: 'bold', fontSize: '1.2rem',
                                border: 'none', cursor: 'pointer', boxShadow: '0 10px 30px rgba(255, 77, 109, 0.3)'
                            }}
                        >
                            {isFinished ? <RotateCcw /> : <PlayCircle />}
                            {isFinished ? 'Посмотреть еще раз' : 'Наша любовь на карте'}
                        </motion.button>
                    ) : (
                        <div style={{ color: '#ff85a1', fontWeight: 600, fontSize: '1.2rem', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                            {isFlying ? (
                                '⏳ Самолет в пути...'
                            ) : activeMeeting ? (
                                <>
                                    <div style={{ color: '#ff4d6d', fontSize: '1.4rem' }}>❤️ {activeMeeting.name}</div>
                                    <div style={{ fontSize: '1.1rem', opacity: 0.9 }}>
                                        Встречаемся в г. {cities[activeMeeting.city].name}!
                                    </div>
                                </>
                            ) : (
                                'Скучаем друг по другу...'
                            )}
                        </div>
                    )}
                </AnimatePresence>
            </div>

            {/* End Message Overlay */}
            <AnimatePresence>
                {isFinished && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1 }}
                        style={{
                            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                            background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(15px)',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            padding: '40px', textAlign: 'center', zIndex: 100, borderRadius: '50px'
                        }}
                    >
                        <motion.div
                            animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
                            transition={{ duration: 3, repeat: Infinity }}
                            style={{ color: '#ff4d6d', marginBottom: '30px' }}
                        >
                            <Heart size={100} fill="#ff4d6d" />
                        </motion.div>
                        <h2 className="romantic-text" style={{ fontSize: '2.5rem', color: '#ff4d6d', lineHeight: 1.4, maxWidth: '800px', marginBottom: '40px' }}>
                            Это были лучшие два года в моей жизни, а впереди нас ждут еще множество замечательных совместных лет
                        </h2>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleStart}
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: '10px',
                                padding: '15px 40px', borderRadius: '40px', background: '#ff4d6d',
                                color: 'white', fontWeight: 'bold', fontSize: '1.2rem',
                                border: 'none', cursor: 'pointer', boxShadow: '0 10px 30px rgba(255, 77, 109, 0.3)'
                            }}
                        >
                            <RotateCcw /> Посмотреть еще раз
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default InteractiveMap;
