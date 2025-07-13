# Personal Links

Site with links of my sites / social networks

## 🚀 Deployment

This project supports multiple deployment options:

### Google Cloud Platform (Recommended)
This project is configured for deployment on Google Cloud Platform. See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

#### Quick Deploy to GCP
1. Install Google Cloud SDK
2. Run `gcloud auth login`
3. Update `deploy.sh` with your project ID
4. Run `./deploy.sh`

### Docker Deployment
Use Docker to build and run the application:

#### Build
```bash
docker build -t personal_links .
```

#### Run
Start the container while exposing port 8080. The application requires an `OPENAI_API_KEY` environment variable so the chatbot can access OpenAI APIs.
```bash
docker run -d -p 8080:8080 -e OPENAI_API_KEY=your_key_here personal_links
```

#### Deploy
Tag the image and push it to your registry, then run it on your preferred host.
```bash
docker tag personal_links yourrepo/personal_links:latest
docker push yourrepo/personal_links:latest
```

## 🛠️ Development

```bash
npm install
npm run dev
```

## 📦 Build

```bash
npm run build
```
