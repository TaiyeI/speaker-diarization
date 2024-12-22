import whisper
import wave

if __name__ == '__main__':
    model_type = 'base'
    filename = 'diarization_test.wav'


    audio = whisper.load_audio(filename)

    model = whisper.load_model(model_type)
    result = model.transcribe(audio)
    print(result["text"])