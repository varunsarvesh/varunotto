from django.db import models

# Create your models here.


class Category(models.Model):
    Name = models.TextField(null=False)

    def __str__(self):
        return self.Name


class Brand(models.Model):
    Name = models.TextField(null=False)
    Categories = models.ManyToManyField(Category)

    def __str__(self):
        return self.Name

