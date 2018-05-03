# \[MO\] How to deploy your Django back-end to AWS

## Owner: [Xavier Lefèvre](https://github.com/xavierlefevre)

## Creation date: November, 13th 2017

## Update date: November, 29th 2017

## Context

* You want to host your back-end with [Amazon Web Services](https://aws.amazon.com/)

## Prerequisites

* Have python3 and pip3 installed
* Have a Django project, [see this if you want to start one](https://github.com/bamlab/dev-standards/blob/master/backend/django/getting-started.mo.md)
* Have an AWS account ready to pay services: [https://portal.aws.amazon.com/billing/signup\#/start](https://portal.aws.amazon.com/billing/signup#/start)

## Steps

### Create on AWS website an Identity and Access Management for the project \(~5min\)

* Find IAM from AWS services
* Go to the User tab
* "Add user"
* Give it a name and all access types
* Attach the below "existing policies directly"
  * AmazonRDSFullAccess
  * AmazonEC2FullAccess
  * AmazonElastiCacheFullAccess
  * AmazonS3FullAccess
  * AWSElasticBeanstalkFullAccess
* Retrieve and store somewhere safe the IAM user access and security key

### Set-up your Elastic Beanstalk \(EB\) environment \(~10min\)

* Install EB CLI: 

  ```bash
  pip3 install awsebcli
  ```

* Set up your EB environment, in your project root directory:

  ```bash
  eb init
  ```

  * Select your server location, close to where your customers will be:

    ```text
    Select a default region
    1) us-east-1 : US East (N. Virginia)
    2) us-west-1 : US West (N. California)
    3) us-west-2 : US West (Oregon)
    4) eu-west-1 : EU (Ireland)
    5) eu-central-1 : EU (Frankfurt)
    6) ap-southeast-1 : Asia Pacific (Singapore)
    7) ap-southeast-2 : Asia Pacific (Sydney)
    8) ap-northeast-1 : Asia Pacific (Tokyo)
    9) sa-east-1 : South America (Sao Paulo)
    10) cn-north-1 : China (Beijing)
    (default is 3):
    ```

  * Connect to your IAM user
  * Give a general name to your instance, generally the name of the project/company, example: name\_of\_project-staging
  * Precise that you are using Python 3+
  * Say no to "CodeCommit"
  * Generate a new SSH Keypair that you will share with your teammates

    > Check: EB should have generated a ".elasticbeanstalk" folder in your directory with your configuration

* You can commit finally your setup

  ```bash
  git add .
  git commit -m "Created EB project instance"
  ```

### Configure your project for EB \(~15min\)

* We use cookiecutter as our base Django project at BAM, so we will use their configuration for EB:
  * Create a ".ebextensions" in your project root directory
  * Copy the [EB configuration from cookie cutter repo](https://github.com/pydanny/cookiecutter-django/tree/master/{{cookiecutter.project_slug}}/.ebextensions)
    * In "10\_packages.config":

      ```text
      packages:
        yum:
          git: []
          postgresql95-devel: []
          libjpeg-turbo-devel: []
          libffi: []
          libffi-devel: []
      ```

    * Copy "20\_elasticcache.config", "30\_options.config", "50\_apache.config" and "enable\_mod\_deflate.conf" as is
    * Copy "40\_python.config" but change the last two lines with:

      ```text
      "aws:elasticbeanstalk:container:python:staticfiles":
        "/static/": "/staticfiles/"
      ```
* To connect to RDS, add a database configuration to your Django config in "base.py" or "production.py":

  ```text
  # DATABASE CONFIGURATION
  # ------------------------------------------------------------------------------

  if 'RDS_DB_NAME' in os.environ:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql_psycopg2',
            'NAME': env('RDS_DB_NAME'),
            'USER': env('RDS_USERNAME'),
            'PASSWORD': env('RDS_PASSWORD'),
            'HOST': env('RDS_HOSTNAME'),
            'PORT': env('RDS_PORT'),
        }
    }
  else:
      DATABASES['default'] = env.db('DATABASE_URL')
  ```

* To serve your statics from AWS, update also the Django config in "base.py":

  ```text
  # STATIC FILE CONFIGURATION
  # ------------------------------------------------------------------------------

  STATIC_ROOT = 'staticfiles'
  STATIC_URL = '/staticfiles/'
  ```

* You can commit your setup

  ```bash
  git add .
  git commit -m "Added python, django and database config and requirements files"
  ```

### Deploying the application \(~45min\)

* For the first time you will create the instance, hence all the necessary servers:

  ```bash
  eb create --scale 1 -db -db.engine postgres -db.i db.t2.micro
  ```

  * Name your environment, like:  project-name-staging
  * Select the default CNAME
  * Select the classic load balancer option
  * Choose a username and password to connect to the DB

* EB will now generate all your servers and provision your config then launch your project
* But you might still have errors `eb logs`, you are missing environment variables that you can directly add to AWS website
  * On AWS website, on the top right, select the right server location \(ex: London\)
  * Go to Elastic Beanstalk
  * Enter your new application
  * Go to configuration
  * Modify the software configuration with variables such as:

    ```text
    DJANGO_ACCOUNT_ALLOW_REGISTRATION, DJANGO_ADMIN_URL, DJANGO_ALLOWED_HOSTS, DJANGO_AWS_ACCESS_KEY_ID, DJANGO_AWS_SECRET_ACCESS_KEY, DJANGO_MAILGUN_API_KEY, DJANGO_SECRET_KEY, DJANGO_SECURE_SSL_REDIRECT, DJANGO_SENTRY_DSN, DJANGO_SERVER_EMAIL, DJANGO_SETTINGS_MODULE, MAILGUN_SENDER_DOMAIN, REDIS_ENDPOINT_ADDRESS, REDIS_PORT
    ```

    > Check 1: You can verify on the AWS website that each server piece has been created \(EB, RDS, S3, EC2\)  
    > Check 2: You can access the aws.ip/admin

### Create a superadmin \(~10min\)

Now that you have deployed once, on your host you should have the credentials for AWS \(cat ~/.aws/config\).

To create a super user you will have to connect directly to the machine in order to run ./manage.py createsuperuser.

* To ssh to your EC2 machine run eb ssh \[PUT YOUR INSTANCE NAME IF NOT BY DEFAULT\]
* Then on the machine go to the root of the project:

  ```bash
  cd /opt/python/current
  ```

* Add the python environment:

  ```bash
  source ./env
  ```

* Run the createuser command:

  ```bash
  cd /app
  ./manage.py createsuperuser
  ```

  > Check: You can access the aws.ip/admin and go through now with your newly created superadmin

### Debug

```bash
eb logs
```

### Deployment

```bash
eb deploy
```

### Sources

* [Cookie-cutter Django repository](https://github.com/pydanny/cookiecutter-django)
* [Step by step tutorial to deploy Django to AWS EB](https://jamesonricks.com/tutorial-deploying-python-3-django-postgresql-to-aws-elastic-beanstalk/)
* [Another tutorial to deploy Django to AWS EB](https://realpython.com/blog/python/deploying-a-django-app-and-postgresql-to-aws-elastic-beanstalk/)

