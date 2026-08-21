pipeline {
    agent any

    environment {
        PM2_HOME = '/tmp/jenkins-pm2'
    }

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

        stage('Deploy') {
            when {
                anyOf {
                    branch 'main'
                    branch 'staging'
                }
            }

            steps {
                script {

                    if (env.BRANCH_NAME == 'main') {

                        sh '''
                            pm2 delete jenkins-main || true

                            APP_BRANCH=main \
                            PORT=3000 \
                            pm2 start app.js --name jenkins-main

                            pm2 save
                        '''

                    } else if (env.BRANCH_NAME == 'staging') {

                        sh '''
                            pm2 delete jenkins-staging || true

                            APP_BRANCH=staging \
                            PORT=3001 \
                            pm2 start app.js --name jenkins-staging

                            pm2 save
                        '''
                    }
                }
            }
        }

        stage('Health Check') {
            when {
                anyOf {
                    branch 'main'
                    branch 'staging'
                }
            }

            steps {
                script {

                    if (env.BRANCH_NAME == 'main') {

                        sh 'curl -f http://127.0.0.1:3000/health'

                    } else {

                        sh 'curl -f http://127.0.0.1:3001/health'
                    }
                }
            }
        }
    }

    post {

        success {
            echo "Deployment successful for ${env.BRANCH_NAME}"
        }

        failure {
            echo "Deployment failed for ${env.BRANCH_NAME}"
        }
    }
}				   
