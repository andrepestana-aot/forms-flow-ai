FROM python:3.11.7-slim-bullseye

# set label for image
LABEL Name="formsflow"

WORKDIR /forms-flow-data-analysis-api/app
RUN apt-get update \
  && apt-get install -y --no-install-recommends git \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*
COPY requirements.txt .
ENV PATH=/venv/bin:$PATH
# ARG MODEL_ID=Seethal/sentiment_analysis_generic_dataset
ARG MODEL_ID=distilbert-base-uncased-finetuned-sst-2-english

# Create virtual environment and install dependencies with CPU-only torch
RUN python3 -m venv /venv \
    && pip install --no-cache-dir --default-timeout=1000 \
       --extra-index-url https://download.pytorch.org/whl/cpu \
       -r requirements.txt \
    && rm -rf ~/.cache/pip

ADD . /forms-flow-data-analysis-api/app
RUN pip install --no-cache-dir .

# Pre-download the model to include it in the image
# This avoids downloading at runtime
RUN mkdir -p /root/.cache/huggingface \
    && python3 -c "from transformers import pipeline; pipeline('sentiment-analysis', model='$MODEL_ID', truncation=True)"

EXPOSE 5000
RUN chmod u+x ./entrypoint.sh
ENTRYPOINT ["/bin/sh", "entrypoint.sh"]