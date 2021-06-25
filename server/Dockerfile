# Install minimal Python 3.
FROM python:3.7-alpine

# We copy just the requirements.txt first to leverage Docker cache
COPY ./requirements.txt /app/requirements.txt

WORKDIR /app
RUN python3 -m venv venv
RUN . venv/bin/activate`
RUN pip install -r requirements.txt

COPY . /app

ENTRYPOINT [ "python" ]

CMD [ "app.py" ]