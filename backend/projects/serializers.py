# pyre-ignore-all-errors
"""
Serializers for the projects app models.
"""
from rest_framework import serializers
from .models import Category, Project, CustomRequest, Order, Feature, BasicCard, PricingCard


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class FeatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feature
        fields = '__all__'


class BasicCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = BasicCard
        fields = '__all__'


class PricingCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = PricingCard
        fields = '__all__'


class ProjectSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_slug = serializers.CharField(source='category.slug', read_only=True)
    silver_card_data = PricingCardSerializer(source='silver_card', read_only=True)
    gold_card_data = PricingCardSerializer(source='gold_card', read_only=True)

    class Meta:
        model = Project
        fields = [
            'id', 'title', 'slug', 'category', 'category_name', 'category_slug',
            'price', 'original_price', 'discount', 'views', 'icon',
            'is_new', 'featured', 'popular', 'description',
            'tech', 'main_image', 'images', 'pricing_tiers',
            'silver_card', 'silver_card_data',
            'gold_card', 'gold_card_data',
        ]


class CustomRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomRequest
        fields = '__all__'


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = '__all__'
