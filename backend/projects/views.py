# pyre-ignore-all-errors
"""
Views for the projects app. These views handle API requests.
"""
import os
from io import BytesIO
from django.core.mail import send_mail, EmailMessage
from django.conf import settings
from django.template.loader import render_to_string
from django.db.models import Count
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from xhtml2pdf import pisa

from .models import Category, Project, CustomRequest, Order, Feature, BasicCard, PricingCard, Carousel
from .serializers import (
    CategorySerializer,
    ProjectSerializer,
    CustomRequestSerializer,
    OrderSerializer,
    FeatureSerializer,
    BasicCardSerializer,
    PricingCardSerializer,
    CarouselSerializer,
)


class CarouselViewSet(viewsets.ModelViewSet):
    queryset = Carousel.objects.all().order_by('order')
    serializer_class = CarouselSerializer
    filterset_fields = ['type', 'is_active']


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class FeatureViewSet(viewsets.ModelViewSet):
    queryset = Feature.objects.all()
    serializer_class = FeatureSerializer


class BasicCardViewSet(viewsets.ModelViewSet):
    """Singleton-style BasicCard – only one record used (id=1)."""
    queryset = BasicCard.objects.all()
    serializer_class = BasicCardSerializer


class PricingCardViewSet(viewsets.ModelViewSet):
    queryset = PricingCard.objects.all().order_by('-created_at')
    serializer_class = PricingCardSerializer


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    filterset_fields = ['category__slug', 'featured', 'is_new']
    search_fields = ['title', 'description', 'tech']
    ordering_fields = ['price', 'views', 'discount']


class CustomRequestViewSet(viewsets.ModelViewSet):
    queryset = CustomRequest.objects.all().order_by('-date')
    serializer_class = CustomRequestSerializer


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    def update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return super().partial_update(request, *args, **kwargs)


@api_view(['GET'])
@permission_classes([AllowAny])
def landing_stats(request):
    """Provides public stats for the landing page."""
    # Only count orders that are fully Completed
    completed_orders = Order.objects.filter(status='Completed')

    # Websites delivered = number of completed orders
    order_count = completed_orders.count()

    # Happy businesses = unique clients who have at least one Completed order
    unique_emails = completed_orders.values_list('client_email', flat=True).distinct()

    return Response({
        'websites_delivered': order_count,
        'happy_businesses': unique_emails.count(),
        'avg_rating': '5.0',
    })


