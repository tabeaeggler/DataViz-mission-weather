# Install minimal Python 3.
FROM python:3.9-alpine

# We copy just the requirements.txt first to leverage Docker cache
COPY ./requirements.txt /app/requirements.txt

WORKDIR /app
RUN python3 -m venv venv
RUN . venv/bin/activate
RUN apt-get install libopenblas-dev build-essential libssl-dev libffi-dev python-dev
RUN pip3 install -r requirements.txt

COPY . /app

ENTRYPOINT [ "python" ]

CMD [ "python3", "-m" , "flask", "run", "--host=0.0.0.0"]