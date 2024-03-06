const synth = window.speechSynthesis;
const voices = synth.getVoices();

const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voices[0];
    synth.speak(utterance);
};

export default speak;
