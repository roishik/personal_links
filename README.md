# personal_links
Site with links of my sites / social networks

## Build
Use Docker to build the application image:
```bash
docker build -t personal_links .
```

## Run
Start the container while exposing port 5000. The application requires an `OPENAI_API_KEY` environment variable so the chatbot can access OpenAI APIs.
```bash
docker run -d -p 5000:5000 -e OPENAI_API_KEY=your_key_here personal_links
```

## Deploy
Tag the image and push it to your registry, then run it on your preferred host.
```bash
docker tag personal_links yourrepo/personal_links:latest
docker push yourrepo/personal_links:latest
```
After deploying, run the container as shown in the run instructions above.
