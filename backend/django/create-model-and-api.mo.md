# [MO] Create a model and an api route (~20 mins)

## Owner: Alice Breton

## Prerequisites (~2 mins)

- Have a django project installed, [see this](https://github.com/bamlab/dev-standards/blob/master/backend/django/getting-started.mo.md).
- Have an app (in this example Publications).
- In this example we will use an already existing model 'city' in a 'locations' app, to show how to integrate other models with foreign keys.

## Steps  

- In this tutorial we will create a News model, add it to the Django admin back-office and an API route to get all the pieces of news that have been created.
- To give a full example, we will ==== REMPLIR

### Create a News model *(~10 min)*

- In this example we will create a new model called News, with different attributes as you will see bellow. In the models.py file of your app (in our case Publications) create a new model. 

ourproject/publications/models.py
```python
from django.db import models

class News(models.Model):
    title = models.CharField(max_length=50)   #CharField is a single line form in the admin; max_length speaks for itself
    description = models.TextField(max_length=1000)   #TextField is a scrollable paragraph in the admin
    created_at = models.DateTimeField(auto_now_add=True)    #auto_now_add generates automatically a timestamp when you create your create the news
    updated_at = models.DateTimeField(auto_now=True)    #auto_now updates the timestamp everytime you change the news
    city = models.ForeignKey('locations.city')    #All the cities of the City model of the locations app

    class Meta:
        verbose_name_plural = "News"    #The name of the class should be singular, this forces the plural to be News and not Newss

    def __str__(self):
        return self.title
```


- If you have users that are in groups, they need the permission to access to the Model. We won't explain how to create a group, we just want to show you how to add permissions to them. They will be added automaticcaly when you deploy.

ouproject/users/apps/py
```python
from django.apps import AppConfig
from django.contrib.admin import site
from django.db.models.signals import post_migrate


class UsersConfig(AppConfig):
    name = 'intramuros.users'
    verbose_name = "Users"

    def ready(self):
        post_migrate.connect(add_group_permissions, sender=self)


def add_model_permissions(group, model, ContentType, Permission):
    content_type = ContentType.objects.get_for_model(model)
    permissions = Permission.objects.filter(content_type=content_type)
    for permission in permissions:
        group.permissions.add(permission)


def add_group_permissions(sender, using, apps, **kwargs):
    Group = apps.get_model("auth", "Group")
    Permission = apps.get_model("auth", "Permission")
    ContentType = apps.get_model("contenttypes", "ContentType")
    News = apps.get_model("publications", "News")   #Add this line

    if Group.objects.using(using).filter(name='Mayor Admin').exists():
        group = Group.objects.get(name='Mayor Admin')
    else:
        group = Group.objects.using(using).create(name='Mayor Admin')
    add_model_permissions(group, News, ContentType, Permission) #Add this second line
```

- Finally, make your migrations and migrate.


### Add the News model to the admin *(~2 min)*

- We now need to add the model to the admin back-office.

ourproject/publications/admin.py
```python
from django.contrib import admin
from .models import News


@admin.register(News)
class MyNewsAdmin(admin.ModelAdmin):
    list_display = (
        'title',
        'city'
    )
```

If you don't override `list_display` by writing `pass` instead of `list_display`, the default column title in the admin will be the __str__ returned in the model.
list_display allows you to add several columns to the admin interface.


### Serialize the News you get from the database *(~2 min)*

- Serializers define the API representation.


ourproject/publications/serializers.py
```python
from .models import News
from rest_framework import serializers


class NewsSerializer(serializers.HyperlinkedModelSerializer):
    id = serializers.IntegerField(source='pk')
    city = serializers.StringRelatedField(many=False, source="city.pk")   #We need this to get the primary key of the city that is attached to this news

    class Meta:
        model = News
        fields = ('title', 'description', 'created_at', 'updated_at', 'city', 'id')    #All the fields you wish to get
```


### Create a News ViewSet *(~2 min)*


```python
from .models import News
from rest_framework import viewsets
from .serializers import NewsSerializer

#This is an example of filtering the pieces of news with the city-id like this: /?city-id=5
class FilterByCity(object):   
    def get_queryset(self):   #You need to override the default get_queryset method
        queryset = super().get_queryset()
        city_id = self.request.query_params.get('city-id')
        if city_id is not None:
            queryset = queryset.filter(city=city_id)
        return queryset


class NewsViewSet(FilterByCity, viewsets. ):
    queryset = News.objects.all()
    serializer_class = NewsSerializer
```

- The NewsViewSet class will now inherit both classes FilterByCity viewsets.ModelViewSet from right to left. The FilterByCity get_queryset method will override the ModelViewSet one because the class is the furthest at the left.



### Create a News ViewSet *(~2 min)*

- Create a route for the ViewSet.

ouproject/config/router.py
```python
from rest_framework import routers
from intramuros.users.viewsets import UserViewSet
from intramuros.locations.viewsets import CityViewSet
from intramuros.publications.viewsets import NewsViewSet  #Add this line


# Routers provide an easy way of automatically determining the URL conf.
router = routers.DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'locations/cities', CityViewSet)
router.register(r'publications/news', NewsViewSet)    #Add this one too
```

- You are good to go! :D

- If you go on this url: HOST/publications/news/

- you should get something like this:

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
        "title": "Hate comment",
        "description": "I didn't find this interesting, I already knew everything...",
        "created_at": "2017-11-08T15:33:28.834694Z",
        "updated_at": "2017-11-08T15:33:28.834721Z",
        "city": "66",
        "id": 3
    },
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


- If you go on this url: HOST/publications/news/?city-id=5 (that is filtered)

- you should get something like this:

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
