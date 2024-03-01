FROM python:3.10
ENV PYTHONUNBUFFERED 1

COPY requirements.txt /temp/
COPY project/project service

WORKDIR /service

EXPOSE 8000

RUN pip install -r /temp/requirements.txt

RUN adduser --disabled-password service-user

USER service-user