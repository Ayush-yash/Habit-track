pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'habit-tracker-app'
        DOCKER_TAG = 'latest'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                bat 'npm run test:ci'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                // Requires SonarQube Scanner plugin configured in Jenkins
                withSonarQubeEnv('SonarQube') {
                    bat 'sonar-scanner'
                }
            }
        }

        stage('Build React App') {
            steps {
                bat 'npm run build'
            }
        }

        stage('Build Docker Image') {
            steps {
                bat "docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} ."
            }
        }

        stage('Deploy with Docker') {
            steps {
                bat "docker stop ${DOCKER_IMAGE} || exit 0"
                bat "docker rm ${DOCKER_IMAGE} || exit 0"
                bat "docker run -d -p 8080:80 --name ${DOCKER_IMAGE} ${DOCKER_IMAGE}:${DOCKER_TAG}"
            }
        }
    }
}
