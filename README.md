# Ticketing App

### Running App
 1. `minikube start` 
 2. `minikube addons enable ingress`
 3. `skaffold dev` 

### Kubernetes setup
 1. `kubectl create secret generic jwt-secret --from-literal=JWT_KEY=secret` - create a secret
