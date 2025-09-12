FROM python:3.11-slim 

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

FROM builder AS final

WORKDIR /app

COPY . .
 
EXPOSE 5000

CMD ["python", "app.py"]
