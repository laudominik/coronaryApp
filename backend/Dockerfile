FROM python:3.11.4
WORKDIR /app
COPY requirements.txt ./requirements.txt 
COPY ./vessel_tree_generator/requirements.txt ./vessel_tree_generator/requirements.txt 
RUN pip3 install -r requirements.txt 
RUN pip3 install -r ./vessel_tree_generator/requirements.txt 
RUN apt-get update && apt-get install ffmpeg libsm6 libxext6  -y
COPY . ./
ENV PYTHONUNBUFFERED=1
ENTRYPOINT ["python3", "manage.py", "runserver", "0.0.0.0:8000"]