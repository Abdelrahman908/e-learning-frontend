import React, { useRef, useState, useEffect, useCallback } from 'react';
import ReactPlayer from 'react-player';

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

const VideoPlayerComponent = ({
  videoUrl,
  onProgressUpdate,
  autoPlay = false,
  onRestart,
}) => {
  const playerRef = useRef(null);
  const containerRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1); // 0 to 1
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const lastSentRef = useRef(0);

  // تحديث الوقت الحالي والتقدم (بتقليل التحديثات)
  const handleProgress = useCallback(
    (state) => {
      setCurrentTime(state.playedSeconds);
      setDuration(state.loadedSeconds > duration ? state.loadedSeconds : duration);

      const now = Date.now();
      if (now - lastSentRef.current > 1000) {
        lastSentRef.current = now;
        if (onProgressUpdate) onProgressUpdate(state.played * 100);
      }
    },
    [duration, onProgressUpdate]
  );

  // عند انتهاء الفيديو
  const handleEnded = () => {
    setIsPlaying(false);
    if (onRestart) onRestart();
  };

  // تشغيل/إيقاف الفيديو
  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  // إعادة التشغيل
  const handleRestartClick = () => {
    if (playerRef.current) {
      playerRef.current.seekTo(0);
      setIsPlaying(true);
      if (onRestart) onRestart();
    }
  };

  // التحكم في الصوت
  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    setIsMuted(val === 0);
  };

  // كتم الصوت
  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      if (volume === 0) setVolume(1);
    } else {
      setIsMuted(true);
    }
  };

  // الـ Fullscreen
  const toggleFullscreen = () => {
    const elem = containerRef.current;
    if (!elem) return;

    if (!document.fullscreenElement) {
      elem.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => setIsFullscreen(false));
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => setIsFullscreen(true));
    }
  };

  // الاستماع لتغيير حالة fullscreen
  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  // اختصارات لوحة المفاتيح
  useEffect(() => {
    const keyHandler = (e) => {
      if (e.key.toLowerCase() === 'f') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        togglePlayPause();
      } else if (e.key.toLowerCase() === 'm') {
        e.preventDefault();
        toggleMute();
      }
    };
    window.addEventListener('keydown', keyHandler);
    return () => window.removeEventListener('keydown', keyHandler);
  });

  // Loader عندما الفيديو يحمل (react-player يوفر callback)
  const handleReady = () => setIsLoading(false);
  const handleBuffer = () => setIsLoading(true);
  const handleBufferEnd = () => setIsLoading(false);

  return (
    <div
      ref={containerRef}
      className={`w-full max-w-3xl mx-auto rounded shadow-lg bg-white p-4 ${
        isFullscreen ? 'fixed top-0 left-0 w-full h-full z-50 bg-black p-0' : ''
      }`}
      style={isFullscreen ? { padding: 0 } : {}}
    >
      <div className="relative" style={{ height: isFullscreen ? '100%' : 'auto' }}>
        {isLoading && (
          <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 z-10 rounded">
            <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-12 w-12"></div>
          </div>
        )}
        <ReactPlayer
          ref={playerRef}
          url={videoUrl}
          playing={isPlaying}
          muted={isMuted}
          volume={volume}
          width="100%"
          height={isFullscreen ? '100%' : 'auto'}
          onProgress={handleProgress}
          onEnded={handleEnded}
          onReady={handleReady}
          onBuffer={handleBuffer}
          onBufferEnd={handleBufferEnd}
          controls={false}
          config={{
            file: {
              attributes: {
                crossOrigin: 'anonymous',
              },
            },
          }}
          style={{ cursor: 'pointer' }}
          onClick={togglePlayPause}
        />
      </div>

      {/* أزرار التحكم */}
      <div className="flex items-center justify-between mt-3 space-x-4">
        <button
          onClick={togglePlayPause}
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded px-3 py-1 flex items-center"
          aria-label={isPlaying ? 'إيقاف الفيديو' : 'تشغيل الفيديو'}
        >
          {isPlaying ? '⏸️ إيقاف' : '▶️ تشغيل'}
        </button>

        <button
          onClick={handleRestartClick}
          className="bg-green-600 hover:bg-green-700 text-white rounded px-3 py-1"
          aria-label="إعادة تشغيل الفيديو"
        >
          🔄 إعادة تشغيل
        </button>

        <button
          onClick={toggleMute}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 rounded px-3 py-1"
          aria-label={isMuted ? 'إلغاء كتم الصوت' : 'كتم الصوت'}
        >
          {isMuted ? '🔈' : '🔇'}
        </button>

        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={isMuted ? 0 : volume}
          onChange={handleVolumeChange}
          aria-label="مستوى الصوت"
          className="w-24"
        />

        <button
          onClick={toggleFullscreen}
          className="bg-purple-600 hover:bg-purple-700 text-white rounded px-3 py-1"
          aria-label={isFullscreen ? 'الخروج من وضع ملء الشاشة' : 'الدخول إلى وضع ملء الشاشة'}
          title="F - تبديل ملء الشاشة"
        >
          {isFullscreen ? '🡼 خروج ملء الشاشة' : '🡽 ملء الشاشة'}
        </button>
      </div>

      {/* شريط التقدم التفاعلي */}
      <div
        onClick={(e) => {
          if (!playerRef.current || !containerRef.current) return;
          const rect = e.currentTarget.getBoundingClientRect();
          const clickX = e.clientX - rect.left;
          const newPlayed = clickX / rect.width;
          playerRef.current.seekTo(newPlayed);
        }}
        className="w-full h-3 bg-gray-300 rounded-full mt-4 cursor-pointer"
        aria-label="شريط تقدم الفيديو"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={(currentTime / duration) * 100 || 0}
      >
        <div
          className="h-3 bg-indigo-600 rounded-full transition-all duration-300"
          style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
        />
      </div>

      {/* الوقت الحالي والمدة */}
      <div className="flex justify-between text-sm text-gray-600 mt-2 px-1 select-none">
        <span>الوقت الحالي: {formatTime(currentTime)}</span>
        <span>المدة: {formatTime(duration)}</span>
      </div>
    </div>
  );
};

export default VideoPlayerComponent;
