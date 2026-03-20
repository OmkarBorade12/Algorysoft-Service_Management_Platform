"""
Models for the projects app. Optimized database schema.
"""
from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    icon = models.CharField(max_length=50)

    def __str__(self):
        return self.name

class Project(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    original_price = models.DecimalField(max_digits=10, decimal_places=2)
    discount = models.IntegerField()
    views = models.IntegerField(default=0)
    icon = models.CharField(max_length=50)
    is_new = models.BooleanField(default=False)
    featured = models.BooleanField(default=False)
    popular = models.BooleanField(default=False)
    description = models.TextField()
    tech = models.JSONField(default=list)
    main_image = models.TextField(blank=True, null=True)
    images = models.JSONField(default=list)
    pricing_tiers = models.JSONField(default=dict, blank=True, null=True)

    def __str__(self):
        return self.title

class CustomRequest(models.Model):
    client = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True, null=True)
    business = models.CharField(max_length=100, blank=True, null=True)
    requirements = models.TextField()
    status = models.CharField(max_length=50, default='New')
    date = models.DateTimeField(auto_now_add=True)
    timeline = models.CharField(max_length=100, blank=True, null=True)
    budget = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return f"Request from {self.client}"

class Order(models.Model):
    order_id = models.CharField(max_length=50, unique=True, null=True)
    client_name = models.CharField(max_length=100)
    client_email = models.EmailField()
    product = models.CharField(max_length=200)
    tier = models.CharField(max_length=50)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=50, default='Pending')
    progress = models.IntegerField(default=0)
    date = models.DateTimeField(auto_now_add=True)
    razorpay_order_id = models.CharField(max_length=100, blank=True, null=True)
    razorpay_payment_id = models.CharField(max_length=100, blank=True, null=True)
    chat = models.JSONField(default=list, blank=True)

    def __str__(self):
        return f"Order {self.order_id} - {self.client_name}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2)

class Feature(models.Model):
    name = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.name
