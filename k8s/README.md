# EpicCart — Kubernetes Demonstration Manifests

> **IMPORTANT NOTICE FOR EXAMINERS & STUDENTS**  
> These manifests demonstrate how EpicCart can be containerized and orchestrated in a production Kubernetes cluster (such as Minikube, Kind, AWS EKS, or GKE).  
> **Current Live Storefront Architecture:** EpicCart is deployed live across managed serverless platforms (React frontend on **Vercel**, Express backend on **Render**, and PostgreSQL on **Neon**). This `k8s/` directory serves as the **academic and DevOps demonstration architecture** to showcase multi-container orchestration, self-healing, scaling, and YAML configuration.

---

## Architecture Overview

```
                      [ Client Traffic (Internet) ]
                                    │
                                    ▼
                [ Ingress Controller (nginx-ingress) ]
                   │ host: epiccart.local
                   ├── /api ──────► [ epiccart-backend-service (ClusterIP:5000) ]
                   │                               │
                   │                               ▼
                   │                   [ Backend Pods (2 Replicas) ]
                   │                   • Port: 5000
                   │                   • Probes: /api/health
                   │                   • DB: Managed Neon PostgreSQL
                   │
                   └── / ─────────► [ epiccart-frontend-service (LoadBalancer:80) ]
                                                   │
                                                   ▼
                                       [ Frontend Pods (2 Replicas) ]
                                       • Port: 80 (Nginx SPA)
                                       • Probes: /
```

---

## File Inventory & Explanations

| File | Resource Kind | Purpose |
| :--- | :--- | :--- |
| `backend-configmap.yaml` | `ConfigMap` | Injects non-sensitive environment variables (`PORT`, `NODE_ENV`, `FRONTEND_URL`, `EMAIL_HOST`) into backend containers. |
| `backend-secret.yaml` | `Secret` | Reference template for sensitive environment variables (`DATABASE_URL`, `JWT_SECRET`, `RAZORPAY_*`, `CLOUDINARY_*`). Contains placeholders—never commit real secrets. |
| `backend-deployment.yaml` | `Deployment` | Manages 2 replicas of the Node.js backend with automated self-healing, rolling updates, CPU/memory limits, and liveness/readiness probes targeting `/api/health`. |
| `backend-service.yaml` | `Service` (`ClusterIP`) | Internal L4 load balancer providing a stable DNS entry (`epiccart-backend-service:5000`) within the cluster network. |
| `frontend-deployment.yaml`| `Deployment` | Manages 2 replicas of the Vite-built React SPA served via Nginx with resource constraints and HTTP health checks. |
| `frontend-service.yaml` | `Service` (`LoadBalancer`)| Exposes the frontend on port 80 to external traffic. |
| `ingress.yaml` | `Ingress` | L7 reverse proxy routing path-based requests (`/api` to backend service, `/` to frontend service). |
| `kustomization.yaml` | `Kustomization` | Groups all manifests for declarative client-side validation and atomic deployment. |

---

## Safe Validation Commands (Class Demonstration)

### 1. Validate manifests client-side without touching any cluster:
```bash
kubectl kustomize k8s/
```
*(This parses all YAML files, validates resource syntax, and prints the resolved manifest stream).*

### 2. Client-side dry-run validation (if kubectl is installed):
```bash
kubectl apply --dry-run=client -k k8s/
```

### 3. Deploy to a local cluster (e.g. Minikube / Kind) — ONLY if demonstrator wishes:
```bash
# 1. Create live secret with real credentials (outside git)
kubectl create secret generic epiccart-backend-secret \
  --from-literal=DATABASE_URL="postgresql://..." \
  --from-literal=JWT_SECRET="..."

# 2. Apply manifests
kubectl apply -k k8s/

# 3. Check deployment status
kubectl get deployments,pods,services,ingress
```

