# 1. visit hf.co/pyannote/speaker-diarization and accept user conditions
# 2. visit hf.co/pyannote/segmentation and accept user conditions
# 3. visit hf.co/settings/tokens to create an access token
# 4. instantiate pretrained speaker diarization pipeline

# from pyannote.audio import Pipeline
# from pyannote.database.util import load_rttm
# from huggingface_hub import HfApi

# ROOT_DIR = "./pyannote-audio"
# AUDIO_FILE = f"{ROOT_DIR}/tutorials/assets/sample.wav"
# REFERENCE = f"{ROOT_DIR}/tutorials/assets/sample.rttm"

# pipeline = Pipeline.from_pretrained("pyannote/speaker-diarization-3.1", use_auth_token="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")
# reference = load_rttm(REFERENCE)["sample"]

# import torch
# pipeline.to(torch.device("cuda"))

# # apply the pipeline to an audio file
# diarization = pipeline("./diarization_test.wav")

# # dump the diarization output to disk using RTTM format
# # with open("audio.rttm", "w") as rttm:
# #     diarization.write_rttm(rttm)

# for turn, _, speaker in diarization.itertracks(yield_label=True):
#     print(f"start={turn.start:.1f}s stop={turn.end:.1f}s speaker_{speaker}")

import credentials
from pyannote.audio import Pipeline
pipeline = Pipeline.from_pretrained(
    "pyannote/speaker-diarization-3.1",
    use_auth_token= credentials.HUGGING_FACE_KEY)#REPLACE

# send pipeline to GPU (when available)
import torch
pipeline.to(torch.device("cuda"))

# apply pretrained pipeline
diarization = pipeline("diarisation_test.wav")

# print the result
for turn, _, speaker in diarization.itertracks(yield_label=True):
    print(f"start={turn.start:.1f}s stop={turn.end:.1f}s speaker_{speaker}")