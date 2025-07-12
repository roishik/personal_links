# Deploying to Google Cloud Platform

This guide will help you deploy your personal links application to Google Cloud Platform.

## Prerequisites

1. **Google Cloud Account**: You need a Google Cloud account with billing enabled
2. **Google Cloud SDK**: Install the Google Cloud SDK
3. **Node.js**: Ensure you have Node.js 20+ installed

## Option 1: Deploy to App Engine (Recommended)

### Step 1: Install Google Cloud SDK

```bash
# macOS (using Homebrew)
brew install google-cloud-sdk

# Or download from: https://cloud.google.com/sdk/docs/install
```

### Step 2: Authenticate and Set Up Project

```bash
# Login to Google Cloud
gcloud auth login

# Create a new project (or use existing)
gcloud projects create your-unique-project-id

# Set the project
gcloud config set project your-unique-project-id

# Enable required APIs
gcloud services enable appengine.googleapis.com
gcloud services enable cloudbuild.googleapis.com
```

### Step 3: Update Configuration

Edit `deploy.sh` and replace `your-project-id` with your actual project ID.

### Step 4: Deploy

```bash
# Make the script executable (if not already)
chmod +x deploy.sh

# Run the deployment
./deploy.sh
```

## Option 2: Deploy to Cloud Run

### Step 1: Enable Cloud Run API

```bash
gcloud services enable run.googleapis.com
```

### Step 2: Build and Deploy

```bash
# Build the Docker image
docker build -t gcr.io/your-project-id/personal-links .

# Push to Container Registry
docker push gcr.io/your-project-id/personal-links

# Deploy to Cloud Run
gcloud run deploy personal-links \
  --image gcr.io/your-project-id/personal-links \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080
```

## Option 3: Automated Deployment with Cloud Build

### Step 1: Enable Cloud Build API

```bash
gcloud services enable cloudbuild.googleapis.com
```

### Step 2: Deploy

```bash
# Submit build to Cloud Build
gcloud builds submit --config cloudbuild.yaml
```

## Environment Variables

If your application uses environment variables, you can set them in the `app.yaml` file:

```yaml
env_variables:
  NODE_ENV: "production"
  DATABASE_URL: "your-database-url"
  # Add other environment variables as needed
```

## Custom Domain (Optional)

To use a custom domain:

1. **Add domain to App Engine**:
   ```bash
   gcloud app domain-mappings create your-domain.com
   ```

2. **Update DNS**: Add the CNAME record provided by Google Cloud

## Monitoring and Logs

- **View logs**: `gcloud app logs tail -s default`
- **Monitor**: Visit the Google Cloud Console
- **Metrics**: Available in the App Engine dashboard

## Cost Optimization

- App Engine automatically scales to zero when not in use
- F1 instances are cost-effective for small applications
- Consider using Cloud Run for even better cost optimization

## Troubleshooting

### Common Issues

1. **Port Issues**: Ensure your app listens on `process.env.PORT`
2. **Build Failures**: Check that all dependencies are in `package.json`
3. **Static Files**: Ensure static files are properly served

### Useful Commands

```bash
# View app status
gcloud app describe

# View logs
gcloud app logs tail

# Open app in browser
gcloud app browse

# List versions
gcloud app versions list
```

## Security Considerations

1. **Environment Variables**: Never commit sensitive data to version control
2. **HTTPS**: App Engine automatically provides HTTPS
3. **Authentication**: Consider adding authentication if needed

## Next Steps

After deployment, your app will be available at:
- App Engine: `https://your-project-id.appspot.com`
- Cloud Run: `https://personal-links-xxxxx-uc.a.run.app`

Remember to update your DNS settings if you're using a custom domain! 