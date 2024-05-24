FROM python:3.11-alpine
RUN pip3 install django django-cors-headers django-rest-framework
COPY . ./
ENV PYTHONUNBUFFERED=1
ENTRYPOINT ["python3", "manage.py", "runserver", "0.0.0.0:8000"] 
