pipeline {
    agent any

    environment {
        NODE_ENV = 'production'
        // Mock variables for Jenkins pipeline
        DOCKER_REGISTRY = 'dockerhub_username' 
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Backend: Install & Test') {
            steps {
                dir('backend') {
                    sh 'npm install'
                    // If we had a test script, we would run it here
                    // sh 'npm test' 
                }
            }
        }

        stage('Frontend: Install & Build') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }

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

        // Future stages: Push to registry, trigger deployment webhook
    }

    post {
        success {
            echo 'Pipeline completed successfully.'
        }
        failure {
            echo 'Pipeline failed. Check logs for details.'
        }
    }
}

