# [MO] Create Complex User Models in Django in 1/2 hour (~30 min)

## Owner: [Sammy Teillet](https://github.com/samox)

## Context

- You have a Django project installed.
- You need to handle different types of users (for instance an Actor, a Producer, a Director) that will all inherit from the user, but will have different properties.
- You want to handle them from the admin.

## Prerequisites (~45min)

- Have the project installed, [see this](https://github.com/bamlab/dev-standards/blob/master/backend/django/getting-started.mo.md)

## Situation

- You have a basic user model with a name.
- You want to create another type of user, a Mayor that has a City (the city is a foreign key to a City model). 
- You do not want to override the classic user model.
- You want to create a Mayor from the admin
- You want the newly created Mayor to be part of the Staff (Staff User can access the admin, but they are not SuperUser)

## Steps

### Add the Mayor model (5 min)

- In the models.py file, where the User is defined, create a new class that inherits the User

```python
# You should have the User in the same file, or from app.models import User

class Mayor(User):
    city = models.ForeignKey('locations.city')

    class Meta:
        verbose_name = "Mayor"
```

- Create the migration file: `./manage.py makemigrations` or `docker-compose run django_container_name ./manage.py makemigrations`
- Run the migration: `./manage.py migrate` or `docker-compose run django_container_name ./manage.py migrate`

> **Check 1:** Run the show migration command to see the new one ``./manage.py showmigrations``

### Create a Mayor from the admin (5 min)

- In the admin.py, where the User model is added `admin.register(User)`
- Add the following:

```python
from .models import Mayor
from django.contrib.auth.admin import UserAdmin

@admin.register(Mayor)
class MyMayorAdmin(UserAdmin):
    pass
```

> **Check 1:** You now see the Mayor in the admin. But all the forms (form to add a Mayor, form to change/update a Mayor) are the same as for the regular User.

### Override the admin form to add a Mayor (10 min)

- In the admin.py when you declared your MyMayorAdmin class, you can choose the fields you want to display in the form by overriding the `add_fieldsets` property. You can readme more about `add_fieldset` [here:](https://docs.djangoproject.com/en/1.11/topics/auth/customizing/#a-full-example)
- You need to know the fields you want to display. `username`, `password1` and `password2` are default fields of the "user admin add form"
- In our case:

```python
from .models import Mayor
from django.contrib.auth.admin import UserAdmin

class MyMayorAdmin(AuthUserAdmin):
    add_fieldsets = (
            ('User Profile', {'fields': ('username', 'city', 'password1', 'password2')}),
    )
```

> **Check 1:** You now see the city field in the "add new mayor" form.

### Give admin property to mayor user (10 min)

- You can manually set a user to be part of the staff, you can also override the save method of the AddForm so it changes the property is_staff to True
- First create a form that inherits the AddUserForm and override the save method (see [overriding custom model method](https://docs.djangoproject.com/en/1.11/topics/db/models/#overriding-predefined-model-methods)):

```python
from django.contrib.auth.forms import UserCreationForm

class MyMayorCreationForm(UserCreationForm):

    class Meta(UserCreationForm.Meta):
        model = Mayor

    def save(self, commit=True):
        user = super().save(commit=False)
        user.is_staff = True
        if commit:
            user.save()
        return user
```

- Then use this form in the MyMayorAdmin class:

```python
@admin.register(Mayor)
class MyMayorAdmin(AuthUserAdmin):
    add_form = MyMayorCreationForm
```

> **Check 1**: When I create a mayor, I see that it is staff user in the detail view of the mayor.
