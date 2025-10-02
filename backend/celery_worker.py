from celery import Celery
import os

# Create the Celery app instance
# The first argument is the name of the current module.
# The broker URL is read from environment variables or a config file.
celery = Celery(
    'tasks',
    broker=os.environ.get('CELERY_BROKER_URL', 'redis://localhost:6379/0'),
    backend=os.environ.get('CELERY_RESULT_BACKEND',
                           'redis://localhost:6379/0'),
    include=['tasks.link_tasks']
)

celery.conf.update(
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='UTC',
    enable_utc=True,
)

if __name__ == '__main__':
    celery.start()
