#!/bin/bash

# Deploy to Google Cloud Platform
echo "🚀 Deploying to Google Cloud Platform..."

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ Google Cloud SDK is not installed. Please install it first:"
    echo "https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Check if user is authenticated
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    echo "❌ Not authenticated with Google Cloud. Please run:"
    echo "gcloud auth login"
    exit 1
fi

# Set project ID (replace with your project ID)
PROJECT_ID="your-project-id"
echo "📋 Using project: $PROJECT_ID"

# Set the project
gcloud config set project $PROJECT_ID

# Build the application
echo "🔨 Building application..."
npm run build

# Deploy to App Engine
echo "🚀 Deploying to App Engine..."
gcloud app deploy app.yaml --quiet

echo "✅ Deployment complete!"
echo "🌐 Your app is available at: https://$PROJECT_ID.appspot.com" 