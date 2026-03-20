from rest_framework import serializers
from .models import Category, Project, CustomRequest, Order, Feature

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class FeatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feature
        fields = '__all__'

class ProjectSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_slug = serializers.CharField(source='category.slug', read_only=True)
    
    class Meta:
        model = Project
        fields = [
            'id', 'title', 'slug', 'category', 'category_name', 'category_slug',
            'price', 'original_price', 'discount', 'views', 'icon', 
            'is_new', 'featured', 'popular', 'description', 
            'tech', 'main_image', 'images', 'pricing_tiers'
        ]

class CustomRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomRequest
        fields = '__all__'

class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = '__all__'
