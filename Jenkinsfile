pipeline {
    agent any

    tools {
        nodejs "nodejs"
    }

    stages {

        stage('Checkout') {
            steps {
                echo "Building branch: ${env.BRANCH_NAME}"
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Test') {
            steps {
                sh 'node --check app.js'
            }
        }

        stage('Deploy Staging') {
            steps {
                sh '''
                    pm2 delete jenkins-staging || true

                    APP_BRANCH=staging \
                    PORT=3001 \
                    pm2 start app.js --name jenkins-staging

                    pm2 save
                '''
            }
        }

        stage('Health Check') {
            steps {
                sh '''
                    sleep 3
                    curl -f http://127.0.0.1:3001/health
                '''
            }
        }
    }

    post {
        success {
            echo "Staging deployment successful"
        }

        failure {
            echo "Staging deployment failed"
        }
    }
}
