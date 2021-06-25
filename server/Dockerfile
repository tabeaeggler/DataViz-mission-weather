# Install minimal Python 3.
FROM python:3.9-alpine

# We copy just the requirements.txt first to leverage Docker cache
COPY ./requirements.txt /app/requirements.txt

WORKDIR /app
RUN python3 -m venv venv
RUN . venv/bin/activate
RUN pip3 install -r --no-cache-dir requirements.txt

COPY . /app

ENTRYPOINT [ "python" ]

CMD [ "python3", "-m" , "flask", "run", "--host=0.0.0.0"]