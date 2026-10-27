// Declarative Jenkins pipeline defining the continuous integration workflow for EpicCart
pipeline {
    // Run on any available Jenkins agent/executor
    agent any

    environment {
        NODE_ENV = 'production'
        // Placeholder username for Docker Hub image registry
        DOCKER_REGISTRY = 'dockerhub_username' 
    }

    stages {
        // Stage 1: Pull the latest code from version control (Git)
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        // Stage 2: Install backend dependencies
        stage('Backend: Install & Test') {
            steps {
                dir('backend') {
                    // Fast, deterministic package install based on package-lock.json
                    sh 'npm install'
                    // Note: npm test is commented out because no automated unit tests are written yet
                    // sh 'npm test' 
                }
            }
        }

        // Stage 3: Install frontend dependencies and verify Vite compilation
        stage('Frontend: Install & Build') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                    // Compiles React JSX and catches any build-time or syntax errors
                    sh 'npm run build'
                }
            }
        }

        // Stage 4: Build Docker images for both backend and frontend
        // Note: These docker commands are currently illustrative placeholders in our demonstration pipeline
        stage('Build Docker Images') {
            steps {
                script {
                    echo "Building backend Docker image..."
                    // sh "docker build -t ${DOCKER_REGISTRY}/epiccart-backend:latest ./backend"
                    
                    echo "Building frontend Docker image..."
                    // sh "docker build -t ${DOCKER_REGISTRY}/epiccart-frontend:latest ./frontend"
                }
            }
        }
    }

    // Post-build notifications triggered after pipeline stages finish
    post {
        success {
            echo 'Pipeline completed successfully.'
        }
        failure {
            echo 'Pipeline failed. Check logs for details.'
        }
    }
}
