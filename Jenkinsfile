pipeline {
    agent any

    environment {
        SONAR_SERVER = 'sonar-server'
        SONAR_SCANNER = 'sonar-scanner'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    credentialsId: 'github-pat',
                    url: 'https://github.com/Ayush-yash/Habit-track.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Run Tests & Coverage') {
            steps {
                // Generates lcov.info in coverage/ folder
                sh 'npx vitest run --coverage'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                script {
                    def scannerHome = tool "${SONAR_SCANNER}"

                    withSonarQubeEnv("${SONAR_SERVER}") {
                        sh """
                            ${scannerHome}/bin/sonar-scanner \
                            -Dsonar.projectKey=habit-tracker \
                            -Dsonar.projectName='Habit Tracker' \
                            -Dsonar.sources=src \
                            -Dsonar.exclusions=node_modules/**,dist/**,**/*.test.js,**/*.test.jsx \
                            -Dsonar.tests=src \
                            -Dsonar.test.inclusions=**/*.test.js,**/*.test.jsx \
                            -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info
                        """
                    }
                }
            }
        }

        stage('Quality Gate') {
            steps {
                timeout(time: 10, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }
    }
}
