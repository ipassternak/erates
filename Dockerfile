FROM python:3.12-alpine
WORKDIR /app
COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt
COPY public public
COPY app app
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0"]