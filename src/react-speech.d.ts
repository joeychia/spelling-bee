declare module 'react-speech' {
    type SpeechProps = {
      text: string;
      voice?: string;
      rate?: number;
      pitch?: number;
      volume?: number;
      lang?: string;
      voiceURI?: string;
      voiceXML?: string;
      'xml:lang'?: string;
      'x-webkit-speech'?: string;
      'x-webkit-grammar'?: string;
      'x-webkit-voice'?: string;
    };
  
    type SynthesisProps = SpeechProps & {
      onStart?: () => void;
      onEnd?: () => void;
      onError?: (e: any) => void;
    };
  
    type SpeechType = {
      cancel: () => void;
      pause: () => void;
      resume: () => void;
      play: () => void;
    };
  
    function synthesis(props: SynthesisProps): SpeechType;
  
    const Speech: React.FC<SpeechProps>;
  
    export default Speech;
  }
  