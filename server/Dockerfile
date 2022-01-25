# Install minimal Python 3.
FROM python:3.9-alpine

# We copy just the requirements.txt first to leverage Docker cache
COPY ./requirements.txt /deployment/requirements.txt

WORKDIR /deployment
RUN python3 -m venv venv
RUN . venv/bin/activate
RUN apk update
RUN apk --no-cache add curl gcc g++
RUN ln -s /usr/include/locale.h /usr/include/xlocale.h
RUN pip3 install -r requirements.txt

COPY . /deployment
EXPOSE 5000
CMD ["python", "/app/api.py"]

#CMD ["flask", "run"]
