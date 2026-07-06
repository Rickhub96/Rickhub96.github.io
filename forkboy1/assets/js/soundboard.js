(function soundboard() {
  const volumeSlider = document.getElementById("volume");
  const canvas = document.getElementById("visualizer");
  const ctx2d = canvas.getContext("2d");

  let audioCtx = null;
  let masterGain = null;
  let analyser = null;
  let dataArray = null;
  let animId = null;

  function ensureContext() {
    if (audioCtx) return;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioCtx();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = parseFloat(volumeSlider.value);

    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    dataArray = new Uint8Array(analyser.frequencyBinCount);

    masterGain.connect(analyser);
    analyser.connect(audioCtx.destination);
  }

  volumeSlider.addEventListener("input", () => {
    if (masterGain) masterGain.gain.value = parseFloat(volumeSlider.value);
  });

  function noiseBuffer(duration) {
    const buffer = audioCtx.createBuffer(1, audioCtx.sampleRate * duration, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    return buffer;
  }

  function playThunder() {
    const src = audioCtx.createBufferSource();
    src.buffer = noiseBuffer(1.4);
    const filter = audioCtx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(400, audioCtx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 1.3);
    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(1, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.4);
    src.connect(filter).connect(gain).connect(masterGain);
    src.start();
    src.stop(audioCtx.currentTime + 1.4);
  }

  function playFanfare() {
    const notes = [392, 494, 587, 784];
    notes.forEach((freq, i) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sawtooth";
      osc.frequency.value = freq;
      const start = audioCtx.currentTime + i * 0.15;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.25, start + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.5);
      osc.connect(gain).connect(masterGain);
      osc.start(start);
      osc.stop(start + 0.55);
    });
  }

  function playCheer() {
    const src = audioCtx.createBufferSource();
    src.buffer = noiseBuffer(0.9);
    const filter = audioCtx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(1200, audioCtx.currentTime);
    filter.Q.value = 0.6;
    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.5, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.7, audioCtx.currentTime + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.9);
    src.connect(filter).connect(gain).connect(masterGain);
    src.start();
    src.stop(audioCtx.currentTime + 0.9);
  }

  function playCoin() {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(880, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1760, audioCtx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
    osc.connect(gain).connect(masterGain);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.3);
  }

  const SOUNDS = { thunder: playThunder, fanfare: playFanfare, cheer: playCheer, coin: playCoin };

  document.querySelectorAll(".sound-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      ensureContext();
      if (audioCtx.state === "suspended") audioCtx.resume();
      SOUNDS[btn.dataset.sound]?.();
      startVisualizer();
    });
  });

  function startVisualizer() {
    if (animId) return;
    function draw() {
      analyser.getByteFrequencyData(dataArray);
      ctx2d.clearRect(0, 0, canvas.width, canvas.height);
      const barWidth = canvas.width / dataArray.length;
      for (let i = 0; i < dataArray.length; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height;
        ctx2d.fillStyle = "rgba(232,200,115," + (0.3 + dataArray[i] / 400) + ")";
        ctx2d.fillRect(i * barWidth, canvas.height - barHeight, barWidth - 1, barHeight);
      }
      animId = requestAnimationFrame(draw);
    }
    draw();
    setTimeout(() => { cancelAnimationFrame(animId); animId = null; ctx2d.clearRect(0,0,canvas.width,canvas.height); }, 2200);
  }
})();