@api_view(['POST'])
@permission_classes([AllowAny])
def send_invoice_email(request):
    """Sends an invoice notification email to the client with a PDF attachment."""
    data = request.data
    client_email = data.get('client_email')
    invoice_no = data.get('invoice_no')
    status_label = data.get('status')
    amount = data.get('amount')
    client_name = data.get('client_name')

    if not client_email:
        return Response({'error': 'No client email provided'}, status=status.HTTP_400_BAD_REQUEST)

    subject = f"Invoice {invoice_no} from AlgorySoft - {status_label}"
    
    # Email body (Text)
    if status_label == 'Paid':
        body = f"Hello {client_name},\n\nWe have received your payment of {amount} for Invoice {invoice_no}. Thank you for your business!\n\nPlease find the official Tax Invoice attached to this email.\n\nBest Regards,\nAlgorySoft Team"
    else:
        body = f"Hello {client_name},\n\nYour invoice {invoice_no} for {amount} has been generated. Please find the details attached.\n\nStatus: Unpaid (Due soon)\n\nBest Regards,\nAlgorySoft Team"

    # HTML for PDF (Simplified format)
    html_content = f"""
    <html>
    <head>
        <style>
            @page {{ size: A4; margin: 1cm; }}
            body {{ font-family: Helvetica, Arial, sans-serif; font-size: 10pt; color: #333; }}
            .header {{ text-align: center; border-bottom: 2px solid #5e35b1; padding-bottom: 10px; margin-bottom: 20px; }}
            .section-title {{ font-size: 18pt; font-weight: bold; text-transform: uppercase; color: #5e35b1; }}
            .grid {{ width: 100%; margin-bottom: 20px; }}
            .grid td {{ vertical-align: top; width: 50%; }}
            .table {{ width: 100%; border-collapse: collapse; border: 1px solid #000; margin-top: 20px; }}
            .table th {{ background: #f0f0f0; border: 1px solid #000; padding: 8px; font-size: 8pt; }}
            .table td {{ border: 1px solid #000; padding: 8px; font-size: 9pt; }}
            .total-box {{ float: right; width: 250px; background: #f8f8f8; padding: 15px; border: 1px solid #ddd; margin-top: 20px; }}
            .footer {{ margin-top: 50px; font-size: 8pt; color: #777; border-top: 1px solid #eee; padding-top: 10px; }}
        </style>
    </head>
    <body>
        <div class="header">
            <div class="section-title">Tax Invoice</div>
        </div>
        <table class="grid">
            <tr>
                <td>
                    <strong>Sold By:</strong> AlgorySoft Private Limited<br>
                    Gadag, Karnataka, India - 582101<br>
                    <strong>GSTIN:</strong> 29AAECB1611P1ZJ
                </td>
                <td style="text-align: right;">
                    <strong>Invoice Number:</strong> {invoice_no}<br>
                    <strong>Date:</strong> {data.get('date', 'N/A')}
                </td>
            </tr>
        </table>
        <table class="grid">
            <tr>
                <td>
                    <strong>Bill To:</strong><br>
                    {client_name}<br>
                    {data.get('client_email')}
                </td>
                <td style="text-align: right;">
                    <strong>Order ID:</strong> ORD-{invoice_no.split('-')[-1]}<br>
                    <strong>Status:</strong> {status_label}
                </td>
            </tr>
        </table>
        <table class="table">
            <thead>
                <tr>
                    <th>Description</th>
                    <th style="width: 50px;">Qty</th>
                    <th>Rate</th>
                    <th>GST ({data.get('gst_percent', 18)}%)</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{data.get('project_name', 'Professional Services')}</td>
                    <td style="text-align: center;">1</td>
                    <td style="text-align: right;">{amount}</td>
                    <td style="text-align: right;">{data.get('gst_percent', 18)}%</td>
                    <td style="text-align: right; font-weight: bold;">{amount}</td>
                </tr>
            </tbody>
        </table>
        <div class="total-box">
            <table style="width: 100%;">
                <tr><td style="font-size: 14pt; font-weight: bold; color: #5e35b1;">Grand Total:</td><td style="text-align: right; font-size: 14pt; font-weight: bold;">{amount}</td></tr>
            </table>
        </div>
        <div style="clear: both;"></div>
        <div class="footer">
            <strong>Returns Policy:</strong> Service discussions within 14 days of invoice emission.
            <div style="margin-top: 10px; color: #000; font-weight: bold;">Authorized Signatory for AlgorySoft</div>
            <center><p>Thank you for choosing AlgorySoft!</p></center>
        </div>
    </body>
    </html>
    """

    # Generate PDF in memory
    pdf_buffer = BytesIO()
    pisa_status = pisa.CreatePDF(html_content, dest=pdf_buffer)

    if pisa_status.err:
        return Response({'error': 'Failed to generate PDF'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    try:
        # Create EmailMessage with attachment
        email = EmailMessage(
            subject=subject,
            body=body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[client_email],
        )
        email.attach(f"Invoice_{invoice_no}.pdf", pdf_buffer.getvalue(), "application/pdf")
        email.send()
        
        return Response({'message': 'Tax Invoice sent successfully with PDF attachment!'})
    except Exception as e:
        print(f"SMTP Error: {e}")
        return Response({'message': 'Invoice processed, but email skip triggered.', 'warning': str(e)})
