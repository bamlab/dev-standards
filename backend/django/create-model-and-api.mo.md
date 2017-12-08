# [MO] Create a model and an api route (~40 mins)

## Owner: [Alice Breton](https://github.com/AliceB08)

## Prerequisites (~45 mins)

* Have a django project installed with an app created
  [see this](https://github.com/bamlab/dev-standards/blob/master/backend/django/getting-started.mo.md).
* In this example we will use an already existing model `city` in a `locations` app, to show how to integrate other
  models with foreign keys.

## Steps

* In this tutorial we will create a `News` model, add it to the Django admin back-office and create a GET API route to
  retrieve all the news that have been created.

### Create a News model _(~10 min)_

* In this example we will create a new model called `News` that has different attributes as you will see bellow. In the
  _models.py_ file of your app (in our case `Publications`) create a new model.

```python
# File: "our_django_project/publications/models.py"
from django.db import models

class News(models.Model):
    title = models.CharField(max_length=50)
    description = models.TextField(max_length=1000)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    city = models.ForeignKey('locations.city')

    class Meta:
        verbose_name_plural = "News"

    def __str__(self):
        return self.title
```

* `CharField` will return a single line form in the admin; max_length speaks for itself.
  [Here is the Django doc for more information](https://docs.djangoproject.com/en/1.11/ref/models/fields/).
* `TextField` will return a scrollable paragraph in the admin.
* `auto_now_add` generates automatically a timestamp when a news is created.
* `auto_now` updates the timestamp everytime you change the news.
* Concerning the city attribute which is a **many to one** relationship: every piece of news is linked to one city, two
  pieces of news can have the same city.

* It's standard that the name of a model (not class) is singular, and django automatically puts it to plural for
  external use. However here, News is a singular/plural english name, so we need to make sure Django does not add a
  second 's' (Newss) by overriding `verbose_name_plural`

* Finally, make your migrations and migrate. To do this run the following commands in your shell :

```shell
python3 manage.py makemigrations
python3 manage.py migrate
```

or adapt the previous commands, if you run your project with docker.

- Here is an article that goes into more detail [How to Create Django Data Migrations](https://simpleisbetterthancomplex.com/tutorial/2017/09/26/how-to-create-django-data-migrations.html)

#### What you can check!
- You can now check that the migrations are run and that the model exists in the database:

```bash
python3 manage.py showmigrations
```

- You should see the last migration in the list.
- You could also go in the database and check that the table has been created:
```
python3 manage.py dbshell
```
- In the shell display the table (in case of psql `\d`) and check the existence of your model. More info [here](https://docs.djangoproject.com/en/2.0/ref/django-admin/#dbshell)

### Add permissions to a group _(~10 min)_

* Users that are in groups need permission to access the Model. If you don't have a group yet, you can create one by
  clicking on **group** on the admin web site. We can now add permissions to them that will be automatically added when
  you deploy.

```python
# File: "our_django_project/users/apps.py"
from django.apps import AppConfig
from django.contrib.admin import site
from django.db.models.signals import post_migrate


# This function takes a group and a model and adds all the permissions (read, update, delete) of this model to the group
def add_model_permissions(group, model, ContentType, Permission):
    content_type = ContentType.objects.get_for_model(model)
    permissions = Permission.objects.filter(content_type=content_type)
    for permission in permissions:
        group.permissions.add(permission)


# This function takes the model News and adds the permissions to the group Mayor Admin
def add_group_permissions(sender, using, apps, **kwargs):
    Group = apps.get_model("auth", "Group")
    Permission = apps.get_model("auth", "Permission")
    ContentType = apps.get_model("contenttypes", "ContentType")
    News = apps.get_model("publications", "News")   #Add this line

    #If the group Mayor Admin doesn't exist, this piece of code creates it.
    if Group.objects.using(using).filter(name='Mayor Admin').exists():
        group = Group.objects.get(name='Mayor Admin')
    else:
        group = Group.objects.using(using).create(name='Mayor Admin')
    add_model_permissions(group, News, ContentType, Permission) #Add this second line


class UsersConfig(AppConfig):
    name = 'our_django_project.users'
    verbose_name = "Users"

    # Call the add_groups_permissions after the migrations are run
    def ready(self):
        post_migrate.connect(add_group_permissions, sender=self)
```

#### What you can check!
- Create a new user that will be part of the mayor admin group.
- Connect yourself as the mayor and check that you can create pieces of news.


### Add the News model to the admin _(~5 min)_

* We now need to add the model to the admin back-office.

```python
# File: "our_django_project/publications/admin.py"
from django.contrib import admin
from .models import News


@admin.register(News)
class MyNewsAdmin(admin.ModelAdmin):
    list_display = (
        'title',
        'city'
    )
```

If you don't add the `list_display` property, the default column title in the admin will be the result of the magic
method **str** returned in the model (you can read more [here](https://www.python-course.eu/python3_magic_methods.php)).
`list_display` allows you to add several columns to the admin interface.

Without `list_display`:
![](https://user-images.githubusercontent.com/30256638/32740101-2104d6dc-c8a2-11e7-9838-9c2b15bb60a5.png)

With `list_display`:
![](https://user-images.githubusercontent.com/30256638/32740159-50ac5a40-c8a2-11e7-8b9e-89db21193896.png)

You can learn how to add other configuration to your admin by reading the
[official documentation](https://docs.djangoproject.com/en/1.11/ref/contrib/admin/#modeladmin-options)

#### What you can check!
You can now check that the titles on the admin interface have changed.


### Serialize the News you get from the database _(~5 min)_

* Serializers translates Django models into other formats, generally text-based formats. In our project want to get a JSON response. Check out the [official Django doc](https://docs.djangoproject.com/en/1.11/topics/serialization/) for more info.

```python
# File: "our_django_project/publications/serializers.py"
from .models import News
from rest_framework import serializers


class NewsSerializer(serializers.HyperlinkedModelSerializer):
    id = serializers.IntegerField(source='pk')
    city = serializers.StringRelatedField(many=False, source="city.pk")   #We need this to get the primary key of the city that is attached to this news

    class Meta:
        model = News
        fields = ('title', 'description', 'created_at', 'updated_at', 'city', 'id')    #All the fields you wish to get
```

### Create a News ViewSet _(~5 min)_

@ what is it ? what the goal.
[](http://www.django-rest-framework.org/api-guide/viewsets/)

```python
# File: "our_django_project/publications/viewsets.py"
from .models import News
from rest_framework import viewsets
from .serializers import NewsSerializer

#This is an example of filtering the pieces of news with the city-id like this: /?city-id=5
class FilterByCity(object):
    def get_queryset(self):   #You need to override the default get_queryset method
        queryset = super().get_queryset()
        city_id = self.request.query_params.get('city-id')

        # This filters the queryset by city (if there is a city)
        if city_id is not None:
            queryset = queryset.filter(city=city_id)

        return queryset


class NewsViewSet(FilterByCity, viewsets.ModelViewSet):
    queryset = News.objects.all()
    serializer_class = NewsSerializer
```

* The NewsViewSet class will now inherit both classes FilterByCity viewsets.ModelViewSet from right to left. Therefore, the FilterByCity get_queryset method will override the ModelViewSet one.

### Mount the `News` ViewSet to an endpoint using a router _(~5 min)_

* Create a route for the ViewSet.

```python
# File: "our_django_project/config/router.py"
from rest_framework import routers
from our_django_project.users.viewsets import UserViewSet
from our_django_project.locations.viewsets import CityViewSet
from our_django_project.publications.viewsets import NewsViewSet  #Add this line


# Routers provide an easy way of automatically determining the URL conf.
router = routers.DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'locations/cities', CityViewSet)
router.register(r'publications/news', NewsViewSet)    #Add this one too
```

#### What you can check!

* You are good to go! :D

* If you go on this url: `HOST/publications/news/` you should get something like this:

```json
[
  {
    "title": "Reading the article",
    "description": "Hello, I am glad I read this article!",
    "created_at": "2017-11-08T15:31:30.597524Z",
    "updated_at": "2017-11-08T15:31:30.597555Z",
    "city": "66",
    "id": 2
  },
  {
    "title": "Tutorial",
    "description": "I followed the tutorial to create a new model",
    "created_at": "2017-11-08T15:33:28.834694Z",
    "updated_at": "2017-11-08T15:33:28.834721Z",
    "city": "66",
    "id": 3
  },
  {
    "title": "Les français adorent !",
    "description": "J'ai lu cet article, il m'a aidé à faire mon premier modèle, youhouu !",
    "created_at": "2017-11-08T15:20:33.457740Z",
    "updated_at": "2017-11-08T16:54:19.322703Z",
    "city": "5",
    "id": 1
  }
]
```

* If you go on this url: `HOST/publications/news/?city-id=5` (that is filtered) you should get something like this:

```json
[
  {
    "title": "Les français adorent !",
    "description": "Je suis française et j'ai lu cet article, il m'a aidé à faire mon premier modèle, youhouu !",
    "created_at": "2017-11-08T15:20:33.457740Z",
    "updated_at": "2017-11-08T16:54:19.322703Z",
    "city": "5",
    "id": 1
  }
]
```
